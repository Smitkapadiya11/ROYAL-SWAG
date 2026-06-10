/** Shared 48-hour offer countdown — resets on fixed boundaries from seed (not per-session). */

export const OFFER_CYCLE_MS = 48 * 60 * 60 * 1000;

/** Monday 00:00 UTC — predictable default seed when env is unset. */
const DEFAULT_SEED_MS = Date.UTC(2024, 0, 1, 0, 0, 0, 0);

export function getTimerSeedMs(): number {
  const raw = process.env.NEXT_PUBLIC_TIMER_SEED_TIMESTAMP;
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_SEED_MS;
}

/** Milliseconds until the current 48h window ends (same for all users at a given instant). */
export function getOfferRemainingMs(now = Date.now()): number {
  const seed = getTimerSeedMs();
  const elapsed = now - seed;
  if (elapsed < 0) return OFFER_CYCLE_MS;

  const cycleIndex = Math.floor(elapsed / OFFER_CYCLE_MS);
  const cycleEnd = seed + (cycleIndex + 1) * OFFER_CYCLE_MS;
  return Math.max(0, cycleEnd - now);
}

export function formatCountdownParts(totalMs: number): [string, string, string] {
  const totalSec = Math.max(0, Math.floor(totalMs / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [
    String(h).padStart(2, "0"),
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ];
}
