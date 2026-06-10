"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  formatCountdownParts,
  getOfferRemainingMs,
} from "@/lib/countdown-timer";
import { cn } from "@/lib/utils";
import {
  countdownDigitAnimate,
  countdownDigitEnter,
  countdownDigitExit,
  countdownFlipTransition,
} from "@/lib/motionVariants";

function FlipDigit({ value, dark }: { value: string; dark?: boolean }) {
  const reduceMotion = useReducedMotion();

  const boxClass = cn(
    "inline-flex min-w-[1.1rem] items-center justify-center rounded border px-0.5 font-mono text-base font-bold tabular-nums",
    dark
      ? "border-white/20 bg-white/10 text-white"
      : "border-primary/15 bg-white/60 text-primary"
  );

  if (reduceMotion) {
    return <span className={boxClass}>{value}</span>;
  }

  return (
    <span className={boxClass} style={{ perspective: 400 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={countdownDigitEnter}
          animate={countdownDigitAnimate}
          exit={countdownDigitExit}
          transition={countdownFlipTransition}
          className="inline-block"
          style={{ transformOrigin: "center bottom" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function DigitGroup({
  value,
  dark,
}: {
  value: string;
  dark?: boolean;
}) {
  return (
    <span className="inline-flex gap-0.5">
      {value.split("").map((digit, i) => (
        <FlipDigit key={`${value}-${i}`} value={digit} dark={dark} />
      ))}
    </span>
  );
}

type CountdownTimerProps = {
  className?: string;
  /** Use on dark backgrounds (product hero panels) */
  variant?: "light" | "dark";
};

export default function CountdownTimer({
  className,
  variant = "light",
}: CountdownTimerProps) {
  const [parts, setParts] = useState<[string, string, string]>(["47", "59", "59"]);
  const dark = variant === "dark";

  useEffect(() => {
    const tick = () => setParts(formatCountdownParts(getOfferRemainingMs()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      aria-live="polite"
    >
      <span
        className={cn(
          "font-sans text-sm font-medium",
          dark ? "text-white/90" : "text-on-surface-variant"
        )}
      >
        ⏰ Offer ends in:
      </span>
      <div className="inline-flex items-center gap-1">
        <DigitGroup value={parts[0]} dark={dark} />
        <span className={cn("font-mono font-bold", dark ? "text-white/70" : "text-primary/50")}>
          :
        </span>
        <DigitGroup value={parts[1]} dark={dark} />
        <span className={cn("font-mono font-bold", dark ? "text-white/70" : "text-primary/50")}>
          :
        </span>
        <DigitGroup value={parts[2]} dark={dark} />
      </div>
    </div>
  );
}
