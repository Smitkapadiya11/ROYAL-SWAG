"use client";

import { useEffect, useState } from "react";

function useCountdown(hours: number) {
  const getTarget = () => {
    const stored = localStorage.getItem("rs_timer_target");
    if (stored) {
      const t = parseInt(stored, 10);
      if (t > Date.now()) return t;
    }
    const t = Date.now() + hours * 60 * 60 * 1000;
    localStorage.setItem("rs_timer_target", t.toString());
    return t;
  };

  const [display, setDisplay] = useState("00:00:00");

  useEffect(() => {
    let target = getTarget();

    const tick = () => {
      let diff = target - Date.now();
      if (diff <= 0) {
        const t = Date.now() + hours * 60 * 60 * 1000;
        localStorage.setItem("rs_timer_target", t.toString());
        target = t;
        diff = target - Date.now();
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setDisplay(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hours]);

  return display;
}

export default function CountdownTimer() {
  const time = useCountdown(48);

  return (
    <p
      className="text-sm font-bold text-red-600 min-h-[1.25rem] max-w-full break-words"
      aria-live="polite"
      aria-label={`Offer ends in ${time}`}
    >
      <span className="text-red-600">⏰ Offer ends in: </span>
      <span className="font-mono tabular-nums text-red-600">{time}</span>
    </p>
  );
}
