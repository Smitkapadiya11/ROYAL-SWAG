"use client";

import { useEffect, useState } from "react";
import { useInViewReveal } from "@/hooks/useScrollReveal";

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
  className = "font-number",
}: CountUpProps) {
  const { ref, visible, reduceMotion } = useInViewReveal<HTMLSpanElement>();
  const [count, setCount] = useState(reduceMotion ? end : 0);

  useEffect(() => {
    if (!visible || end <= 0) return;
    if (reduceMotion) {
      setCount(end);
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
  }, [visible, end, duration, reduceMotion]);

  const display = end <= 0 ? 0 : count;

  return (
    <span ref={ref} className={`inline ${className}`}>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
