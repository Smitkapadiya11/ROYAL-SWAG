"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/store/quiz-store";
import { supabase } from "@/lib/supabase";
import {
  getTier,
  TIER_RESULTS,
  MAX_SCORE,
  type LungHealthTier,
} from "@/lib/quiz-data";
import CheckoutModal from "@/components/CheckoutModal";

// ━━━ SVG Circular Gauge ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ScoreGauge({ score, maxScore, color }: { score: number; maxScore: number; color: string }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score / maxScore, 1);
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedPct(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  const dashOffset = circumference * (1 - animatedPct);

  return (
    <div className="relative inline-flex items-center justify-center" aria-hidden="true">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--brand-sage)" strokeWidth="14" />
        <circle
          cx="100" cy="100" r={radius}
          fill="none" stroke={color} strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-[var(--brand-dark)]">{score}</span>
        <span className="text-sm text-[var(--brand-dark)]/40">/ {maxScore}</span>
      </div>
    </div>
  );
}

// ━━━ Share Button ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ShareButton({ tier }: { tier: LungHealthTier }) {
  const result = TIER_RESULTS[tier];
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleShare = async () => {
    const text = `I just took the Royal Swag Lung Health Test! My result: ${result.label} ${result.emoji}\n\nFind out about your lungs at https://www.royalswag.in/lung-test`;
    if (canShare) {
      try {
        await navigator.share({ title: "My Royal Swag Lung Health Result", text });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Result copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      id="share-result-btn"
      className="px-6 py-3 rounded-full border-2 border-[var(--brand-green)] text-[var(--brand-green)] font-semibold text-sm hover:bg-[var(--brand-sage)] transition-all"
    >
      🔗 Share Your Result
    </button>
  );
}

// ━━━ Report Page ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function LungTestReportPage() {
  const { state, reset } = useQuiz();
  const router = useRouter();
  const redirected = useRef(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Guard
  useEffect(() => {
    if (state.score === null && !redirected.current) {
      redirected.current = true;
      router.replace("/lung-test");
    }
  }, [state.score, router]);

  // Update Supabase lead with score
  useEffect(() => {
    if (state.score !== null && state.leadId) {
      const tier = getTier(state.score);
      const result = TIER_RESULTS[tier];

      const updateData = async () => {
        try {
          await supabase
            .from("leads")
            .update({ quiz_score: state.score, lung_tier: result.label })
            .eq("id", state.leadId);
        } catch (err) {
          console.error("Failed to update lead score:", err);
        }
      };
      updateData();
    }
  }, [state.score, state.leadId]);

  // GSAP entry animations
  useEffect(() => {
    if (state.score === null) return;

    const init = async () => {
      const { gsap } = await import("gsap");
      if (!pageRef.current) return;

      const tl = gsap.timeline();
      tl.fromTo(".report-header", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .fromTo(".report-gauge", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, "-=0.2")
        .fromTo(".report-recs", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.1")
        .fromTo(".report-herbs", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.1")
        .fromTo(".report-ctas", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.1");
    };

    init();
  }, [state.score]);

  if (state.score === null) return null;

  const score = state.score;
  const tier = getTier(score);
  const result = TIER_RESULTS[tier];

  return (
    <div ref={pageRef} className="min-h-[100svh] bg-[var(--brand-ivory)] px-4 pb-20 pt-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 report-header opacity-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-gold)] mb-3">
            Your Lung Health Result
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brand-dark)] mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}>
            {result.headline}
          </h1>
          <p className="text-base text-[var(--brand-dark)]/55 max-w-md mx-auto">
            {result.subtitle}
          </p>
        </div>

        {/* Score gauge */}
        <div className={`rounded-2xl border-2 p-8 flex flex-col sm:flex-row items-center gap-8 mb-8 report-gauge opacity-0 ${result.bgColor} ${result.borderColor}`}>
          <ScoreGauge score={score} maxScore={MAX_SCORE} color={result.gaugeColor} />
          <div>
            <span className={`inline-flex items-center gap-2 text-lg font-bold px-4 py-2 rounded-full bg-white shadow-sm mb-3 ${result.color}`}>
              <span role="img" aria-label={result.label}>{result.emoji}</span>
              {result.label}
            </span>
            <p className={`text-sm leading-relaxed ${result.color} opacity-80`}>
              Score {score} out of {MAX_SCORE} — take these recommendations seriously.
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <section className="mb-8 report-recs opacity-0" aria-labelledby="recs-heading">
          <h2 id="recs-heading" className="font-bold text-xl text-[var(--brand-dark)] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Your 3 Personalized Recommendations
          </h2>
          <div className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-[var(--brand-sage)] shadow-sm">
                <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--brand-green)] text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-[var(--brand-dark)]/70 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Herb highlights */}
        <section className="mb-10 report-herbs opacity-0" aria-labelledby="herbs-heading">
          <h2 id="herbs-heading" className="font-bold text-xl text-[var(--brand-dark)] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Key Herbs for Your Condition
          </h2>
          <div className="flex flex-wrap gap-3">
            {result.ingredients.map(({ name, benefit }) => (
              <div key={name} className="bg-white rounded-2xl px-4 py-3 border border-[var(--brand-sage)] shadow-sm">
                <p className="font-semibold text-[var(--brand-green)] text-sm">🌿 {name}</p>
                <p className="text-xs text-[var(--brand-dark)]/50 mt-0.5">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Personalised Buy Now CTA — main conversion goal */}
        <div className="report-ctas opacity-0 mb-6 rounded-2xl bg-[var(--brand-green)] p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gold)] mb-2">
            Your Personalised Recommendation
          </p>
          <p className="text-white font-semibold text-lg mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
            Based on your lung health profile, we recommend:
          </p>
          <p className="text-white/70 text-sm mb-5">
            Royal Swag Lung Detox Tea — targeted herbs for your specific risk factors (see above)
          </p>
          <button
            id="report-buy-now-btn"
            onClick={() => setIsCheckoutOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--brand-gold)] text-[var(--brand-green)] font-bold text-base shadow-lg hover:opacity-90 transition-all active:scale-95 w-full sm:w-auto"
          >
            🛒 Buy Now — from Rs 359
          </button>
          <p className="text-white/40 text-xs mt-3">Free delivery · 30-Day money-back guarantee</p>
        </div>

        {/* Secondary CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center report-ctas opacity-0">
          <Link
            href="/product"
            id="report-cta-product"
            className="flex-1 text-center px-7 py-4 rounded-full border-2 border-[var(--brand-green)] text-[var(--brand-green)] font-semibold text-base hover:bg-[var(--brand-sage)] transition-all active:scale-95"
          >
            View Product Details →
          </Link>
          <ShareButton tier={tier} />
        </div>

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onConfirm={() => {
            setIsCheckoutOpen(false);
            router.push("/product");
          }}
        />

        {/* Retake */}
        <div className="text-center mt-8">
          <button
            onClick={() => { reset(); router.push("/lung-test"); }}
            className="text-sm text-[var(--brand-dark)]/35 hover:text-[var(--brand-dark)] underline underline-offset-2 transition-colors"
          >
            Retake the quiz
          </button>
        </div>

      </div>
    </div>
  );
}
