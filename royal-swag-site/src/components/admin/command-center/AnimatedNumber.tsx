"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({
  value,
  format,
  className = "",
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) return;

    const duration = 500;
    const start = performance.now();

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (t < 1) requestAnimationFrame(frame);
      else setDisplay(to);
    };

    requestAnimationFrame(frame);
  }, [value]);

  const text = format ? format(display) : Math.round(display).toLocaleString("en-IN");

  return <span className={className}>{text}</span>;
}
