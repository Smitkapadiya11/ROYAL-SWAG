"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import { HERB_IMAGE_BY_NAME } from "@/lib/lung-test-questions";
import type { StoredLungResult } from "@/lib/lung-test-constants";
import {
  getBreathHoldInsight,
  getLungScore,
  getSymptomHerbMatches,
  MAX_SYMPTOM_POINTS,
  SYMPTOM_QUESTIONS,
  type SymptomAnswers,
} from "@/lib/lungScore";
import {
  getPrimaryDiscountPercent,
  getStarterPackOffer,
} from "@/lib/product-price";
import { productImageSrc, SINGLE_PACK_OFFER_IMAGE } from "@/lib/product-images";
import { toWebp } from "@/lib/image-assets";
import { EVENTS, trackEvent } from "@/lib/events";

const TESTIMONIALS = {
  mild: [
    {
      name: "Neha M., Pune",
      text: "Started as prevention — my morning throat feels clearer after 3 weeks.",
    },
    {
      name: "Arjun S., Bangalore",
      text: "Living in traffic every day — this tea feels like daily lung insurance.",
    },
  ],
  moderate: [
    {
      name: "Ramesh K., Ahmedabad",
      text: "Morning cough dropped from 20 minutes to barely 5 — felt in control again.",
    },
    {
      name: "Priya M., Ahmedabad",
      text: "Ex-smoker of 11 years. My doctor asked what I changed after 3 weeks.",
    },
  ],
  high: [
    {
      name: "Vikram D., Delhi",
      text: "Chest heaviness eased within 2 weeks. Stairs feel manageable again.",
    },
    {
      name: "Sunita R., Mumbai",
      text: "Factory dust exposure — breathlessness improved noticeably in a month.",
    },
  ],
} as const;

function RiskGauge({
  score,
  maxScore,
  color,
  label,
}: {
  score: number;
  maxScore: number;
  color: string;
  label: string;
}) {
  const reduceMotion = useReducedMotion();
  const [animated, setAnimated] = useState(reduceMotion ? score : 0);
  const radius = 80;
  const circumference = Math.PI * radius;
  const progress = maxScore > 0 ? animated / maxScore : 0;

  useEffect(() => {
    if (reduceMotion) {
      setAnimated(score);
      return;
    }
    const start = performance.now();
    const duration = 1200;
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(Math.round(score * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score, reduceMotion]);

  return (
    <div className="relative mx-auto h-48 w-full max-w-sm md:h-52">
      <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#dee5d1"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduceMotion ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: reduceMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-2 flex flex-col items-center text-center">
        <span className="font-number text-5xl font-bold tabular-nums md:text-6xl" style={{ color }}>
          {animated}
        </span>
        <span className="mt-1 font-sans text-xs font-bold uppercase tracking-widest md:text-sm" style={{ color }}>
          {label} Risk
        </span>
        <span className="mt-0.5 font-sans text-[11px] text-on-surface-variant">
          of {maxScore} symptom points
        </span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-4 text-center">
      <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>
      <p
        className="mt-1 font-number text-2xl font-bold tabular-nums text-primary md:text-3xl"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      <p className="mt-1 font-sans text-xs leading-snug text-on-surface-variant">{detail}</p>
    </div>
  );
}

type LungHealthReportProps = {
  stored: StoredLungResult;
  onRetake?: () => void;
};

export function LungHealthReport({ stored, onRetake }: LungHealthReportProps) {
  const lungScore = getLungScore(stored.score);
  const starterPack = getStarterPackOffer();
  const discountPct = getPrimaryDiscountPercent();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const answers: SymptomAnswers = useMemo(
    () => ({
      city: stored.city,
      smoke: stored.smoke,
      cough: stored.cough,
      breathless: stored.breathless,
      dust: stored.dust,
      mucus: stored.mucus,
      worsened: stored.worsened,
    }),
    [stored]
  );

  const symptomMatches = useMemo(() => getSymptomHerbMatches(answers), [answers]);
  const flaggedSymptoms = useMemo(
    () => SYMPTOM_QUESTIONS.filter((q) => answers[q.key]),
    [answers]
  );
  const yesCount = flaggedSymptoms.length;
  const herbNames =
    stored.matchedHerbs.length > 0
      ? stored.matchedHerbs
      : [...new Set(symptomMatches.map((m) => m.herbName))];

  const breathInsight =
    typeof stored.breathHoldSeconds === "number"
      ? getBreathHoldInsight(stored.breathHoldSeconds)
      : null;

  const testimonials = TESTIMONIALS[lungScore.riskSlug];
  const productHref =
    "/product?pack=single&utm_source=lung-test&utm_medium=result&utm_campaign=buy";

  const handleSendReport = async () => {
    if (emailSent || sendingEmail) return;
    setSendingEmail(true);
    try {
      const res = await fetch("/api/send-lung-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: stored.name,
          email: stored.email,
          phone: stored.phone,
          score: stored.score,
          riskLevel: lungScore.riskSlug,
          matchedHerbs: herbNames,
          answers,
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      setEmailSent(true);
      toast.success("Report sent to your email!");
    } catch {
      toast.error("Could not send email. Try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  const firstName = stored.name.trim().split(/\s+/)[0] ?? "there";

  return (
    <div className="flex flex-col gap-8 pb-8 md:gap-10">
      {/* Section 1 — Risk header */}
      <section className="glass-card rounded-3xl p-6 text-center md:p-10">
        <h1 className="font-display text-2xl font-bold text-primary md:text-4xl">
          Hi {firstName}, here&apos;s your Lung Health Report
        </h1>
        <div className="mt-8">
          <RiskGauge
            score={stored.score}
            maxScore={MAX_SYMPTOM_POINTS}
            color={lungScore.color}
            label={lungScore.label}
          />
        </div>
        <p className="mx-auto mt-5 max-w-lg font-sans text-base font-medium leading-relaxed text-on-surface md:text-lg">
          {lungScore.subtitle}
        </p>
        <p className="mx-auto mt-3 max-w-lg font-sans text-sm leading-relaxed text-on-surface-variant md:text-base">
          {lungScore.recommendation}
        </p>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <StatCard
          label="Symptom score"
          value={`${stored.score}/${MAX_SYMPTOM_POINTS}`}
          detail={`${lungScore.level} risk band`}
          accent={lungScore.color}
        />
        <StatCard
          label="Flags raised"
          value={String(yesCount)}
          detail={`of ${SYMPTOM_QUESTIONS.length} questions`}
        />
        {breathInsight ? (
          <StatCard
            label="Breath hold"
            value={`${breathInsight.seconds}s`}
            detail={breathInsight.label}
            accent={breathInsight.color}
          />
        ) : (
          <StatCard
            label="Herbs matched"
            value={String(herbNames.length)}
            detail="In your personalised blend"
          />
        )}
      </section>

      {/* Flagged symptoms list */}
      {flaggedSymptoms.length > 0 ? (
        <section className="glass-card rounded-3xl p-5 md:p-6">
          <h2 className="font-display text-lg font-bold text-primary md:text-xl">
            What we detected from your answers
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {flaggedSymptoms.map((q) => (
              <li
                key={q.key}
                className="flex items-start justify-between gap-3 rounded-xl bg-surface/70 px-4 py-3"
              >
                <span className="font-sans text-sm font-medium text-on-surface md:text-base">
                  {q.text}
                </span>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 font-number text-xs font-bold tabular-nums text-primary">
                  +{q.weight} pts
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Section 2 — Symptom → herb analysis */}
      {symptomMatches.length > 0 ? (
        <section>
          <h2 className="mb-1 font-display text-xl font-bold text-primary md:text-2xl">
            Your Symptoms Analysis
          </h2>
          <p className="mb-4 font-sans text-sm text-on-surface-variant md:text-base">
            Each symptom maps to a herb in Royal Swag that targets that issue.
          </p>
          <div className="flex flex-col gap-3">
            {symptomMatches.map((match, i) => (
              <div
                key={`${match.symptomKey}-${match.herbName}-${i}`}
                className="glass-card flex flex-col gap-3 rounded-2xl p-4 md:p-5 sm:flex-row sm:items-center"
              >
                <span className="inline-flex shrink-0 rounded-full bg-primary/10 px-3 py-1.5 font-sans text-xs font-semibold text-primary md:text-sm">
                  {match.symptomLabel}
                </span>
                <span className="hidden text-lg text-ayurvedic-gold sm:inline" aria-hidden>
                  →
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-ayurvedic-gold md:h-16 md:w-16">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={toWebp(
                        HERB_IMAGE_BY_NAME[match.herbName] ?? "/images/herbs/tulsi.jpg"
                      )}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold text-primary md:text-xl">
                      {match.herbName}
                    </p>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-on-surface-variant md:text-base">
                      {match.benefit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Section 3 — 1-pack recommendation + CTA */}
      <section className="glass-card rounded-3xl p-6 md:p-8">
        <h2 className="font-display text-xl font-bold text-primary md:text-2xl">
          Based on your lung profile, Royal Swag Tar Out Tea is recommended.
        </h2>
        <p className="mt-2 font-sans text-sm text-on-surface-variant md:text-base">
          Our blend of {herbNames.join(", ")} specifically addresses your {yesCount}{" "}
          risk factor{yesCount === 1 ? "" : "s"}. Start with the{" "}
          <strong className="text-primary">1 Pack (30 tea bags)</strong> — one month of
          daily detox.
        </p>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-glass-border bg-surface/60 p-5 sm:flex-row sm:items-center">
          <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-white sm:mx-0 md:h-32 md:w-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={productImageSrc(SINGLE_PACK_OFFER_IMAGE)}
              alt="Royal Swag Lung Detox Tea — 1 Pack"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-contain p-2"
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="font-display text-lg font-bold text-primary md:text-xl">
              {starterPack.title} — 30 Tea Bags
            </p>
            <p className="mt-0.5 font-sans text-sm text-on-surface-variant">
              {starterPack.subtitle}
            </p>
            <p className="mt-2 flex flex-wrap items-baseline justify-center gap-2 sm:justify-start">
              <span className="font-number text-sm tabular-nums text-on-surface-variant line-through md:text-base">
                ₹{starterPack.mrp}
              </span>
              <span className="font-number text-3xl font-bold tabular-nums text-primary">
                ₹{starterPack.price}
              </span>
            </p>
            {discountPct > 0 ? (
              <span className="mt-2 inline-block rounded-full bg-ayurvedic-gold/15 px-3 py-1 font-sans text-[11px] font-bold text-ayurvedic-gold">
                {discountPct}% OFF for test participants
              </span>
            ) : null}
          </div>
        </div>

        <Link
          href={productHref}
          onClick={() => trackEvent(EVENTS.LUNG_BUY_CLICK, { page: "/lung-test/result" })}
          className="btn-primary mt-6 block w-full text-center text-base"
          id="buy-now-btn"
        >
          Buy Now — 1 Pack · ₹{starterPack.price}
        </Link>
        <p className="mt-3 text-center font-sans text-xs text-on-surface-variant md:text-sm">
          Free delivery · 30-day guarantee · FSSAI approved
        </p>
      </section>

      {/* Section 4 — Social proof */}
      <section>
        <p className="mb-4 text-center font-sans text-sm font-semibold text-on-surface-variant md:text-base">
          Join 2,400+ customers who improved their lung health
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="glass-card rounded-2xl p-4 md:p-5">
              <p className="font-sans text-sm italic leading-relaxed text-on-surface-variant md:text-base">
                &quot;{t.text}&quot;
              </p>
              <footer className="mt-2 font-sans text-xs font-semibold text-primary md:text-sm">
                — {t.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Section 5 — Email result */}
      <section className="glass-card rounded-3xl p-6 text-center md:p-8">
        <h2 className="font-display text-lg font-bold text-primary md:text-xl">
          Get your full Lung Health Report on email
        </h2>
        <p className="mt-2 font-sans text-sm text-on-surface-variant md:text-base">
          We&apos;ll send a summary to {stored.email}
        </p>
        <button
          type="button"
          onClick={() => void handleSendReport()}
          disabled={sendingEmail || emailSent}
          className="mt-4 inline-flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-xl border-2 border-primary px-6 py-3 font-sans text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:opacity-60 sm:w-auto md:text-base"
        >
          {emailSent ? "Report Sent ✓" : sendingEmail ? "Sending…" : "Send My Report"}
        </button>
      </section>

      {onRetake ? (
        <button
          type="button"
          onClick={onRetake}
          className="font-sans text-sm text-on-surface-variant hover:text-primary"
        >
          ← Retake Assessment
        </button>
      ) : (
        <Link
          href="/lung-test"
          className="font-sans text-sm text-on-surface-variant hover:text-primary"
        >
          ← Retake Assessment
        </Link>
      )}
    </div>
  );
}
