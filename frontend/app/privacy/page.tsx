import type { ReactNode } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container, Eyebrow } from "@/components/ui";

export const metadata = { title: "Privacy Policy — Clypfetch" };

function H({ children }: { children: ReactNode }) {
  return <h2 className="mt-9 font-display text-xl font-bold text-[var(--fg)]">{children}</h2>;
}
function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-[var(--fg-dim)]">{children}</p>;
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Container className="max-w-2xl py-10 sm:py-14">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[var(--fg)] sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-[var(--fg-faint)]">Last updated: August 17, 2026</p>

          <P>
            The short version: Clypfetch has no accounts, no tracking, and keeps your history on
            your own device. Here are the details.
          </P>

          <H>What we don&apos;t collect</H>
          <P>
            No sign-up, no profile, no analytics cookies, no ad trackers. We don&apos;t ask for your
            name, email, or any personal information to use the tool.
          </P>

          <H>Your download history stays local</H>
          <P>
            The list of videos you fetch is stored in your browser&apos;s local storage on this
            device only. It never leaves your device and we can&apos;t see it. Clearing it in{" "}
            <Link href="/settings" className="text-violet hover:underline">
              Settings
            </Link>{" "}
            (or clearing your browser data) removes it completely.
          </P>

          <H>How a fetch is processed</H>
          <P>
            When you paste a link, our server asks the source platform for that video, downloads it
            to a temporary location so it can be played and saved reliably, and serves it back to
            you. That temporary copy is automatically deleted a short time later. We don&apos;t build
            a library of what people fetch.
          </P>
          <P>
            Basic, short-lived server logs (such as an IP address and timestamp) may be generated for
            security and abuse-prevention, as with almost any web service. They are not used to
            profile you.
          </P>

          <H>Third-party platforms</H>
          <P>
            The videos come from TikTok and X. When our server contacts them on your behalf, those
            platforms handle the request under their own privacy policies, which we don&apos;t
            control.
          </P>

          <H>Changes</H>
          <P>We&apos;ll update this page if our practices change. The date above always reflects the latest version.</P>

          <H>Contact</H>
          <P>
            Questions about privacy? Email{" "}
            <a href="mailto:hello@clypfetch.app" className="text-violet hover:underline">
              hello@clypfetch.app
            </a>
            . See also our{" "}
            <Link href="/terms" className="text-violet hover:underline">
              Terms of Service
            </Link>
            .
          </P>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
