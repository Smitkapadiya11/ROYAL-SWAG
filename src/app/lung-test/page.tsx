"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuiz } from "@/store/quiz-store";
import {
  QUIZ_QUESTIONS,
  TOTAL_QUESTIONS,
  calculateScore,
  type QuizQuestion,
} from "@/lib/quiz-data";

type LungTestYesNoKey =
  | "pollution"
  | "smoke"
  | "morningCough"
  | "breathless"
  | "dustFumes";

type LungTestYesNoAnswers = Record<LungTestYesNoKey, boolean>;

// ━━━ Progress Bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ProgressBar({ step, total }: { step: number; total: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = Math.round((step / total) * 100);

  useEffect(() => {
    const animate = async () => {
      const { gsap } = await import("gsap");
      if (barRef.current) {
        gsap.to(barRef.current, {
          width: `${pct}%`,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };
    animate();
  }, [pct]);

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Question ${step} of ${total}`}
    >
      <div className="flex justify-between text-xs text-[var(--brand-green)]/50 mb-2 font-medium">
        <span>Step {step} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--brand-sage)]">
        <div
          ref={barRef}
          className="h-full rounded-full bg-[var(--brand-green)]"
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}

// ━━━ Single Option ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function QuizOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium text-base transition-all duration-200 ${
        selected
          ? "bg-[var(--brand-green)] border-[var(--brand-green)] text-white shadow-sm scale-[1.01]"
          : "bg-white border-[var(--brand-sage)] text-[var(--brand-dark)] hover:border-[var(--brand-green)] hover:bg-[var(--brand-sage)]/40"
      }`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

// ━━━ Quiz Card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function QuizCard({
  question,
  qIndex,
  cardKey,
}: {
  question: QuizQuestion;
  qIndex: number;
  cardKey: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { state, answer } = useQuiz();
  const existingAnswer = state.answers[qIndex];

  // GSAP slide transition on mount
  useEffect(() => {
    const animate = async () => {
      const { gsap } = await import("gsap");
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.28, ease: "power2.out" }
        );
      }
    };
    animate();
  }, [cardKey]);

  const handleSingle = (score: number) => answer(score);

  if (question.multiSelect) {
    const selected: number[] = Array.isArray(existingAnswer) ? existingAnswer : [];

    const toggle = (score: number, label: string) => {
      if (label === "None of the above") {
        answer([0]);
      } else {
        const filtered = selected.filter((s) => s !== 0);
        const idx = filtered.indexOf(score);
        if (idx !== -1) {
          answer(filtered.filter((_, i) => i !== idx));
        } else {
          answer([...filtered, score]);
        }
      }
    };

    const noneSelected = selected.length === 1 && selected[0] === 0;

    return (
      <div ref={cardRef} className="flex flex-col gap-3">
        {question.options.map(({ label, score }) => {
          const isNoneOption = label === "None of the above";
          const isSelected = isNoneOption ? noneSelected : selected.includes(score);
          return (
            <QuizOption
              key={label}
              label={label}
              selected={isSelected}
              onClick={() => toggle(score, label)}
            />
          );
        })}
        <button
          disabled={selected.length === 0}
          className="mt-2 px-7 py-4 rounded-full bg-[var(--brand-green)] text-white font-semibold text-base shadow-sm hover:bg-[#163d29] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => answer(selected)}
        >
          Continue →
        </button>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="flex flex-col gap-3">
      {question.options.map(({ label, score }) => (
        <QuizOption
          key={label}
          label={label}
          selected={existingAnswer === score}
          onClick={() => handleSingle(score)}
        />
      ))}
    </div>
  );
}

// ━━━ Main Quiz Page ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function LungTestPage() {
  const { state, startQuiz, goBack, complete } = useQuiz();
  const router = useRouter();
  const { currentStep } = state;

  // Lead form state
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [yn, setYn] = useState<LungTestYesNoAnswers>({
    pollution: false,
    smoke: false,
    morningCough: false,
    breathless: false,
    dustFumes: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quiz completion
  useEffect(() => {
    if (currentStep >= TOTAL_QUESTIONS) {
      const flatScores = state.answers.map((a) =>
        Array.isArray(a) ? a.reduce((s, v) => s + v, 0) : (a as number)
      );
      const score = calculateScore(flatScores as number[]);
      complete(score);
      router.push("/lung-test/report");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      setError("All fields are required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (!phoneRegex.test(formData.mobile)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    try {
      const answers = {
        q1: yn.pollution,
        q2: yn.smoke,
        q3: yn.morningCough,
        q4: yn.breathless,
        q5: yn.dustFumes,
      };
      const score =
        Number(answers.q1) +
        Number(answers.q2) +
        Number(answers.q3) +
        Number(answers.q4) +
        Number(answers.q5);

      // Persist to localStorage for /lung-test/result
      try {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          score,
          answers,
          savedAt: Date.now(),
        };
        localStorage.setItem("lungTestResult", JSON.stringify(payload));
        localStorage.setItem("lungTestAnswers", JSON.stringify(answers));
        localStorage.setItem("lungTestScore", String(score));
      } catch {
        /* ignore storage errors */
      }

      // Save lead to backend (Supabase or console fallback)
      try {
        await fetch("/api/save-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.mobile,
            score,
            answers,
          }),
        });
      } catch (err: any) {
        console.error("save-lead failed:", err?.message ?? err);
      }

      router.push("/lung-test/result");
    } catch (err: any) {
      console.error("Lung test submit failed:", err?.message ?? err);
      router.push("/lung-test/result");
    } finally {
      setLoading(false);
    }
  };

  if (currentStep >= TOTAL_QUESTIONS) return null;

  // ── Lead Capture (Step -1) ──────────────────────────────
  if (currentStep === -1) {
    return (
      <div className="min-h-[100svh] bg-[var(--brand-ivory)] flex flex-col justify-center py-16 px-4">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <h1
              className="text-4xl font-black text-[var(--brand-green)] mb-1"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              ROYAL SWAG
            </h1>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--brand-gold)] mb-8">
              estd. 2016
            </p>
            <h2 className="text-2xl font-bold text-[var(--brand-dark)] mb-3 leading-snug">
              Let's Personalize Your Lung Health Report
            </h2>
            <p className="text-sm text-[var(--brand-dark)]/55 font-medium">
              Takes 2 minutes · 100% Free · Instant Results
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--brand-sage)] shadow-sm p-8">
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}
            <form className="space-y-5" onSubmit={handleLeadSubmit}>
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-[var(--brand-dark)] mb-1.5">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 text-sm"
                  placeholder="Rahul Sharma"
                />
              </div>
              <div>
                <label htmlFor="email-addr" className="block text-sm font-medium text-[var(--brand-dark)] mb-1.5">
                  Email Address
                </label>
                <input
                  id="email-addr"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 text-sm"
                  placeholder="rahul@example.com"
                />
              </div>
              <div>
                <label htmlFor="mobile-num" className="block text-sm font-medium text-[var(--brand-dark)] mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-dark)]/40 text-sm font-medium">
                    +91
                  </span>
                  <input
                    id="mobile-num"
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 text-sm"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              {/* Yes/No Questions */}
              <div className="pt-2 space-y-4">
                <YesNoQuestion
                  id="q1"
                  question="Do you live in a high-pollution city or near heavy traffic?"
                  value={yn.pollution}
                  onChange={(v) => setYn({ ...yn, pollution: v })}
                />
                <YesNoQuestion
                  id="q2"
                  question="Do you smoke or have you smoked in the past?"
                  value={yn.smoke}
                  onChange={(v) => setYn({ ...yn, smoke: v })}
                />
                <YesNoQuestion
                  id="q3"
                  question="Do you experience morning cough or throat clearing?"
                  value={yn.morningCough}
                  onChange={(v) => setYn({ ...yn, morningCough: v })}
                />
                <YesNoQuestion
                  id="q4"
                  question="Do you feel breathless climbing stairs or walking fast?"
                  value={yn.breathless}
                  onChange={(v) => setYn({ ...yn, breathless: v })}
                />
                <YesNoQuestion
                  id="q5"
                  question="Do you work near dust, chemicals, paint, or factory fumes?"
                  value={yn.dustFumes}
                  onChange={(v) => setYn({ ...yn, dustFumes: v })}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="lead-submit-btn"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-[var(--brand-green)] text-[var(--brand-gold)] font-bold text-base shadow-sm hover:bg-[#163d29] transition-all active:scale-95 disabled:opacity-70"
                >
                  {loading ? "Preparing..." : "See My Result →"}
                </button>
                <p className="text-center text-xs text-[var(--brand-dark)]/35 mt-4">
                  🔒 Your data is safe. No spam, ever.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz Screen ─────────────────────────────────────────
  const question = QUIZ_QUESTIONS[currentStep];
  const displayStep = currentStep + 1;

  return (
    <div className="min-h-[100svh] bg-[var(--brand-ivory)] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-6">
          {currentStep > 0 && (
            <button
              onClick={goBack}
              className="p-2 rounded-full hover:bg-[var(--brand-sage)] transition-colors shrink-0"
              aria-label="Go back to previous question"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-[var(--brand-green)]" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex-1">
            <ProgressBar step={displayStep} total={TOTAL_QUESTIONS} />
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center px-4 pb-16">
        <div className="max-w-2xl mx-auto w-full">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--brand-gold)] mb-4">
            Question {displayStep}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--brand-dark)] leading-snug mb-8"
            style={{ fontFamily: "var(--font-playfair)" }}>
            {question.question}
          </h2>
          <QuizCard question={question} qIndex={currentStep} cardKey={currentStep} />
        </div>
      </div>
    </div>
  );
}

function YesNoQuestion(props: {
  id: string;
  question: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const { id, question, value, onChange } = props;

  return (
    <fieldset className="rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/20 p-4">
      <legend className="text-sm font-semibold text-[var(--brand-dark)]/80 px-1">
        {question}
      </legend>
      <div className="mt-3 flex gap-3">
        <label className="flex-1 cursor-pointer">
          <input
            type="radio"
            name={id}
            checked={value === true}
            onChange={() => onChange(true)}
            className="sr-only"
          />
          <span
            className={`block w-full text-center rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-colors ${
              value
                ? "border-[var(--brand-green)] bg-white text-[var(--brand-green)]"
                : "border-[var(--brand-sage)] bg-white/70 text-[var(--brand-dark)]/60 hover:border-[var(--brand-green)]"
            }`}
          >
            Yes
          </span>
        </label>
        <label className="flex-1 cursor-pointer">
          <input
            type="radio"
            name={id}
            checked={value === false}
            onChange={() => onChange(false)}
            className="sr-only"
          />
          <span
            className={`block w-full text-center rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-colors ${
              !value
                ? "border-[var(--brand-green)] bg-white text-[var(--brand-green)]"
                : "border-[var(--brand-sage)] bg-white/70 text-[var(--brand-dark)]/60 hover:border-[var(--brand-green)]"
            }`}
          >
            No
          </span>
        </label>
      </div>
    </fieldset>
  );
}
