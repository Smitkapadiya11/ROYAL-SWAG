"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LeadGuardLink } from "@/components/LeadGuardLink";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { LUNG_TEST_QUESTION_COUNT } from "@/lib/lung-test-constants";

const RISK = {
  mild: {
    label: "Mild Risk",
    color: "#C49A2A",
    bg: "rgba(196,154,42,0.07)",
    border: "rgba(196,154,42,0.35)",
    pct: 35,
    headline: "Your lungs are coping — but pollution is accumulating silently.",
    detail:
      "You're in the early stage. Daily urban exposure adds up. Starting a gentle detox now prevents serious damage in 3–5 years.",
    herbs: ["Tulsi", "Pippali"],
    herbWhy:
      "Tulsi for daily anti-inflammatory protection. Pippali to keep oxygen absorption strong.",
    timeline: "Most mild-risk users feel measurably lighter within 7–10 days.",
  },
  moderate: {
    label: "Moderate Risk",
    color: "#B85C00",
    bg: "rgba(184,92,0,0.07)",
    border: "rgba(184,92,0,0.35)",
    pct: 65,
    headline: "Active airway inflammation detected in your profile.",
    detail:
      "Your lungs are signalling stress — chronic mucus, mild breathlessness, recurring cough. The right herbs can clear this in 2–3 weeks.",
    herbs: ["Vasaka", "Mulethi", "Tulsi"],
    herbWhy:
      "Vasaka breaks down mucus. Mulethi soothes inflamed airways. Tulsi stops further inflammation.",
    timeline: "Moderate-risk users typically report a clear morning cough by Day 14.",
  },
  high: {
    label: "High Risk",
    color: "#A02020",
    bg: "rgba(160,32,32,0.07)",
    border: "rgba(160,32,32,0.3)",
    pct: 90,
    headline: "Your lungs need immediate, targeted intervention.",
    detail:
      "Multiple high-risk markers. This is where ex-smokers and chronic-exposure profiles sit. Royal Swag's full 7-herb formula was specifically built for this.",
    herbs: ["Vasaka", "Mulethi", "Tulsi", "Pippali", "Kantakari"],
    herbWhy:
      "All 5 work together: dissolve tar, clear airways, restart oxygen flow, kill chronic inflammation, prevent infection.",
    timeline: "High-risk users typically need a full 30-day cycle. Most report breathing changes by Week 2.",
  },
} as const;

type RiskKey = keyof typeof RISK;

function RiskMeter({ scorePercentage }: { scorePercentage: number }) {
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setAnimatedPct(scorePercentage), 80);
    return () => window.clearTimeout(t);
  }, [scorePercentage]);

  const zone: "mild" | "moderate" | "high" =
    scorePercentage <= 34 ? "mild" : scorePercentage <= 67 ? "moderate" : "high";

  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ marginBottom: 10 }}>
        <h2 style={{ fontFamily: "var(--ff-head)", fontSize: 32, color: "#1A1A14" }}>
          Risk Meter
        </h2>
      </div>
      <div
        style={{
          position: "relative",
          height: 18,
          borderRadius: 999,
          border: "1px solid rgba(212,200,168,0.6)",
          background:
            "linear-gradient(90deg, rgba(74,100,34,0.9) 0%, rgba(196,154,42,0.92) 36%, rgba(224,126,41,0.96) 66%, rgba(160,32,32,0.97) 100%)",
          overflow: "visible",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(26,26,20,0.12)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `clamp(0px, calc(${animatedPct}% - 9px), calc(100% - 18px))`,
            top: "50%",
            transform: "translateY(-50%)",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            border: "2px solid #1A1A14",
            boxShadow: "0 0 0 3px rgba(255,255,255,0.25), 0 0 16px rgba(255,255,255,0.45)",
            transition: "left 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          alignItems: "center",
        }}
      >
        <p
          style={{
            textAlign: "left",
            fontSize: 12,
            letterSpacing: 1.2,
            color: zone === "mild" ? "#4A6422" : "rgba(74,100,34,0.6)",
            fontWeight: zone === "mild" ? 700 : 500,
          }}
        >
          MILD
        </p>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            letterSpacing: 1.2,
            color: zone === "moderate" ? "#B85C00" : "rgba(184,92,0,0.62)",
            fontWeight: zone === "moderate" ? 700 : 500,
          }}
        >
          MODERATE
        </p>
        <p
          style={{
            textAlign: "right",
            fontSize: 12,
            letterSpacing: 1.2,
            color: zone === "high" ? "#A02020" : "rgba(160,32,32,0.62)",
            fontWeight: zone === "high" ? 700 : 500,
          }}
        >
          HIGH RISK
        </p>
      </div>
    </div>
  );
}

// Image paths — update to exact filenames if/when specific risk-level photos are added
const LUNG_PHOTOS: Record<"mild" | "moderate" | "high", string> = {
  mild:     "/images/lung-after.jpg",
  moderate: "/images/lung-before.jpg",
  high:     "/images/lung-before.jpg",
};

function Result() {
  const params = useSearchParams();
  const router = useRouter();
  const scoreStr = params?.get("score") ?? null;
  const name = decodeURIComponent(params?.get("name") ?? "there");
  const [photoError, setPhotoError] = useState(false);

  const scoreParsed = scoreStr !== null ? Number.parseInt(scoreStr, 10) : Number.NaN;
  const scoreValid = scoreStr !== null && !Number.isNaN(scoreParsed);
  const maxScore = LUNG_TEST_QUESTION_COUNT;
  const clampedScore = useMemo(() => {
    if (!scoreValid) return 0;
    return Math.min(Math.max(scoreParsed, 0), maxScore);
  }, [scoreParsed, scoreValid, maxScore]);
  const scorePercentage = useMemo(
    () => Math.round((clampedScore / maxScore) * 100),
    [clampedScore, maxScore]
  );
  const level: RiskKey =
    scorePercentage <= 34 ? "mild" : scorePercentage <= 67 ? "moderate" : "high";
  const R = RISK[level];

  useEffect(() => {
    if (!scoreValid) router.replace("/lung-test");
  }, [scoreValid, router]);

  if (!scoreValid) {
    return null;
  }

  return (
    <>
      {/* ── HEADER ── */}
      <section style={{
        background: "#2D3D15", color: "#F2E6CE",
        padding: "100px 24px 64px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 3,
            color: "rgba(196,154,42,0.85)", marginBottom: 14,
          }}>YOUR LUNG HEALTH REPORT</p>
          <h1 style={{
            fontFamily: "var(--ff-head)",
            fontSize: "clamp(30px, 5vw, 52px)",
            color: "#F2E6CE", marginBottom: 12, lineHeight: 1.15,
          }}>
            Hi {name.split(" ")[0]},<br />
            <em style={{ color: "#C49A2A" }}>here is what we found.</em>
          </h1>
          <p style={{ opacity: 0.65, fontSize: 14 }}>
            Based on {maxScore} clinical questions
          </p>
        </div>
      </section>

      {/* ── BODY ── */}
      <section style={{ background: "#F2E6CE", padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* RISK CARD */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            border: `2px solid ${R.color}`,
            padding: "40px 36px 36px",
            marginBottom: 28,
          }}>
            {/* Top row */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 24, gap: 12, flexWrap: "wrap",
            }}>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 2,
                background: R.bg, color: R.color,
                padding: "6px 14px", borderRadius: 20,
                border: `1px solid ${R.border}`,
              }}>YOUR ASSESSMENT</span>
              <button
                onClick={() => router.push("/lung-test")}
                style={{
                  background: "transparent", border: "1px solid #D4C8A8",
                  color: "#5C5647", padding: "6px 14px",
                  borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
                }}
              >↻ Retake test</button>
            </div>

            {/* Conditional lung photo */}
            {!photoError ? (
              <div style={{
                position: "relative", width: "100%", height: 220,
                borderRadius: 10, overflow: "hidden",
                marginBottom: 28, background: R.bg,
              }}>
                <Image
                  src={LUNG_PHOTOS[level]}
                  alt={`${R.label} lung profile`}
                  fill
                  sizes="(max-width: 768px) 100vw, 760px"
                  style={{
                    objectFit: "cover", objectPosition: "center",
                    filter:
                      level === "high"     ? "sepia(15%) saturate(0.85)" :
                      level === "moderate" ? "sepia(8%)" :
                      "none",
                  }}
                  onError={() => setPhotoError(true)}
                />
                <div style={{
                  position: "absolute", bottom: 14, left: 14,
                  background: `${R.color}DD`, color: "#fff",
                  padding: "5px 14px", borderRadius: 20,
                  fontSize: 10, fontWeight: 700, letterSpacing: 2,
                }}>
                  {R.label.toUpperCase()} — YOUR PROFILE
                </div>
              </div>
            ) : (
              <div style={{
                height: 100, background: R.bg,
                borderRadius: 10, marginBottom: 28,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "var(--ff-head)", fontSize: 48, color: R.color }}>
                  {level === "high" ? "⚠" : level === "moderate" ? "◉" : "✓"}
                </span>
              </div>
            )}

            <RiskMeter scorePercentage={scorePercentage} />

            <h3 style={{
              fontFamily: "var(--ff-head)",
              fontSize: 20, color: "#1A1A14",
              marginBottom: 12, lineHeight: 1.4,
            }}>{R.headline}</h3>
            <p style={{
              fontSize: 15, color: "#5C5647",
              lineHeight: 1.75,
            }}>{R.detail}</p>
          </div>

          {/* HERBS */}
          <div style={{
            background: "#fff",
            borderRadius: 16, border: "1px solid #D4C8A8",
            padding: "32px 28px", marginBottom: 28,
          }}>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 2,
              color: "#C49A2A", marginBottom: 8,
            }}>RECOMMENDED HERBS FOR YOUR PROFILE</p>
            <h3 style={{
              fontFamily: "var(--ff-head)", fontSize: 22,
              color: "#1A1A14", marginBottom: 20,
            }}>{R.herbs.length} herbs you need most</h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
              {R.herbs.map(h => (
                <span key={h} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#F2E6CE", border: "1px solid #4A6422",
                  borderRadius: 24, padding: "8px 16px",
                  fontSize: 14, fontWeight: 600, color: "#2D3D15",
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#4A6422", display: "inline-block",
                  }} />
                  {h}
                </span>
              ))}
            </div>

            <p style={{
              fontSize: 14, color: "#5C5647",
              lineHeight: 1.75, marginBottom: 16,
              padding: "16px 18px", background: "#F2E6CE",
              borderRadius: 8, borderLeft: "3px solid #4A6422",
            }}>
              <strong style={{ color: "#2D3D15" }}>Why these herbs: </strong>
              {R.herbWhy}
            </p>

            <p style={{ fontSize: 13, color: "#5C5647", fontStyle: "italic" }}>
              ⏱ {R.timeline}
            </p>
          </div>

          {/* CTA */}
          <div style={{
            background: "#4A6422", borderRadius: 16,
            padding: "40px 32px", textAlign: "center", color: "#F2E6CE",
          }}>
            <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 8, lineHeight: 1.65 }}>
              BASED ON YOUR PROFILE, WE RECOMMEND
            </p>
            <h3 style={{
              fontFamily: "var(--ff-head)", fontSize: 26,
              color: "#F2E6CE", marginBottom: 4,
            }}>Royal Swag Lung Detox Tea</h3>
            <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 24, lineHeight: 1.65 }}>
              7 Ayurvedic herbs · 20 bags · 30-day supply
            </p>
            <LeadGuardLink href="/product" style={{
              display: "inline-block",
              background: "#C49A2A", color: "#2D3D15",
              padding: "16px 36px", borderRadius: 8,
              fontWeight: 700, fontSize: 16, textDecoration: "none",
              marginBottom: 16,
            }}>Start My Lung Detox — ₹349 →</LeadGuardLink>
            <p style={{ fontSize: 12, opacity: 0.6 }}>
              Free delivery · 30-day money back · Ships within 24 hours
            </p>
          </div>

          {/* Secondary actions */}
          <div style={{
            display: "flex", gap: 12, marginTop: 20,
            justifyContent: "center", flexWrap: "wrap",
          }}>
            <button
              onClick={() => router.push("/lung-test")}
              style={{
                background: "transparent", border: "1px solid #D4C8A8",
                color: "#5C5647", padding: "10px 22px",
                borderRadius: 6, fontSize: 13, cursor: "pointer",
              }}
            >↻ Retake the test</button>
            <Link href="/" style={{
              background: "transparent", border: "1px solid #D4C8A8",
              color: "#5C5647", padding: "10px 22px",
              borderRadius: 6, fontSize: 13, textDecoration: "none",
            }}>← Back to home</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100svh",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <p style={{ color: "#5C5647", fontSize: 15 }}>Loading your report…</p>
      </div>
    }>
      <Result />
    </Suspense>
  );
}
