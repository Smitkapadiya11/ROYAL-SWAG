"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Phase = "ready" | "holding" | "done";

interface BreathHoldTestProps {
  onComplete: (seconds: number) => void;
  disabled?: boolean;
  onBack?: () => void;
}

export default function BreathHoldTest({
  onComplete,
  disabled = false,
  onBack,
}: BreathHoldTestProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const hasStartedRef = useRef(false);
  const hasDoneRef = useRef(false);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startHolding = useCallback(() => {
    if (disabled) return;
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setPhase("holding");
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(secs);
    }, 200);
  }, [disabled]);

  const stopHolding = useCallback(() => {
    if (hasDoneRef.current) return;
    if (!hasStartedRef.current) return;
    hasDoneRef.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const finalSeconds = Math.max(
      1,
      Math.floor((Date.now() - startTimeRef.current) / 1000)
    );
    setElapsed(finalSeconds);
    setPhase("done");
    setTimeout(() => {
      onComplete(finalSeconds);
    }, 1200);
  }, [onComplete]);

  const handleStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startHolding();
    },
    [startHolding]
  );

  const handleStop = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (phase === "holding") stopHolding();
    },
    [phase, stopHolding]
  );

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex h-12 items-center justify-center text-center">
        {phase === "ready" && (
          <p className="font-sans text-sm text-[#45483f]">
            Take a deep breath in, then press START
          </p>
        )}
        {phase === "holding" && (
          <p className="animate-pulse font-display text-2xl font-bold text-[#324023]">
            Hold… {elapsed}s
          </p>
        )}
        {phase === "done" && (
          <p className="font-display text-2xl font-bold text-[#9A6F1A]">
            ✓ {elapsed} seconds! Analysing…
          </p>
        )}
      </div>

      {phase === "ready" && (
        <button
          type="button"
          onPointerDown={handleStart}
          disabled={disabled}
          className="flex h-44 w-44 cursor-pointer touch-none select-none flex-col items-center justify-center gap-2 rounded-full bg-[#324023] text-white shadow-[0_0_0_12px_rgba(73,87,56,0.15),0_0_0_24px_rgba(73,87,56,0.08)] transition-transform duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <span className="text-4xl">🫁</span>
          <span className="font-sans text-lg font-bold tracking-widest">START</span>
          <span className="font-sans text-[10px] text-white/60">tap to begin</span>
        </button>
      )}

      {phase === "holding" && (
        <div className="relative flex items-center justify-center">
          <div className="absolute h-52 w-52 animate-ping rounded-full bg-[#9A6F1A]/20" />
          <div className="absolute h-48 w-48 animate-pulse rounded-full bg-[#9A6F1A]/10" />
          <button
            type="button"
            onPointerUp={handleStop}
            onPointerLeave={handleStop}
            className="relative flex h-44 w-44 cursor-pointer touch-none select-none flex-col items-center justify-center gap-1 rounded-full bg-[#9A6F1A] text-white shadow-[0_0_0_12px_rgba(154,111,26,0.2),0_0_0_24px_rgba(154,111,26,0.1)]"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <span className="font-number text-5xl font-bold tabular-nums">{elapsed}</span>
            <span className="font-sans text-sm text-white/80">seconds</span>
            <span className="mt-1 font-sans text-[10px] text-white/60">
              release to stop
            </span>
          </button>
        </div>
      )}

      {phase === "done" && (
        <div className="flex h-44 w-44 flex-col items-center justify-center gap-1 rounded-full border-4 border-[#324023] bg-[#324023]/10">
          <span className="font-number text-5xl font-bold tabular-nums text-[#324023]">
            {elapsed}
          </span>
          <span className="font-sans text-sm text-[#45483f]">seconds held</span>
        </div>
      )}

      {phase !== "done" && (
        <div className="w-full max-w-xs">
          <div className="mb-1 flex justify-between font-sans text-[10px] text-[#75786e]">
            <span>Low</span>
            <span>Normal</span>
            <span>Excellent</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full">
            <div className="h-full flex-1 bg-[#ba1a1a]/40" />
            <div className="h-full w-px bg-white" />
            <div className="h-full flex-1 bg-[#d97706]/40" />
            <div className="h-full w-px bg-white" />
            <div className="h-full flex-1 bg-[#16a34a]/40" />
          </div>
          <div className="mt-0.5 flex justify-between font-number text-[10px] text-[#75786e]">
            <span>0-15s</span>
            <span>25-40s</span>
            <span>40s+</span>
          </div>
        </div>
      )}

      {phase === "ready" && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-2 font-sans text-xs text-[#75786e] transition-colors hover:text-[#324023]"
        >
          ← Back to questions
        </button>
      )}
    </div>
  );
}

export { BreathHoldTest };
