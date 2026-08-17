import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-[color:var(--edge)] pb-[calc(3rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex max-w-md flex-col gap-3">
          <Logo size={24} />
          <p className="text-xs leading-relaxed text-[var(--fg-faint)]">
            Clypfetch fetches publicly available videos. Downloading content you don&apos;t own
            may be restricted by TikTok&apos;s or X&apos;s Terms of Service — please respect
            creators&apos; rights and only save videos you have permission to keep.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-[var(--fg-dim)]">
          <Link href="/terms" className="transition-colors hover:text-[var(--fg)]">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-[var(--fg)]">
            Privacy
          </Link>
          <a href="mailto:hello@clypfetch.app" className="transition-colors hover:text-[var(--fg)]">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
