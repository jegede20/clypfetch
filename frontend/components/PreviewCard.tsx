"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoResult } from "@/lib/api";
import { addHistory } from "@/lib/history";
import { formatDuration } from "@/lib/format";
import { btnClass, Chip } from "./ui";
import { DownloadIcon, PlayIcon, TikTokGlyph, XGlyph } from "./icons";

export function PreviewCard({
  result,
  sourceUrl,
  onDownloaded,
}: {
  result: VideoResult;
  sourceUrl: string;
  onDownloaded?: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [thumbBroken, setThumbBroken] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Respect the "auto-play preview" setting from Settings.
  useEffect(() => {
    try {
      if (localStorage.getItem("clypfetch-autoplay") === "1") setPlaying(true);
    } catch {
      /* ignore */
    }
  }, []);

  const ar =
    result.width && result.height
      ? result.width / result.height
      : result.platform === "x"
      ? 16 / 9
      : 9 / 16;

  const Glyph = result.platform === "tiktok" ? TikTokGlyph : XGlyph;
  const duration = formatDuration(result.duration);

  function recordDownload() {
    addHistory({
      url: sourceUrl,
      platform: result.platform,
      title: result.title,
      thumbnail: result.thumbnail,
      duration: result.duration,
      streamUrl: result.streamUrl,
      downloadUrl: result.downloadUrl,
    });
    onDownloaded?.();
  }

  return (
    <div className="bg-paper text-ink border-2 border-ink rounded-none shadow-[8px_8px_0_0_#6D3FE0]">
      {/* Media */}
      <div
        className="relative w-full overflow-hidden border-b-2 border-ink bg-ink"
        style={{ aspectRatio: String(ar) }}
      >
        {playing ? (
          <video
            ref={videoRef}
            src={result.streamUrl}
            className="absolute inset-0 h-full w-full object-contain bg-ink"
            controls
            autoPlay
            playsInline
          />
        ) : (
          <>
            {result.thumbnail && !thumbBroken ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.thumbnail}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setThumbBroken(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-violet to-coral" />
            )}
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center bg-ink/25 no-tap transition-colors hover:bg-ink/10"
            >
              <span className="flex h-16 w-16 items-center justify-center border-2 border-ink bg-lime text-ink shadow-[5px_5px_0_0_#14121A] transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none">
                <PlayIcon width={26} height={26} />
              </span>
            </button>
            {duration && (
              <span className="absolute bottom-2 right-2 border-2 border-ink bg-ink px-2 py-1 text-xs font-bold text-paper">
                {duration}
              </span>
            )}
          </>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <Chip tone={result.platform === "tiktok" ? "violet" : "neutral"}>
            <Glyph width={13} height={13} />
            {result.platform === "tiktok" ? "TikTok" : "X"}
          </Chip>
          {result.uploader && (
            <span className="truncate text-xs font-semibold text-ink/55">@{result.uploader}</span>
          )}
        </div>

        <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
          {result.title}
        </p>

        <div className="mt-1 grid grid-cols-2 gap-3">
          <a
            href={result.downloadUrl}
            onClick={recordDownload}
            className={btnClass("coral", "md", true)}
          >
            <DownloadIcon width={18} height={18} />
            Download
          </a>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className={btnClass("violet", "md", true)}
          >
            <PlayIcon width={16} height={16} />
            {playing ? "Restart" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}
