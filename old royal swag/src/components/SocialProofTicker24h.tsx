"use client";

import { useEffect, useRef, useState } from "react";

const SOCIAL_PROOF_STORAGE_KEY = "productSocialProof24h";

function randomIntInclusive(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random 8–15 on first visit, +1 every 3–7 min; persisted in localStorage (client-only). */
export default function SocialProofTicker24h() {
  const [count, setCount] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let initial: number;
    try {
      const raw = localStorage.getItem(SOCIAL_PROOF_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { count?: unknown };
        if (typeof parsed.count === "number" && Number.isFinite(parsed.count) && parsed.count >= 0) {
          initial = parsed.count;
        } else {
          initial = randomIntInclusive(8, 15);
          localStorage.setItem(SOCIAL_PROOF_STORAGE_KEY, JSON.stringify({ count: initial }));
        }
      } else {
        initial = randomIntInclusive(8, 15);
        localStorage.setItem(SOCIAL_PROOF_STORAGE_KEY, JSON.stringify({ count: initial }));
      }
    } catch {
      initial = randomIntInclusive(8, 15);
    }

    const t0 = window.setTimeout(() => {
      setCount(initial);
    }, 0);

    const scheduleBump = () => {
      const delayMs = randomIntInclusive(3, 7) * 60 * 1000;
      timeoutRef.current = setTimeout(() => {
        setCount((prev) => {
          const next = (prev ?? initial) + 1;
          try {
            localStorage.setItem(SOCIAL_PROOF_STORAGE_KEY, JSON.stringify({ count: next }));
          } catch {
            /* ignore */
          }
          return next;
        });
        scheduleBump();
      }, delayMs);
    };

    scheduleBump();

    return () => {
      window.clearTimeout(t0);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (count === null) return null;

  return (
    <p className="text-xs text-[var(--brand-dark)]/55 min-h-[1.25rem] max-w-full break-words leading-snug">
      👥 <span className="tabular-nums inline-block min-w-[1.5ch] text-center">{count}</span> people
      ordered in the last 24 hours
    </p>
  );
}
