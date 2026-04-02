"use client";

import { useEffect, useRef, useState } from "react";

const OFFER_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours
/** End timestamp (ms); resets every 48h from this point when expired */
const STORAGE_KEY = "productOffer48hDeadline";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer() {
  const [display, setDisplay] = useState("00:00:00");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let deadline: number;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!Number.isNaN(parsed) && parsed > Date.now()) {
          deadline = parsed;
        } else {
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
      let diff = deadline - Date.now();
      if (diff <= 0) {
        deadline = Date.now() + OFFER_DURATION_MS;
        try {
          localStorage.setItem(STORAGE_KEY, String(deadline));
        } catch {
          /* ignore */
        }
        diff = deadline - Date.now();
      }
      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setDisplay(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <p
      className="text-sm font-bold text-red-600 min-h-[1.25rem] max-w-full break-words"
      aria-live="polite"
      aria-label={`Offer ends in ${display}`}
    >
      <span className="text-red-600">⏰ Offer ends in: </span>
      <span className="font-mono tabular-nums text-red-600">{display}</span>
    </p>
  );
}
