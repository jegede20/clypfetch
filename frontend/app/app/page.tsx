"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PreviewCard } from "@/components/PreviewCard";
import { PlatformChip } from "@/components/PlatformChip";
import { Container, Eyebrow, Spinner, btnClass } from "@/components/ui";
import {
  AlertIcon,
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  LinkIcon,
  RefreshIcon,
} from "@/components/icons";
import { detectPlatform, looksLikeUrl } from "@/lib/platform";
import { extractVideo, type ApiError, type VideoResult } from "@/lib/api";

type Status = "idle" | "fetching" | "ready" | "error";

const STEPS = ["Link verified", "Locating video", "Preparing preview"] as const;

function FetchSteps({ active }: { active: number }) {
  // `active` is the 1-based index currently in progress; < active = done, 4 = all done.
  return (
    <ul className="mt-6 flex flex-col gap-3">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = active > n;
        const current = active === n;
        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center border-2 rounded-none ${
                done
                  ? "border-ink bg-lime text-ink"
                  : current
                  ? "border-[color:var(--edge-strong)] bg-[var(--canvas-2)]"
                  : "border-[color:var(--edge)] bg-transparent"
              }`}
            >
              {done ? (
                <CheckIcon width={15} height={15} />
              ) : current ? (
                <Spinner size={15} />
              ) : (
                <span className="h-1.5 w-1.5 bg-[var(--fg-faint)]" />
              )}
            </span>
            <span
              className={`text-sm font-semibold ${
                done || current ? "text-[var(--fg)]" : "text-[var(--fg-faint)]"
              }`}
            >
              {label}
              {current && "…"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function AppFlow() {
  const params = useSearchParams();

  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [failedUrl, setFailedUrl] = useState("");
  const [step, setStep] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const stepTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const autoRan = useRef(false);

  const platform = detectPlatform(url);
  const canFetch = platform !== null;

  const clearTimers = useCallback(() => {
    stepTimers.current.forEach(clearTimeout);
    stepTimers.current = [];
  }, []);

  const runFetch = useCallback(
    async (raw: string) => {
      const target = raw.trim();
      if (!detectPlatform(target)) return;

      clearTimers();
      setStatus("fetching");
      setError(null);
      setResult(null);
      setStep(1);
      // Advance the visible checklist while the single backend call runs.
      stepTimers.current.push(setTimeout(() => setStep(2), 700));
      stepTimers.current.push(setTimeout(() => setStep(3), 2200));

      try {
        const res = await extractVideo(target);
        clearTimers();
        setStep(4);
        setResult(res);
        setStatus("ready");
      } catch (e) {
        clearTimers();
        setFailedUrl(target);
        setError(e as ApiError);
        setStatus("error");
      }
    },
    [clearTimers]
  );

  // Pre-fill + auto-fetch when arriving from the landing hero (?url=…).
  useEffect(() => {
    if (autoRan.current) return;
    autoRan.current = true;
    const q = params.get("url");
    if (q) {
      setUrl(q);
      if (detectPlatform(q)) void runFetch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canFetch) void runFetch(url);
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      // Clipboard blocked — just focus the field so the user can paste manually.
    }
    inputRef.current?.focus();
  }

  function reset(keepUrl: boolean) {
    clearTimers();
    setStatus("idle");
    setResult(null);
    setError(null);
    if (!keepUrl) setUrl("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  const showInput = status === "idle" || status === "fetching";

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Container className="max-w-xl py-10 sm:py-16">
          <Eyebrow>Fetch a clip</Eyebrow>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[var(--fg)] sm:text-4xl">
            Paste a link, grab the video.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-dim)]">
            Drop a public TikTok or X link below. We&apos;ll find the video, show you a
            preview, and let you save it.
          </p>

          {showInput && (
            <form onSubmit={onSubmit} className="mt-8">
              <div className="flex items-stretch border-2 border-ink bg-paper rounded-none shadow-[6px_6px_0_0_#6D3FE0]">
                <span className="flex items-center pl-3 text-ink/40">
                  <LinkIcon width={18} height={18} />
                </span>
                <input
                  ref={inputRef}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={status === "fetching"}
                  inputMode="url"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="https://www.tiktok.com/@user/video/…"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-[15px] text-ink placeholder:text-ink/35 outline-none disabled:opacity-60"
                  aria-label="Video link"
                />
                {url && status !== "fetching" && (
                  <button
                    type="button"
                    onClick={() => reset(false)}
                    aria-label="Clear"
                    className="flex items-center px-2 text-ink/40 no-tap hover:text-ink"
                  >
                    <CloseIcon width={18} height={18} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={pasteFromClipboard}
                  disabled={status === "fetching"}
                  className="border-l-2 border-ink bg-paper-dim px-3 text-xs font-bold uppercase tracking-wide text-ink no-tap hover:bg-lime disabled:opacity-50"
                >
                  Paste
                </button>
              </div>

              <div className="mt-3 flex min-h-[34px] items-center justify-between gap-3">
                {platform ? (
                  <PlatformChip platform={platform} />
                ) : url.trim() ? (
                  <span className="text-xs font-medium text-coral">
                    {looksLikeUrl(url)
                      ? "Only TikTok and X links are supported right now."
                      : "That doesn't look like a link yet."}
                  </span>
                ) : (
                  <span className="text-xs text-[var(--fg-faint)]">
                    TikTok &amp; X supported
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!canFetch || status === "fetching"}
                className={`${btnClass("coral", "lg", true)} mt-3`}
              >
                {status === "fetching" ? (
                  <>
                    <Spinner size={18} />
                    Fetching…
                  </>
                ) : (
                  <>
                    <BoltIcon width={18} height={18} />
                    Fetch video
                  </>
                )}
              </button>

              {status === "fetching" && <FetchSteps active={step} />}
            </form>
          )}

          {status === "ready" && result && (
            <div className="mt-8">
              <PreviewCard result={result} sourceUrl={url} />
              <button
                type="button"
                onClick={() => reset(false)}
                className={`${btnClass("ghost", "md", true)} mt-5`}
              >
                <RefreshIcon width={17} height={17} />
                Fetch another link
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="mt-8 border-2 border-ink bg-paper text-ink rounded-none shadow-[7px_7px_0_0_#E84A38]">
              <div className="flex items-start gap-3 border-b-2 border-ink bg-coral px-4 py-3 text-paper">
                <span className="mt-0.5 shrink-0">
                  <AlertIcon width={20} height={20} />
                </span>
                <div>
                  <p className="font-display text-lg font-bold leading-tight">
                    That didn&apos;t work
                  </p>
                  <p className="mt-1 text-sm leading-snug text-paper/90">
                    {error?.message || "We couldn't fetch this video. Please try again."}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink/45">
                  The link you tried
                </p>
                <p className="break-all border-2 border-[color:rgba(20,18,26,0.15)] bg-paper-dim px-3 py-2 font-mono text-xs text-ink/70">
                  {failedUrl}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => void runFetch(failedUrl)}
                    className={btnClass("coral", "md", true)}
                  >
                    <RefreshIcon width={17} height={17} />
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={() => reset(true)}
                    className={btnClass("ghost", "md", true)}
                  >
                    <EditIcon width={16} height={16} />
                    Edit link
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-xs leading-relaxed text-[var(--fg-faint)]">
            Only save videos you have the right to keep. See our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--fg-dim)]">
              terms
            </Link>
            .
          </p>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={null}>
      <AppFlow />
    </Suspense>
  );
}
