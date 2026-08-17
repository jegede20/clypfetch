import type { ButtonHTMLAttributes, ReactNode } from "react";

export type Variant = "coral" | "violet" | "lime" | "ghost";
export type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  coral: "bg-coral text-paper border-ink shadow-[4px_4px_0_0_#E84A38] hover:brightness-[1.05]",
  violet: "bg-violet text-paper border-ink shadow-[4px_4px_0_0_#6D3FE0] hover:brightness-[1.05]",
  lime: "bg-lime text-ink border-ink shadow-[4px_4px_0_0_#A9DA3E] hover:brightness-[1.03]",
  ghost:
    "bg-[var(--canvas-2)] text-[var(--fg)] border-[color:var(--edge-strong)] shadow-[4px_4px_0_0_var(--edge)] hover:bg-[var(--canvas-3)]",
};

const SIZE: Record<Size, string> = {
  sm: "px-3.5 py-2 text-[13px] gap-1.5",
  md: "px-5 py-3 text-[15px] gap-2",
  lg: "px-6 py-3.5 text-base gap-2.5",
};

/** Shared class string for the stacked-shadow, sharp-edge button. */
export function btnClass(variant: Variant = "coral", size: Size = "md", full = false): string {
  return [
    "inline-flex items-center justify-center text-center font-semibold leading-none border-2 no-tap select-none cursor-pointer",
    "rounded-none transition-[transform,filter,background-color] duration-75 will-change-transform",
    "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    "disabled:opacity-45 disabled:pointer-events-none disabled:active:translate-x-0 disabled:active:translate-y-0",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
    VARIANT[variant],
    SIZE[size],
    full ? "w-full" : "",
  ].join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "coral",
  size = "md",
  full = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={`${btnClass(variant, size, full)} ${className}`} {...rest}>
      {children}
    </button>
  );
}

type Stack = "violet" | "coral" | "lime" | "ink" | "none";
const CARD_SHADOW: Record<Stack, string> = {
  violet: "shadow-[7px_7px_0_0_#6D3FE0]",
  coral: "shadow-[7px_7px_0_0_#E84A38]",
  lime: "shadow-[7px_7px_0_0_#A9DA3E]",
  ink: "shadow-[7px_7px_0_0_#14121A]",
  none: "",
};

/** Cream "paper" card — the surface that pops off the ink canvas. */
export function Card({
  children,
  className = "",
  stack = "violet",
}: {
  children: ReactNode;
  className?: string;
  stack?: Stack;
}) {
  return (
    <div className={`bg-paper text-ink border-2 border-ink rounded-none ${CARD_SHADOW[stack]} ${className}`}>
      {children}
    </div>
  );
}

type Tone = "neutral" | "lime" | "violet" | "coral";
const CHIP_TONE: Record<Tone, string> = {
  neutral: "bg-[var(--canvas-3)] text-[var(--fg)] border-[color:var(--edge-strong)] shadow-[3px_3px_0_0_var(--edge)]",
  lime: "bg-lime text-ink border-ink shadow-[3px_3px_0_0_#A9DA3E]",
  violet: "bg-violet text-paper border-ink shadow-[3px_3px_0_0_#6D3FE0]",
  coral: "bg-coral text-paper border-ink shadow-[3px_3px_0_0_#E84A38]",
};

export function Chip({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border-2 rounded-none px-3 py-1.5 text-xs font-semibold leading-none ${CHIP_TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Spinning square — the sharp-edge take on a loader. */
export function Spinner({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-none ${className}`}
      style={{
        width: size,
        height: size,
        border: "3px solid rgba(139,92,246,0.25)",
        borderTopColor: "#8B5CF6",
      }}
      aria-hidden="true"
    />
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block font-display font-bold uppercase tracking-[0.18em] text-[11px] text-violet ${className}`}
    >
      {children}
    </span>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
