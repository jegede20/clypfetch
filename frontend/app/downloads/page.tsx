"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container, Eyebrow, btnClass } from "@/components/ui";
import {
  CloseIcon,
  DownloadIcon,
  GhostVideoIcon,
  PlayIcon,
  SearchIcon,
  TikTokGlyph,
  TrashIcon,
  XGlyph,
} from "@/components/icons";
import {
  clearHistory,
  getHistory,
  HISTORY_EVENT,
  removeHistory,
  type HistoryItem,
} from "@/lib/history";
import { formatDuration, timeAgo } from "@/lib/format";
import type { Platform } from "@/lib/platform";

type Tab = "all" | Platform;
const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "tiktok", label: "TikTok" },
  { key: "x", label: "X" },
];

function PlatformGlyph({ platform, ...p }: { platform: Platform } & { width?: number; height?: number }) {
  return platform === "tiktok" ? <TikTokGlyph {...p} /> : <XGlyph {...p} />;
}

const iconBtn =
  "flex h-10 w-10 shrink-0 items-center justify-center border-2 rounded-none no-tap transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

export default function DownloadsPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [playing, setPlaying] = useState<HistoryItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => setItems(getHistory());
    sync();
    window.addEventListener(HISTORY_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(HISTORY_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (tab !== "all" && it.platform !== tab) return false;
      if (q && !it.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, tab]);

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Container className="max-w-3xl py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>Your library</Eyebrow>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[var(--fg)] sm:text-4xl">
                Downloads
              </h1>
            </div>
            {mounted && items.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Clear your entire download history?")) clearHistory();
                }}
                className="text-sm font-semibold text-[var(--fg-faint)] no-tap hover:text-coral"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Search */}
          <div className="mt-6 flex items-stretch border-2 border-[color:var(--edge-strong)] bg-[var(--canvas-2)] rounded-none shadow-[5px_5px_0_0_#6D3FE0]">
            <span className="flex items-center pl-3 text-[var(--fg-faint)]">
              <SearchIcon width={18} height={18} />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your downloads…"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-faint)] outline-none"
              aria-label="Search downloads"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="flex items-center px-3 text-[var(--fg-faint)] no-tap hover:text-[var(--fg)]"
              >
                <CloseIcon width={18} height={18} />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-2">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`border-2 rounded-none px-4 py-2 text-sm font-bold no-tap transition-colors ${
                    active
                      ? "border-ink bg-violet text-paper shadow-[3px_3px_0_0_#6D3FE0]"
                      : "border-[color:var(--edge-strong)] bg-[var(--canvas-2)] text-[var(--fg-dim)] hover:text-[var(--fg)]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* List / empty */}
          <div className="mt-6">
            {!mounted ? null : filtered.length === 0 ? (
              <EmptyState hasAny={items.length > 0} onReset={() => { setQuery(""); setTab("all"); }} />
            ) : (
              <ul className="flex flex-col gap-3">
                {filtered.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center gap-3 border-2 border-[color:var(--edge-strong)] bg-[var(--canvas-2)] rounded-none p-3"
                  >
                    {/* Thumb */}
                    <button
                      type="button"
                      onClick={() => setPlaying(it)}
                      aria-label={`Play ${it.title}`}
                      className="relative h-16 w-16 shrink-0 overflow-hidden border-2 border-ink bg-ink no-tap"
                    >
                      {it.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.thumbnail} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet to-coral text-paper">
                          <PlayIcon width={20} height={20} />
                        </span>
                      )}
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/25 opacity-0 transition-opacity hover:opacity-100">
                        <PlayIcon width={20} height={20} className="text-paper" />
                      </span>
                    </button>

                    {/* Meta */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--fg)]">{it.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--fg-faint)]">
                        <span className="inline-flex items-center gap-1 font-semibold text-[var(--fg-dim)]">
                          <PlatformGlyph platform={it.platform} width={12} height={12} />
                          {it.platform === "tiktok" ? "TikTok" : "X"}
                        </span>
                        <span>·</span>
                        <span>{timeAgo(it.savedAt)}</span>
                        {formatDuration(it.duration) && (
                          <>
                            <span>·</span>
                            <span>{formatDuration(it.duration)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <a
                        href={it.downloadUrl}
                        aria-label="Download again"
                        className={`${iconBtn} border-ink bg-coral text-paper shadow-[3px_3px_0_0_#E84A38]`}
                      >
                        <DownloadIcon width={18} height={18} />
                      </a>
                      <button
                        type="button"
                        onClick={() => removeHistory(it.id)}
                        aria-label="Remove from history"
                        className={`${iconBtn} border-[color:var(--edge-strong)] bg-[var(--canvas-3)] text-[var(--fg-dim)] hover:text-coral`}
                      >
                        <TrashIcon width={17} height={17} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </main>
      <Footer />

      {/* Player modal */}
      {playing && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-4"
          onClick={() => setPlaying(null)}
        >
          <div
            className="w-full max-w-sm border-2 border-ink bg-paper rounded-none shadow-[8px_8px_0_0_#6D3FE0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-ink px-3 py-2">
              <span className="truncate pr-2 text-sm font-bold text-ink">{playing.title}</span>
              <button
                type="button"
                onClick={() => setPlaying(null)}
                aria-label="Close"
                className="shrink-0 text-ink/50 no-tap hover:text-ink"
              >
                <CloseIcon width={20} height={20} />
              </button>
            </div>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={playing.streamUrl}
              controls
              autoPlay
              playsInline
              className="max-h-[70vh] w-full bg-ink object-contain"
            />
            <div className="p-3">
              <a href={playing.downloadUrl} className={btnClass("coral", "md", true)}>
                <DownloadIcon width={18} height={18} />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasAny, onReset }: { hasAny: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center border-2 border-dashed border-[color:var(--edge-strong)] bg-[var(--canvas-2)] px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center border-2 border-[color:var(--edge-strong)] bg-[var(--canvas-3)] text-[var(--fg-faint)]">
        <GhostVideoIcon width={30} height={30} />
      </span>
      {hasAny ? (
        <>
          <p className="mt-5 font-display text-xl font-bold text-[var(--fg)]">No matches</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--fg-dim)]">
            Nothing here fits that search or filter.
          </p>
          <button type="button" onClick={onReset} className={`${btnClass("ghost", "md")} mt-6`}>
            Reset filters
          </button>
        </>
      ) : (
        <>
          <p className="mt-5 font-display text-xl font-bold text-[var(--fg)]">No downloads yet</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--fg-dim)]">
            Videos you fetch and save will show up here for quick access.
          </p>
          <Link href="/app" className={`${btnClass("coral", "md")} mt-6`}>
            <PlayIcon width={16} height={16} />
            Fetch your first video
          </Link>
        </>
      )}
    </div>
  );
}
