"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AnswersShape = {
  q1: boolean;
  q2: boolean;
  q3: boolean;
  q4: boolean;
  q5: boolean;
};

type LungTestStored = {
  name: string;
  email: string;
  phone: string;
  score: number;
  answers: AnswersShape | boolean[] | null;
  timestamp?: number;
};

type Risk = {
  label: string;
  message: string;
  textColor: string;
  barColor: string;
};

function normalizeAnswers(raw: LungTestStored["answers"]): AnswersShape | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    if (raw.length < 5) return null;
    return {
      q1: !!raw[0],
      q2: !!raw[1],
      q3: !!raw[2],
      q4: !!raw[3],
      q5: !!raw[4],
    };
  }
  if (
    typeof raw === "object" &&
    "q1" in raw &&
    "q2" in raw &&
    "q3" in raw &&
    "q4" in raw &&
    "q5" in raw
  ) {
    return raw as AnswersShape;
  }
  return null;
}

function getRisk(score: number): Risk {
  if (score <= 1) {
    return {
      label: "✅ Mild Risk",
      message: "Your lungs are in decent shape. Preventive care is now key.",
      textColor: "#16a34a",
      barColor: "#16a34a",
    };
  }
  if (score <= 3) {
    return {
      label: "⚠️ Moderate Risk",
      message: "Your lungs show signs of stress. Act now before it worsens.",
      textColor: "#d97706",
      barColor: "#d97706",
    };
  }
  return {
    label: "🔴 High Risk",
    message: "Your lung health needs urgent attention.",
    textColor: "#dc2626",
    barColor: "#dc2626",
  };
}

const HERB_CARDS: Array<{
  key: keyof AnswersShape;
  herb: string;
  emoji: string;
  desc: string;
}> = [
  { key: "q1", herb: "Vasaka", emoji: "🌿", desc: "Clears pollution toxins" },
  { key: "q2", herb: "Mulethi", emoji: "🍃", desc: "Repairs smoke damage" },
  { key: "q3", herb: "Tulsi", emoji: "🌱", desc: "Soothes morning cough" },
  { key: "q4", herb: "Pippali", emoji: "🫚", desc: "Restores breathing capacity" },
  { key: "q5", herb: "Vasaka", emoji: "🌿", desc: "Shields from dust/fumes" },
];

export default function LungTestResultClient() {
  const [stored, setStored] = useState<LungTestStored | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
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
      if (!parsed || typeof parsed.score !== "number" || !answers) {
        setStored(null);
      } else {
        setStored({ ...parsed, answers });
      }
    } catch {
      setStored(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!stored) return;
    const pct = Math.round((Math.min(Math.max(stored.score, 0), 5) / 5) * 100);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setBarWidth(pct));
    });
    return () => cancelAnimationFrame(t);
  }, [stored]);

  const risk = useMemo(() => (stored ? getRisk(stored.score) : null), [stored]);

  const answersNorm = useMemo(() => (stored ? normalizeAnswers(stored.answers) : null), [stored]);

  const yesCards = useMemo(() => {
    if (!answersNorm) return [];
    return HERB_CARDS.filter((c) => answersNorm[c.key]);
  }, [answersNorm]);

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
      <div className="flex min-h-[100svh] items-center justify-center bg-[#061408] px-4 py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#16a34a] border-t-transparent" />
      </div>
    );
  }

  if (!stored || !risk) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center bg-[#061408] px-4 py-20">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
            Please complete the Lung Test first
          </h1>
          <p className="mt-3 text-sm text-gray-400">Your personalised report will appear here after you finish the quiz.</p>
          <Link
            href="/lung-test"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#16a34a] px-6 py-4 font-bold text-white"
          >
            Take Free Lung Test →
          </Link>
        </div>
      </div>
    );
  }

  const displayName = stored.name?.trim() || "there";

  return (
    <div className="min-h-[100svh] bg-[#061408] px-4 pb-24 pt-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-center text-sm text-gray-300">
          Hello <span className="font-semibold text-white">{displayName}</span>,
        </p>
        <p className="mb-8 text-center text-sm text-gray-400">Here is your lung health report:</p>

        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#4ade80]">Your Lung Test Result</p>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: risk.textColor }}>
            {risk.label}
          </h1>
          <p className="mx-auto max-w-md text-base text-gray-300">{risk.message}</p>
        </div>

        <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-300">Lung stress indicator</p>
            <p className="text-sm font-bold text-white">
              Score {stored.score}/5
            </p>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full"
              style={{
                width: `${barWidth}%`,
                backgroundColor: risk.barColor,
                transition: "width 1.5s ease",
              }}
            />
          </div>
        </div>

        <section aria-labelledby="herbs" className="mb-10">
          <h2 id="herbs" className="mb-4 text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Herbs matched to your answers
          </h2>

          {yesCards.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-gray-400">
              No major red flags from your answers. Preventive lung care is still recommended.
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {yesCards.map((c) => (
                <li
                  key={c.key}
                  className="rounded-xl border-l-4 border-green-500 bg-[#0a2412] px-4 py-4 text-left shadow-sm"
                >
                  <p className="text-lg font-bold text-white">
                    <span className="mr-2">{c.emoji}</span>
                    {c.herb}
                  </p>
                  <p className="mt-1 text-sm text-gray-300">{c.desc}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4ade80]">Based on your lung profile, we recommend:</p>
          <h3 className="mb-6 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Royal Swag Lung Detox Tea
          </h3>

          <Link
            href="/product"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#15803d] py-4 text-lg font-bold text-white transition hover:bg-[#166534]"
          >
            Buy Now — Rs 359
          </Link>

          <button
            type="button"
            onClick={handleRetake}
            className="mt-4 w-full rounded-xl border-2 border-green-600 bg-transparent py-3 text-base font-semibold text-green-400 transition hover:bg-white/5"
          >
            🔄 Take the Test Again
          </button>
        </section>
      </div>
    </div>
  );
}
