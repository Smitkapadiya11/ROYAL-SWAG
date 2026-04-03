"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ROYAL_SWAG_LOGO_HEIGHT,
  ROYAL_SWAG_LOGO_SRC,
  ROYAL_SWAG_LOGO_WIDTH,
} from "@/lib/brand-logo";
import { computeLungTestScore, LUNG_TEST_MAX_SCORE } from "@/lib/lung-test-scoring";

const QUESTIONS = [
  "Do you live in a city with high air pollution or heavy traffic?",
  "Do you smoke, or have you smoked in the past?",
  "Do you experience morning cough or frequent throat clearing?",
  "Do you feel breathless while climbing stairs or walking fast?",
  "Do you work near dust, chemicals, paint fumes, or factories?",
  "Do you often feel tired or low on energy throughout the day?",
  "Do you live or work near a highway, factory, or construction zone?",
  "Have you noticed your breathing getting worse over the past 6 months?",
];

const TOTAL_STEPS = 3 + QUESTIONS.length;

export default function LungTestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showMidAffirm, setShowMidAffirm] = useState(false);
  const midAffirmShownRef = useRef(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    answers: Array.from({ length: QUESTIONS.length }, () => null) as (boolean | null)[],
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 1) nameInputRef.current?.focus();
    if (step === 2) emailInputRef.current?.focus();
    if (step === 3) phoneInputRef.current?.focus();
  }, [step]);

  const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const phoneValid = (p: string) => /^[6789]\d{9}$/.test(p.replace(/\D/g, ""));

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const finalizeSubmit = async (answers: (boolean | null)[]) => {
    const bools = answers.map((a) => a === true);
    const score = computeLungTestScore(bools);
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.replace(/\D/g, ""),
      score,
      maxScore: LUNG_TEST_MAX_SCORE,
      answers: {
        q1: !!answers[0],
        q2: !!answers[1],
        q3: !!answers[2],
        q4: !!answers[3],
        q5: !!answers[4],
        q6: !!answers[5],
        q7: !!answers[6],
        q8: !!answers[7],
      },
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem("lungTestResult", JSON.stringify(payload));
    } catch {
      /* ignore */
    }

    try {
      await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          score,
          answers: payload.answers,
        }),
      });
    } catch (err) {
      console.error("save-lead failed:", err);
    }

    setSubmitting(true);
    window.setTimeout(() => {
      router.push("/lung-test/result");
    }, 1000);
  };

  const handleAnswer = (qIndex: number, answer: boolean) => {
    const newAnswers = [...formData.answers];
    newAnswers[qIndex] = answer;
    setFormData((f) => ({ ...f, answers: newAnswers }));
    window.setTimeout(() => {
      if (step < TOTAL_STEPS) {
        const nextStep = step + 1;
        if (nextStep === 8 && qIndex === 3 && !midAffirmShownRef.current) {
          midAffirmShownRef.current = true;
          setShowMidAffirm(true);
          window.setTimeout(() => setShowMidAffirm(false), 8000);
        }
        setStep(nextStep);
      } else {
        finalizeSubmit(newAnswers);
      }
    }, 600);
  };

  const handleContinueName = () => {
    if (!formData.name.trim()) return;
    setStep(2);
  };
  const handleContinueEmail = () => {
    if (!emailValid(formData.email)) return;
    setStep(3);
  };
  const handleContinuePhone = () => {
    const digits = formData.phone.replace(/\D/g, "");
    if (digits.length !== 10 || !phoneValid(digits)) return;
    setFormData((f) => ({ ...f, phone: digits }));
    setStep(4);
  };

  if (submitting) {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
        style={{
          background: "linear-gradient(135deg, #020b05 0%, #061408 100%)",
        }}
      >
        <p className="text-6xl mb-4" aria-hidden="true">
          🫁
        </p>
        <p className="text-white text-lg font-semibold text-center mb-6">Analysing your lung health...</p>
        <div className="h-10 w-10 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-[100svh] flex flex-col items-center px-4 py-8"
      style={{
        background: "linear-gradient(135deg, #020b05 0%, #061408 100%)",
      }}
    >
      <style>{`
        @keyframes lungTestStepFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full max-w-[480px] mb-8">
        <div className="text-center mb-6">
          <Image
            src={ROYAL_SWAG_LOGO_SRC}
            alt="Royal Swag Logo"
            width={ROYAL_SWAG_LOGO_WIDTH}
            height={ROYAL_SWAG_LOGO_HEIGHT}
            className="mx-auto h-12 w-auto"
          />
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#c9a84c] mt-2">Free Lung Test</p>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Your Lung Report:</p>
        <div className="flex gap-1 mb-2" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => {
            const filled = Math.ceil((step / TOTAL_STEPS) * 10);
            return (
              <div
                key={i}
                className={`h-2 min-w-0 flex-1 rounded-sm transition-colors ${i < filled ? "bg-[#4ade80]" : "bg-white/15"}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[#4ade80] font-semibold">Step {step} of {TOTAL_STEPS}</span>
          <span className="text-gray-500">{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{
              width: `${(step / TOTAL_STEPS) * 100}%`,
              background: "linear-gradient(90deg, #16a34a, #4ade80)",
            }}
          />
        </div>
      </div>

      <div
        key={step}
        className="w-full max-w-[480px]"
        style={{ animation: "lungTestStepFadeIn 0.3s ease forwards" }}
      >
        {step === 1 && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 leading-tight">
              Take the 60-Second Lung Health Check
            </h1>
            <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
              Answer 8 quick questions. Get your personal lung toxin score. Free — no signup needed to see your result.
            </p>
            <p className="text-white/90 text-sm font-semibold text-center mb-3">What&apos;s your name?</p>
            <input
              ref={nameInputRef}
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              className="w-full p-4 text-lg rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/40 focus:border-green-500 focus:outline-none mb-2"
            />
            <p className="text-[11px] text-gray-500 text-center mb-6">Used only to personalise your lung report.</p>
            <button
              type="button"
              disabled={!formData.name.trim()}
              onClick={handleContinueName}
              className="w-full py-4 rounded-xl bg-green-700 text-white font-bold disabled:opacity-40"
            >
              Continue →
            </button>
            <p className="mt-2 text-center text-[11px] text-gray-500">No email required to see your result</p>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-white text-center mb-2">Your email address?</h1>
            <p className="text-gray-400 text-sm text-center mb-8">We&apos;ll send your lung health report here.</p>
            <input
              ref={emailInputRef}
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
              className="w-full p-4 text-lg rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/40 focus:border-green-500 focus:outline-none mb-2"
            />
            <p className="text-[11px] text-gray-500 text-center mb-6">We never spam — lung report delivery only.</p>
            <button
              type="button"
              disabled={!emailValid(formData.email)}
              onClick={handleContinueEmail}
              className="w-full py-4 rounded-xl bg-green-700 text-white font-bold disabled:opacity-40"
            >
              Continue →
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-white text-center mb-2">Your mobile number?</h1>
            <p className="text-gray-400 text-sm text-center mb-4">For WhatsApp delivery of your results.</p>
            <p className="text-[11px] text-gray-500 text-center mb-6">We never share your number. Only used for order updates.</p>
            <div className="flex gap-2 mb-6">
              <span className="flex items-center px-4 rounded-xl bg-white/10 text-gray-300 text-sm border border-white/15">
                +91
              </span>
              <input
                ref={phoneInputRef}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
                className="flex-1 p-4 text-lg rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/40 focus:border-green-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              disabled={formData.phone.replace(/\D/g, "").length !== 10 || !phoneValid(formData.phone)}
              onClick={handleContinuePhone}
              className="w-full py-4 rounded-xl bg-green-700 text-white font-bold disabled:opacity-40"
            >
              Continue →
            </button>
          </div>
        )}

        {step >= 4 && step <= TOTAL_STEPS && (
          <div className="text-center">
            {showMidAffirm && step === 8 && (
              <p className="mb-4 rounded-xl border border-[#4ade80]/40 bg-[#4ade80]/10 px-4 py-3 text-sm text-[#86efac] leading-snug">
                You&apos;re doing great. Most people skip this check for years. You&apos;re already ahead of 80% of people
                your age.
              </p>
            )}
            <p className="text-5xl mb-4" aria-hidden="true">
              🫁
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mb-6">
              Question {step - 3} of {QUESTIONS.length}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-10 px-1">
              {QUESTIONS[step - 4]}
            </h2>
            <div className="flex flex-col min-[360px]:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleAnswer(step - 4, true)}
                className={`flex-1 py-5 text-lg font-bold rounded-xl border-2 transition-colors ${
                  formData.answers[step - 4] === true
                    ? "bg-red-500 text-white border-red-500"
                    : "border-red-400 bg-red-50/10 text-white border-red-400/80"
                }`}
              >
                😮‍💨 Yes
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(step - 4, false)}
                className={`flex-1 py-5 text-lg font-bold rounded-xl border-2 transition-colors ${
                  formData.answers[step - 4] === false
                    ? "bg-green-600 text-white border-green-600"
                    : "border-green-400 bg-green-50/10 text-white border-green-400/80"
                }`}
              >
                ✅ No
              </button>
            </div>
          </div>
        )}
      </div>

      {step > 1 && (
        <button
          type="button"
          onClick={goBack}
          className="mt-6 text-gray-500 text-sm bg-transparent border-none cursor-pointer hover:text-gray-300"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
