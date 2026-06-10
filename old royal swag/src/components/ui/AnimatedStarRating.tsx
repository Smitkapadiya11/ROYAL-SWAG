"use client";

import { useEffect, useState } from "react";
import { useInViewReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type AnimatedStarRatingProps = {
  count?: number;
  className?: string;
};

export function AnimatedStarRating({ count = 5, className }: AnimatedStarRatingProps) {
  const { ref, visible, reduceMotion } = useInViewReveal();
  const [filled, setFilled] = useState(reduceMotion ? count : 0);

  useEffect(() => {
    if (!visible || reduceMotion) {
      if (reduceMotion) setFilled(count);
      return;
    }

    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setFilled(current);
      if (current >= count) clearInterval(timer);
    }, 120);

    return () => clearInterval(timer);
  }, [visible, reduceMotion, count]);

  return (
    <div ref={ref} className={cn("text-ayurvedic-gold", className)} aria-label={`${count} stars`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn("inline-block transition-opacity duration-200", i < filled ? "opacity-100" : "opacity-15")}
        >
          ★
        </span>
      ))}
    </div>
  );
}
