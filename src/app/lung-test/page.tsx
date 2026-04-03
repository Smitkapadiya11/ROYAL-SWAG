"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  "Do you live in a city with high air pollution or heavy traffic?",
  "Do you smoke, or have you smoked in the past?",
  "Do you experience morning cough or frequent throat clearing?",
  "Do you feel breathless while climbing stairs or walking fast?",
  "Do you work near dust, chemicals, paint fumes, or factories?",
];

export default function LungTestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    answers: [null, null, null, null, null] as (boolean | null)[],
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
    const score = answers.filter((a) => a === true).length;
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.replace(/\D/g, ""),
      score,
      answers: {
        q1: !!answers[0],
        q2: !!answers[1],
        q3: !!answers[2],
        q4: !!answers[3],
        q5: !!answers[4],
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
      if (step < 8) {
        setStep((s) => s + 1);
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
          <p className="text-white font-bold tracking-tight text-lg">ROYAL SWAG</p>
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#c9a84c] mt-1">Free Lung Test</p>
        </div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[#4ade80] font-semibold">Step {step} of 8</span>
          <span className="text-gray-500">{Math.round((step / 8) * 100)}% complete</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{
              width: `${(step / 8) * 100}%`,
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
            <h1 className="text-2xl font-bold text-white text-center mb-2">What&apos;s your name?</h1>
            <p className="text-gray-400 text-sm text-center mb-8">We&apos;ll personalise your lung report for you.</p>
            <input
              ref={nameInputRef}
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              className="w-full p-4 text-lg rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/40 focus:border-green-500 focus:outline-none mb-6"
            />
            <button
              type="button"
              disabled={!formData.name.trim()}
              onClick={handleContinueName}
              className="w-full py-4 rounded-xl bg-green-700 text-white font-bold disabled:opacity-40"
            >
              Continue →
            </button>
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
              className="w-full p-4 text-lg rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/40 focus:border-green-500 focus:outline-none mb-6"
            />
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
            <p className="text-gray-400 text-sm text-center mb-8">For WhatsApp delivery of your results.</p>
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

        {step >= 4 && step <= 8 && (
          <div className="text-center">
            <p className="text-5xl mb-4" aria-hidden="true">
              🫁
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mb-6">
              Question {step - 3} of 5
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
