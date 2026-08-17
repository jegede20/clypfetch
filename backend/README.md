# Clypfetch API

FastAPI + yt-dlp service that turns a public **TikTok** or **X (Twitter)** link
into a directly-playable video URL, and proxies playback + download so the
frontend never hits CORS / hotlink walls.

## Endpoints

| Method | Path              | Purpose                                            |
|--------|-------------------|----------------------------------------------------|
| GET    | `/`               | Health check                                       |
| POST   | `/api/extract`    | `{ "url": "..." }` → metadata + video/stream/download URLs |
| GET    | `/api/stream?url=`| Range-aware **inline** proxy (playback fallback)   |
| GET    | `/api/download?url=` | Range-aware **attachment** proxy (save to device) |

`/api/extract` response:

```json
{
  "platform": "tiktok",
  "title": "...",
  "uploader": "...",
  "thumbnail": "https://...",
  "duration": 12.3,
  "width": 576, "height": 1024, "ext": "mp4",
  "videoUrl": "https://<cdn>/....mp4",
  "streamUrl": "https://<api>/api/stream?url=...",
  "downloadUrl": "https://<api>/api/download?url=..."
}
```

Errors return a JSON body `{ "error": "<code>", "message": "<friendly text>" }`
with codes: `unsupported`, `novideo`, `private`, `login`, `age`, `geo`,
`unavailable`, `failed`, `upstream`.

## Run locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install fastapi "uvicorn>=0.29" yt-dlp httpx
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Health check: http://localhost:8000/  →  `{"ok": true, ...}`

## Deploy (free tier)

**Render** — push this repo, "New → Blueprint", point at `backend/render.yaml`.
Set `ALLOWED_ORIGINS` to your Vercel URL.

**Fly.io** — `cd backend && fly launch --no-deploy` then `fly deploy`.

Both build the `Dockerfile`, which bundles **ffmpeg** so yt-dlp can mux the
highest-quality X streams. (TikTok progressive mp4 needs no ffmpeg.)

## Notes / constraints

- Extraction results are cached in-memory for 5 min so *play* and *download*
  of the same link reuse one yt-dlp run.
- Platforms change their internals often — if extraction breaks, first
  `pip install -U yt-dlp` (kept unpinned for exactly this reason).
- Downloading third-party content may violate platform ToS. This is surfaced
  to users in the app footer/terms, not hidden.
