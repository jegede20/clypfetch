export type Platform = "tiktok" | "x";

const TIKTOK = /https?:\/\/([\w-]+\.)?tiktok\.com\//i;
const X = /https?:\/\/([\w-]+\.)?(x|twitter)\.com\//i;

/** Detect which supported platform a pasted URL belongs to (or null). */
export function detectPlatform(url: string): Platform | null {
  const u = (url || "").trim();
  if (TIKTOK.test(u)) return "tiktok";
  if (X.test(u)) return "x";
  return null;
}

export const PLATFORM_LABEL: Record<Platform, string> = {
  tiktok: "TikTok",
  x: "X",
};

/** True once the string looks like it could be a URL worth checking. */
export function looksLikeUrl(url: string): boolean {
  return /^https?:\/\/\S+\.\S+/i.test((url || "").trim());
}
