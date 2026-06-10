/** Lightweight session replay — field names only, never values */

export type ReplayEvent =
  | { t: number; type: "move"; x: number; y: number }
  | { t: number; type: "click"; x: number; y: number; tag: string; id?: string; text?: string }
  | { t: number; type: "scroll"; pct: number }
  | { t: number; type: "page"; path: string }
  | { t: number; type: "field"; name: string; action: "focus" | "blur" };

const MAX_EVENTS = 500;
const THROTTLE_MS = 100;

let lastMoveAt = 0;

function storageKey(sessionId: string): string {
  return `rs_replay_${sessionId}`;
}

function readEvents(sessionId: string): ReplayEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(sessionId));
    return raw ? (JSON.parse(raw) as ReplayEvent[]) : [];
  } catch {
    return [];
  }
}

function writeEvents(sessionId: string, events: ReplayEvent[]): void {
  if (typeof window === "undefined") return;
  const trimmed = events.slice(-MAX_EVENTS);
  try {
    localStorage.setItem(storageKey(sessionId), JSON.stringify(trimmed));
  } catch {
    /* quota */
  }
}

export function appendReplayEvent(sessionId: string, event: ReplayEvent): void {
  const events = readEvents(sessionId);
  events.push(event);
  writeEvents(sessionId, events);
}

export function recordReplayPage(sessionId: string, path: string): void {
  appendReplayEvent(sessionId, { t: Date.now(), type: "page", path });
}

export function recordReplayMove(sessionId: string, clientX: number, clientY: number): void {
  const now = Date.now();
  if (now - lastMoveAt < THROTTLE_MS) return;
  lastMoveAt = now;
  const x = Math.round((clientX / window.innerWidth) * 1000) / 10;
  const y = Math.round((clientY / window.innerHeight) * 1000) / 10;
  appendReplayEvent(sessionId, { t: now, type: "move", x, y });
}

export function recordReplayClick(
  sessionId: string,
  target: HTMLElement,
  clientX: number,
  clientY: number
): void {
  const x = Math.round((clientX / window.innerWidth) * 1000) / 10;
  const y = Math.round((clientY / window.innerHeight) * 1000) / 10;
  const tag = target.tagName.toLowerCase();
  const id = target.id || undefined;
  const text = target.textContent?.trim().slice(0, 40) || undefined;
  appendReplayEvent(sessionId, { t: Date.now(), type: "click", x, y, tag, id, text });
}

export function recordReplayScroll(sessionId: string, pct: number): void {
  appendReplayEvent(sessionId, { t: Date.now(), type: "scroll", pct });
}

export function recordReplayField(
  sessionId: string,
  name: string,
  action: "focus" | "blur"
): void {
  if (!name) return;
  const lower = name.toLowerCase();
  if (
    lower.includes("password") ||
    lower.includes("card") ||
    lower.includes("cvv") ||
    lower.includes("otp")
  ) {
    return;
  }
  appendReplayEvent(sessionId, { t: Date.now(), type: "field", name, action });
}

export function flushReplay(sessionId: string): ReplayEvent[] {
  const events = readEvents(sessionId);
  try {
    localStorage.removeItem(storageKey(sessionId));
  } catch {
    /* ignore */
  }
  return events;
}
