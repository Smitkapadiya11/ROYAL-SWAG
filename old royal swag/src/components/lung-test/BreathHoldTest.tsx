"use client";

import { useEffect, useRef, useState } from "react";

type BreathHoldTestProps = {
  onComplete: (seconds: number) => void;
  disabled?: boolean;
};

function formatTime(secs: number) {
  const s = Math.floor(secs);
  const ms = Math.floor((secs % 1) * 10);
  return `${s.toString().padStart(2, "0")}.${ms}s`;
}

function statusForElapsed(elapsed: number) {
  if (elapsed < 10) return { text: "Hold steady…", color: "#d97706" };
  if (elapsed < 25) return { text: "Lungs warming up", color: "#d97706" };
  if (elapsed < 40) return { text: "Good oxygen retention", color: "#16a34a" };
  if (elapsed < 55) return { text: "Strong capacity!", color: "#16a34a" };
  return { text: "Excellent — keep holding!", color: "#15803d" };
}

export default function BreathHoldTest({ onComplete, disabled }: BreathHoldTestProps) {
  const [phase, setPhase] = useState<"idle" | "holding" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [analysing, setAnalysing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startHold = () => {
    if (disabled || analysing) return;
    setPhase("holding");
    setElapsed(0);
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed((Date.now() - startRef.current) / 1000);
    }, 80);
  };

  const stopHold = () => {
    if (phase !== "holding" || analysing) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const finalSec = (Date.now() - startRef.current) / 1000;
    setElapsed(finalSec);
    setPhase("done");
    setAnalysing(true);
    setTimeout(() => onComplete(finalSec), 1200);
  };

  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(elapsed / 60, 1);
  const dashOffset = circumference * (1 - progress);
  const status = statusForElapsed(elapsed);

  return (
    <div className="breath-test">
      <p className="breath-test__intro">
        Take a deep breath in. Press and hold the lung below. Release when you need air — we&apos;ll measure your
        breath-hold time.
      </p>

      <div className="breath-test__orb-wrap">
        <span className="breath-test__ring breath-test__ring--pulse" aria-hidden />
        <span className="breath-test__ring breath-test__ring--pulse breath-test__ring--delay" aria-hidden />

        <button
          type="button"
          className={`breath-test__orb ${phase === "holding" ? "breath-test__orb--active" : ""}`}
          onPointerDown={phase === "idle" ? startHold : undefined}
          onPointerUp={phase === "holding" ? stopHold : undefined}
          onPointerLeave={phase === "holding" ? stopHold : undefined}
          onClick={phase === "idle" ? startHold : phase === "holding" ? stopHold : undefined}
          disabled={disabled || analysing || phase === "done"}
          aria-label={
            analysing
              ? "Analysing breath hold"
              : phase === "holding"
                ? "Release to stop timer"
                : "Press and hold to start breath test"
          }
        >
          <svg className="breath-test__svg" viewBox="0 0 200 200" aria-hidden>
            <defs>
              <linearGradient id="lungGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5c946e" />
                <stop offset="100%" stopColor="#324023" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#9a6f1a"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={phase === "holding" ? dashOffset : circumference}
              transform="rotate(-90 100 100)"
            />
            <path
              d="M88 72c-8-12-28-8-32 8-4 14 6 28 20 32 14 4 28-2 36-14 8-12 6-30-6-38-10-8-24-4-18 12z"
              fill="url(#lungGrad)"
              opacity="0.9"
            />
          </svg>

          <span
            className={`breath-test__timer ${phase === "holding" ? "breath-test__timer--lg" : ""}`}
          >
            {analysing ? "Analysing…" : phase === "holding" ? formatTime(elapsed) : phase === "done" ? formatTime(elapsed) : "HOLD"}
          </span>
        </button>
      </div>

      {phase === "holding" && (
        <p className="breath-test__status" style={{ color: status.color }}>
          {status.text}
        </p>
      )}

      {phase === "idle" && (
        <p className="breath-test__hint">Tap and hold · Healthy average: 40–60 seconds</p>
      )}

      <style jsx>{`
        .breath-test {
          text-align: center;
        }
        .breath-test__intro {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(42, 48, 32, 0.85);
          margin: 0 0 28px;
        }
        .breath-test__orb-wrap {
          position: relative;
          width: 220px;
          height: 220px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .breath-test__ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(37, 211, 102, 0.35);
          animation: breathPulse 2s ease-out infinite;
        }
        .breath-test__ring--delay {
          animation-delay: 1s;
        }
        @keyframes breathPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        .breath-test__orb {
          position: relative;
          z-index: 1;
          width: 200px;
          height: 200px;
          border: none;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #6b9b7a 0%, #324023 70%);
          cursor: pointer;
          box-shadow: 0 12px 40px rgba(50, 64, 35, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .breath-test__orb--active {
          transform: scale(1.03);
          box-shadow: 0 16px 48px rgba(154, 111, 26, 0.4);
        }
        .breath-test__orb:disabled {
          cursor: default;
        }
        .breath-test__svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .breath-test__timer {
          position: relative;
          z-index: 2;
          font-size: 18px;
          font-weight: 800;
          color: #f4edd6;
          letter-spacing: 0.04em;
        }
        .breath-test__timer--lg {
          font-size: 32px;
        }
        .breath-test__status {
          font-size: 17px;
          font-weight: 700;
          margin: 8px 0;
        }
        .breath-test__hint {
          font-size: 13px;
          color: rgba(73, 87, 56, 0.7);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
