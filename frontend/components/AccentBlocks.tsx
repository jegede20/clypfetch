const BLOCKS = [
  {
    label: "paste link",
    step: "01",
    bg: "bg-violet",
    text: "text-paper",
    shadow: "shadow-[9px_9px_0_0_#6D3FE0]",
    anim: "animate-float",
    rotate: "-rotate-2",
  },
  {
    label: "fetch video",
    step: "02",
    bg: "bg-coral",
    text: "text-paper",
    shadow: "shadow-[9px_9px_0_0_#E84A38]",
    anim: "animate-floatb",
    rotate: "rotate-1",
  },
  {
    label: "play · download",
    step: "03",
    bg: "bg-lime",
    text: "text-ink",
    shadow: "shadow-[9px_9px_0_0_#A9DA3E]",
    anim: "animate-floatc",
    rotate: "-rotate-1",
  },
];

export function AccentBlocks() {
  return (
    <div className="flex flex-col items-center gap-6 py-4" aria-hidden="true">
      {BLOCKS.map((b) => (
        <div
          key={b.label}
          className={`clip-corner w-60 border-2 border-ink px-6 py-5 ${b.bg} ${b.text} ${b.shadow} ${b.anim} ${b.rotate}`}
        >
          <span className="block font-display text-xs font-bold uppercase tracking-[0.2em] opacity-70">
            {b.step}
          </span>
          <span className="mt-1 block font-display text-2xl font-extrabold lowercase leading-none tracking-tight">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
