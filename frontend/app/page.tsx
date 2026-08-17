import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AccentBlocks } from "@/components/AccentBlocks";
import { HeroInput } from "@/components/HeroInput";
import { Container, Eyebrow, Chip, btnClass } from "@/components/ui";
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  DeviceIcon,
  DownloadIcon,
  LockOpenIcon,
  PlayIcon,
  TikTokGlyph,
  XGlyph,
} from "@/components/icons";

const STEPS = [
  {
    n: "01",
    title: "Paste a link",
    body: "Copy a public TikTok or X video link and drop it in. Clypfetch detects the platform automatically.",
    accent: "bg-violet text-paper",
  },
  {
    n: "02",
    title: "We fetch it",
    body: "The real video is pulled server-side — no watermark hunting, no sketchy redirects, no guesswork.",
    accent: "bg-coral text-paper",
  },
  {
    n: "03",
    title: "Play or save",
    body: "Preview it right in your browser, then download the file straight to your device in one tap.",
    accent: "bg-lime text-ink",
  },
];

const VALUES = [
  { icon: BoltIcon, title: "Fast & direct", body: "Paste to preview in seconds. No hoops, no redirects." },
  { icon: LockOpenIcon, title: "No account", body: "Totally free. Nothing to sign up for, nothing to install." },
  { icon: DeviceIcon, title: "Works anywhere", body: "Phone or desktop — the same clean flow on every screen." },
];

function PreviewMock() {
  return (
    <Link
      href="/app"
      aria-label="Try Clypfetch"
      className="block bg-paper text-ink border-2 border-ink rounded-none shadow-[8px_8px_0_0_#6D3FE0] no-tap transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[9/16] max-h-[400px] w-full overflow-hidden border-b-2 border-ink bg-gradient-to-br from-violet via-ink-2 to-coral">
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center border-2 border-ink bg-lime text-ink shadow-[5px_5px_0_0_#14121A]">
            <PlayIcon width={26} height={26} />
          </span>
        </span>
        <span className="absolute bottom-2 right-2 border-2 border-ink bg-ink px-2 py-1 text-xs font-bold text-paper">
          0:14
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <Chip tone="violet">
            <TikTokGlyph width={13} height={13} />
            TikTok
          </Chip>
          <span className="text-xs font-semibold text-ink/55">@creator</span>
        </div>
        <p className="text-sm font-semibold leading-snug text-ink">
          That clip you actually wanted to keep
        </p>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <span className="inline-flex items-center justify-center gap-2 border-2 border-ink bg-coral px-4 py-3 text-[15px] font-semibold text-paper shadow-[4px_4px_0_0_#E84A38]">
            <DownloadIcon width={18} height={18} />
            Download
          </span>
          <span className="inline-flex items-center justify-center gap-2 border-2 border-ink bg-violet px-4 py-3 text-[15px] font-semibold text-paper shadow-[4px_4px_0_0_#6D3FE0]">
            <PlayIcon width={16} height={16} />
            Play
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Container className="py-14 sm:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <Eyebrow>Free video fetcher</Eyebrow>
                <h1 className="mt-4 font-display text-[2.6rem] font-extrabold leading-[1.03] tracking-tight text-[var(--fg)] sm:text-6xl">
                  Paste a link.{" "}
                  <span className="marker text-ink">Grab</span> the video.
                </h1>
                <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--fg-dim)] sm:text-lg">
                  Clypfetch turns any public TikTok or X link into a video you can preview
                  and save — no account, no watermark, no hassle.
                </p>

                <div className="mt-8 max-w-md">
                  <HeroInput />
                </div>

                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[var(--fg-dim)]">
                  {["100% free", "No sign-up", "No watermark", "Mobile ready"].map((t) => (
                    <li key={t} className="inline-flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center bg-lime text-ink">
                        <CheckIcon width={12} height={12} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="pointer-events-none absolute -left-32 top-2 hidden opacity-90 xl:block">
                  <AccentBlocks />
                </div>
                <div className="relative w-full max-w-[300px]">
                  <PreviewMock />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 border-t-2 border-[color:var(--edge)]">
          <Container className="py-16 sm:py-20">
            <div className="max-w-xl">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[var(--fg)] sm:text-4xl">
                Three steps, start to saved.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="border-2 border-ink bg-paper text-ink rounded-none p-6 shadow-[7px_7px_0_0_#14121A]"
                >
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center border-2 border-ink font-display text-lg font-extrabold ${s.accent}`}
                  >
                    {s.n}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Value band */}
        <section className="border-t-2 border-[color:var(--edge)]">
          <Container className="py-16 sm:py-20">
            <div className="grid gap-6 md:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.title} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[color:var(--edge-strong)] bg-[var(--canvas-2)] text-violet shadow-[4px_4px_0_0_var(--edge)]">
                    <v.icon width={22} height={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[var(--fg)]">{v.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--fg-dim)]">{v.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-2 border-[color:var(--edge)] bg-[var(--canvas-2)] px-5 py-4">
              <span className="text-sm font-semibold text-[var(--fg-dim)]">Supported today:</span>
              <Chip tone="violet">
                <TikTokGlyph width={13} height={13} />
                TikTok
              </Chip>
              <Chip tone="neutral">
                <XGlyph width={13} height={13} />
                X · Twitter
              </Chip>
              <span className="text-xs text-[var(--fg-faint)]">More platforms later.</span>
            </div>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="border-t-2 border-[color:var(--edge)]">
          <Container className="py-16 sm:py-24">
            <div className="clip-corner mx-auto max-w-3xl border-2 border-ink bg-lime px-8 py-12 text-center text-ink shadow-[10px_10px_0_0_#A9DA3E]">
              <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Ready to grab that clip?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink/75">
                It&apos;s free and takes about ten seconds. Paste a link and see.
              </p>
              <Link href="/app" className={`${btnClass("coral", "lg")} mt-7`}>
                <BoltIcon width={18} height={18} />
                Fetch a video
                <ArrowRightIcon width={18} height={18} />
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
