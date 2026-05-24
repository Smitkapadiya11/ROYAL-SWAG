"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import BreathHoldTest from "@/components/lung-test/BreathHoldTest";
import { LungTestResult } from "@/components/lung-test/LungTestResult";
import { QuestionScreen } from "@/components/lung-test/QuestionScreen";
import { trackEvent } from "@/lib/events";
import { ANALYTICS_EVENTS, setAdvancedMatching, track } from "@/lib/analytics";
import { LUNG_TEST_QUESTIONS } from "@/lib/lung-test-questions";
import { LUNG_TEST_STORAGE_KEY } from "@/lib/lung-test-constants";
import {
  computeSymptomPoints,
  getLungScore,
  type LungLevel,
  type SymptomAnswers,
} from "@/lib/lungScore";
import { cn } from "@/lib/utils";

type View = "intro" | "form" | "questions" | "breath" | "result";

const INPUT_CLASS =
  "w-full rounded-xl border border-[#c5c8bc] bg-white/60 px-4 py-3.5 font-sans text-base text-[#324023] placeholder:text-[#75786e] transition-colors focus:border-[#9A6F1A] focus:outline-none focus:ring-2 focus:ring-[#9A6F1A]/20";

const EMPTY_ANSWERS: SymptomAnswers = {
  city: false,
  smoke: false,
  cough: false,
  breathless: false,
  dust: false,
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

export default function LungTestPage() {
  const [view, setView] = useState<View>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [answers, setAnswers] = useState<SymptomAnswers>(EMPTY_ANSWERS);
  const [score, setScore] = useState(0);
  const [breathSeconds, setBreathSeconds] = useState(0);
  const [resultLevel, setResultLevel] = useState<LungLevel>("Mild");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.classList.add("lung-test-page");
    return () => document.body.classList.remove("lung-test-page");
  }, []);

  const resetTest = useCallback(() => {
    setView("intro");
    setCurrentQ(0);
    setLead({ name: "", email: "", phone: "" });
    setAnswers(EMPTY_ANSWERS);
    setScore(0);
    setBreathSeconds(0);
    setResultLevel("Mild");
    setSubmitting(false);
    try {
      sessionStorage.removeItem(LUNG_TEST_STORAGE_KEY);
      localStorage.removeItem(LUNG_TEST_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneOk = /^[6-9]\d{9}$/.test(lead.phone.replace(/\D/g, "").slice(-10));
    if (!lead.name.trim() || !lead.email.trim() || !phoneOk) return;

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
    setView("breath");
  };

  const saveAndShowResult = async (seconds: number) => {
    if (submitting) return;
    setSubmitting(true);

    const points = computeSymptomPoints(answers);
    const lungScore = getLungScore(points);
    const level = lungScore.level;

    setBreathSeconds(seconds);
    setScore(points);
    setResultLevel(level);

    const payload = {
      name: lead.name.trim(),
      email: lead.email.trim(),
      phone: lead.phone.replace(/\D/g, "").slice(-10),
      ...answers,
      breathHoldSeconds: seconds,
      score: points,
      level,
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
      level,
      breath_seconds: seconds,
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
          breathHoldSeconds: seconds,
          score: points,
          level,
        }),
      });
    } catch (err) {
      console.error("lung test submit failed", err);
    }

    setSubmitting(false);
    setView("result");
  };

  const currentQuestion = LUNG_TEST_QUESTIONS[currentQ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-parchment font-sans text-on-surface antialiased">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-[#e9f1dc] opacity-80 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[60vw] w-[60vw] rounded-full bg-[#f4edd6] opacity-70 blur-3xl" />
      </div>

      <header
        className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/60 px-5 backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.45)" }}
      >
        <Link href="/" aria-label="Royal Swag home">
          <BrandLogo variant="on-light" className="h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          {view !== "intro" && view !== "result" && (
            <>
              <StepPill label="Details" active={view === "form"} />
              <StepPill label="Quiz" active={view === "questions"} />
              <StepPill label="Breath" active={view === "breath"} />
            </>
          )}
          <span className="rounded-full bg-[#324023]/10 px-3 py-1 font-sans text-xs font-bold text-[#9A6F1A]">
            Free Lung Test
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-24 pt-6 md:max-w-lg">
        {view === "intro" && (
          <section className="flex min-h-[70vh] flex-col duration-500 animate-in fade-in">
            <div
              className="relative mb-8 w-full overflow-hidden rounded-2xl shadow-sm"
              style={{ height: "200px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/lungtest.jpeg"
                alt="Lung Health Test"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.background =
                      "linear-gradient(160deg, #324023 0%, #495738 60%, #9A6F1A 100%)";
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#495738]/80 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="text-2xl">🫁</span>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white">
                  60-Second Assessment
                </span>
              </div>
            </div>

            <h1 className="mb-3 font-display text-[36px] font-bold leading-tight text-[#324023]">
              Discover Your
              <br />
              <span className="text-[#9A6F1A]">Lung Capacity</span>
            </h1>
            <p className="mb-8 font-sans text-base leading-relaxed text-[#45483f]">
              A quick symptom quiz plus breath-hold test — personalised Ayurvedic
              herb recommendations in under a minute.
            </p>

            <ul className="mb-8 space-y-3">
              {[
                "5 simple yes/no questions",
                "Interactive breath-hold test",
                "Instant risk score & herb match",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-sans text-sm text-[#45483f]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#9A6F1A]/15 text-xs text-[#9A6F1A]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setView("form")}
              className="mt-auto w-full rounded-2xl bg-[#324023] py-4 font-sans text-sm font-bold tracking-wide text-white shadow-[0_8px_24px_rgba(50,64,35,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(50,64,35,0.35)]"
            >
              Start Assessment →
            </button>
          </section>
        )}

        {view === "form" && (
          <section className="flex min-h-[70vh] flex-col duration-300 animate-in fade-in slide-in-from-right">
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6F1A]">
              Step 1 of 3
            </p>
            <h2 className="mb-2 font-display text-[28px] font-bold text-[#324023]">
              Your details
            </h2>
            <p className="mb-6 font-sans text-sm text-[#45483f]">
              We&apos;ll email your personalised lung report instantly.
            </p>

            <form
              onSubmit={handleLeadSubmit}
              className="glass-card flex flex-col gap-4 rounded-3xl p-6 shadow-sm"
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
                className="w-full rounded-2xl bg-[#9A6F1A] py-4 font-sans text-sm font-bold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Continue to Quiz →
              </button>
            </form>

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
          <section className="min-h-[70vh]">
            <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6F1A]">
              Step 2 of 3
            </p>
            <QuestionScreen
              key={currentQuestion.id}
              question={currentQuestion}
              current={currentQ + 1}
              total={LUNG_TEST_QUESTIONS.length}
              onAnswer={handleAnswer}
            />
            <button
              type="button"
              onClick={() => {
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
              className="mt-4 font-sans text-sm text-[#75786e] hover:text-[#324023]"
            >
              ← Back
            </button>
          </section>
        )}

        {view === "breath" && (
          <section className="flex min-h-[70vh] flex-col duration-300 animate-in fade-in">
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <div className="mb-4">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6F1A]">
                  Step 3 of 3
                </span>
                <h2 className="mt-2 font-display text-[28px] font-bold text-[#324023]">
                  Breath Hold Test
                </h2>
                <p className="mt-1 font-sans text-sm text-[#45483f]">
                  Hold your breath as long as comfortable. Press and hold the
                  circle.
                </p>
              </div>
              <BreathHoldTest
                onComplete={saveAndShowResult}
                disabled={submitting}
                onBack={() => {
                  setView("questions");
                  setCurrentQ(LUNG_TEST_QUESTIONS.length - 1);
                }}
              />
              <p className="max-w-xs font-sans text-xs text-[#75786e]">
                Normal: 25+ seconds. Don&apos;t push past comfort.
              </p>
            </div>
          </section>
        )}

        {view === "result" && (
          <section className="min-h-[70vh] py-2">
            <p className="mb-4 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6F1A]">
              Your personalised result
            </p>
            <LungTestResult
              score={score}
              level={resultLevel}
              breathSeconds={breathSeconds}
              answers={answers}
              onRetake={resetTest}
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
