"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "rs_offer_reset_at";
const CYCLE_MS = 48 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;
const UNITS = ["HH", "MM", "SS"] as const;

function getResetAnchor(): number {
  if (typeof window === "undefined") return Date.now() + CYCLE_MS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const ts = parseInt(stored, 10);
    if (!Number.isNaN(ts)) return ts;
  }
  const now = Date.now();
  localStorage.setItem(STORAGE_KEY, String(now));
  return now;
}

function getRemainingMs(): number {
  const anchor = getResetAnchor();
  const elapsed = Date.now() - anchor;
  if (elapsed >= CYCLE_MS) {
    const next = Date.now();
    localStorage.setItem(STORAGE_KEY, String(next));
    return CYCLE_MS;
  }
  return CYCLE_MS - elapsed;
}

function formatParts(totalMs: number): [string, string, string] {
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

export default function CountdownTimer({ className }: { className?: string }) {
  const [parts, setParts] = useState<[string, string, string]>(["48", "00", "00"]);
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const tick = () => {
      const remaining = getRemainingMs();
      setParts(formatParts(remaining));
      setUrgent(remaining <= ONE_HOUR_MS);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "rounded-xl border border-white/50 bg-glass px-4 py-3 backdrop-blur-xl shadow-glass",
        urgent && "animate-pulse",
        className
      )}
      aria-live="polite"
    >
      <p
        className={cn(
          "mb-2 font-body text-sm font-semibold tracking-wide text-gold",
          urgent && "text-[#9A6F1A]"
        )}
      >
        Offer ends in:
      </p>
      <div className="flex items-center gap-1">
        {UNITS.map((unit, i) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="min-w-[44px] rounded-lg bg-[#324023] px-3 py-1.5 text-center text-white">
              <span className="countdown-digit font-number text-xl font-bold tabular-nums">
                {parts[i]}
              </span>
            </div>
            <span className="mt-1 font-sans text-[9px] uppercase tracking-wider text-[#45483f]">
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
