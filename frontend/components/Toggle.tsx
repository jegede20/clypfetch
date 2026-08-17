"use client";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  // Custom square track + square knob — not the default rounded pill toggle.
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center border-2 border-ink rounded-none no-tap transition-colors duration-100 ${
        checked ? "bg-lime" : "bg-[var(--canvas-3)]"
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 border-2 border-ink bg-paper transition-[left] duration-100 ${
          checked ? "left-[26px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}
