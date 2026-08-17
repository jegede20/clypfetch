# Clypfetch

Paste a public **TikTok** or **X (Twitter)** video link → preview it in the browser → download it to your device. Free, no account.

- **Frontend:** Next.js 15 (App Router) + React 19 + Tailwind CSS + TypeScript
- **Backend:** FastAPI + [yt-dlp](https://github.com/yt-dlp/yt-dlp) + uvicorn
- **Design:** "Pill Stack" — sharp-edged blocks with hard offset shadows, dark-first palette

The backend does the extraction **server-side** (yt-dlp downloads to a short-lived temp cache), then serves the file with native HTTP range support. This is deliberate: TikTok's CDN 403s any HTTP client whose fingerprint isn't yt-dlp's own, so proxying the raw CDN URL to the browser does not work — letting yt-dlp fetch and serving the local file does.

---

## Project layout

```
clypfetch/
├── backend/     # FastAPI + yt-dlp service (extract / stream / download)
└── frontend/    # Next.js app (landing, app flow, downloads, settings, legal)
```

---

## Run it locally

You need **two terminals** — one for the API, one for the web app.

### 1. Backend (port 8000)

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python main.py            # serves on http://localhost:8000
```

> **ffmpeg:** not required for most single-file MP4s. It's only needed when a source
> serves separate video/audio streams that must be merged. The production Docker image
> bundles it; for local dev you usually won't hit that path.

Health check: `curl http://localhost:8000/` → `{"ok":true,"service":"Clypfetch API"}`

### 2. Frontend (port 3000)

```bash
cd frontend
npm install
cp .env.example .env.local     # points NEXT_PUBLIC_API_BASE at http://localhost:8000
npm run dev                    # http://localhost:3000
```

Open **http://localhost:3000**, paste a public TikTok/X link, and fetch.

> `NEXT_PUBLIC_API_BASE` is read at **build time**. If you change it, restart `npm run dev`
> (or rebuild) so the new value is baked into the client bundle.

---

## API

| Method | Route            | Purpose                                                        |
|--------|------------------|----------------------------------------------------------------|
| `GET`  | `/`              | Health check                                                   |
| `POST` | `/api/extract`   | `{ "url": "..." }` → metadata + `streamUrl` / `downloadUrl`    |
| `GET`  | `/api/stream?url=`   | Serves the video inline, with HTTP range support (seeking) |
| `GET`  | `/api/download?url=` | Serves the video as an attachment (browser download)       |

`/api/extract` returns:

```json
{
  "platform": "tiktok",
  "title": "...", "uploader": "...", "thumbnail": "https://...",
  "duration": 10, "width": 720, "height": 1280, "ext": "mp4",
  "streamUrl": "http://localhost:8000/api/stream?url=...",
  "downloadUrl": "http://localhost:8000/api/download?url=..."
}
```

Failures return a friendly `{ "error": "...", "message": "..." }` the UI renders in its error state.

---

## Deploy

This is a monorepo, so the two halves deploy to two hosts.

### Backend → Render (Docker Blueprint)

A **`render.yaml` at the repo root** describes the backend service (Docker runtime,
health check, CORS env var). It points at `backend/` for the build context.

1. Render dashboard → **New + → Blueprint** → connect this GitHub repo → **Apply**.
   Render reads the root `render.yaml` and provisions `clypfetch-api` on the free plan.
2. When the first deploy finishes, copy the service URL (e.g. `https://clypfetch-api.onrender.com`).
3. Once the frontend is live, set **`ALLOWED_ORIGINS`** to your exact Vercel origin to lock CORS down (it defaults to `*`).

> Free instances sleep after ~15 min idle, so the first request after a lull cold-starts (~30–60s). The UI shows a loading state throughout — it won't error.

The backend also ships a `backend/fly.toml` if you prefer Fly.io: `cd backend && fly launch --no-deploy`, then `fly deploy`.

### Frontend → Vercel

1. Import the repo into Vercel and set **Root Directory = `frontend`**.
2. Set env var **`NEXT_PUBLIC_API_BASE`** = your Render backend URL (e.g. `https://clypfetch-api.onrender.com`).
   Without it the app falls back to `localhost:8000` and every fetch fails on the live site.
3. Deploy. `npm run build` is already validated clean.

---

## A note on responsible use

Clypfetch surfaces this in its own footer, Terms, and onboarding rather than hiding it:
downloading a video you don't own or have permission to save **may violate TikTok's or X's
Terms of Service** and can infringe a creator's rights. That's a real risk, not a solved
problem. Only save content you have the right to keep.
