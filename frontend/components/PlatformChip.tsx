import type { Platform } from "@/lib/platform";
import { Chip } from "./ui";
import { CheckIcon, TikTokGlyph, XGlyph } from "./icons";

export function PlatformChip({ platform }: { platform: Platform }) {
  const label = platform === "tiktok" ? "TikTok" : "X";
  const Glyph = platform === "tiktok" ? TikTokGlyph : XGlyph;
  return (
    <Chip tone="lime">
      <Glyph width={13} height={13} />
      {label} detected
      <CheckIcon width={13} height={13} />
    </Chip>
  );
}
