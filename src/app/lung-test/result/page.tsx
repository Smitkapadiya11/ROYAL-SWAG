"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/store/quiz-store";

type LungTestStored = {
  name: string;
  email: string;
  phone: string;
  score: number;
  answers: {
    q1: boolean;
    q2: boolean;
    q3: boolean;
    q4: boolean;
    q5: boolean;
  };
};

type Risk = {
  label: string;
  message: string;
  colorClass: string;
  barClass: string;
  borderClass: string;
  bgClass: string;
};

function getRisk(score: number): Risk {
  if (score <= 1) {
    return {
      label: "✅ Mild Risk",
      message: "Your lungs are in decent shape. Preventive care is key.",
      colorClass: "text-green-700",
      barClass: "bg-green-600",
      borderClass: "border-green-200",
      bgClass: "bg-green-50",
    };
  }
  if (score <= 3) {
    return {
      label: "⚠️ Moderate Risk",
      message: "Your lungs show signs of stress. Act now before it worsens.",
      colorClass: "text-orange-700",
      barClass: "bg-orange-500",
      borderClass: "border-orange-200",
      bgClass: "bg-orange-50",
    };
  }
  return {
    label: "🔴 High Risk",
    message: "Your lung health needs urgent attention.",
    colorClass: "text-red-700",
    barClass: "bg-red-600",
    borderClass: "border-red-200",
    bgClass: "bg-red-50",
  };
}

const HERB_CARDS: Array<{
  key: keyof LungTestStored["answers"];
  title: string;
  herb: string;
  desc: string;
}> = [
  {
    key: "q1",
    title: "Pollution",
    herb: "Vasaka",
    desc: "Clears environmental toxins from airways",
  },
  {
    key: "q2",
    title: "Smoker",
    herb: "Mulethi",
    desc: "Repairs smoke-damaged bronchial lining",
  },
  {
    key: "q3",
    title: "Morning cough",
    herb: "Tulsi",
    desc: "Natural antibacterial, soothes throat inflammation",
  },
  {
    key: "q4",
    title: "Breathless",
    herb: "Pippali",
    desc: "Strengthens lung capacity and oxygen uptake",
  },
  {
    key: "q5",
    title: "Dust/fumes",
    herb: "Vasaka",
    desc: "Shields airways from particulate matter",
  },
];

export default function LungTestResultPage() {
  const [stored, setStored] = useState<LungTestStored | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const { reset } = useQuiz();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lungTestResult");
      if (!raw) {
        setStored(null);
        setLoaded(true);
        return;
      }
      const parsed = JSON.parse(raw) as LungTestStored;
      if (!parsed || typeof parsed.score !== "number" || !parsed.answers) {
        setStored(null);
      } else {
        setStored(parsed);
      }
    } catch {
      setStored(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  const risk = useMemo(() => (stored ? getRisk(stored.score) : null), [stored]);
  const pct = useMemo(() => {
    if (!stored) return 0;
    return Math.round((Math.min(Math.max(stored.score, 0), 5) / 5) * 100);
  }, [stored]);

  const yesCards = useMemo(() => {
    if (!stored) return [];
    return HERB_CARDS.filter((c) => stored.answers[c.key]);
  }, [stored]);

  const handleRetake = () => {
    try {
      localStorage.removeItem("lungTestResult");
      localStorage.removeItem("lungTestAnswers");
      localStorage.removeItem("lungTestScore");
    } catch {
      /* ignore */
    }
    reset();
    router.push("/lung-test");
  };

  if (!loaded) {
    return (
      <div className="min-h-[100svh] bg-[var(--brand-ivory)] flex items-center justify-center px-4 py-20">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stored || !risk) {
    return (
      <div className="min-h-[100svh] bg-[var(--brand-ivory)] flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <h1
            className="text-2xl sm:text-3xl font-bold text-[var(--brand-dark)]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Please complete the Lung Test first.
          </h1>
          <p className="mt-3 text-sm text-[var(--brand-dark)]/55">
            Your result isn’t available yet.
          </p>
          <Link
            href="/lung-test"
            className="mt-6 inline-flex items-center justify-center w-full px-6 py-4 rounded-xl bg-[var(--brand-green)] text-white font-bold"
          >
            Take the Free Lung Test →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-[var(--brand-ivory)] pt-20 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-3">
            Your Lung Test Result
          </p>
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-3 ${risk.colorClass}`}
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {risk.label}
          </h1>
          <p className="text-base text-[var(--brand-dark)]/60 max-w-md mx-auto">
            {risk.message}
          </p>
        </div>

        {/* Risk meter */}
        <div className={`rounded-2xl border ${risk.borderClass} ${risk.bgClass} p-6 mb-8`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-[var(--brand-dark)]/70">Risk Meter</p>
            <p className="text-sm font-bold text-[var(--brand-dark)]">
              Score {stored.score}/5
            </p>
          </div>
          <div className="h-3 w-full rounded-full bg-white/70 overflow-hidden border border-black/5">
            <div
              className={`h-full ${risk.barClass}`}
              style={{ width: `${pct}%`, transition: "width 600ms cubic-bezier(0.22,1,0.36,1)" }}
            />
          </div>
        </div>

        {/* Herb recommendations */}
        <section aria-labelledby="herbs" className="mb-10">
          <h2
            id="herbs"
            className="text-xl font-bold text-[var(--brand-dark)] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Herb Recommendations Based on Your Answers
          </h2>

          {yesCards.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--brand-sage)] p-5 text-sm text-[var(--brand-dark)]/60">
              No major red flags detected from your answers. Preventive lung care is still recommended.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {yesCards.map((c) => (
                <div
                  key={c.key}
                  className="bg-white rounded-2xl border border-[var(--brand-sage)] shadow-sm p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gold)] mb-2">
                    {c.title}
                  </p>
                  <p className="text-base font-bold text-[var(--brand-green)]">
                    🌿 {c.herb}
                  </p>
                  <p className="mt-1 text-sm text-[var(--brand-dark)]/60">{c.desc}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-white border border-[var(--brand-sage)] p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gold)] mb-2">
            Based on your lung profile, we recommend:
          </p>
          <h3
            className="text-2xl font-bold text-[var(--brand-dark)] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Royal Swag Lung Detox Tea
          </h3>

          <Link
            href="/product"
            className="bg-green-700 text-white px-8 py-4 text-xl rounded-lg w-full font-bold inline-flex items-center justify-center hover:bg-green-800 transition-colors"
          >
            Buy Now — Rs 699
          </Link>

          <button
            type="button"
            onClick={handleRetake}
            className="mt-3 border-2 border-green-700 text-green-700 bg-transparent px-8 py-3 rounded-lg w-full hover:bg-green-50 transition-colors text-base font-semibold"
          >
            🔄 Take the Test Again
          </button>
        </section>
      </div>
    </div>
  );
}

