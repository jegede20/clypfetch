"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { Logo } from "./Logo";
import { btnClass } from "./ui";
import { InfoIcon, DownloadIcon, SettingsIcon } from "./icons";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/downloads", label: "Downloads" },
  { href: "/settings", label: "Settings" },
];

type Tab = { href: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };
const TABS: Tab[] = [
  { href: "/#how", label: "How it works", Icon: InfoIcon },
  { href: "/downloads", label: "Downloads", Icon: DownloadIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

// Hash links (jump to a section on the landing page) are never a "current page".
function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 border-b-2 border-[color:var(--edge)] bg-[var(--canvas-glass)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Clypfetch home" className="no-tap">
            <Logo size={27} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const active = isActive(pathname, l.href);
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

      {/*
        Mobile bottom tab bar. The top nav's links are `hidden md:flex`, so on
        phones the Downloads / Settings pages (and the How-it-works section) are
        otherwise unreachable without forcing desktop mode. This gives them a
        thumb-friendly home. Hidden at md+, where the top nav takes over.
      */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[color:var(--edge-strong)] bg-[var(--canvas-glass)] backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto grid max-w-md grid-cols-3">
          {TABS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1 py-2 no-tap"
              >
                <span
                  className={
                    active
                      ? "flex h-9 w-9 items-center justify-center rounded-none border-2 border-ink bg-violet text-paper shadow-[2px_2px_0_0_#6D3FE0]"
                      : "flex h-9 w-9 items-center justify-center text-[var(--fg-dim)]"
                  }
                >
                  <Icon width={20} height={20} />
                </span>
                <span
                  className={`text-[10px] font-bold leading-none tracking-tight ${
                    active ? "text-violet" : "text-[var(--fg-faint)]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
