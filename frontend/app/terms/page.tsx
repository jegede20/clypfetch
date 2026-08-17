import type { ReactNode } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container, Eyebrow } from "@/components/ui";

export const metadata = { title: "Terms of Service — Clypfetch" };

function H({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-9 font-display text-xl font-bold text-[var(--fg)]">{children}</h2>
  );
}
function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-[var(--fg-dim)]">{children}</p>;
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Container className="max-w-2xl py-10 sm:py-14">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[var(--fg)] sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-[var(--fg-faint)]">Last updated: August 17, 2026</p>

          <H>1. What Clypfetch is</H>
          <P>
            Clypfetch is a free tool that resolves a public TikTok or X (Twitter) video link into a
            file you can preview and download. We don&apos;t host videos ourselves — we fetch the
            content the link points to, hand it to you, and discard our temporary copy shortly
            after.
          </P>

          <H>2. Respecting platform terms &amp; creators</H>
          <P>
            This is the important part, and we won&apos;t hide it: downloading a video that you
            don&apos;t own or have permission to save may violate TikTok&apos;s or X&apos;s Terms of
            Service, and can infringe the rights of the person who made it. That is a real risk, not
            a solved problem.
          </P>
          <P>
            You are solely responsible for how you use anything you fetch with Clypfetch. By using
            it, you agree to only download content that you created, that you have permission to
            save, or that is otherwise legal for you to keep in your situation — and to honor the
            terms of the platform the video came from.
          </P>

          <H>3. Acceptable use</H>
          <P>Please do not use Clypfetch to:</P>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-[var(--fg-dim)]">
            <li>Re-upload or redistribute other people&apos;s videos as if they were your own.</li>
            <li>Remove attribution, or strip watermarks to misrepresent a creator&apos;s work.</li>
            <li>Download private, restricted, or paywalled content you weren&apos;t granted access to.</li>
            <li>Break any law that applies to you, or any platform&apos;s terms.</li>
          </ul>

          <H>4. No warranty</H>
          <P>
            Clypfetch is provided &quot;as is,&quot; without warranties of any kind. Platforms change
            constantly, so fetching may fail, be incomplete, or stop working at any time. We
            don&apos;t guarantee availability, accuracy, or fitness for any particular purpose.
          </P>

          <H>5. Limitation of liability</H>
          <P>
            To the fullest extent permitted by law, Clypfetch and its maintainers are not liable for
            any damages, claims, or consequences arising from your use of the tool — including any
            dispute with a platform or a content owner.
          </P>

          <H>6. Changes</H>
          <P>
            We may update these terms as the tool evolves. Continued use after a change means you
            accept the revised terms.
          </P>

          <H>7. Contact</H>
          <P>
            Questions? Reach us at{" "}
            <a href="mailto:hello@clypfetch.app" className="text-violet hover:underline">
              hello@clypfetch.app
            </a>
            . See also our{" "}
            <Link href="/privacy" className="text-violet hover:underline">
              Privacy Policy
            </Link>
            .
          </P>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
