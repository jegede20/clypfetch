import type { Platform } from "./platform";

export interface HistoryItem {
  id: string;
  url: string;
  platform: Platform;
  title: string;
  thumbnail: string | null;
  duration: number | null;
  streamUrl: string;
  downloadUrl: string;
  savedAt: number;
}

const KEY = "clypfetch-history";
const EVENT = "clypfetch-history";

function makeId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.floor(performance.now())}`;
  }
}

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function addHistory(item: Omit<HistoryItem, "id" | "savedAt">): HistoryItem[] {
  const existing = getHistory().filter((h) => h.url !== item.url);
  const entry: HistoryItem = { ...item, id: makeId(), savedAt: Date.now() };
  const next = [entry, ...existing].slice(0, 100);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
  return next;
}

export function removeHistory(id: string): HistoryItem[] {
  const next = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
  return next;
}

export function clearHistory(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export const HISTORY_EVENT = EVENT;
