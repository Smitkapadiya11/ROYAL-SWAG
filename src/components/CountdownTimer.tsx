"use client";

import { useEffect, useRef, useState } from "react";

const OFFER_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours
const STORAGE_KEY = "royal_swag_offer_end";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 47, m: 59, s: 59 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Calculate or restore the deadline
    let deadline: number;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > Date.now()) {
          deadline = parsed;
        } else {
          // Expired — reset
          deadline = Date.now() + OFFER_DURATION_MS;
          localStorage.setItem(STORAGE_KEY, String(deadline));
        }
      } else {
        deadline = Date.now() + OFFER_DURATION_MS;
        localStorage.setItem(STORAGE_KEY, String(deadline));
      }
    } catch {
      deadline = Date.now() + OFFER_DURATION_MS;
    }

    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        // Reset deadline
        const newDeadline = Date.now() + OFFER_DURATION_MS;
        try { localStorage.setItem(STORAGE_KEY, String(newDeadline)); } catch {}
        deadline = newDeadline;
      }
      const remaining = Math.max(0, deadline - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setTimeLeft({ h, m, s });
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5"
      aria-live="polite"
      aria-label={`Offer ends in ${timeLeft.h} hours ${timeLeft.m} minutes ${timeLeft.s} seconds`}
    >
      <span className="text-red-600 text-sm font-semibold">🔥 Offer ends in:</span>
      <div className="flex items-center gap-1">
        {[
          { val: timeLeft.h, label: "hr" },
          { val: timeLeft.m, label: "min" },
          { val: timeLeft.s, label: "sec" },
        ].map(({ val, label }, i) => (
          <span key={label} className="flex items-center gap-0.5">
            {i > 0 && <span className="text-red-400 font-bold text-sm">:</span>}
            <span className="font-mono font-bold text-red-700 text-base tabular-nums w-[2ch] text-center">
              {pad(val)}
            </span>
            <span className="text-red-400 text-[10px] font-medium hidden sm:inline">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
