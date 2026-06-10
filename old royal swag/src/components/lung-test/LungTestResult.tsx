"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HERB_IMAGE_BY_NAME } from "@/lib/lung-test-questions";
import type { SymptomAnswers } from "@/lib/lungScore";
import { MAX_SYMPTOM_POINTS } from "@/lib/lungScore";
import { getStarterPackOffer } from "@/lib/product-price";
import { productImageSrc, SINGLE_PACK_OFFER_IMAGE } from "@/lib/product-images";
import { EVENTS, trackEvent } from "@/lib/events";

const RISK_CONFIG = {
  Mild: {
    color: "#16a34a",
    bg: "rgba(22,163,74,0.1)",
    emoji: "😊",
    headline: "Good Lung Health",
    message:
      "Your lungs are in reasonable shape. A daily detox ritual will keep them clean and strong.",
    urgency: "Preventive care — start before symptoms worsen.",
  },
  Moderate: {
    color: "#d97706",
    bg: "rgba(217,119,6,0.1)",
    emoji: "😐",
    headline: "Needs Attention",
    message:
      "Your lungs show signs of toxin buildup. Ayurvedic cleansing can significantly restore function.",
    urgency: "Start your detox — improvement in 15–30 days.",
  },
  High: {
    color: "#dc2626",
    bg: "rgba(220,38,38,0.1)",
    emoji: "😟",
    headline: "High Risk",
    message:
      "Your lungs need urgent care. Toxin buildup is affecting your daily breathing quality.",
    urgency: "Begin detox immediately — results in 7–14 days.",
  },
} as const;

type HerbRec = { name: string; reason: string };

function buildRecommendedHerbs(answers: SymptomAnswers): HerbRec[] {
  return [
    answers.smoke && {
      name: "Vasaka",
      reason: "Repairs smoke-damaged airways",
    },
    answers.smoke && {
      name: "Pippali",
      reason: "Restores lung capacity after smoking",
    },
    answers.city && {
      name: "Tulsi",
      reason: "Fights pollution-induced inflammation",
    },
    answers.city && {
      name: "Mulethi",
      reason: "Soothes pollution-irritated airways",
    },
    answers.cough && {
      name: "Kantakari",
      reason: "Stops morning cough naturally",
    },
    answers.breathless && {
      name: "Pushkarmool",
      reason: "Opens airways for easier breathing",
    },
  ]
    .filter((h): h is HerbRec => Boolean(h))
    .slice(0, 3);
}

export type LungTestResultProps = {
  score: number;
  level: "Mild" | "Moderate" | "High";
  breathSeconds: number;
  answers: SymptomAnswers;
  onRetake?: () => void;
};

export function LungTestResult({
  score,
  level,
  breathSeconds,
  answers,
  onRetake,
}: LungTestResultProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showHerbs, setShowHerbs] = useState(false);
  const config = RISK_CONFIG[level];
  const maxScore = MAX_SYMPTOM_POINTS;
  const roundedBreath = Math.round(breathSeconds);

  const recommendedHerbs = useMemo(
    () => buildRecommendedHerbs(answers),
    [answers]
  );

  useEffect(() => {
    if (score <= 0) return;

    let start = 0;
    const end = score;
    const duration = 1500;
    const step = Math.max(duration / end, 16);
    const timer = setInterval(() => {
      start += 1;
      setAnimatedScore(start);
      if (start >= end) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [score]);

  const displayedScore = score <= 0 ? 0 : animatedScore;

  useEffect(() => {
    const t = setTimeout(() => setShowHerbs(true), 800);
    return () => clearTimeout(t);
  }, []);

  const breathTier =
    roundedBreath >= 40
      ? "Excellent"
      : roundedBreath >= 25
        ? "Good"
        : roundedBreath >= 15
          ? "Fair"
          : "Low";

  const herbNames =
    recommendedHerbs.length > 0
      ? recommendedHerbs.map((h) => h.name).join(", ")
      : "recommended herbs";

  const starterPack = getStarterPackOffer();

  return (
    <div className="flex flex-col gap-6 duration-500 animate-in fade-in md:grid md:grid-cols-2 md:items-start md:gap-8 lg:gap-10">
      <div className="flex flex-col gap-6 md:col-span-1">
      <div className="glass-card relative overflow-hidden rounded-3xl p-8 text-center md:p-10">
        <div
          className="absolute inset-0 rounded-3xl opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${config.color}, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          <div className="mb-4 text-6xl duration-500 animate-in zoom-in">
            {config.emoji}
          </div>

          <div className="relative mx-auto mb-6 h-36 w-36">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#dee5d1"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={config.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - displayedScore / maxScore)}`}
                style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-number text-4xl font-bold"
                style={{ color: config.color }}
              >
                {displayedScore}
              </span>
              <span className="font-sans text-xs text-[#45483f]">
                of {maxScore}
              </span>
            </div>
          </div>

          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-sm font-bold"
            style={{ background: config.bg, color: config.color }}
          >
            {level} Risk
          </div>

          <h3 className="mb-2 font-display text-2xl font-bold text-[#324023]">
            {config.headline}
          </h3>
          <p className="font-sans text-base leading-6 text-[#45483f]">
            {config.message}
          </p>

          <div
            className="mt-4 rounded-xl px-4 py-2 font-sans text-xs font-semibold"
            style={{ background: config.bg, color: config.color }}
          >
            {config.urgency}
          </div>
        </div>
      </div>

      <div className="glass-card flex items-center gap-4 rounded-2xl p-5 md:p-6">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#324023] md:h-16 md:w-16">
          <span className="font-number text-xl font-bold text-white">
            {roundedBreath}
          </span>
          <span className="font-sans text-[9px] text-white/70">secs</span>
        </div>
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#45483f]">
            Breath Hold Result
          </p>
          <p className="mt-0.5 font-display text-lg font-bold text-[#324023]">
            {breathTier} Capacity
          </p>
          <p className="mt-0.5 font-sans text-xs text-[#45483f]">
            {roundedBreath >= 25
              ? "Your lungs retain good air capacity."
              : "Lung capacity below optimal — detox can help."}
          </p>
        </div>
      </div>
      </div>

      <div className="flex flex-col gap-6 md:sticky md:top-24 md:col-span-1">
      {recommendedHerbs.length > 0 && showHerbs && (
        <div className="flex flex-col gap-3 duration-500 animate-in slide-in-from-bottom">
          <h4 className="font-display text-xl font-bold text-[#324023]">
            Herbs Matched To You
          </h4>
          {recommendedHerbs.map((herb, i) => (
            <div
              key={herb.name}
              className="glass-card flex items-center gap-4 rounded-2xl p-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="h-12 w-12 shrink-0 overflow-hidden rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #324023, #9A6F1A)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERB_IMAGE_BY_NAME[herb.name] ?? "/images/herbs/tulsi.jpg"}
                  alt={herb.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div>
                <p className="font-sans text-sm font-bold text-[#324023]">
                  {herb.name}
                </p>
                <p className="mt-0.5 font-sans text-xs text-[#45483f]">
                  {herb.reason}
                </p>
              </div>
              <div className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9A6F1A]">
                <span className="text-xs text-white">✓</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="glass-card relative overflow-hidden rounded-3xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(50,64,35,0.05), rgba(154,111,26,0.08))",
        }}
      >
        <div className="mb-4 flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImageSrc(SINGLE_PACK_OFFER_IMAGE)}
            alt="Royal Swag — 1 Pack"
            loading="eager"
            decoding="async"
            className="h-20 w-20 shrink-0 rounded-xl object-contain bg-white p-1"
            onError={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #324023, #9A6F1A)";
            }}
          />
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-[#9A6F1A]">
              Personalised For You
            </p>
            <h4 className="mt-1 font-display text-xl font-bold text-[#324023]">
              Royal Swag Lung Detox Tea
            </h4>
            <p className="mt-1 font-sans text-xs text-[#45483f]">
              Contains all {herbNames} matched to your profile.
            </p>
          </div>
        </div>
        <Link
          href="/product?pack=single&utm_source=lung-test&utm_medium=result"
          onClick={() => {
            trackEvent(EVENTS.LUNG_BUY_CLICK, { page: "/lung-test/result" });
          }}
          className="block w-full rounded-2xl py-4 text-center font-sans text-sm font-bold tracking-wide text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          style={{ background: "#9A6F1A" }}
        >
          Start Your Detox — 1 Pack · ₹{starterPack.price}
        </Link>
      </div>

      {onRetake ? (
        <button
          type="button"
          onClick={onRetake}
          className="py-2 text-center font-sans text-sm text-[#75786e] transition-colors hover:text-[#324023] md:text-left"
        >
          ← Retake Assessment
        </button>
      ) : (
        <Link
          href="/lung-test"
          className="py-2 text-center font-sans text-sm text-[#75786e] transition-colors hover:text-[#324023] md:text-left"
        >
          ← Retake Assessment
        </Link>
      )}
      </div>
    </div>
  );
}
