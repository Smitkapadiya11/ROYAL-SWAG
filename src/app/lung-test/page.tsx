"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { LUNG_TEST_QUESTION_COUNT } from "@/lib/lung-test-constants";
import { computeLungTestScore } from "@/lib/lung-test-scoring";

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
const TOTAL_STEPS = 4 + MAX_SCORE;

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0D2010 0%, #1A3A1A 60%, #2D3D15 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "24px 20px 48px",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 24,
  padding: "clamp(32px,5vw,56px)",
  backdropFilter: "blur(20px)",
  maxWidth: 560,
  width: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
};

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1.5px solid rgba(255,255,255,0.15)",
  borderRadius: 14,
  padding: "16px 20px",
  color: "#FAF6EE",
  fontSize: 15,
  fontFamily: "var(--font-sans)",
  width: "100%",
  outline: "none",
  marginBottom: 20,
  boxSizing: "border-box",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(24px,3.5vw,38px)",
  color: "#FAF6EE",
  lineHeight: 1.25,
  marginBottom: 32,
};

type Step = "name" | "email" | "phone" | "quiz";

function answerBtn(selected: boolean, isYes: boolean): React.CSSProperties {
  return {
    width: "100%",
    minHeight: 48,
    padding: "16px 24px",
    borderRadius: 16,
    border: `1.5px solid ${selected ? "#2D6A2D" : "rgba(255,255,255,0.12)"}`,
    background: selected ? "rgba(45,106,45,0.2)" : "rgba(255,255,255,0.06)",
    color: selected ? "#7FB085" : "#FAF6EE",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    fontFamily: "var(--font-sans)",
  };
}

export default function LungTestPage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qIdx, setQIdx] = useState(0);
  const [ans, setAns] = useState<(boolean | null)[]>(Array(MAX_SCORE).fill(null));
  const [hoverYes, setHoverYes] = useState(false);
  const [hoverNo, setHoverNo] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPhone = phone.replace(/\D/g, "").length >= 10;

  const currentStep =
    step === "name" ? 1 : step === "email" ? 2 : step === "phone" ? 3 : 4 + qIdx;
  const progress = (currentStep / TOTAL_STEPS) * 100;

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.from(cardRef.current, { opacity: 0, y: 30, duration: 0.5, ease: "power3.out" });
  }, [step, qIdx]);

  const goNext = () => {
    if (step === "name" && name.trim().length >= 2) setStep("email");
    else if (step === "email" && validEmail) setStep("phone");
    else if (step === "phone" && validPhone) setStep("quiz");
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
          const bools = next.map((a) => a === true);
          const score = computeLungTestScore(bools);
          const riskLevel = score <= 4 ? "MILD" : score <= 10 ? "MODERATE" : "HIGH";
          fetch("/api/lung-test/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              phone,
              answers: bools,
              score,
              riskLevel,
            }),
          }).catch(console.error);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("rs_user", JSON.stringify({ name, email, phone }));
            localStorage.setItem(
              "lungTestResult",
              JSON.stringify({
                name,
                email,
                phone,
                score,
                maxScore: 20,
                answers: {
                  q1: bools[0],
                  q2: bools[1],
                  q3: bools[2],
                  q4: bools[3],
                  q5: bools[4],
                  q6: bools[5],
                  q7: bools[6],
                  q8: bools[7],
                },
                timestamp: Date.now(),
              })
            );
          }
          router.push(`/lung-test/result?score=${score}&name=${encodeURIComponent(name)}`);
        })();
      }
    }, 220);
  };

  return (
    <section style={pageBg}>
      <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
        <Image
          src="/images/new_logo.png"
          alt="Royal Swag"
          width={80}
          height={80}
          style={{ objectFit: "contain", margin: "0 auto", width: 80, height: "auto" }}
          priority
        />
      </div>

      <div style={{ width: "100%", maxWidth: 560, margin: "0 auto" }}>
        <div
          style={{
            height: 4,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #C49A2A, #E8C84A)",
              borderRadius: 2,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            letterSpacing: "0.15em",
            color: "rgba(250,246,238,0.5)",
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          STEP {currentStep} OF {TOTAL_STEPS}
        </p>

        <div ref={cardRef} style={cardStyle}>
          {step === "name" && (
            <>
              <h2 style={headingStyle}>
                First, what should we
                <br />
                <em style={{ color: "#E8C84A", fontStyle: "italic" }}>call you?</em>
              </h2>
              <p style={{ color: "rgba(250,246,238,0.65)", marginBottom: 24, fontSize: 15 }}>
                Your personalised lung report needs a name on top.
              </p>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goNext()}
                placeholder="e.g. Rahul Sharma"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={goNext}
                disabled={name.trim().length < 2}
                className="btn-gold"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: 18,
                  fontSize: 16,
                  marginTop: 24,
                  borderRadius: 16,
                  border: "none",
                  cursor: name.trim().length >= 2 ? "pointer" : "not-allowed",
                  opacity: name.trim().length >= 2 ? 1 : 0.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Continue →
              </button>
            </>
          )}

          {step === "email" && (
            <>
              <h2 style={headingStyle}>
                Hi {name.split(" ")[0]},
                <br />
                <em style={{ color: "#E8C84A", fontStyle: "italic" }}>your email?</em>
              </h2>
              <p style={{ color: "rgba(250,246,238,0.65)", marginBottom: 24, fontSize: 15 }}>
                We&apos;ll send your detailed report and lung-care tips here.
              </p>
              <input
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goNext()}
                placeholder="Eximburg@gmail.com"
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep("name")}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 16,
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    background: "transparent",
                    color: "#FAF6EE",
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!validEmail}
                  className="btn-gold"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: 18,
                    fontSize: 16,
                    borderRadius: 16,
                    border: "none",
                    opacity: validEmail ? 1 : 0.5,
                    cursor: validEmail ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {step === "phone" && (
            <>
              <h2 style={headingStyle}>
                Last bit —
                <br />
                <em style={{ color: "#E8C84A", fontStyle: "italic" }}>your phone.</em>
              </h2>
              <p style={{ color: "rgba(250,246,238,0.65)", marginBottom: 24, fontSize: 15 }}>
                For order updates and free Ayurvedic consultation, if needed.
              </p>
              <input
                autoFocus
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goNext()}
                placeholder="+91 98765 43210"
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 16,
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    background: "transparent",
                    color: "#FAF6EE",
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!validPhone}
                  className="btn-gold"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: 18,
                    fontSize: 16,
                    borderRadius: 16,
                    border: "none",
                    opacity: validPhone ? 1 : 0.5,
                    cursor: validPhone ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Start the Test →
                </button>
              </div>
            </>
          )}

          {step === "quiz" && (
            <>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: "rgba(250,246,238,0.45)",
                  marginBottom: 16,
                  textTransform: "uppercase",
                }}
              >
                {QUESTIONS[qIdx].topic}
              </p>
              <h2 style={{ ...headingStyle, marginBottom: 12 }}>{QUESTIONS[qIdx].q}</h2>
              <p
                style={{
                  color: "rgba(250,246,238,0.55)",
                  fontSize: 14,
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                {QUESTIONS[qIdx].hint}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => choose(true)}
                  onMouseEnter={() => setHoverYes(true)}
                  onMouseLeave={() => setHoverYes(false)}
                  style={{
                    ...answerBtn(ans[qIdx] === true, true),
                    ...(hoverYes && ans[qIdx] !== true
                      ? { borderColor: "#C49A2A", background: "rgba(196,154,42,0.12)" }
                      : {}),
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => choose(false)}
                  onMouseEnter={() => setHoverNo(true)}
                  onMouseLeave={() => setHoverNo(false)}
                  style={{
                    ...answerBtn(ans[qIdx] === false, false),
                    ...(hoverNo && ans[qIdx] !== false
                      ? { borderColor: "#C49A2A", background: "rgba(196,154,42,0.12)" }
                      : {}),
                  }}
                >
                  No
                </button>
              </div>
              {qIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setQIdx(qIdx - 1)}
                  style={{
                    marginTop: 20,
                    background: "none",
                    border: "none",
                    color: "rgba(250,246,238,0.5)",
                    fontSize: 13,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  ← Previous question
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgba(250,246,238,0.35); }
      `}</style>
    </section>
  );
}
