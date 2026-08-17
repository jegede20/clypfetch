"""
Clypfetch API — turns a public TikTok / X (Twitter) link into a playable +
downloadable video.

Design note
-----------
Platform CDNs (TikTok especially) fingerprint the HTTP client, so re-fetching
a resolved CDN URL from our own code — or from the browser — gets a 403 even
with yt-dlp's exact headers. The reliable path is to let *yt-dlp itself*
download the file (it handles the CDN's TLS/session quirks), cache it, and
serve it locally with Range support. Extraction is therefore two-phase:

  /api/extract   -> metadata only (fast, no video bytes) for the preview card
  /api/stream    -> ensures the file is downloaded, serves it inline (Range)
  /api/download  -> same file, served as an attachment (save to device)

Endpoints
  GET  /                  health check
  POST /api/extract       { url } -> metadata + stream/download URLs
  GET  /api/stream?url=   inline video (playback), supports Range/seek
  GET  /api/download?url= attachment video (save to device)
"""

from __future__ import annotations

import asyncio
import hashlib
import os
import re
import tempfile
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional
from urllib.parse import quote

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from yt_dlp import YoutubeDL
from yt_dlp.utils import DownloadError, ExtractorError

APP_NAME = "Clypfetch API"

META_TTL = 300      # metadata cache (seconds)
MEDIA_TTL = 1800    # downloaded-file cache (seconds)
MEDIA_DIR = Path(tempfile.gettempdir()) / "clypfetch_media"
MEDIA_DIR.mkdir(exist_ok=True)

_meta_cache: dict[str, tuple[float, dict]] = {}
_media_cache: dict[str, tuple[float, str]] = {}
_locks: dict[str, asyncio.Lock] = {}

# ---- platform detection --------------------------------------------------
TIKTOK_RE = re.compile(r"https?://([\w-]+\.)?tiktok\.com/", re.I)
X_RE = re.compile(r"https?://([\w-]+\.)?(x|twitter)\.com/", re.I)


def detect_platform(url: str) -> Optional[str]:
    if TIKTOK_RE.search(url):
        return "tiktok"
    if X_RE.search(url):
        return "x"
    return None


# ---- yt-dlp --------------------------------------------------------------
BASE_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "noplaylist": True,
    # Prefer a single progressive mp4 (audio+video) so no ffmpeg mux is needed
    # for TikTok; X's combined mp4 variants also match this.
    "format": "best[ext=mp4][vcodec!=none][acodec!=none]/b[vcodec!=none][acodec!=none]/b",
    "extractor_retries": 2,
    "retries": 3,
    "socket_timeout": 20,
}

# Errors where retrying is pointless — the video simply can't be fetched.
_FATAL = ("private", "unavailable", "removed", "deleted", "not found", "404",
          "login", "log in", "sign in", "age-restrict", "does not exist",
          "no downloadable", "no video", "photo")


def _is_fatal(msg: str) -> bool:
    m = msg.lower()
    return any(k in m for k in _FATAL)


def _with_retry(fn, tries: int = 3, delay: float = 1.5):
    """Retry transient extractor hiccups (e.g. TikTok 'rehydration')."""
    last: Optional[Exception] = None
    for i in range(tries):
        try:
            return fn()
        except (DownloadError, ExtractorError) as e:
            last = e
            if _is_fatal(str(e)):
                raise
            if i < tries - 1:
                time.sleep(delay)
    assert last is not None
    raise last


def _meta_from_info(info: dict) -> dict:
    if info.get("_type") == "playlist" and info.get("entries"):
        entries = [e for e in info["entries"] if e]
        if entries:
            info = entries[0]
    return {
        "title": (info.get("title") or info.get("description") or "Untitled video").strip(),
        "uploader": info.get("uploader") or info.get("uploader_id") or info.get("channel"),
        "thumbnail": info.get("thumbnail"),
        "duration": info.get("duration"),
        "width": info.get("width"),
        "height": info.get("height"),
        "ext": info.get("ext") or "mp4",
    }


def _extract_meta(url: str) -> dict:
    now = time.time()
    hit = _meta_cache.get(url)
    if hit and now - hit[0] < META_TTL:
        return hit[1]

    def run():
        with YoutubeDL({**BASE_OPTS, "skip_download": True}) as y:
            return y.extract_info(url, download=False)

    info = _with_retry(run)
    meta = _meta_from_info(info)
    _meta_cache[url] = (now, meta)
    return meta


def _sweep_media():
    now = time.time()
    for f in MEDIA_DIR.glob("*"):
        try:
            if now - f.stat().st_mtime > MEDIA_TTL:
                f.unlink()
        except OSError:
            pass


def _ensure_media(url: str) -> tuple[str, dict]:
    """Download the video via yt-dlp (cached) and return (filepath, meta)."""
    now = time.time()
    hit = _media_cache.get(url)
    if hit and now - hit[0] < MEDIA_TTL and os.path.exists(hit[1]):
        return hit[1], _meta_cache.get(url, (0, {}))[1]

    _sweep_media()
    key = hashlib.sha1(url.encode()).hexdigest()[:16]
    outtmpl = str(MEDIA_DIR / f"{key}.%(ext)s")

    def run():
        with YoutubeDL({**BASE_OPTS, "skip_download": False, "outtmpl": outtmpl, "overwrites": True}) as y:
            info = y.extract_info(url, download=True)
        rd = info.get("requested_downloads")
        path = rd[0].get("filepath") if rd else None
        if not path or not os.path.exists(path):
            with YoutubeDL(BASE_OPTS) as y:
                path = y.prepare_filename(info)
        if not path or not os.path.exists(path):
            raise ExtractorError("download produced no file")
        return path, info

    path, info = _with_retry(run)
    _media_cache[url] = (now, path)
    _meta_cache[url] = (now, _meta_from_info(info))
    return path, _meta_cache[url][1]


def _friendly_error(exc: Exception) -> tuple[str, str]:
    msg = str(exc).lower()
    if any(k in msg for k in ("no downloadable", "no video", "photo")):
        return ("novideo", "This post doesn't contain a video — it may be a photo post.")
    if "private" in msg:
        return ("private", "This video is private, so it can't be fetched.")
    if any(k in msg for k in ("login", "log in", "sign in", "authenticat", "cookies", "account")):
        return ("login", "This video requires login to view, so it can't be fetched.")
    if "age" in msg:
        return ("age", "This video is age-restricted and can't be fetched without login.")
    if any(k in msg for k in ("geo", "region", "country", "not available in your")):
        return ("geo", "This video isn't available in the server's region.")
    if any(k in msg for k in ("unavailable", "removed", "deleted", "not found", "404", "does not exist")):
        return ("unavailable", "This video is unavailable — it may have been deleted or made private.")
    return ("failed", "We couldn't fetch this video. It may be private, deleted, or expired.")


def _safe_filename(title: str, ext: str) -> str:
    base = re.sub(r"[^\w\-]+", "_", (title or "clypfetch").strip())[:60].strip("_")
    return f"{base or 'clypfetch'}.{ext or 'mp4'}"


def _media_type(ext: str) -> str:
    return {"mp4": "video/mp4", "webm": "video/webm", "mov": "video/quicktime"}.get(ext, "video/mp4")


# ---- app -----------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # On Windows, asyncio's Proactor event loop logs a noisy — but harmless —
    # ConnectionResetError whenever a client closes a streaming socket early
    # (e.g. a <video> element issuing Range requests and seeking mid-stream).
    # The response itself still completes fine. Swallow just that case so it
    # doesn't bury real errors. This does not occur on Linux (prod/Docker).
    loop = asyncio.get_running_loop()
    _default = loop.get_exception_handler()

    def _quiet_client_disconnects(loop, context):
        exc = context.get("exception")
        if isinstance(exc, (ConnectionResetError, ConnectionAbortedError)):
            return
        if _default is not None:
            _default(loop, context)
        else:
            loop.default_exception_handler(context)

    loop.set_exception_handler(_quiet_client_disconnects)
    yield


app = FastAPI(title=APP_NAME, lifespan=lifespan)

_origins = os.environ.get("ALLOWED_ORIGINS", "*").strip()
allow_origins = ["*"] if _origins == "*" else [o.strip() for o in _origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExtractIn(BaseModel):
    url: str


@app.get("/")
async def health():
    return {"ok": True, "service": APP_NAME}


@app.post("/api/extract")
async def extract(body: ExtractIn, request: Request):
    url = (body.url or "").strip()
    if not url:
        return JSONResponse(status_code=400, content={"error": "empty", "message": "Please paste a video link."})

    platform = detect_platform(url)
    if not platform:
        return JSONResponse(status_code=422, content={"error": "unsupported", "message": "Only TikTok and X (Twitter) links are supported right now."})

    try:
        meta = await asyncio.to_thread(_extract_meta, url)
    except (DownloadError, ExtractorError) as e:
        code, message = _friendly_error(e)
        return JSONResponse(status_code=404, content={"error": code, "message": message, "detail": str(e)[:300]})
    except Exception as e:  # noqa: BLE001
        return JSONResponse(status_code=500, content={"error": "failed", "message": "Something went wrong while fetching. Please try again.", "detail": str(e)[:300]})

    base = str(request.base_url).rstrip("/")
    q = quote(url, safe="")
    return {
        "platform": platform,
        "title": meta["title"],
        "uploader": meta["uploader"],
        "thumbnail": meta["thumbnail"],
        "duration": meta["duration"],
        "width": meta["width"],
        "height": meta["height"],
        "ext": meta["ext"],
        "streamUrl": f"{base}/api/stream?url={q}",
        "downloadUrl": f"{base}/api/download?url={q}",
    }


async def _serve(url: str, as_attachment: bool):
    platform = detect_platform(url)
    if not platform:
        raise HTTPException(status_code=422, detail={"error": "unsupported", "message": "Unsupported link."})

    lock = _locks.setdefault(url, asyncio.Lock())
    async with lock:
        try:
            path, meta = await asyncio.to_thread(_ensure_media, url)
        except (DownloadError, ExtractorError) as e:
            code, message = _friendly_error(e)
            raise HTTPException(status_code=404, detail={"error": code, "message": message})
        except HTTPException:
            raise
        except Exception:  # noqa: BLE001
            raise HTTPException(status_code=500, detail={"error": "failed", "message": "Fetch failed."})

    ext = (meta.get("ext") or Path(path).suffix.lstrip(".") or "mp4")
    media_type = _media_type(ext)
    # FileResponse handles Range requests (206 + Content-Range) natively.
    if as_attachment:
        return FileResponse(path, media_type=media_type, filename=_safe_filename(meta.get("title") or "clypfetch", ext))
    return FileResponse(path, media_type=media_type)


@app.get("/api/stream")
async def stream(url: str = Query(...)):
    return await _serve(url, as_attachment=False)


@app.get("/api/download")
async def download(url: str = Query(...)):
    return await _serve(url, as_attachment=True)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", "8000")), reload=False)
