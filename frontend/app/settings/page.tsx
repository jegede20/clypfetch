"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Toggle } from "@/components/Toggle";
import { Container, Eyebrow } from "@/components/ui";
import { clearHistory } from "@/lib/history";
import type { ReactNode } from "react";

const APP_VERSION = "1.0.0";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-[var(--fg-faint)]">
        {title}
      </h2>
      <div className="divide-y-2 divide-[color:var(--edge)] border-2 border-[color:var(--edge-strong)] bg-[var(--canvas-2)] rounded-none">
        {children}
      </div>
    </section>
  );
}

function Row({
  title,
  desc,
  control,
}: {
  title: string;
  desc?: string;
  control?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--fg)]">{title}</p>
        {desc && <p className="mt-0.5 text-xs leading-relaxed text-[var(--fg-dim)]">{desc}</p>}
      </div>
      {control && <div className="shrink-0">{control}</div>}
    </div>
  );
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [autoplay, setAutoplay] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setTheme(localStorage.getItem("clypfetch-theme") === "light" ? "light" : "dark");
      setAutoplay(localStorage.getItem("clypfetch-autoplay") === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function applyTheme(next: "dark" | "light") {
    setTheme(next);
    try {
      localStorage.setItem("clypfetch-theme", next);
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    if (next === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
  }

  function applyAutoplay(next: boolean) {
    setAutoplay(next);
    try {
      localStorage.setItem("clypfetch-autoplay", next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function resetAll() {
    if (!confirm("Reset Clypfetch? This clears your download history and preferences.")) return;
    try {
      clearHistory();
      localStorage.removeItem("clypfetch-theme");
      localStorage.removeItem("clypfetch-autoplay");
      localStorage.removeItem("clypfetch-onboarded");
    } catch {
      /* ignore */
    }
    document.documentElement.removeAttribute("data-theme");
    location.reload();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Container className="max-w-2xl py-10 sm:py-14">
          <Eyebrow>Preferences</Eyebrow>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[var(--fg)] sm:text-4xl">
            Settings
          </h1>

          <Group title="Downloads">
            <Row
              title="Video quality"
              desc="Clypfetch always grabs the best available MP4 with audio."
              control={
                <span className="border-2 border-[color:var(--edge-strong)] bg-[var(--canvas-3)] px-3 py-1.5 text-xs font-bold text-[var(--fg-dim)]">
                  Best · MP4
                </span>
              }
            />
            <Row
              title="Auto-play preview"
              desc="Start playing as soon as a video is ready, instead of showing a poster first."
              control={
                mounted ? (
                  <Toggle checked={autoplay} onChange={applyAutoplay} label="Auto-play preview" />
                ) : null
              }
            />
            <Row
              title="Save location"
              desc="Videos download through your browser to its usual Downloads folder."
            />
          </Group>

          <Group title="Appearance">
            <Row
              title="Dark mode"
              desc="Clypfetch is built dark-first. Turn this off for the cream light theme."
              control={
                mounted ? (
                  <Toggle
                    checked={theme === "dark"}
                    onChange={(v) => applyTheme(v ? "dark" : "light")}
                    label="Dark mode"
                  />
                ) : null
              }
            />
          </Group>

          <Group title="Data">
            <Row
              title="Clear download history"
              desc="Remove every saved item from this device. Won't delete files you already downloaded."
              control={
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Clear your download history?")) clearHistory();
                  }}
                  className="border-2 border-ink bg-coral px-3 py-2 text-xs font-bold text-paper no-tap shadow-[3px_3px_0_0_#E84A38] transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                >
                  Clear
                </button>
              }
            />
            <Row
              title="Reset everything"
              desc="Clear history and reset all preferences to defaults."
              control={
                <button
                  type="button"
                  onClick={resetAll}
                  className="border-2 border-[color:var(--edge-strong)] bg-[var(--canvas-3)] px-3 py-2 text-xs font-bold text-[var(--fg-dim)] no-tap hover:text-coral"
                >
                  Reset
                </button>
              }
            />
          </Group>

          <Group title="About">
            <Row
              title="Terms of Service"
              control={
                <Link href="/terms" className="text-sm font-semibold text-violet no-tap hover:underline">
                  View
                </Link>
              }
            />
            <Row
              title="Privacy Policy"
              control={
                <Link href="/privacy" className="text-sm font-semibold text-violet no-tap hover:underline">
                  View
                </Link>
              }
            />
            <Row
              title="Contact"
              control={
                <a
                  href="mailto:hello@clypfetch.app"
                  className="text-sm font-semibold text-violet no-tap hover:underline"
                >
                  Email
                </a>
              }
            />
          </Group>

          <p className="mt-10 text-center text-xs text-[var(--fg-faint)]">
            Clypfetch v{APP_VERSION} · Made for saving the clips you love, responsibly.
          </p>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
