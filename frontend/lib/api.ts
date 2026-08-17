import type { Platform } from "./platform";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export interface VideoResult {
  platform: Platform;
  title: string;
  uploader: string | null;
  thumbnail: string | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  ext: string;
  streamUrl: string;
  downloadUrl: string;
}

export interface ApiError {
  error: string;
  message: string;
  detail?: string;
}

function isApiError(x: unknown): x is ApiError {
  return typeof x === "object" && x !== null && "message" in x;
}

/** Ask the backend to resolve a pasted link into playable + downloadable URLs. */
export async function extractVideo(url: string): Promise<VideoResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    throw {
      error: "network",
      message:
        "Can't reach the Clypfetch server. Check your connection and try again.",
    } as ApiError;
  }

  const data: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (isApiError(data)) throw data;
    throw {
      error: "failed",
      message: "We couldn't fetch this video. Please try again.",
    } as ApiError;
  }
  return data as VideoResult;
}
