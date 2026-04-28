"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

const bgStyle: React.CSSProperties = {
  background: "linear-gradient(160deg, var(--rs-deep) 0%, #0d1f07 100%)",
  minHeight: "100vh", display: "flex", flexDirection: "column",
  alignItems: "center", padding: "40px 20px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 16px", fontSize: 16,
  borderRadius: "var(--r-md)", border: "1.5px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)", color: "#fff",
  fontFamily: "var(--font-body)", outline: "none", marginBottom: 8,
};

const btnGreenStyle = (disabled?: boolean): React.CSSProperties => ({
  width: "100%", padding: "15px", fontSize: 16, fontWeight: 700,
  borderRadius: "var(--r-md)", border: "none", cursor: disabled ? "not-allowed" : "pointer",
  background: disabled ? "rgba(74,100,34,0.4)" : "var(--rs-olive)",
  color: disabled ? "rgba(255,255,255,0.4)" : "var(--rs-cream)",
  fontFamily: "var(--font-body)",
});

export default function LungTestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showMidAffirm, setShowMidAffirm] = useState(false);
  const midAffirmShownRef = useRef(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    answers: Array.from({ length: QUESTIONS.length }, () => null) as (boolean | null)[],
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const phoneValid = (p: string) => /^[6789]\d{9}$/.test(p.replace(/\D/g, ""));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const finalizeSubmit = async (answers: (boolean | null)[]) => {
    const bools = answers.map((a) => a === true);
    const score = computeLungTestScore(bools);
    const payload = {
      name: formData.name.trim(), email: formData.email.trim(),
      phone: formData.phone.replace(/\D/g, ""), score,
      maxScore: LUNG_TEST_MAX_SCORE,
      answers: { q1: !!answers[0], q2: !!answers[1], q3: !!answers[2], q4: !!answers[3], q5: !!answers[4], q6: !!answers[5], q7: !!answers[6], q8: !!answers[7] },
      timestamp: Date.now(),
    };
    try { localStorage.setItem("lungTestResult", JSON.stringify(payload)); } catch { /* ignore */ }
    try {
      await fetch("/api/save-lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: payload.name, email: payload.email, phone: payload.phone, score, answers: payload.answers }),
      });
    } catch { /* ignore */ }
    setSubmitting(true);
    window.setTimeout(() => {
      router.push(`/lung-test/result?score=${score}&name=${encodeURIComponent(payload.name || "there")}`);
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

  if (submitting) {
    return (
      <div style={{ ...bgStyle, justifyContent: "center", textAlign: "center" }}>
        <p style={{ fontSize: 56, marginBottom: 16 }}>🫁</p>
        <p style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
          Analysing your lung health...
        </p>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "3px solid var(--rs-olive)", borderTopColor: "var(--rs-gold)",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div style={bgStyle}>
      {/* Progress */}
      <div style={{ width: "100%", maxWidth: 480, marginBottom: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 11, letterSpacing: 3, color: "var(--rs-gold)", fontWeight: 600, textTransform: "uppercase" }}>
            Free Lung Test
          </span>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const filled = Math.ceil((step / TOTAL_STEPS) * 10);
            return (
              <div key={i} style={{
                flex: 1, height: 6, borderRadius: 3,
                background: i < filled ? "var(--rs-olive)" : "rgba(255,255,255,0.1)",
              }} />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "var(--rs-gold)", fontWeight: 600 }}>Step {step} of {TOTAL_STEPS}</span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>{progressPct}% complete</span>
        </div>
      </div>

      {/* Step content */}
      <div style={{ width: "100%", maxWidth: 480 }}>
        {step === 1 && (
          <div>
            <h1 style={{ color: "#fff", textAlign: "center", fontSize: "clamp(22px, 4vw, 30px)", marginBottom: 10 }}>
              Take the 60-Second Lung Health Check
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", fontSize: 14, marginBottom: 28 }}>
              8 quick questions. Your personalised lung health score in under 2 minutes.
            </p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              What&apos;s your name?
            </p>
            <input
              ref={nameInputRef}
              type="text" placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              style={inputStyle}
            />
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: 20 }}>
              Used only to personalise your lung report.
            </p>
            <button
              type="button"
              disabled={!formData.name.trim()}
              onClick={() => setStep(2)}
              style={btnGreenStyle(!formData.name.trim())}
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ color: "#fff", textAlign: "center", marginBottom: 8 }}>Your email address?</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", fontSize: 14, marginBottom: 24 }}>
              We&apos;ll send your lung health report here.
            </p>
            <input
              ref={emailInputRef}
              type="email" placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
              style={inputStyle}
            />
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: 20 }}>
              We never spam — report delivery only.
            </p>
            <button
              type="button"
              disabled={!emailValid(formData.email)}
              onClick={() => setStep(3)}
              style={btnGreenStyle(!emailValid(formData.email))}
            >
              Continue →
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ color: "#fff", textAlign: "center", marginBottom: 8 }}>Your mobile number?</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", fontSize: 14, marginBottom: 24 }}>
              For WhatsApp delivery of your results.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={{
                padding: "14px 16px", borderRadius: "var(--r-md)",
                background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)", fontSize: 15, flexShrink: 0,
              }}>+91</span>
              <input
                ref={phoneInputRef}
                type="tel" inputMode="numeric" maxLength={10} placeholder="98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: 20 }}>
              Never shared. Only for order updates.
            </p>
            <button
              type="button"
              disabled={formData.phone.replace(/\D/g, "").length !== 10 || !phoneValid(formData.phone)}
              onClick={() => {
                const digits = formData.phone.replace(/\D/g, "");
                setFormData((f) => ({ ...f, phone: digits }));
                setStep(4);
              }}
              style={btnGreenStyle(formData.phone.replace(/\D/g, "").length !== 10)}
            >
              Continue →
            </button>
          </div>
        )}

        {step >= 4 && step <= TOTAL_STEPS && (
          <div style={{ textAlign: "center" }}>
            {showMidAffirm && step === 8 && (
              <p style={{
                marginBottom: 16, padding: "12px 16px", borderRadius: "var(--r-md)",
                background: "rgba(74,100,34,0.2)", border: "1px solid rgba(74,100,34,0.4)",
                color: "rgba(162,222,133,0.9)", fontSize: 13, lineHeight: 1.6,
              }}>
                You&apos;re doing great. Most people skip this check for years.
              </p>
            )}
            <p style={{ fontSize: 52, marginBottom: 12 }}>🫁</p>
            <span style={{
              display: "inline-block", padding: "4px 14px", borderRadius: 20,
              background: "rgba(74,100,34,0.25)", color: "rgba(162,222,133,0.8)",
              fontSize: 12, fontWeight: 700, marginBottom: 24,
            }}>
              Question {step - 3} of {QUESTIONS.length}
            </span>
            <h2 style={{ color: "#fff", fontSize: "clamp(18px, 3vw, 24px)", marginBottom: 36, lineHeight: 1.4 }}>
              {QUESTIONS[step - 4]}
            </h2>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                onClick={() => handleAnswer(step - 4, true)}
                style={{
                  flex: 1, padding: "18px", fontSize: 17, fontWeight: 700,
                  borderRadius: "var(--r-md)", border: "2px solid",
                  cursor: "pointer", fontFamily: "var(--font-body)",
                  borderColor: formData.answers[step - 4] === true ? "#ef4444" : "rgba(239,68,68,0.5)",
                  background: formData.answers[step - 4] === true ? "#ef4444" : "rgba(239,68,68,0.1)",
                  color: "#fff",
                }}
              >
                😮‍💨 Yes
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(step - 4, false)}
                style={{
                  flex: 1, padding: "18px", fontSize: 17, fontWeight: 700,
                  borderRadius: "var(--r-md)", border: "2px solid",
                  cursor: "pointer", fontFamily: "var(--font-body)",
                  borderColor: formData.answers[step - 4] === false ? "var(--rs-olive)" : "rgba(74,100,34,0.5)",
                  background: formData.answers[step - 4] === false ? "var(--rs-olive)" : "rgba(74,100,34,0.1)",
                  color: "#fff",
                }}
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
          style={{
            marginTop: 24, background: "none", border: "none",
            color: "rgba(255,255,255,0.35)", fontSize: 14, cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          ← Back
        </button>
      )}
    </div>
  );
}
