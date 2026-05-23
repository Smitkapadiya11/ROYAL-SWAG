"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type CountUpProps = {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function CountUp({
  end,
  prefix = "",
  suffix = "",
  duration = 2000,
  className = "",
}: CountUpProps) {
  const { ref, visible } = useScrollReveal();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (end <= 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const step = Math.max(duration / end, 16);
    const increment = Math.max(1, Math.ceil(end / 60));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, step);

    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return (
    <div ref={ref} className={`inline ${className}`}>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </div>
  );
}
