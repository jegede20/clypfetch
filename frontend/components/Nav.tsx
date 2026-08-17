"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { btnClass } from "./ui";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/downloads", label: "Downloads" },
  { href: "/settings", label: "Settings" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[color:var(--edge)] bg-[var(--canvas-glass)] backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Clypfetch home" className="no-tap">
          <Logo size={27} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = l.href.startsWith("/#")
              ? false
              : pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 text-sm font-semibold transition-colors ${
                  active ? "text-violet" : "text-[var(--fg-dim)] hover:text-[var(--fg)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/app" className={btnClass("coral", "sm")}>
          Try it free
        </Link>
      </div>
    </header>
  );
}
