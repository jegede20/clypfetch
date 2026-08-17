"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlatformChip } from "./PlatformChip";
import { btnClass } from "./ui";
import { ArrowRightIcon, LinkIcon } from "./icons";
import { detectPlatform, looksLikeUrl } from "@/lib/platform";

export function HeroInput() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const platform = detectPlatform(url);

  function go(e: React.FormEvent) {
    e.preventDefault();
    const q = url.trim();
    router.push(q ? `/app?url=${encodeURIComponent(q)}` : "/app");
  }

  return (
    <form onSubmit={go} className="w-full">
      <div className="flex items-stretch border-2 border-ink bg-paper rounded-none shadow-[6px_6px_0_0_#6D3FE0]">
        <span className="flex items-center pl-3 text-ink/40">
          <LinkIcon width={18} height={18} />
        </span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          inputMode="url"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Paste a TikTok or X link…"
          aria-label="Video link"
          className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-[15px] text-ink placeholder:text-ink/35 outline-none"
        />
        <button
          type="submit"
          aria-label="Fetch video"
          className="flex items-center gap-2 border-l-2 border-ink bg-coral px-4 text-sm font-bold text-paper no-tap transition-[filter] hover:brightness-105"
        >
          <span className="hidden sm:inline">Fetch</span>
          <ArrowRightIcon width={18} height={18} />
        </button>
      </div>
      <div className="mt-3 flex min-h-[30px] items-center gap-2">
        {platform ? (
          <PlatformChip platform={platform} />
        ) : url.trim() && !looksLikeUrl(url) ? (
          <span className="text-xs font-medium text-[var(--fg-faint)]">
            Paste a full link starting with https://
          </span>
        ) : (
          <span className="text-xs text-[var(--fg-faint)]">
            Free · no account · TikTok &amp; X
          </span>
        )}
      </div>
    </form>
  );
}
