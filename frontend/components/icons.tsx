import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...p,
});

export function PlayIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M6 4L20 12L6 20V4Z" fill="currentColor" />
    </svg>
  );
}

export function DownloadIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M12 3v11m0 0l-4.5-4.5M12 14l4.5-4.5" stroke="currentColor" strokeWidth={2.2} strokeLinecap="square" />
      <path d="M4 20h16" stroke="currentColor" strokeWidth={2.2} strokeLinecap="square" />
    </svg>
  );
}

export function ArrowRightIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4 12h15m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth={2.2} strokeLinecap="square" />
    </svg>
  );
}

export function CheckIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4 12.5L9.5 18L20 6" stroke="currentColor" strokeWidth={2.6} strokeLinecap="square" />
    </svg>
  );
}

export function TrashIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h16M9 6V3.5h6V6M6 6l1 15h10l1-15" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
    </svg>
  );
}

export function SearchIcon(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx={11} cy={11} r={6.5} stroke="currentColor" strokeWidth={2} />
      <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
    </svg>
  );
}

export function CloseIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth={2.2} strokeLinecap="square" />
    </svg>
  );
}

export function LinkIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M9 15l6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
      <path d="M11 6l1.5-1.5a4 4 0 015.5 5.5L16 12" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
      <path d="M13 18l-1.5 1.5a4 4 0 01-5.5-5.5L8 12" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
    </svg>
  );
}

export function RefreshIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M20 6v5h-5" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
      <path d="M19 11a7 7 0 10-1.5 6.5" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
    </svg>
  );
}

export function EditIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
      <path d="M14 6l4 4" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

export function AlertIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M12 4L21 20H3L12 4Z" stroke="currentColor" strokeWidth={2} strokeLinejoin="miter" />
      <path d="M12 10v4" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
      <path d="M12 17.2v.2" stroke="currentColor" strokeWidth={2.4} strokeLinecap="square" />
    </svg>
  );
}

export function BoltIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M13 3L5 13h5l-1 8 8-11h-5l1-7z" fill="currentColor" />
    </svg>
  );
}

export function SaveIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M5 4h11l3 3v13H5V4z" stroke="currentColor" strokeWidth={2} />
      <path d="M8 4v5h7V4M8 20v-6h8v6" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

export function DeviceIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x={7} y={3} width={10} height={18} stroke="currentColor" strokeWidth={2} />
      <path d="M11 18h2" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
    </svg>
  );
}

export function LockOpenIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x={5} y={11} width={14} height={9} stroke="currentColor" strokeWidth={2} />
      <path d="M8 11V8a4 4 0 017-2.6" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
    </svg>
  );
}

/** TikTok note glyph (simplified, sharp). */
export function TikTokGlyph(p: P) {
  return (
    <svg {...base(p)}>
      <path
        d="M14 3h2.6c.3 2 1.5 3.5 3.4 3.9V9.6c-1.3 0-2.5-.4-3.4-1v5.9a5.5 5.5 0 11-5.5-5.5c.3 0 .6 0 .9.1v2.7a2.8 2.8 0 102 2.7V3z"
        fill="currentColor"
      />
    </svg>
  );
}

/** X (Twitter) glyph. */
export function XGlyph(p: P) {
  return (
    <svg {...base(p)}>
      <path
        d="M4 4h4.2l4 5.6L16.8 4H20l-6.3 7.7L20.5 20h-4.2l-4.4-6.1L6.8 20H3.5l6.7-8.2L4 4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function GhostVideoIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x={3} y={6} width={12} height={12} stroke="currentColor" strokeWidth={2} />
      <path d="M15 10l6-3v10l-6-3v-4z" stroke="currentColor" strokeWidth={2} strokeLinejoin="miter" />
    </svg>
  );
}

/** Sharp "info" mark (boxed i) — used for the How-it-works section. */
export function InfoIcon(p: P) {
  return (
    <svg {...base(p)}>
      <rect x={4} y={4} width={16} height={16} stroke="currentColor" strokeWidth={2} />
      <path d="M12 11v5.5" stroke="currentColor" strokeWidth={2.2} strokeLinecap="square" />
      <path d="M12 7.6v.2" stroke="currentColor" strokeWidth={2.6} strokeLinecap="square" />
    </svg>
  );
}

/** Settings — sliders with square knobs (sharp, no round gear). */
export function SettingsIcon(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M3 8.5h18M3 15.5h18" stroke="currentColor" strokeWidth={2} strokeLinecap="square" />
      <rect x={13} y={6} width={5} height={5} fill="currentColor" />
      <rect x={6} y={13} width={5} height={5} fill="currentColor" />
    </svg>
  );
}
