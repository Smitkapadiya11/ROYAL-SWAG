"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import BreathHoldTest from "@/components/lung-test/BreathHoldTest";
import { trackEvent } from "@/lib/events";
import { ANALYTICS_EVENTS, setAdvancedMatching, track } from "@/lib/analytics";
import {
  SYMPTOM_QUESTIONS,
  computeSymptomPoints,
  getLungScore,
  type SymptomAnswers,
} from "@/lib/lungScore";
import { LUNG_TEST_STORAGE_KEY } from "@/lib/lung-test-constants";
import { cn } from "@/lib/utils";

type View = "intro" | "lead-form" | "symptoms" | "breath";

const INPUT_CLASS =
  "w-full rounded-xl border border-primary bg-parchment px-4 py-3 font-sans text-base text-on-surface placeholder:text-outline transition-colors focus:border-ayurvedic-gold focus:outline-none focus:ring-2 focus:ring-ayurvedic-gold/20";

function ViewSection({
  visible,
  children,
  className,
}: {
  visible: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (!visible) return null;
  return (
    <section className={cn("fade-transition view-visible flex flex-col", className)}>
      {children}
    </section>
  );
}

export default function LungTestPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("intro");
  const [symptomIndex, setSymptomIndex] = useState(0);
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [answers, setAnswers] = useState<SymptomAnswers>({
    city: false,
    smoke: false,
    cough: false,
    breathless: false,
    dust: false,
  });
  const [symptomDraft, setSymptomDraft] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.classList.add("lung-test-page");
    return () => document.body.classList.remove("lung-test-page");
  }, []);

  const currentQuestion =
    view === "symptoms" ? SYMPTOM_QUESTIONS[symptomIndex] : null;

  useEffect(() => {
    if (currentQuestion) {
      setSymptomDraft(answers[currentQuestion.key]);
    }
  }, [currentQuestion, answers]);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneOk = /^[6-9]\d{9}$/.test(lead.phone.replace(/\D/g, "").slice(-10));
    if (lead.name.trim() && lead.email.trim() && phoneOk) {
      setView("symptoms");
      setSymptomIndex(0);
      void setAdvancedMatching({ email: lead.email.trim(), phone: lead.phone });
      track(ANALYTICS_EVENTS.LEAD, {
        lead_type: "lung_test",
        content_name: "Lung Test",
        page: "/lung-test",
      });
      trackEvent("lung_test_start", { page: "/lung-test" });
    }
  };

  const saveSymptomAnswer = useCallback(
    (isYes: boolean) => {
      const q = SYMPTOM_QUESTIONS[symptomIndex];
      if (!q) return;

      setAnswers((prev) => ({ ...prev, [q.key]: isYes }));

      trackEvent("lung_test_question", {
        q_number: symptomIndex + 1,
        answer: isYes ? "yes" : "no",
        question: q.key,
        page: "/lung-test",
      });
    },
    [symptomIndex]
  );

  const handleSymptomNext = () => {
    if (symptomDraft === null || !currentQuestion) return;
    saveSymptomAnswer(symptomDraft);

    if (symptomIndex < SYMPTOM_QUESTIONS.length - 1) {
      setSymptomIndex((i) => i + 1);
      setSymptomDraft(null);
    } else {
      trackEvent("lung_test_questions_complete", { page: "/lung-test" });
      setView("breath");
    }
  };

  const handleSymptomBack = () => {
    if (symptomIndex > 0) {
      const prevQ = SYMPTOM_QUESTIONS[symptomIndex - 1];
      setSymptomIndex((i) => i - 1);
      setSymptomDraft(answers[prevQ.key]);
    } else {
      setView("lead-form");
    }
  };

  const finishTest = async (breathHoldSeconds: number) => {
    if (submitting) return;
    setSubmitting(true);

    const points = computeSymptomPoints(answers);
    const lungScore = getLungScore(points);

    const payload = {
      name: lead.name.trim(),
      email: lead.email.trim(),
      phone: lead.phone.replace(/\D/g, "").slice(-10),
      ...answers,
      breathHoldSeconds,
      score: points,
      level: lungScore.level,
      color: lungScore.color,
      recommendation: lungScore.recommendation,
      timestamp: Date.now(),
    };

    try {
      sessionStorage.setItem(LUNG_TEST_STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(LUNG_TEST_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }

    trackEvent("lung_test_complete", {
      score: points,
      level: lungScore.level,
      breath_seconds: breathHoldSeconds,
      page: "/lung-test",
    });

    try {
      await fetch("/api/lung-test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          city: payload.city,
          smoke: payload.smoke,
          cough: payload.cough,
          breathless: payload.breathless,
          dust: payload.dust,
          breathHoldSeconds,
          score: points,
          level: lungScore.level,
        }),
      });
    } catch (err) {
      console.error("lung test submit failed", err);
    }

    router.push("/lung-test/result");
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-parchment font-sans text-on-surface antialiased">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[50vw] w-[50vw] rounded-full bg-surface-container opacity-70 mix-blend-multiply blur-3xl filter" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[60vw] w-[60vw] rounded-full bg-[#e6e0c9] opacity-50 mix-blend-multiply blur-3xl filter" />
      </div>

      <header
        className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-glass-border px-5 backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.4)" }}
      >
        <Link href="/" aria-label="Royal Swag home">
          <BrandLogo variant="on-light" className="h-9 w-auto" />
        </Link>
        <span className="rounded-full bg-surface-container-high/50 px-3 py-1 font-sans text-sm font-bold text-ayurvedic-gold">
          Free Lung Test
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-20 pt-6">
        <ViewSection visible={view === "intro"} className="min-h-[60vh]">
          <div
            className="relative mb-8 h-48 w-full overflow-hidden rounded-2xl bg-surface-container shadow-sm"
            style={{
              backgroundImage: "url('/images/lung-test-hero.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary-container/80 to-transparent p-4">
              <span className="text-2xl text-white" aria-hidden>
                🫁
              </span>
            </div>
          </div>

          <h1 className="mb-4 font-display text-[36px] font-bold leading-[42px] text-primary-container">
            Discover Your Lung Capacity
          </h1>
          <p className="mb-8 font-sans text-base leading-relaxed text-on-surface-variant">
            Combine ancient Ayurvedic wisdom with modern wellness. This quick test
            evaluates your respiratory health to provide personalised botanical
            recommendations.
          </p>

          <button
            type="button"
            onClick={() => setView("lead-form")}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container py-4 font-sans text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Start Assessment →
          </button>
        </ViewSection>

        <ViewSection visible={view === "lead-form"} className="min-h-[60vh]">
          <h2 className="mb-2 font-display text-2xl font-bold text-primary-container">
            Your details
          </h2>
          <p className="mb-6 font-sans text-sm text-on-surface-variant">
            60 seconds · Symptom quiz + breath-hold test · Personalised herb report
          </p>
          <form
            onSubmit={handleLeadSubmit}
            className="glass-card flex flex-col gap-4 rounded-2xl p-6 shadow-sm"
          >
            <input
              type="text"
              placeholder="Full name"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              className={INPUT_CLASS}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              className={INPUT_CLASS}
              required
            />
            <input
              type="tel"
              placeholder="10-digit mobile"
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              maxLength={10}
              className={INPUT_CLASS}
              required
            />
            <button
              type="submit"
              data-track-button="lung-test-start"
              data-track-label="Start Free Test"
              className="w-full rounded-xl bg-primary-container py-4 font-sans text-sm font-semibold tracking-wide text-white"
            >
              Continue →
            </button>
          </form>
          <button
            type="button"
            onClick={() => setView("intro")}
            className="mt-4 font-sans text-sm font-semibold text-primary-container underline"
          >
            ← Back
          </button>
        </ViewSection>

        <ViewSection visible={view === "symptoms"} className="min-h-[60vh]">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-outline">
              Step 1 of 2
            </span>
            <div className="flex gap-1">
              <div className="h-1.5 w-6 rounded-full bg-primary-container" />
              <div className="h-1.5 w-2 rounded-full bg-outline-variant" />
            </div>
          </div>

          {currentQuestion && (
            <>
              <div className="glass-card mb-6 rounded-2xl p-6 shadow-sm">
                <p className="mb-1 font-sans text-xs text-on-surface-variant">
                  Question {symptomIndex + 1} of {SYMPTOM_QUESTIONS.length}
                </p>
                <p className="mb-4 font-sans text-sm font-semibold text-on-surface">
                  {currentQuestion.text}
                </p>
                <div className="space-y-3">
                  {(
                    [
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.label}
                      className="flex cursor-pointer items-center rounded-xl border border-glass-border bg-white/30 p-3 transition-colors hover:bg-white/50"
                    >
                      <input
                        type="radio"
                        name={currentQuestion.key}
                        checked={symptomDraft === opt.value}
                        onChange={() => setSymptomDraft(opt.value)}
                        className="h-5 w-5 accent-primary-container"
                      />
                      <span className="ml-3 font-sans text-base text-on-surface">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex gap-4">
                <button
                  type="button"
                  onClick={handleSymptomBack}
                  className="flex-1 rounded-xl border border-primary-container py-4 font-sans text-sm font-semibold text-primary-container transition-colors hover:bg-surface-container-highest"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSymptomNext}
                  disabled={symptomDraft === null}
                  className="flex-1 rounded-xl bg-primary-container py-4 font-sans text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </ViewSection>

        <ViewSection
          visible={view === "breath"}
          className="fade-transition min-h-[500px] flex-col items-center justify-center"
        >
          <div className="mb-6 flex w-full items-center justify-between">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-outline">
              Step 2 of 2
            </span>
            <div className="flex gap-1">
              <div className="h-1.5 w-2 rounded-full bg-outline-variant" />
              <div className="h-1.5 w-6 rounded-full bg-primary-container" />
            </div>
          </div>

          <section className="fade-transition flex min-h-[500px] w-full flex-col items-center justify-center">
            <h2 className="mb-4 text-center font-display text-2xl font-bold text-primary-container">
              Breath-hold lung check
            </h2>
            <BreathHoldTest onComplete={finishTest} disabled={submitting} />
          </section>

          <button
            type="button"
            onClick={() => {
              setView("symptoms");
              setSymptomIndex(SYMPTOM_QUESTIONS.length - 1);
            }}
            className="mt-6 font-sans text-sm font-semibold text-primary-container underline"
          >
            ← Back to questions
          </button>
        </ViewSection>
      </main>

      <div
        id="loader"
        className={cn(
          "fixed inset-0 z-[60] flex-col items-center justify-center bg-parchment/90 backdrop-blur-sm",
          submitting ? "flex" : "hidden"
        )}
        aria-live="polite"
        aria-busy={submitting}
      >
        <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl border-2 border-primary-container bg-primary-container/20">
          <span className="text-2xl text-primary-container" aria-hidden>
            🌿
          </span>
        </div>
        <p className="animate-pulse font-sans text-sm font-semibold text-primary-container">
          Preparing...
        </p>
      </div>
    </div>
  );
}
