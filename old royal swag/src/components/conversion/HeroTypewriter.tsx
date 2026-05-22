"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  "You wake up coughing before your first cup of chai...",
  "You step outside and your chest already feels heavy...",
  "You've been meaning to do something about your lungs for months...",
  "You live where India's air quality spikes — your lungs absorb up to 22 cigarettes worth of pollution daily...",
] as const;

export default function HeroTypewriter() {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let cancelled = false;

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    (async () => {
      let li = 0;
      while (!cancelled) {
        const full = LINES[li % LINES.length];
        for (let i = 0; i <= full.length && !cancelled; i++) {
          setDisplay(full.slice(0, i));
          await sleep(36);
        }
        await sleep(2400);
        for (let i = full.length; i >= 0 && !cancelled; i -= 2) {
          setDisplay(full.slice(0, Math.max(0, i)));
          await sleep(16);
        }
        await sleep(400);
        li += 1;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [started]);

  return (
    <div
      ref={wrapRef}
      className="hero-typewriter-wrap min-h-[4.5rem] sm:min-h-[5rem] flex items-center justify-center px-2"
    >
      <p className="text-base sm:text-lg md:text-xl text-[var(--brand-dark)]/85 font-medium leading-snug text-center max-w-xl">
        {display}
        <span
          className="inline-block w-0.5 h-[1.1em] ml-0.5 align-[-0.15em] bg-[var(--brand-green)] animate-pulse"
          aria-hidden="true"
        />
      </p>
    </div>
  );
}
