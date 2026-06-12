"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BreathHoldTest from "@/components/lung-test/BreathHoldTest";
import { QuestionScreen } from "@/components/lung-test/QuestionScreen";
import { trackEvent } from "@/lib/events";
import { ANALYTICS_EVENTS, setAdvancedMatching, track } from "@/lib/analytics";
import { LUNG_TEST_QUESTIONS, type LungTestQuestion } from "@/lib/lung-test-questions";
import { writeStoredLungResult, type StoredLungResult } from "@/lib/lung-test-constants";
import {
  adjustScoreForBreathHold,
  computeSymptomPoints,
  getLungScore,
  getMatchedHerbNames,
  type SymptomAnswers,
} from "@/lib/lungScore";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/contexts/LocaleContext";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { LUNG_TEST_INTRO_ALT, LUNG_TEST_INTRO_IMAGE } from "@/lib/image-assets";
import { lungQuestionStepTransition, lungQuestionStepVariants } from "@/lib/motionVariants";

type View = "intro" | "form" | "questions" | "breath-hold";

const INPUT_CLASS =
  "w-full rounded-xl border border-[#c5c8bc] bg-white/60 px-4 py-3.5 font-sans text-base text-[#324023] placeholder:text-[#75786e] transition-colors focus:border-[#9A6F1A] focus:outline-none focus:ring-2 focus:ring-[#9A6F1A]/20";

const EMPTY_ANSWERS: SymptomAnswers = {
  city: false,
  smoke: false,
  cough: false,
  breathless: false,
  dust: false,
  mucus: false,
  worsened: false,
};

function StepPill({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.15em]",
        active
          ? "bg-[#324023] text-white"
          : "bg-[#dee5d1] text-[#75786e]"
      )}
    >
      {label}
    </span>
  );
}

const INTRO_BULLET_KEYS = [
  "lungTest.intro.bullet1",
  "lungTest.intro.bullet2",
  "lungTest.intro.bullet3",
] as const;

function IntroHeroImage({ className = "mb-8" }: { className?: string }) {
  return (
    <div className={cn("lung-test-intro-frame mx-auto w-full shadow-sm", className)}>
      <OptimizedImage
        src={LUNG_TEST_INTRO_IMAGE}
        alt={LUNG_TEST_INTRO_ALT}
        fill
        sizes="(max-width: 768px) 100vw, 520px"
        objectFit="cover"
        objectPosition="center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#495738]/80 to-transparent" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 md:bottom-6 md:left-6">
        <span className="text-2xl md:text-3xl" aria-hidden>
          🫁
        </span>
        <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white md:text-sm">
          60-Second Assessment
        </span>
      </div>
    </div>
  );
}

function LungTestQuestionsStep({
  questionId,
  question,
  current,
  total,
  onAnswer,
  onBack,
}: {
  questionId: string;
  question: LungTestQuestion;
  current: number;
  total: number;
  onAnswer: (yes: boolean) => void;
  onBack: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mx-auto min-h-[70vh] w-full max-w-3xl md:min-h-[60vh]">
      <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6F1A]">
        Step 2 of 2
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={questionId}
          variants={reduceMotion ? undefined : lungQuestionStepVariants}
          initial={reduceMotion ? false : "initial"}
          animate="animate"
          exit={reduceMotion ? undefined : "exit"}
          transition={lungQuestionStepTransition}
        >
          <QuestionScreen
            question={question}
            current={current}
            total={total}
            onAnswer={onAnswer}
          />
        </motion.div>
      </AnimatePresence>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 font-sans text-sm text-[#75786e] hover:text-[#324023]"
      >
        ← Back
      </button>
    </section>
  );
}

function IntroCopy({
  onStart,
  desktop = false,
}: {
  onStart: () => void;
  desktop?: boolean;
}) {
  const { t } = useTranslations();

  return (
    <div className={cn("flex flex-col", desktop ? "justify-center" : "flex-1")}>
      <h1
        className={cn(
          "mb-3 font-display font-bold leading-tight text-[#324023]",
          desktop ? "text-5xl lg:text-6xl" : "text-[36px]"
        )}
      >
        {t("lungTest.intro.title")}
      </h1>
      <p
        className={cn(
          "mb-8 font-sans leading-relaxed text-[#45483f]",
          desktop ? "max-w-lg text-lg" : "text-base"
        )}
      >
        {t("lungTest.intro.subtitle")}
      </p>

      <ul className={cn("space-y-3", desktop ? "mb-10 space-y-4" : "mb-8")}>
        {INTRO_BULLET_KEYS.map((key) => (
          <li
            key={key}
            className={cn(
              "flex items-center gap-3 font-sans text-[#45483f]",
              desktop ? "text-base" : "text-sm"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-full bg-[#9A6F1A]/15 text-[#9A6F1A]",
                desktop ? "h-8 w-8 text-sm" : "h-6 w-6 text-xs"
              )}
            >
              ✓
            </span>
            {t(key)}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onStart}
        className={cn(
          "w-full rounded-2xl bg-[#324023] py-4 font-sans font-bold tracking-wide text-white shadow-[0_8px_24px_rgba(50,64,35,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(50,64,35,0.35)]",
          desktop ? "max-w-sm text-base" : "mt-auto text-sm"
        )}
      >
        {t("lungTest.intro.cta")} →
      </button>
    </div>
  );
}

export default function LungTestPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [answers, setAnswers] = useState<SymptomAnswers>(EMPTY_ANSWERS);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneOk = /^[6-9]\d{9}$/.test(lead.phone.replace(/\D/g, "").slice(-10));
    if (!lead.name.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!lead.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!phoneOk) {
      setFormError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setFormError(null);

    setView("questions");
    setCurrentQ(0);
    setScore(0);
    setAnswers(EMPTY_ANSWERS);

    void setAdvancedMatching({ email: lead.email.trim(), phone: lead.phone });
    track(ANALYTICS_EVENTS.LEAD, {
      lead_type: "lung_test",
      content_name: "Lung Test",
      page: "/lung-test",
    });
    trackEvent("lung_test_start", { page: "/lung-test" });
  };

  const finishQuiz = async (finalAnswers: SymptomAnswers, breathHoldSeconds?: number) => {
    if (submitting) return;
    setSubmitting(true);

    const symptomPoints = computeSymptomPoints(finalAnswers);
    const points =
      breathHoldSeconds != null
        ? adjustScoreForBreathHold(symptomPoints, breathHoldSeconds)
        : symptomPoints;
    const lungScore = getLungScore(points);
    const matchedHerbs = getMatchedHerbNames(finalAnswers);

    const payload: StoredLungResult = {
      name: lead.name.trim(),
      email: lead.email.trim(),
      phone: lead.phone.replace(/\D/g, "").slice(-10),
      ...finalAnswers,
      score: points,
      level: lungScore.level,
      riskSlug: lungScore.riskSlug,
      matchedHerbs,
      timestamp: Date.now(),
    };

    writeStoredLungResult(payload);

    trackEvent("lung_test_complete", {
      score: points,
      level: lungScore.level,
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
          city: finalAnswers.city,
          smoke: finalAnswers.smoke,
          cough: finalAnswers.cough,
          breathless: finalAnswers.breathless,
          dust: finalAnswers.dust,
          mucus: finalAnswers.mucus,
          worsened: finalAnswers.worsened,
          breathHoldSeconds: breathHoldSeconds ?? null,
          score: points,
          sourceUrl: window.location.href,
        }),
      });
    } catch (err) {
      console.error("lung test submit failed", err);
    }

    setSubmitting(false);
    router.push("/lung-test/result");
  };

  const handleAnswer = (yes: boolean) => {
    const q = LUNG_TEST_QUESTIONS[currentQ];
    if (!q) return;

    const newAnswers = { ...answers, [q.key]: yes };
    const newScore = yes ? score + q.points : score;

    setAnswers(newAnswers);
    setScore(newScore);

    trackEvent("lung_test_question", {
      q_number: currentQ + 1,
      answer: yes ? "yes" : "no",
      question: q.key,
      page: "/lung-test",
    });

    if (currentQ + 1 < LUNG_TEST_QUESTIONS.length) {
      setCurrentQ(currentQ + 1);
      return;
    }

    trackEvent("lung_test_questions_complete", { page: "/lung-test" });
    setAnswers(newAnswers);
    setScore(newScore);
    setView("breath-hold");
  };

  const handleBreathHoldComplete = (seconds: number) => {
    trackEvent("lung_test_breath_hold", { seconds, page: "/lung-test" });
    void finishQuiz(answers, seconds);
  };

  const currentQuestion = LUNG_TEST_QUESTIONS[currentQ];

  return (
    <div className="page-shell page-mobile-pad relative bg-parchment font-sans text-on-surface antialiased">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-[#e9f1dc] opacity-80 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[60vw] w-[60vw] rounded-full bg-[#f4edd6] opacity-70 blur-3xl" />
      </div>

      <main className="layout-container layout-page-main relative z-10 pb-24 pt-6 md:pb-16 md:pt-10">
        {view !== "intro" && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <StepPill label="Details" active={view === "form"} />
              <StepPill
                label="Symptoms"
                active={view === "questions" || view === "breath-hold"}
              />
            </div>
            <span className="rounded-full bg-[#324023]/10 px-3 py-1 font-sans text-xs font-bold text-[#9A6F1A]">
              Free Lung Test
            </span>
          </div>
        )}
        {view === "intro" && (
          <>
            <section className="flex min-h-[70vh] flex-col duration-500 animate-in fade-in md:hidden">
              <IntroHeroImage />
              <IntroCopy onStart={() => setView("form")} />
            </section>

            <section className="hidden min-h-[72vh] duration-500 animate-in fade-in md:grid layout-grid--split">
              <IntroHeroImage className="mb-0 md:mx-0" />
              <IntroCopy onStart={() => setView("form")} desktop />
            </section>
          </>
        )}

        {view === "form" && (
          <section className="layout-content-narrow flex min-h-[70vh] w-full flex-col duration-300 animate-in fade-in slide-in-from-right md:min-h-[60vh]">
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6F1A] md:text-xs">
              Step 1 of 2
            </p>
            <h2 className="mb-2 font-display text-[28px] font-bold text-[#324023] md:text-4xl">
              Your details
            </h2>
            <p className="mb-6 font-sans text-sm text-[#45483f] md:text-base">
              We&apos;ll email your personalised lung report instantly.
            </p>

            <div className="layout-grid--split md:items-start">
              <form
                onSubmit={handleLeadSubmit}
                className="glass-card flex flex-col gap-4 rounded-3xl p-6 shadow-sm md:p-8"
              >
                {formError ? (
                  <p
                    className="rounded-xl border border-[#ba1a1a]/30 bg-[#ffdad6]/40 px-4 py-3 font-sans text-sm text-[#ba1a1a]"
                    role="alert"
                  >
                    {formError}
                  </p>
                ) : null}
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
                  className="w-full rounded-2xl bg-[#9A6F1A] py-4 font-sans text-sm font-bold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:text-base"
                >
                  Continue to Symptoms →
                </button>
              </form>

              <ul className="mt-6 hidden space-y-4 md:mt-0 md:block">
                {[
                  "7 quick yes/no questions",
                  "Personalised herb match",
                  "Instant risk score",
                  "Email report on request",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 font-sans text-sm text-[#45483f]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9A6F1A]/15 text-sm text-[#9A6F1A]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setView("intro")}
              className="mt-4 font-sans text-sm text-[#75786e] hover:text-[#324023]"
            >
              ← Back
            </button>
          </section>
        )}

        {view === "questions" && currentQuestion && (
          <LungTestQuestionsStep
            questionId={currentQuestion.id}
            question={currentQuestion}
            current={currentQ + 1}
            total={LUNG_TEST_QUESTIONS.length}
            onAnswer={handleAnswer}
            onBack={() => {
              if (currentQ > 0) {
                const qToUndo = LUNG_TEST_QUESTIONS[currentQ - 1];
                if (answers[qToUndo.key]) {
                  setScore((s) => s - qToUndo.points);
                }
                setAnswers((a) => ({ ...a, [qToUndo.key]: false }));
                setCurrentQ((i) => i - 1);
              } else {
                setView("form");
              }
            }}
          />
        )}

        {view === "breath-hold" && (
          <section className="layout-content-narrow w-full text-center">
            <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6F1A]">
              Final step
            </p>
            <h2 className="mb-3 font-display text-2xl font-bold text-[#324023] md:text-3xl">
              Breath-hold lung capacity test
            </h2>
            <p className="mb-8 font-sans text-sm text-[#45483f] md:text-base">
              Take a deep breath, press and hold the button for as long as you can
              comfortably hold your breath, then release.
            </p>
            <BreathHoldTest
              onComplete={handleBreathHoldComplete}
              onBack={() => setView("questions")}
            />
          </section>
        )}
      </main>

      <div
        className={cn(
          "fixed inset-0 z-[60] flex-col items-center justify-center bg-parchment/90 backdrop-blur-sm",
          submitting ? "flex" : "hidden"
        )}
        aria-live="polite"
        aria-busy={submitting}
        aria-hidden={!submitting}
      >
        <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl border-2 border-[#324023] bg-[#324023]/10">
          <span className="text-2xl" aria-hidden>
            🌿
          </span>
        </div>
        <p className="animate-pulse font-sans text-sm font-semibold text-[#324023]">
          Analysing your lungs…
        </p>
      </div>
    </div>
  );
}
