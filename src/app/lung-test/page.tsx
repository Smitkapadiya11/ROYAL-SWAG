"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  "Do you live in a high-pollution city (Delhi, Mumbai, Surat, etc.)?",
  "Do you smoke or have you smoked in the last 5 years?",
  "Do you experience morning cough or mucus?",
  "Do you feel breathless climbing stairs or walking fast?",
  "Do you work near dust, chemicals, fumes, or heavy traffic?",
];

type Step = "name" | "email" | "phone" | "quiz";

export default function LungTestPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(5).fill(null));
  const [current, setCurrent] = useState(0);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPhone = phone.replace(/\D/g, "").length >= 10;

  const stepIndex =
    step === "name"  ? 0 :
    step === "email" ? 1 :
    step === "phone" ? 2 :
    3 + current;
  const totalSteps = 3 + QUESTIONS.length;
  const progress = (stepIndex / totalSteps) * 100;

  const answerQuiz = (val: boolean) => {
    const next = [...answers];
    next[current] = val;
    setAnswers(next);
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      const score = next.filter(Boolean).length;
      router.push(`/lung-test/result?score=${score}&name=${encodeURIComponent(name)}`);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px 20px",
    fontSize: 18,
    border: "1.5px solid #D4C8A8",
    borderRadius: 8,
    background: "#fff",
    color: "#1A1A14",
    outline: "none",
    marginBottom: 20,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <section style={{
      minHeight: "100svh",
      background: "transparent",
      display: "flex",
      alignItems: "center",
      padding: "60px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 540, margin: "0 auto" }}>

        {/* Progress bar */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: 10, fontSize: 11, letterSpacing: 2, color: "#5C5647",
          }}>
            <span>STEP {stepIndex + 1} OF {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 4, background: "#D4C8A8", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: "#4A6422", transition: "width 0.4s ease", borderRadius: 2,
            }} />
          </div>
        </div>

        {/* ── STEP 1: NAME ── */}
        {step === "name" && (
          <div>
            <span style={{
              display: "block", fontSize: 11, letterSpacing: 3,
              color: "#C49A2A", fontWeight: 600, marginBottom: 12,
            }}>WELCOME</span>
            <h1 style={{ fontSize: "clamp(28px,4vw,38px)", marginBottom: 12, color: "#1A1A14", lineHeight: 1.2 }}>
              What should we<br />
              <em style={{ fontStyle: "italic", color: "#4A6422" }}>call you?</em>
            </h1>
            <p style={{ fontSize: 15, marginBottom: 32, color: "#5C5647" }}>
              Your free lung health report will be addressed personally.
            </p>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              onKeyDown={e => e.key === "Enter" && name.trim() && setStep("email")}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "#4A6422")}
              onBlur={e => (e.currentTarget.style.borderColor = "#D4C8A8")}
            />
            <button
              onClick={() => name.trim() && setStep("email")}
              disabled={!name.trim()}
              className="b b-olive"
              style={{ width: "100%", padding: 16, fontSize: 16, opacity: name.trim() ? 1 : 0.4 }}>
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2: EMAIL ── */}
        {step === "email" && (
          <div>
            <span style={{
              display: "block", fontSize: 11, letterSpacing: 3,
              color: "#C49A2A", fontWeight: 600, marginBottom: 12,
            }}>STEP 2 OF 3</span>
            <h1 style={{ fontSize: "clamp(28px,4vw,38px)", marginBottom: 12, color: "#1A1A14", lineHeight: 1.2 }}>
              Hi {name},<br />
              <em style={{ fontStyle: "italic", color: "#4A6422" }}>where do we send it?</em>
            </h1>
            <p style={{ fontSize: 15, marginBottom: 32, color: "#5C5647" }}>
              Your lung health report will be emailed to this address.
            </p>
            <input
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="rahul@example.com"
              onKeyDown={e => e.key === "Enter" && validEmail && setStep("phone")}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "#4A6422")}
              onBlur={e => (e.currentTarget.style.borderColor = "#D4C8A8")}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep("name")} className="b b-ghost" style={{ padding: "14px 24px" }}>
                ← Back
              </button>
              <button
                onClick={() => validEmail && setStep("phone")}
                disabled={!validEmail}
                className="b b-olive"
                style={{ flex: 1, padding: 16, fontSize: 16, opacity: validEmail ? 1 : 0.4 }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: PHONE ── */}
        {step === "phone" && (
          <div>
            <span style={{
              display: "block", fontSize: 11, letterSpacing: 3,
              color: "#C49A2A", fontWeight: 600, marginBottom: 12,
            }}>STEP 3 OF 3</span>
            <h1 style={{ fontSize: "clamp(28px,4vw,38px)", marginBottom: 12, color: "#1A1A14", lineHeight: 1.2 }}>
              Almost there.<br />
              <em style={{ fontStyle: "italic", color: "#4A6422" }}>Your number?</em>
            </h1>
            <p style={{ fontSize: 15, marginBottom: 32, color: "#5C5647" }}>
              Used only for delivery updates and personalised recommendations.
            </p>
            <input
              autoFocus
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              onKeyDown={e => e.key === "Enter" && validPhone && setStep("quiz")}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "#4A6422")}
              onBlur={e => (e.currentTarget.style.borderColor = "#D4C8A8")}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep("email")} className="b b-ghost" style={{ padding: "14px 24px" }}>
                ← Back
              </button>
              <button
                onClick={() => validPhone && setStep("quiz")}
                disabled={!validPhone}
                className="b b-olive"
                style={{ flex: 1, padding: 16, fontSize: 16, opacity: validPhone ? 1 : 0.4 }}>
                Start Lung Test →
              </button>
            </div>
          </div>
        )}

        {/* ── QUIZ STEPS ── */}
        {step === "quiz" && (
          <div>
            <span style={{
              display: "block", fontSize: 11, letterSpacing: 3,
              color: "#C49A2A", fontWeight: 600, marginBottom: 12,
            }}>
              QUESTION {current + 1} OF {QUESTIONS.length}
            </span>
            <h2 style={{
              fontSize: "clamp(20px,3vw,26px)",
              marginBottom: 40, color: "#1A1A14", lineHeight: 1.4,
            }}>
              {QUESTIONS[current]}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button
                onClick={() => answerQuiz(true)}
                style={{
                  padding: 24, fontSize: 17, fontWeight: 600,
                  background: "#fff", color: "#4A6422",
                  border: "1.5px solid #D4C8A8", borderRadius: 12,
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#4A6422";
                  e.currentTarget.style.color = "#F2E6CE";
                  e.currentTarget.style.borderColor = "#4A6422";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#4A6422";
                  e.currentTarget.style.borderColor = "#D4C8A8";
                }}>
                Yes
              </button>
              <button
                onClick={() => answerQuiz(false)}
                style={{
                  padding: 24, fontSize: 17, fontWeight: 600,
                  background: "#fff", color: "#5C5647",
                  border: "1.5px solid #D4C8A8", borderRadius: 12,
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#5C5647";
                  e.currentTarget.style.color = "#F2E6CE";
                  e.currentTarget.style.borderColor = "#5C5647";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#5C5647";
                  e.currentTarget.style.borderColor = "#D4C8A8";
                }}>
                No
              </button>
            </div>
            {current > 0 && (
              <button
                onClick={() => setCurrent(c => c - 1)}
                style={{
                  background: "none", border: "none", color: "#5C5647",
                  fontSize: 13, marginTop: 24, cursor: "pointer", padding: 0,
                }}>
                ← Previous question
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
