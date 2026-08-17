export function Logomark({ size = 30, className = "" }: { size?: number; className?: string }) {
  // Two offset sharp squares (lime back, violet front) + cream play triangle.
  // The "stack" motif in miniature — reads as both the design system and a play icon.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect x="9" y="9" width="18" height="18" fill="#C8F169" />
      <rect x="4" y="4" width="18" height="18" fill="#8B5CF6" />
      <path d="M11 9 L11 17 L18 13 Z" fill="#FBF7F0" />
    </svg>
  );
}

export function Logo({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 no-tap ${className}`}>
      <Logomark size={size} />
      <span
        className="font-display font-extrabold tracking-tight text-[var(--fg)]"
        style={{ fontSize: Math.round(size * 0.72), lineHeight: 1 }}
      >
        Clypfetch
      </span>
    </span>
  );
}
