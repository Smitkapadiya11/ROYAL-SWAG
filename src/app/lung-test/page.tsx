"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  { q: "Do you live in a high-pollution city?",          hint: "Delhi, Mumbai, Surat, Bengaluru, Pune, etc." },
  { q: "Do you currently smoke or vape?",                 hint: "Or have you in the last 5 years?" },
  { q: "Morning cough, mucus, or chest tightness?",       hint: "More than 3 days a week" },
  { q: "Breathlessness on stairs or walking fast?",       hint: "Even a short flight feels heavy" },
  { q: "Daily exposure to dust, fumes, or traffic?",      hint: "At work, commute, or near construction" },
];

type Step = "name" | "email" | "phone" | "quiz";

export default function LungTestPage() {
  const router = useRouter();
  const [step, setStep]   = useState<Step>("name");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qIdx, setQIdx]   = useState(0);
  const [ans, setAns]     = useState<(boolean | null)[]>(Array(5).fill(null));

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
      if (qIdx < QUESTIONS.length - 1) {
        setQIdx(qIdx + 1);
      } else {
        const score = next.filter(Boolean).length;
        if (typeof window !== "undefined") {
          sessionStorage.setItem("rs_user", JSON.stringify({ name, email, phone }));
        }
        router.push(`/lung-test/result?score=${score}&name=${encodeURIComponent(name)}`);
      }
    }, 220);
  };

  const totalSteps = 4 + QUESTIONS.length;
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
      <div style={{ width: "100%", maxWidth: 540, margin: "0 auto" }}>

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
              placeholder="rahul@example.com"
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

        {/* ── QUIZ ── */}
        {step === "quiz" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 2,
              color: "#C49A2A", marginBottom: 14,
            }}>QUESTION {qIdx + 1} OF {QUESTIONS.length}</p>
            <h2 style={{
              fontFamily: "var(--ff-head)",
              fontSize: "clamp(22px,3vw,32px)",
              color: "#1A1A14", marginBottom: 10, lineHeight: 1.3,
            }}>{QUESTIONS[qIdx].q}</h2>
            <p style={{
              color: "#5C5647", marginBottom: 36,
              fontSize: 14, fontStyle: "italic",
            }}>{QUESTIONS[qIdx].hint}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button
                onClick={() => choose(true)}
                style={{
                  padding: "20px", background: "#4A6422",
                  color: "#F2E6CE", border: "none",
                  borderRadius: 8, fontSize: 17, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#2D3D15")}
                onMouseLeave={e => (e.currentTarget.style.background = "#4A6422")}
              >Yes</button>
              <button
                onClick={() => choose(false)}
                style={{
                  padding: "20px", background: "transparent",
                  color: "#4A6422", border: "1.5px solid #4A6422",
                  borderRadius: 8, fontSize: 17, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#4A6422";
                  e.currentTarget.style.color = "#F2E6CE";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#4A6422";
                }}
              >No</button>
            </div>

            {/* Visual engagement context card */}
            <div style={{
              marginTop: 32,
              padding: "18px 20px",
              background: "#fff",
              borderRadius: 10,
              border: "1px solid #D4C8A8",
              display: "flex", gap: 16, alignItems: "flex-start",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "#F2E6CE",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, flexShrink: 0,
                filter: "grayscale(80%)",
              }}>
                {(["🏙️", "🚬", "😮‍💨", "🫁", "⚙️"] as const)[qIdx] ?? "🫁"}
              </div>
              <div>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 2.5,
                  color: "#C49A2A", marginBottom: 4,
                  textTransform: "uppercase" as const,
                }}>
                  {[
                    "POLLUTION RISK",
                    "SMOKING RISK",
                    "AIRWAY HEALTH",
                    "BREATHING CAPACITY",
                    "OCCUPATIONAL RISK",
                  ][qIdx] ?? "LUNG HEALTH"}
                </p>
                <p style={{ fontSize: 13, color: "#5C5647", lineHeight: 1.65 }}>
                  {[
                    "Living in a high-pollution city is the number one non-smoking cause of lung damage in India. Your body doesn't tell you — it just absorbs.",
                    "Nicotine clears your system in days. The tar and particle deposits from smoking can take 7–10 years to clear without targeted herbs.",
                    "A morning cough means your lungs spent the night fighting inflammation they couldn't resolve. It is a signal, not a coincidence.",
                    "Breathlessness on mild exertion is measurable. It means your oxygen transfer capacity has dropped — and that can be reversed.",
                    "Occupational lung exposure is the most underdiagnosed cause of chronic respiratory decline in India. Most people attribute it to 'just getting older.'",
                  ][qIdx] ?? "Your answers are building your personalised lung health report."}
                </p>
              </div>
            </div>

            {qIdx > 0 && (
              <button
                onClick={() => setQIdx(qIdx - 1)}
                style={{
                  marginTop: 24, background: "none", border: "none",
                  color: "#5C5647", fontSize: 13, cursor: "pointer", padding: 0,
                }}
              >← Previous question</button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
