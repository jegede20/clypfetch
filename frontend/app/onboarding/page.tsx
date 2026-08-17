"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logomark } from "@/components/Logo";
import { Container, btnClass } from "@/components/ui";
import {
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  LinkIcon,
  PlayIcon,
  TikTokGlyph,
  XGlyph,
} from "@/components/icons";

const MINI = [
  { icon: LinkIcon, label: "Paste a public TikTok or X link" },
  { icon: PlayIcon, label: "Preview the video in your browser" },
  { icon: DownloadIcon, label: "Download it to your device" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const last = step === 2;

  function finish() {
    try {
      localStorage.setItem("clypfetch-onboarded", "1");
    } catch {
      /* ignore */
    }
    router.push("/app");
  }

  function next() {
    if (last) finish();
    else setStep((s) => s + 1);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-4 py-5 sm:px-6">
        <Logomark size={30} />
        <button
          type="button"
          onClick={finish}
          className="text-sm font-semibold text-[var(--fg-dim)] no-tap hover:text-[var(--fg)]"
        >
          Skip
        </button>
      </div>

      <main className="flex flex-1 items-center">
        <Container className="max-w-md">
          {/* Progress dots (squares) */}
          <div className="mb-8 flex items-center gap-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-2.5 border-2 border-ink transition-all ${
                  i === step ? "w-8 bg-violet" : i < step ? "w-2.5 bg-lime" : "w-2.5 bg-[var(--canvas-3)]"
                }`}
              />
            ))}
          </div>

          {step === 0 && (
            <div>
              <div className="mb-6 inline-flex border-2 border-ink bg-[var(--canvas-2)] p-4 shadow-[6px_6px_0_0_#6D3FE0]">
                <Logomark size={44} />
              </div>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-[var(--fg)] sm:text-4xl">
                Welcome to Clypfetch
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[var(--fg-dim)]">
                Save the clips you love — no account, no watermark, no hassle. Here&apos;s the
                thirty-second tour.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-[var(--fg)] sm:text-4xl">
                How it works
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[var(--fg-dim)]">
                Three steps, every time:
              </p>
              <ul className="mt-6 flex flex-col gap-4">
                {MINI.map((m, i) => (
                  <li key={m.label} className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-lime text-ink shadow-[3px_3px_0_0_#14121A]">
                      <m.icon width={20} height={20} />
                    </span>
                    <span className="text-sm font-semibold text-[var(--fg)]">
                      <span className="mr-2 text-[var(--fg-faint)]">{i + 1}.</span>
                      {m.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-[var(--fg)] sm:text-4xl">
                What you can fetch
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[var(--fg-dim)]">
                Clypfetch supports these platforms today:
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 border-2 border-ink bg-violet px-4 py-3 text-paper shadow-[4px_4px_0_0_#6D3FE0]">
                  <TikTokGlyph width={20} height={20} />
                  <span className="font-display font-bold">TikTok</span>
                  <CheckIcon width={18} height={18} className="ml-auto" />
                </div>
                <div className="flex items-center gap-3 border-2 border-ink bg-[var(--canvas-2)] px-4 py-3 text-[var(--fg)] shadow-[4px_4px_0_0_var(--edge)]">
                  <XGlyph width={18} height={18} />
                  <span className="font-display font-bold">X · Twitter</span>
                  <CheckIcon width={18} height={18} className="ml-auto text-lime" />
                </div>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-[var(--fg-faint)]">
                Please respect creators — only save videos you have the right to keep.
              </p>
            </div>
          )}

          <div className="mt-10 flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className={btnClass("ghost", "md")}
              >
                Back
              </button>
            )}
            <button type="button" onClick={next} className={`${btnClass("coral", "md")} flex-1`}>
              {last ? "Get started" : "Next"}
              <ArrowRightIcon width={18} height={18} />
            </button>
          </div>
        </Container>
      </main>
    </div>
  );
}
