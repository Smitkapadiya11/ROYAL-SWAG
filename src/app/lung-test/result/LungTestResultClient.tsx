"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  computeLungTestScore,
  getLungTestRiskBand,
  LUNG_TEST_MAX_SCORE,
  type LungTestRiskBand,
} from "@/lib/lung-test-scoring";

type AnswersShape = {
  q1: boolean;
  q2: boolean;
  q3: boolean;
  q4: boolean;
  q5: boolean;
  q6: boolean;
  q7: boolean;
  q8: boolean;
};

type LungTestStored = {
  name: string;
  email: string;
  phone: string;
  score: number;
  maxScore?: number;
  answers: Partial<AnswersShape> | boolean[] | null;
  timestamp?: number;
};

const BG = "#0D3B1F";
const GOLD = "#d4a574";
const AMBER = "#f59e0b";

function normalizeAnswers(raw: LungTestStored["answers"]): AnswersShape | null {
  if (!raw) return null;
  const base = {
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    q5: false,
    q6: false,
    q7: false,
    q8: false,
  };
  if (Array.isArray(raw)) {
    if (raw.length < 5) return null;
    for (let i = 0; i < Math.min(8, raw.length); i++) {
      const k = `q${i + 1}` as keyof AnswersShape;
      base[k] = !!raw[i];
    }
    return base as AnswersShape;
  }
  if (typeof raw === "object") {
    return {
      q1: !!raw.q1,
      q2: !!raw.q2,
      q3: !!raw.q3,
      q4: !!raw.q4,
      q5: !!raw.q5,
      q6: !!raw.q6,
      q7: !!raw.q7,
      q8: !!raw.q8,
    };
  }
  return null;
}

function answersToBools(a: AnswersShape): boolean[] {
  return [a.q1, a.q2, a.q3, a.q4, a.q5, a.q6, a.q7, a.q8];
}

type HerbCard = { id: string; herb: string; line: string };

/** Map YES answers to Royal Swag herbs (deduped). */
function getHerbCardsForAnswers(a: AnswersShape): HerbCard[] {
  const out: HerbCard[] = [];
  const seen = new Set<string>();
  const push = (id: string, herb: string, line: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ id, herb, line });
  };
  if (a.q1 || a.q2 || a.q5 || a.q7) {
    push("vasaka", "Vasaka", "Clears bronchial toxins");
  }
  if (a.q3) push("mulethi", "Mulethi", "Soothes airway lining");
  if (a.q4 || a.q8) push("pippali", "Pippali", "Strengthens lung capacity");
  if (a.q6) push("tulsi", "Tulsi", "Fights inflammation and boosts oxygen flow");
  return out;
}

const RISK_HEADLINE: Record<LungTestRiskBand, string> = {
  low: "Your lungs are doing okay, but daily protection still matters",
  moderate: "Your lungs are under stress. Act before it gets worse.",
  high: "Your lungs need urgent attention. Start detox today.",
};

const WHAT_IT_MEANS: Record<LungTestRiskBand, string> = {
  low:
    "Good news — your lungs are relatively clean. But living in India means daily exposure to PM2.5 particles that build up silently. Most people with a low score today develop symptoms within 2–3 years without preventive care.",
  moderate:
    "Your answers reveal your lungs are already under stress. This is the most common score among urban Indians aged 30–55. The good news: at this stage, herbal detox works fastest and most effectively.",
  high:
    "Your score indicates significant toxin buildup in your respiratory system. This does not mean permanent damage — but it does mean every day without action makes recovery slower and harder.",
};

const TESTIMONIALS: Record<LungTestRiskBand, [string, string]> = {
  low: [
    "I scored low but still started Royal Swag for prevention. Six months in, I feel less stuffy on smoggy days — glad I didn’t wait.",
    "— Ananya K., Bengaluru ★★★★★",
  ],
  moderate: [
    "I had the same score. After 30 days my morning cough is completely gone.",
    "— Rajesh M., Pune ★★★★★",
  ],
  high: [
    "My report was in the red zone. I committed to the 30-day detox — breathing up stairs got easier by week three.",
    "— Vikram S., Delhi ★★★★★",
  ],
};

const TESTIMONIALS_B: Record<LungTestRiskBand, [string, string]> = {
  low: [
    "Low score didn’t mean ‘do nothing’ for me. The tea is now my daily shield against Delhi air.",
    "— Rohit P., Delhi ★★★★★",
  ],
  moderate: [
    "Same moderate band as you — I was sceptical. The herbal blend actually calmed my chest tightness within two weeks.",
    "— Meera L., Mumbai ★★★★★",
  ],
  high: [
    "I ignored warnings for years. This score scared me into action — Royal Swag was the first thing that stuck.",
    "— Suresh T., Chennai ★★★★★",
  ],
};

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy - r * Math.sin(angleRad),
  };
}

/** Semicircle arc gauge: green (left) → amber → red (right). Needle: 0 = left, 90° = up/center, 180° = right. */
function RiskArcGauge({ score, maxScore }: { score: number; maxScore: number }) {
  const shadowFilterId = useId().replace(/:/g, "");
  const cx = 140;
  const cy = 132;
  const r = 88;
  const nLen = r - 18;
  const hubR = 8;
  /** Degrees along semicircle: 0 = low (left), 180 = high (right). Animates from 0 after mount. */
  const [needleRotation, setNeedleRotation] = useState(0);

  useEffect(() => {
    const clamped = Math.min(Math.max(score, 0), maxScore);
    const target = maxScore > 0 ? (clamped / maxScore) * 180 : 0;
    const tid = window.setTimeout(() => {
      setNeedleRotation(target);
    }, 300);
    return () => window.clearTimeout(tid);
  }, [score, maxScore]);

  const thick = 14;
  const seg = Math.PI / 3;
  const a0 = Math.PI;
  const a1 = Math.PI - seg;
  const a2 = Math.PI - 2 * seg;
  const a3 = 0;

  const arcPath = (from: number, to: number) => {
    const p1 = polar(cx, cy, r, from);
    const p2 = polar(cx, cy, r, to);
    const large = Math.abs(to - from) > Math.PI ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
  };

  return (
    <div className="mx-auto w-full max-w-[280px]" aria-hidden="true">
      <svg viewBox="0 0 280 150" className="w-full overflow-visible">
        <defs>
          <filter id={shadowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>
        <path
          d={arcPath(a0, a1)}
          fill="none"
          stroke="#16a34a"
          strokeWidth={thick}
          strokeLinecap="round"
          filter={`url(#${shadowFilterId})`}
        />
        <path
          d={arcPath(a1, a2)}
          fill="none"
          stroke={AMBER}
          strokeWidth={thick}
          strokeLinecap="round"
        />
        <path
          d={arcPath(a2, a3)}
          fill="none"
          stroke="#dc2626"
          strokeWidth={thick}
          strokeLinecap="round"
        />
        <g transform={`translate(${cx},${cy})`}>
          <g
            style={{
              transform: `rotate(${needleRotation - 90}deg)`,
              transformOrigin: "50% 100%",
              transformBox: "fill-box",
              transition: "transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={-nLen}
              stroke="#fefce8"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </g>
          <circle cx="0" cy="0" r={hubR} fill="#fefce8" stroke="#0a1f12" strokeWidth={2} />
        </g>
      </svg>
    </div>
  );
}

export default function LungTestResultClient() {
  const [stored, setStored] = useState<LungTestStored | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lungTestResult");
      if (!raw) {
        setStored(null);
        setLoaded(true);
        return;
      }
      const parsed = JSON.parse(raw) as LungTestStored;
      const answers = normalizeAnswers(parsed.answers);
      if (!parsed || !answers) {
        setStored(null);
      } else {
        const bools = answersToBools(answers);
        const recomputed = computeLungTestScore(bools);
        setStored({
          ...parsed,
          answers,
          score: recomputed,
          maxScore: parsed.maxScore ?? LUNG_TEST_MAX_SCORE,
        });
      }
    } catch {
      setStored(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  const maxScore = stored?.maxScore ?? LUNG_TEST_MAX_SCORE;
  const band = useMemo(
    () => (stored ? getLungTestRiskBand(stored.score) : null),
    [stored]
  );

  const answersNorm = useMemo(
    () => (stored ? normalizeAnswers(stored.answers) : null),
    [stored]
  );

  const herbCards = useMemo(
    () => (answersNorm ? getHerbCardsForAnswers(answersNorm) : []),
    [answersNorm]
  );

  const handleRetake = () => {
    try {
      localStorage.removeItem("lungTestResult");
      localStorage.removeItem("lungTestAnswers");
      localStorage.removeItem("lungTestScore");
    } catch {
      /* ignore */
    }
    router.push("/lung-test");
  };

  if (!loaded) {
    return (
      <div
        className="flex min-h-[100svh] items-center justify-center px-4 py-20"
        style={{ backgroundColor: BG }}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#16a34a] border-t-transparent" />
      </div>
    );
  }

  if (!stored || !band || !answersNorm) {
    return (
      <div
        className="flex min-h-[100svh] flex-col items-center justify-center px-4 py-20"
        style={{ backgroundColor: BG }}
      >
        <div className="w-full max-w-md text-center">
          <h1
            className="text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Please complete the Lung Test first
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Your personalised report will appear here after you finish the quiz.
          </p>
          <Link
            href="/lung-test"
            className="mt-6 inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[#15803d] px-6 py-3 text-base font-bold text-white"
          >
            Take Free Lung Test →
          </Link>
        </div>
      </div>
    );
  }

  const firstName = stored.name?.trim().split(/\s+/)[0] || "Friend";
  const bandLabel =
    band === "low" ? "LOW RISK" : band === "moderate" ? "MODERATE RISK" : "HIGH RISK";
  const bandColor =
    band === "low" ? "#4ade80" : band === "moderate" ? AMBER : "#f87171";

  const [tA1, tA2] = TESTIMONIALS[band];
  const [tB1, tB2] = TESTIMONIALS_B[band];

  return (
    <div className="min-h-[100svh] px-4 pb-28 pt-6 sm:pt-8" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-lg">
        {/* PERSONALIZATION */}
        <h1
          className="mb-10 text-center text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {firstName}, here is your Lung Health Report
        </h1>

        {/* Risk label + gauge */}
        <div className="mb-2 text-center">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-bold tracking-widest text-white/90 ring-1 ring-white/20"
            style={{ backgroundColor: `${bandColor}33`, color: bandColor }}
          >
            {bandLabel}
          </span>
          <p className="mt-3 text-sm font-medium text-white/85">{RISK_HEADLINE[band]}</p>
        </div>

        <div className="my-6">
          <RiskArcGauge score={stored.score} maxScore={maxScore} />
          <p className="text-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: GOLD }}>
            Your Score: {stored.score} / {maxScore}
          </p>
        </div>

        {/* Scoring system */}
        <section
          className="mb-8 rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6"
          aria-labelledby="scoring-heading"
        >
          <h2 id="scoring-heading" className="mb-3 text-sm font-bold uppercase tracking-widest text-[#4ade80]">
            How scoring works
          </h2>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <span className="font-semibold text-[#4ade80]">0–4 points</span> = LOW RISK (Green)
            </li>
            <li>
              <span className="font-semibold text-amber-400">5–10 points</span> = MODERATE RISK (Orange)
            </li>
            <li>
              <span className="font-semibold text-red-300">11–20 points</span> = HIGH RISK (Red)
            </li>
          </ul>
          <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/85">
            The higher your score, the more toxin load your lungs are carrying. A score of 0 means clean, healthy
            lungs. Your score means your lungs are working harder than they should be.
          </p>
        </section>

        {/* WHAT THIS MEANS */}
        <section className="mb-10" aria-labelledby="means-heading">
          <h2
            id="means-heading"
            className="mb-3 text-xl font-bold text-white sm:text-2xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What this means for you
          </h2>
          <p className="text-sm leading-relaxed text-white/80 sm:text-base">{WHAT_IT_MEANS[band]}</p>
        </section>

        {/* Herbs */}
        <section className="mb-10" aria-labelledby="herbs-heading">
          <h2
            id="herbs-heading"
            className="mb-4 text-xl font-bold text-white sm:text-2xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Which herbs target your symptoms
          </h2>
          {herbCards.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-black/15 p-4 text-sm text-white/70">
              You didn&apos;t flag these symptom patterns — Royal Swag still combines all four herbs for daily lung
              support.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {herbCards.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-[#4ade80]/25 bg-black/25 px-4 py-4 shadow-sm"
                >
                  <p className="text-lg font-bold text-white">{c.herb}</p>
                  <p className="mt-1 text-sm text-white/75">{c.line}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Urgency + loss aversion + CTA */}
        <section className="rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6">
          <h2 className="text-xl font-bold leading-snug text-white sm:text-2xl md:text-3xl">
            Your lungs won&apos;t detox on their own.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
            {herbCards.length > 0 ? (
              <>
                Royal Swag Lung Detox Tea is the only Ayurvedic blend with all 4 herbs your report identified — in one
                cup, every morning.
              </>
            ) : (
              <>
                Royal Swag Lung Detox Tea combines Tulsi, Vasaka, Mulethi &amp; Pippali — the four herbs Ayurveda trusts
                for daily lung support — in one cup, every morning.
              </>
            )}
          </p>

          <div
            className="mt-6 rounded-xl border border-amber-600/40 bg-gradient-to-br from-red-950/50 to-amber-950/40 px-4 py-3 text-sm leading-snug text-amber-50"
            role="note"
          >
            ⚠️ Untreated lung toxin buildup doubles every 18 months in polluted cities. Your score today is the easiest it
            will be to reverse.
          </div>

          <Link
            href="/product"
            className="mt-5 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#15803d] px-4 py-4 text-center text-base font-bold text-white shadow-lg transition hover:bg-[#166534] sm:text-lg"
          >
            Start My 30-Day Detox — Rs 699 →
          </Link>

          <p className="mt-3 text-center text-sm font-semibold text-amber-200/90">
            ⚡ 2,847 people with similar scores ordered this week
          </p>

          <p className="mt-4 text-center text-xs leading-relaxed text-white/55">
            ✓ Free delivery &nbsp;&nbsp; ✓ 30-day money-back guarantee &nbsp;&nbsp; ✓ Ships in 24 hours
          </p>
        </section>

        {/* Social proof strip */}
        <section className="mt-10 space-y-5" aria-label="Testimonials from similar scores">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-[#4ade80]">
            People with the same risk level
          </h2>
          <blockquote className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/85">
            <p className="italic">&ldquo;{tA1}&rdquo;</p>
            <footer className="mt-2 text-xs text-white/60">{tA2}</footer>
          </blockquote>
          <blockquote className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/85">
            <p className="italic">&ldquo;{tB1}&rdquo;</p>
            <footer className="mt-2 text-xs text-white/60">{tB2}</footer>
          </blockquote>
        </section>

        <button
          type="button"
          onClick={handleRetake}
          className="mt-10 w-full min-h-[48px] rounded-xl border-2 border-[#4ade80]/50 bg-transparent py-3 text-base font-semibold text-[#86efac] transition hover:bg-white/5"
        >
          Retake lung test
        </button>
      </div>
    </div>
  );
}
