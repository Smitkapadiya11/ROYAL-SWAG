"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LUNG_TEST_QUESTION_COUNT } from "@/lib/lung-test-constants";
import { trackLungTestLead } from "@/lib/trackLead";

const QUESTIONS: {
  q: string;
  hint: string;
  topic: string;
}[] = [
  {
    q: "Do you live in a city with visible air pollution?",
    hint: "Delhi, Mumbai, Surat, Pune, Bengaluru — or anywhere with hazy air",
    topic: "POLLUTION EXPOSURE",
  },
  {
    q: "Do you currently smoke, vape, or have you in the last 5 years?",
    hint: "Any form — cigarettes, bidis, hookah, or e-cigarettes",
    topic: "SMOKING HISTORY",
  },
  {
    q: "Do you experience a morning cough or need to clear your throat daily?",
    hint: "More than 3 days a week on average",
    topic: "AIRWAY SYMPTOMS",
  },
  {
    q: "Do you feel breathless or winded climbing stairs or walking briskly?",
    hint: "Even a single flight feels heavier than it used to",
    topic: "BREATHING CAPACITY",
  },
  {
    q: "Do you work near dust, chemicals, vehicle exhaust, or construction?",
    hint: "Factory, workshop, roadside, or heavy-traffic commute daily",
    topic: "OCCUPATIONAL RISK",
  },
  {
    q: "Do you wake up with chest tightness or difficulty breathing?",
    hint: "A feeling of weight on the chest, especially in the first hour of waking",
    topic: "SLEEP & RECOVERY",
  },
  {
    q: "Has your exercise stamina noticeably declined in the last year?",
    hint: "Activities that used to feel easy now leave you more tired",
    topic: "PHYSICAL ENDURANCE",
  },
  {
    q: "Do you consume fried foods or smoke-exposed food more than 4 days a week?",
    hint: "Street food, tandoor, barbeque, or heavy oil cooking",
    topic: "DIETARY EXPOSURE",
  },
];

const MAX_SCORE = LUNG_TEST_QUESTION_COUNT;

type Step = "name" | "email" | "phone" | "quiz";

export default function LungTestPage() {
  const router = useRouter();
  const [step, setStep]   = useState<Step>("name");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qIdx, setQIdx]   = useState(0);
  const [ans, setAns]     = useState<(boolean | null)[]>(Array(MAX_SCORE).fill(null));

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPhone = phone.replace(/\D/g, "").length >= 10;

  const goNext = () => {
    if (step === "name"  && name.trim().length >= 2) setStep("email");
    else if (step === "email" && validEmail)          setStep("phone");
    else if (step === "phone" && validPhone)          setStep("quiz");
  };

  const choose = (val: boolean) => {
    const next = [...ans];
    next[qIdx] = val;
    setAns(next);
    setTimeout(() => {
      if (qIdx < MAX_SCORE - 1) {
        setQIdx(qIdx + 1);
      } else {
        void (async () => {
          const score = next.filter(Boolean).length;
          await trackLungTestLead({
            name: name.trim(),
            mobile: phone,
            email: email.trim(),
          });
          fetch("/api/lung-test/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              phone,
              answers: next.map((a) => a === true),
              score,
              riskLevel: score <= 2 ? "MILD" : score <= 5 ? "MODERATE" : "HIGH",
            }),
          }).catch(console.error);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("rs_user", JSON.stringify({ name, email, phone }));
          }
          router.push(`/lung-test/result?score=${score}&name=${encodeURIComponent(name)}`);
        })();
      }
    }, 220);
  };

  const totalSteps = 4 + MAX_SCORE;
  const currentStep =
    step === "name"  ? 1 :
    step === "email" ? 2 :
    step === "phone" ? 3 :
    4 + qIdx;
  const progress = (currentStep / totalSteps) * 100;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "16px 20px",
    border: "1.5px solid #D4C8A8",
    borderRadius: 8, background: "#fff",
    fontSize: 17, color: "#1A1A14",
    outline: "none", marginBottom: 20,
    fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <section style={{
      minHeight: "100svh", background: "#F2E6CE",
      display: "flex", alignItems: "center",
      padding: "80px 24px 60px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: step === "quiz" ? 960 : 540,
        margin: "0 auto",
      }}>

        {/* Progress bar */}
        <div style={{
          height: 4, background: "rgba(212,200,168,0.6)",
          borderRadius: 2, marginBottom: 36, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", background: "#4A6422",
            width: `${progress}%`, transition: "width 0.4s ease", borderRadius: 2,
          }} />
        </div>

        <p style={{
          fontSize: 11, fontWeight: 600, letterSpacing: 3,
          color: "#C49A2A", marginBottom: 14,
        }}>STEP {currentStep} OF {totalSteps}</p>

        {/* ── NAME ── */}
        {step === "name" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <h2 style={{
              fontFamily: "var(--ff-head)",
              fontSize: "clamp(28px,4vw,40px)",
              color: "#1A1A14", marginBottom: 12,
            }}>
              First, what should we<br />
              <em style={{ color: "#4A6422" }}>call you?</em>
            </h2>
            <p style={{ color: "#5C5647", marginBottom: 32, fontSize: 15 }}>
              Your personalised lung report needs a name on top.
            </p>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && goNext()}
              onFocus={e => (e.currentTarget.style.borderColor = "#4A6422")}
              onBlur={e  => (e.currentTarget.style.borderColor = "#D4C8A8")}
              placeholder="e.g. Rahul Sharma"
              style={inputStyle}
            />
            <button
              onClick={goNext}
              disabled={name.trim().length < 2}
              className="b b-olive"
              style={{
                width: "100%", padding: 16, fontSize: 16,
                opacity: name.trim().length >= 2 ? 1 : 0.4,
              }}
            >Continue →</button>
          </div>
        )}

        {/* ── EMAIL ── */}
        {step === "email" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <h2 style={{
              fontFamily: "var(--ff-head)",
              fontSize: "clamp(28px,4vw,40px)",
              color: "#1A1A14", marginBottom: 12,
            }}>
              Hi {name.split(" ")[0]},<br />
              <em style={{ color: "#4A6422" }}>your email?</em>
            </h2>
            <p style={{ color: "#5C5647", marginBottom: 32, fontSize: 15 }}>
              We&apos;ll send your detailed report and lung-care tips here.
            </p>
            <input
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && goNext()}
              onFocus={e => (e.currentTarget.style.borderColor = "#4A6422")}
              onBlur={e  => (e.currentTarget.style.borderColor = "#D4C8A8")}
              placeholder="Eximburg@gmail.com"
              style={inputStyle}
            />
            <p style={{ fontSize: 12, color: "#5C5647", opacity: 0.7, marginBottom: 20 }}>
              No spam. Used only for your report.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep("name")} className="b b-ghost"
                style={{ padding: "16px 24px" }}>← Back</button>
              <button
                onClick={goNext}
                disabled={!validEmail}
                className="b b-olive"
                style={{ flex: 1, padding: 16, fontSize: 16, opacity: validEmail ? 1 : 0.4 }}
              >Continue →</button>
            </div>
          </div>
        )}

        {/* ── PHONE ── */}
        {step === "phone" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <h2 style={{
              fontFamily: "var(--ff-head)",
              fontSize: "clamp(28px,4vw,40px)",
              color: "#1A1A14", marginBottom: 12,
            }}>
              Last bit —<br />
              <em style={{ color: "#4A6422" }}>your phone.</em>
            </h2>
            <p style={{ color: "#5C5647", marginBottom: 32, fontSize: 15 }}>
              For order updates and free Ayurvedic consultation, if needed.
            </p>
            <input
              autoFocus
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === "Enter" && goNext()}
              onFocus={e => (e.currentTarget.style.borderColor = "#4A6422")}
              onBlur={e  => (e.currentTarget.style.borderColor = "#D4C8A8")}
              placeholder="+91 98765 43210"
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep("email")} className="b b-ghost"
                style={{ padding: "16px 24px" }}>← Back</button>
              <button
                onClick={goNext}
                disabled={!validPhone}
                className="b b-olive"
                style={{ flex: 1, padding: 16, fontSize: 16, opacity: validPhone ? 1 : 0.4 }}
              >Start the Test →</button>
            </div>
          </div>
        )}

        {/* ── QUIZ — branded strip + text + buttons (no stock photos) ── */}
        {step === "quiz" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <p style={{
              fontFamily: "var(--ff-head, Georgia, serif)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "3px",
              color: "#C49A2A",
              marginBottom: 14,
              fontVariantNumeric: "tabular-nums",
            }}>
              QUESTION {String(qIdx + 1).padStart(2, "0")} / {String(MAX_SCORE).padStart(2, "0")}
            </p>

            <div
              className="lung-quiz-grid"
              style={{
                display: "grid",
                gap: 16,
                alignItems: "stretch",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  position: "relative",
                }}
              >
                {/* Decorative header — replaces per-question stock imagery */}
                <div
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: "100%",
                    minHeight: 76,
                    padding: "18px 20px",
                    boxSizing: "border-box",
                    background:
                      "linear-gradient(135deg, #2D3D15 0%, #4A6422 42%, rgba(196,154,42,0.18) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    borderBottom: "1px solid rgba(242,230,206,0.15)",
                  }}
                >
                  <span style={{ fontSize: 28, lineHeight: 1 }}>🫁</span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.28em",
                    color: "#F2E6CE",
                    textTransform: "uppercase",
                  }}>
                    Lung health check
                  </span>
                </div>

                {/* QUESTION TEXT */}
                <div
                  style={{
                    padding: "16px 16px 8px",
                    position: "static",
                  }}
                >
                  <p style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "2.5px",
                    color: "#4A6422",
                    marginBottom: 8,
                    textTransform: "uppercase",
                  }}>
                    {QUESTIONS[qIdx].topic}
                  </p>
                  <p style={{
                    fontSize: 15,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    color: "#1a1a1a",
                    marginBottom: 8,
                    fontFamily: "var(--ff-head, Georgia, serif)",
                  }}>
                    {QUESTIONS[qIdx].q}
                  </p>
                  <p style={{
                    fontSize: 13,
                    color: "#5C5647",
                    fontStyle: "italic",
                    marginBottom: 0,
                    lineHeight: 1.67,
                  }}>
                    {QUESTIONS[qIdx].hint}
                  </p>
                </div>

                {/* YES / NO — always below text, never absolute */}
                <div style={{
                  display: "flex",
                  gap: 12,
                  padding: "8px 16px 16px",
                  position: "static",
                  zIndex: 1,
                  pointerEvents: "auto",
                }}>
                  <button
                    type="button"
                    onClick={() => choose(true)}
                    style={{
                      flex: 1,
                      padding: "14px 10px",
                      borderRadius: 8,
                      border: "2px solid #16a34a",
                      background: ans[qIdx] === true ? "#16a34a" : "#fff",
                      color: ans[qIdx] === true ? "#fff" : "#16a34a",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 14,
                      pointerEvents: "auto",
                      fontFamily: "var(--ff-body, sans-serif)",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => choose(false)}
                    style={{
                      flex: 1,
                      padding: "14px 10px",
                      borderRadius: 8,
                      border: "2px solid #dc2626",
                      background: ans[qIdx] === false ? "#dc2626" : "#fff",
                      color: ans[qIdx] === false ? "#fff" : "#dc2626",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 14,
                      pointerEvents: "auto",
                      fontFamily: "var(--ff-body, sans-serif)",
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {qIdx > 0 && (
              <button
                type="button"
                onClick={() => setQIdx(qIdx - 1)}
                style={{
                  marginTop: 8,
                  background: "none",
                  border: "none",
                  color: "#5C5647",
                  fontSize: 13,
                  cursor: "pointer",
                  padding: 0,
                  position: "static",
                  pointerEvents: "auto",
                  fontFamily: "var(--ff-body, sans-serif)",
                }}
              >
                ← Previous question
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lung-quiz-grid {
          grid-template-columns: minmax(0, 1fr);
        }
        @media (min-width: 640px) {
          .lung-quiz-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </section>
  );
}
