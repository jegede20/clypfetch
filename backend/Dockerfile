# Clypfetch backend — FastAPI + yt-dlp + ffmpeg
FROM python:3.12-slim

# ffmpeg lets yt-dlp mux separate audio/video streams (needed for the
# highest-quality X formats). TikTok progressive mp4 works without it.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000
EXPOSE 8000

# --proxy-headers so request.base_url resolves to https behind Render/Fly TLS,
# which makes the stream/download URLs handed to the frontend correct.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips=*"]
