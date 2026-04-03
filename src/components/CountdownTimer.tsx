"use client";

import { useEffect, useRef, useState, startTransition } from "react";

const OFFER_DURATION_MS = 48 * 60 * 60 * 1000;
const STORAGE_KEY = "productOffer48hDeadline";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function readOrInitDeadline(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!Number.isNaN(parsed) && parsed > Date.now()) {
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }
  const deadline = Date.now() + OFFER_DURATION_MS;
  try {
    localStorage.setItem(STORAGE_KEY, String(deadline));
  } catch {
    /* ignore */
  }
  return deadline;
}

/** Returns display string and ensures deadline ref + localStorage are rolled forward if expired. */
function tickDeadline(deadlineMs: number): { display: string; deadline: number } {
  let deadline = deadlineMs;
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
  return { display: `${pad(h)}:${pad(m)}:${pad(s)}`, deadline };
}

export default function CountdownTimer() {
  const deadlineRef = useRef(0);
  const [display, setDisplay] = useState("00:00:00");

  useEffect(() => {
    const initial = readOrInitDeadline();
    const first = tickDeadline(initial);
    deadlineRef.current = first.deadline;
    startTransition(() => setDisplay(first.display));

    const id = window.setInterval(() => {
      const { display: d, deadline } = tickDeadline(deadlineRef.current);
      deadlineRef.current = deadline;
      startTransition(() => setDisplay(d));
    }, 1000);
    return () => window.clearInterval(id);
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
