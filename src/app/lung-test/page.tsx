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
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(45,61,21,0.1)",
            }}>
              {/* Image strip — b&w visual for engagement */}
              <div style={{
                height: 160,
                background: [
                  "linear-gradient(135deg,#2D3D15,#4A6422)",
                  "linear-gradient(135deg,#1A1A14,#3D2D14)",
                  "linear-gradient(135deg,#2D3D15,#4A6422)",
                  "linear-gradient(135deg,#1A4432,#2D6A44)",
                  "linear-gradient(135deg,#2A2A2A,#4A3A28)",
                ][qIdx] ?? "linear-gradient(135deg,#2D3D15,#4A6422)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                <svg
                  viewBox="0 0 320 160"
                  style={{ width: "100%", height: "100%", position: "absolute", inset: 0, opacity: 0.18 }}
                  preserveAspectRatio="xMidYMid slice"
                >
                  {/* Abstract lung / breath visualisation per question */}
                  {qIdx === 0 && (
                    /* City skyline silhouette */
                    <>
                      <rect x="0" y="100" width="30" height="60" fill="#fff" opacity="0.6"/>
                      <rect x="35" y="70" width="25" height="90" fill="#fff" opacity="0.6"/>
                      <rect x="65" y="110" width="20" height="50" fill="#fff" opacity="0.5"/>
                      <rect x="90" y="60" width="40" height="100" fill="#fff" opacity="0.7"/>
                      <rect x="135" y="85" width="28" height="75" fill="#fff" opacity="0.5"/>
                      <rect x="170" y="50" width="35" height="110" fill="#fff" opacity="0.65"/>
                      <rect x="210" y="90" width="22" height="70" fill="#fff" opacity="0.5"/>
                      <rect x="240" y="75" width="38" height="85" fill="#fff" opacity="0.6"/>
                      <rect x="285" y="105" width="35" height="55" fill="#fff" opacity="0.45"/>
                      {/* Smog layers */}
                      <ellipse cx="160" cy="95" rx="180" ry="30" fill="#fff" opacity="0.08"/>
                      <ellipse cx="160" cy="75" rx="160" ry="20" fill="#fff" opacity="0.05"/>
                    </>
                  )}
                  {qIdx === 1 && (
                    /* Cigarette smoke curl */
                    <>
                      <path d="M160 140 Q155 120 165 100 Q155 80 165 60 Q155 40 160 20" stroke="#fff" strokeWidth="3" fill="none" opacity="0.6"/>
                      <path d="M170 140 Q180 115 165 95 Q175 75 165 55 Q175 35 168 15" stroke="#fff" strokeWidth="2" fill="none" opacity="0.4"/>
                      <rect x="130" y="140" width="60" height="8" rx="4" fill="#fff" opacity="0.5"/>
                      <rect x="120" y="148" width="80" height="5" rx="2" fill="#fff" opacity="0.3"/>
                    </>
                  )}
                  {qIdx === 2 && (
                    /* Lung outline */
                    <>
                      <path d="M120 130 Q90 110 85 80 Q80 50 100 40 Q115 35 125 50 Q130 60 130 75 L130 130 Z" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.6"/>
                      <path d="M200 130 Q230 110 235 80 Q240 50 220 40 Q205 35 195 50 Q190 60 190 75 L190 130 Z" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.6"/>
                      <line x1="130" y1="75" x2="160" y2="75" stroke="#fff" strokeWidth="2" opacity="0.5"/>
                      <line x1="160" y1="40" x2="160" y2="75" stroke="#fff" strokeWidth="3" opacity="0.5"/>
                      {/* Airways */}
                      <path d="M130 90 Q140 80 130 70" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.4"/>
                      <path d="M190 90 Q180 80 190 70" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.4"/>
                    </>
                  )}
                  {qIdx === 3 && (
                    /* Breath wave */
                    <>
                      <path d="M20 80 Q50 40 80 80 Q110 120 140 80 Q170 40 200 80 Q230 120 260 80 Q280 60 300 80" stroke="#fff" strokeWidth="3" fill="none" opacity="0.65"/>
                      <path d="M20 80 Q50 60 80 80 Q110 100 140 80 Q170 60 200 80 Q230 100 260 80 Q280 70 300 80" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.3"/>
                      {/* Oxygen molecules */}
                      <circle cx="80" cy="80" r="8" fill="#fff" opacity="0.2"/>
                      <circle cx="160" cy="80" r="8" fill="#fff" opacity="0.2"/>
                      <circle cx="240" cy="80" r="8" fill="#fff" opacity="0.2"/>
                    </>
                  )}
                  {qIdx === 4 && (
                    /* Industrial/gear silhouette */
                    <>
                      <circle cx="100" cy="80" r="35" stroke="#fff" strokeWidth="3" fill="none" opacity="0.5"/>
                      <circle cx="100" cy="80" r="18" stroke="#fff" strokeWidth="2" fill="none" opacity="0.4"/>
                      <line x1="100" y1="40" x2="100" y2="50" stroke="#fff" strokeWidth="4" opacity="0.5"/>
                      <line x1="100" y1="110" x2="100" y2="120" stroke="#fff" strokeWidth="4" opacity="0.5"/>
                      <line x1="60" y1="80" x2="70" y2="80" stroke="#fff" strokeWidth="4" opacity="0.5"/>
                      <line x1="130" y1="80" x2="140" y2="80" stroke="#fff" strokeWidth="4" opacity="0.5"/>
                      {/* Smoke from factory */}
                      <path d="M200 140 Q198 120 205 100 Q200 85 207 70" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.45"/>
                      <path d="M225 140 Q228 118 220 98 Q226 83 218 65" stroke="#fff" strokeWidth="2" fill="none" opacity="0.35"/>
                      <rect x="185" y="140" width="60" height="20" rx="3" fill="#fff" opacity="0.3"/>
                    </>
                  )}
                </svg>
                {/* Question label overlay */}
                <div style={{
                  position: "relative", zIndex: 1,
                  textAlign: "center",
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 3,
                    color: "rgba(255,255,255,0.85)",
                    background: "rgba(0,0,0,0.25)",
                    padding: "4px 14px",
                    borderRadius: 20,
                    display: "inline-block",
                  }}>
                    {[
                      "POLLUTION RISK",
                      "SMOKING RISK",
                      "AIRWAY HEALTH",
                      "BREATHING CAPACITY",
                      "OCCUPATIONAL RISK",
                    ][qIdx] ?? "LUNG HEALTH"}
                  </span>
                </div>
              </div>

              {/* Fact panel */}
              <div style={{
                padding: "16px 20px",
                background: "#fff",
              }}>
                <p style={{ fontSize: 13, color: "#5C5647", lineHeight: 1.65, margin: 0 }}>
                  {[
                    "Living in a high-pollution city is the number one non-smoking cause of lung damage in India. Your body doesn't warn you — it just quietly absorbs.",
                    "Nicotine clears your system within days. Tar and particle deposits from smoking take 7–10 years to clear without targeted herbal help.",
                    "That morning cough means your lungs spent the night fighting inflammation they couldn't fully resolve. It's not a quirk — it's a signal.",
                    "Breathlessness on mild exertion is measurable. It means your oxygen transfer capacity has dropped — and that is reversible.",
                    "Occupational lung exposure is the most underdiagnosed cause of respiratory decline in India. Most people chalk it up to 'getting older.'",
                  ][qIdx] ?? "Every answer you give is building your personalised lung health report."}
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
