"use client";

import { useEffect, useRef, useState } from "react";
import { DETOX_COUNTER_TARGET } from "@/lib/conversion-constants";

export default function DetoxCounter() {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        const target = DETOX_COUNTER_TARGET;
        const duration = 2200;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - (1 - p) ** 2;
          setValue(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.25, rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className="text-center text-sm font-semibold text-[var(--brand-dark)]/80 sm:text-base"
    >
      <span className="tabular-nums text-xl font-bold text-[var(--brand-green)] sm:text-2xl">{value.toLocaleString("en-IN")}</span>{" "}
      Indians detoxed their lungs with Royal Swag this year
    </p>
  );
}
