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

export default function LungTestPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "quiz">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(5).fill(null));
  const [current, setCurrent] = useState(0);

  const answer = (val: boolean) => {
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

  if (step === "quiz") {
    const progress = (current / QUESTIONS.length) * 100;
    return (
      <section style={{
        minHeight: "100svh", background: "#F2E6CE",
        display: "flex", alignItems: "center",
        padding: "80px 0 60px",
      }}>
        <div className="w" style={{ maxWidth: 560, margin: "0 auto", width: "100%" }}>
          {/* Progress bar */}
          <div style={{
            height: 3, background: "#D4C8A8",
            borderRadius: 2, marginBottom: 48, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", background: "#4A6422",
              width: `${progress}%`, transition: "width 0.3s ease",
            }} />
          </div>

          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 2,
            color: "#C49A2A", display: "block", marginBottom: 12,
          }}>
            QUESTION {current + 1} OF {QUESTIONS.length}
          </span>
          <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", marginBottom: 40, lineHeight: 1.3 }}>
            {QUESTIONS[current]}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <button onClick={() => answer(true)} className="b b-olive"
              style={{ padding: "18px", fontSize: 16, justifyContent: "center" }}>
              Yes
            </button>
            <button onClick={() => answer(false)} className="b b-ghost"
              style={{ padding: "18px", fontSize: 16, justifyContent: "center" }}>
              No
            </button>
          </div>
          {current > 0 && (
            <button onClick={() => setCurrent(c => c - 1)}
              style={{
                background: "none", border: "none", color: "#5C5647",
                fontSize: 13, marginTop: 24, cursor: "pointer", padding: 0,
              }}>
              ← Back
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section style={{
      minHeight: "100svh", background: "#F2E6CE",
      display: "flex", alignItems: "center",
      padding: "80px 0 60px",
    }}>
      <div className="w" style={{ maxWidth: 520, margin: "0 auto", width: "100%" }}>
        <span className="ey">Free Assessment</span>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", marginBottom: 12 }}>
          Know Your<br />
          <em style={{ color: "#4A6422" }}>Lung Health Score.</em>
        </h1>
        <div className="rl" />
        <p style={{ marginBottom: 36, fontSize: 15 }}>
          5 questions. 2 minutes. Personalised Ayurvedic recommendations.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Your Name",     value: name,  set: setName,  type: "text",  placeholder: "e.g. Rahul Sharma" },
            { label: "Email Address", value: email, set: setEmail, type: "email", placeholder: "rahul@example.com" },
            { label: "Phone Number",  value: phone, set: setPhone, type: "tel",   placeholder: "+91 98765 43210" },
          ].map(f => (
            <div key={f.label}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 600,
                letterSpacing: 1.5, color: "#5C5647", marginBottom: 6,
              }}>
                {f.label.toUpperCase()}
              </label>
              <input
                type={f.type}
                value={f.value}
                onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                style={{
                  width: "100%", padding: "13px 16px",
                  border: "1px solid #D4C8A8", borderRadius: 6,
                  background: "#fff", fontSize: 15, color: "#1A1A14",
                  outline: "none",
                }}
              />
            </div>
          ))}
          <button
            onClick={() => name.trim() && setStep("quiz")}
            className="b b-olive"
            style={{
              width: "100%", justifyContent: "center",
              padding: 16, fontSize: 15, marginTop: 8,
              opacity: name.trim() ? 1 : 0.5,
            }}
          >
            Start Free Lung Test →
          </button>
        </div>
        <p style={{ fontSize: 11, color: "#5C5647", marginTop: 16, lineHeight: 1.6, opacity: 0.7 }}>
          Your details are private. Used only to personalise your lung health report.
        </p>
      </div>
    </section>
  );
}
