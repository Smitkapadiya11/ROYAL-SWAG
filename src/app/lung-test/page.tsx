"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LUNG_TEST_QUESTION_COUNT } from "@/lib/lung-test-constants";

type SketchKind = "city" | "smoke" | "cough" | "breath" | "work" | "sleep" | "exercise" | "diet";

const QUESTIONS: {
  q: string;
  hint: string;
  topic: string;
  sketch: SketchKind;
}[] = [
  {
    q: "Do you live in a city with visible air pollution?",
    hint: "Delhi, Mumbai, Surat, Pune, Bengaluru — or anywhere with hazy air",
    topic: "POLLUTION EXPOSURE",
    sketch: "city",
  },
  {
    q: "Do you currently smoke, vape, or have you in the last 5 years?",
    hint: "Any form — cigarettes, bidis, hookah, or e-cigarettes",
    topic: "SMOKING HISTORY",
    sketch: "smoke",
  },
  {
    q: "Do you experience a morning cough or need to clear your throat daily?",
    hint: "More than 3 days a week on average",
    topic: "AIRWAY SYMPTOMS",
    sketch: "cough",
  },
  {
    q: "Do you feel breathless or winded climbing stairs or walking briskly?",
    hint: "Even a single flight feels heavier than it used to",
    topic: "BREATHING CAPACITY",
    sketch: "breath",
  },
  {
    q: "Do you work near dust, chemicals, vehicle exhaust, or construction?",
    hint: "Factory, workshop, roadside, or heavy-traffic commute daily",
    topic: "OCCUPATIONAL RISK",
    sketch: "work",
  },
  {
    q: "Do you wake up with chest tightness or difficulty breathing?",
    hint: "A feeling of weight on the chest, especially in the first hour of waking",
    topic: "SLEEP & RECOVERY",
    sketch: "sleep",
  },
  {
    q: "Has your exercise stamina noticeably declined in the last year?",
    hint: "Activities that used to feel easy now leave you more tired",
    topic: "PHYSICAL ENDURANCE",
    sketch: "exercise",
  },
  {
    q: "Do you consume fried foods or smoke-exposed food more than 4 days a week?",
    hint: "Street food, tandoor, barbeque, or heavy oil cooking",
    topic: "DIETARY EXPOSURE",
    sketch: "diet",
  },
];

const MAX_SCORE = LUNG_TEST_QUESTION_COUNT;

function SketchVisual({ type }: { type: typeof QUESTIONS[number]["sketch"] }) {
  const STROKE = "#2D3D15";
  const THIN = 1.2;
  const MED = 1.8;

  const visuals: Record<typeof QUESTIONS[number]["sketch"], React.ReactNode> = {
    city: (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 120, opacity: 0.55 }}>
        <rect x="8" y="30" width="18" height="44" stroke={STROKE} strokeWidth={THIN} />
        <rect x="30" y="18" width="22" height="56" stroke={STROKE} strokeWidth={THIN} />
        <rect x="56" y="28" width="16" height="46" stroke={STROKE} strokeWidth={THIN} />
        <rect x="76" y="12" width="28" height="62" stroke={STROKE} strokeWidth={MED} />
        <path d="M10 22 Q30 14 60 20 Q90 10 112 18" stroke={STROKE} strokeWidth={THIN} opacity="0.4" />
        <path d="M5 28  Q35 20 70 26 Q95 18 115 24" stroke={STROKE} strokeWidth={THIN} opacity="0.25" />
        <line x1="4" y1="74" x2="116" y2="74" stroke={STROKE} strokeWidth={THIN} />
      </svg>
    ),
    smoke: (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 120, opacity: 0.55 }}>
        <rect x="30" y="48" width="52" height="8" rx="2" stroke={STROKE} strokeWidth={MED} />
        <rect x="74" y="47" width="12" height="10" rx="1" stroke={STROKE} strokeWidth={THIN} />
        <path d="M42 46 Q38 38 42 30 Q46 22 42 14" stroke={STROKE} strokeWidth={THIN} strokeLinecap="round" />
        <path d="M52 46 Q56 36 52 26 Q48 18 54 10" stroke={STROKE} strokeWidth={THIN} strokeLinecap="round" opacity="0.7" />
      </svg>
    ),
    cough: (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 120, opacity: 0.55 }}>
        <circle cx="60" cy="22" r="14" stroke={STROKE} strokeWidth={MED} />
        <path d="M52 35 Q48 50 46 70" stroke={STROKE} strokeWidth={MED} strokeLinecap="round" />
        <path d="M68 35 Q72 50 74 70" stroke={STROKE} strokeWidth={MED} strokeLinecap="round" />
        <path d="M52 48 Q44 44 38 40 Q34 38 32 36" stroke={STROKE} strokeWidth={MED} strokeLinecap="round" />
      </svg>
    ),
    breath: (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 120, opacity: 0.55 }}>
        <path d="M60 14 Q52 10 44 18 Q36 26 36 40 Q36 56 44 64 Q52 70 60 66" stroke={STROKE} strokeWidth={MED} strokeLinecap="round" />
        <path d="M60 14 Q68 10 76 18 Q84 26 84 40 Q84 56 76 64 Q68 70 60 66" stroke={STROKE} strokeWidth={MED} strokeLinecap="round" />
        <line x1="60" y1="8" x2="60" y2="18" stroke={STROKE} strokeWidth={MED} strokeLinecap="round" />
      </svg>
    ),
    work: (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 120, opacity: 0.55 }}>
        <rect x="8" y="32" width="48" height="42" stroke={STROKE} strokeWidth={MED} />
        <rect x="16" y="16" width="8" height="18" stroke={STROKE} strokeWidth={THIN} />
        <rect x="32" y="22" width="8" height="12" stroke={STROKE} strokeWidth={THIN} />
        <circle cx="86" cy="28" r="8" stroke={STROKE} strokeWidth={MED} />
      </svg>
    ),
    sleep: (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 120, opacity: 0.55 }}>
        <rect x="8" y="50" width="104" height="22" rx="3" stroke={STROKE} strokeWidth={MED} />
        <rect x="8" y="36" width="12" height="36" rx="2" stroke={STROKE} strokeWidth={MED} />
        <circle cx="34" cy="44" r="7" stroke={STROKE} strokeWidth={MED} />
      </svg>
    ),
    exercise: (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 120, opacity: 0.55 }}>
        <circle cx="72" cy="18" r="8" stroke={STROKE} strokeWidth={MED} />
        <path d="M72 26 Q68 36 64 44" stroke={STROKE} strokeWidth={MED} strokeLinecap="round" />
        <path d="M66 44 Q60 54 54 62" stroke={STROKE} strokeWidth={MED} strokeLinecap="round" />
      </svg>
    ),
    diet: (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 120, opacity: 0.55 }}>
        <path d="M28 50 Q32 60 60 60 Q88 60 92 50" stroke={STROKE} strokeWidth={MED} strokeLinecap="round" />
        <line x1="28" y1="50" x2="92" y2="50" stroke={STROKE} strokeWidth={MED} />
        <path d="M48 50 Q44 40 48 34 Q52 28 50 22 Q56 30 54 36 Q58 28 62 26 Q60 34 64 38 Q68 44 64 50" stroke={STROKE} strokeWidth={THIN} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 0 8px", opacity: 0.8, filter: "grayscale(30%) contrast(1.1)" }}>
      {visuals[type]}
    </div>
  );
}

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
        const score = next.filter(Boolean).length;
        if (typeof window !== "undefined") {
          sessionStorage.setItem("rs_user", JSON.stringify({ name, email, phone }));
        }
        router.push(`/lung-test/result?score=${score}&name=${encodeURIComponent(name)}`);
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
            <h2 style={{
              fontFamily: "var(--ff-head, Georgia, serif)",
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 600,
              color: "#1A1A14",
              marginBottom: 8,
              lineHeight: 1.3,
            }}>{QUESTIONS[qIdx].q}</h2>
            <p style={{
              fontSize: 13,
              color: "#5C5647",
              fontStyle: "italic",
              marginBottom: 24,
              lineHeight: 1.6,
            }}>{QUESTIONS[qIdx].hint}</p>

            <div style={{
              background: "#fff",
              border: "1px solid #D4C8A8",
              borderRadius: 10,
              marginBottom: 28,
              overflow: "hidden",
            }}>
              <SketchVisual type={QUESTIONS[qIdx].sketch} />
              <p style={{
                textAlign: "center",
                fontSize: 10,
                color: "#5C5647",
                opacity: 0.55,
                paddingBottom: 12,
                letterSpacing: "1px",
              }}>
                {QUESTIONS[qIdx].topic}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button
                onClick={() => choose(true)}
                style={{
                  padding: "18px", background: "#4A6422",
                  color: "#F2E6CE", border: "none",
                  borderRadius: 8, fontSize: 17, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "var(--ff-body, sans-serif)",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#2D3D15")}
                onMouseLeave={e => (e.currentTarget.style.background = "#4A6422")}
              >Yes</button>
              <button
                onClick={() => choose(false)}
                style={{
                  padding: "18px", background: "transparent",
                  color: "#4A6422", border: "1.5px solid #4A6422",
                  borderRadius: 8, fontSize: 17, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "var(--ff-body, sans-serif)",
                  letterSpacing: "0.3px",
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

            {qIdx > 0 && (
              <button
                onClick={() => setQIdx(qIdx - 1)}
                style={{
                  marginTop: 24, background: "none", border: "none",
                  color: "#5C5647", fontSize: 13, cursor: "pointer", padding: 0,
                  fontFamily: "var(--ff-body, sans-serif)",
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
