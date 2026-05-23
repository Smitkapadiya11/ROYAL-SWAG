"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import {
  getBreathHoldInsight,
  getHerbRecommendations,
  getLungScore,
  MAX_SYMPTOM_POINTS,
  type SymptomAnswers,
} from "@/lib/lungScore";
import { LUNG_TEST_STORAGE_KEY } from "@/lib/lung-test-constants";
import { EVENTS, trackEvent } from "@/lib/events";

type StoredResult = {
  name: string;
  email: string;
  phone: string;
  city: boolean;
  smoke: boolean;
  cough: boolean;
  breathless: boolean;
  dust: boolean;
  breathHoldSeconds?: number;
  score: number;
  level: string;
  color?: string;
  recommendation?: string;
  timestamp?: number;
};

const RESULT_BG =
  "linear-gradient(160deg, #0d2010 0%, #1a3a1a 45%, #2d3d15 100%)";

function ScoreGauge({
  score,
  maxScore,
  color,
}: {
  score: number;
  maxScore: number;
  color: string;
}) {
  const strokeRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const pct = maxScore > 0 ? Math.min(score / maxScore, 1) : 0;

  useEffect(() => {
    if (!strokeRef.current || !labelRef.current) return;
    gsap.fromTo(
      strokeRef.current,
      { strokeDashoffset: circumference },
      {
        strokeDashoffset: circumference * (1 - pct),
        duration: 1.4,
        ease: "power3.out",
        delay: 0.15,
      }
    );
    gsap.from(labelRef.current, {
      opacity: 0,
      scale: 0.85,
      duration: 0.6,
      delay: 0.5,
      ease: "back.out(1.6)",
    });
  }, [score, maxScore, pct, circumference]);

  return (
    <div className="relative mx-auto" style={{ width: 180, height: 180 }}>
      <svg width={180} height={180} viewBox="0 0 180 180" aria-hidden>
        <circle
          cx={90}
          cy={90}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={12}
        />
        <circle
          ref={strokeRef}
          cx={90}
          cy={90}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div
        ref={labelRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
      >
        <span className="text-4xl font-bold text-white">{score}</span>
        <span className="text-xs uppercase tracking-widest text-white/60">
          of {maxScore} pts
        </span>
      </div>
    </div>
  );
}

function readStored(): StoredResult | null {
  if (typeof window === "undefined") return null;
  for (const key of [LUNG_TEST_STORAGE_KEY, "lungTestResult", "lung_lead"]) {
    try {
      const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as StoredResult;
      if (key === "lung_lead" && parsed.name) {
        const full = sessionStorage.getItem(LUNG_TEST_STORAGE_KEY);
        if (full) return JSON.parse(full) as StoredResult;
        continue;
      }
      if (parsed?.name && typeof parsed.score === "number") {
        return parsed;
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

export default function LungTestResultClient() {
  const router = useRouter();
  const [stored, setStored] = useState<StoredResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStored(readStored());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (stored) {
      trackEvent(EVENTS.LUNG_RESULT_VIEW, { score: stored.score, level: stored.level });
    }
  }, [stored]);

  const answers: SymptomAnswers | null = useMemo(() => {
    if (!stored) return null;
    return {
      city: !!stored.city,
      smoke: !!stored.smoke,
      cough: !!stored.cough,
      breathless: !!stored.breathless,
      dust: !!stored.dust,
    };
  }, [stored]);

  const lungScore = useMemo(
    () => (stored ? getLungScore(stored.score) : null),
    [stored]
  );

  const herbs = useMemo(
    () => (answers ? getHerbRecommendations(answers) : []),
    [answers]
  );

  const breath = useMemo(
    () =>
      stored?.breathHoldSeconds != null
        ? getBreathHoldInsight(stored.breathHoldSeconds)
        : null,
    [stored]
  );

  if (!loaded) {
    return (
      <div
        className="flex min-h-[70svh] items-center justify-center"
        style={{ background: RESULT_BG }}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#16a34a] border-t-transparent" />
      </div>
    );
  }

  if (!stored || !lungScore || !answers) {
    return (
      <div
        className="flex min-h-[70svh] flex-col items-center justify-center px-4 py-16"
        style={{ background: RESULT_BG }}
      >
        <div className="max-w-md text-center">
          <h1
            className="text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Complete your lung test first
          </h1>
          <p className="mt-3 text-sm text-white/65">
            Your personalised score, breath-hold result, and herb matches appear here after the
            quiz.
          </p>
          <Link
            href="/lung-test"
            className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#16a34a] px-6 py-3 text-base font-bold text-white"
          >
            Take Free Lung Test →
          </Link>
        </div>
      </div>
    );
  }

  const firstName = stored.name.trim().split(/\s+/)[0] || "Friend";

  return (
    <div
      className="px-4 pb-24 pt-8"
      style={{ background: RESULT_BG, minHeight: "100vh" }}
    >
      <div className="mx-auto max-w-lg">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#9a6f1a]">
          Your lung profile
        </p>
        <h1
          className="mb-8 text-center text-2xl font-bold leading-tight text-white sm:text-3xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {firstName}, here is your lung health report
        </h1>

        <div className="mb-6 flex justify-center">
          <span
            className={cn(
              "rounded-full px-3 py-1 font-sans text-sm font-semibold",
              lungScore.level === "Mild" &&
                "bg-green-100 text-green-800",
              lungScore.level === "Moderate" &&
                "bg-amber-100 text-amber-800",
              lungScore.level === "High" && "bg-red-100 text-red-800"
            )}
          >
            {lungScore.level} Risk
          </span>
        </div>

        <div className="mb-8 flex justify-center">
          <ScoreGauge
            score={lungScore.points}
            maxScore={MAX_SYMPTOM_POINTS}
            color={lungScore.color}
          />
        </div>

        <p className="mb-8 text-center text-sm leading-relaxed text-white/80">
          {lungScore.recommendation}
        </p>

        {breath && (
          <section
            className="mb-8 rounded-2xl border border-white/10 bg-black/25 p-5"
            aria-labelledby="breath-heading"
          >
            <h2
              id="breath-heading"
              className="mb-3 text-sm font-bold uppercase tracking-widest text-white/70"
            >
              Breath-hold result
            </h2>
            <div className="flex items-center gap-4">
              <div
                className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-4"
                style={{ borderColor: breath.color }}
              >
                <span className="text-2xl font-bold text-white">{breath.seconds}s</span>
              </div>
              <div>
                <p className="font-semibold" style={{ color: breath.color }}>
                  {breath.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{breath.note}</p>
                <p className="mt-2 text-xs text-white/50">Healthy average: 40–60 seconds</p>
              </div>
            </div>
          </section>
        )}

        <section className="mb-8" aria-labelledby="herbs-heading">
          <h2
            id="herbs-heading"
            className="mb-4 text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Herbs matched to your answers
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {herbs.map((h) => (
              <li
                key={h.id}
                className="rounded-2xl border border-white/12 bg-white/5 p-4"
                style={
                  h.highlight
                    ? { boxShadow: `0 0 0 1px ${lungScore.color}40` }
                    : undefined
                }
              >
                <p className="text-lg font-bold text-[#e8c84a]">{h.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{h.line}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-card relative mb-8 overflow-hidden rounded-2xl border border-white/10 p-6">
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Based on your lung profile, we recommend Royal Swag
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            Royal Swag Lung Detox Tea combines the herbs your report highlighted — one cup each
            morning for a 30-day lung cleanse.
          </p>

          <Link
            href="/product"
            className="mb-4 mt-6 flex w-full items-center justify-center rounded-xl bg-ayurvedic-gold py-4 font-sans text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            onClick={() => {
              trackEvent(EVENTS.LUNG_BUY_CLICK, { page: "/lung-test/result" });
            }}
          >
            Start Your Detox — ₹599
          </Link>

          <p className="mt-4 text-center text-xs text-white/50">
            ✓ Free delivery · ✓ 30-day guarantee · ✓ Ships in 24h
          </p>
        </section>

        <button
          type="button"
          onClick={() => {
            try {
              sessionStorage.removeItem(LUNG_TEST_STORAGE_KEY);
              localStorage.removeItem(LUNG_TEST_STORAGE_KEY);
            } catch {
              /* ignore */
            }
            router.push("/lung-test");
          }}
          className="mt-8 w-full min-h-[48px] rounded-xl border border-white/20 py-3 text-sm font-semibold text-white/80 hover:bg-white/5"
        >
          Retake lung test
        </button>
      </div>
    </div>
  );
}
