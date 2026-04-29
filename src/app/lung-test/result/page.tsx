"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useState } from "react";

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

// Image paths — update to exact filenames if/when specific risk-level photos are added
const LUNG_PHOTOS: Record<"mild" | "moderate" | "high", string> = {
  mild:     "/images/lungs-after.png",     // healthy lungs — best match for mild risk
  moderate: "/images/lungs-before.png",    // polluted lungs — best match for moderate/high
  high:     "/images/lungs-before.png",
};

function Result() {
  const params = useSearchParams();
  const router = useRouter();
  const scoreStr = params?.get("score");
  const name = decodeURIComponent(params?.get("name") ?? "there");
  const [photoError, setPhotoError] = useState(false);

  if (!scoreStr && typeof window !== "undefined") {
    window.location.href = "/lung-test";
    return null;
  }

  const score = parseInt(scoreStr ?? "0");
  const level: RiskKey = score <= 1 ? "mild" : score <= 3 ? "moderate" : "high";
  const R = RISK[level];

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
            Based on 5 clinical questions · Score: {score}/5
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

            {/* Risk meter */}
            <div style={{ marginBottom: 28 }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "baseline", marginBottom: 12,
              }}>
                <h2 style={{
                  fontFamily: "var(--ff-head)",
                  fontSize: 32, fontWeight: 700,
                  color: R.color, lineHeight: 1,
                }}>{R.label}</h2>
                <span style={{ fontSize: 13, color: "#5C5647", fontWeight: 500 }}>
                  Score: {score}/5
                </span>
              </div>
              <div style={{
                height: 8, background: "#F2E6CE",
                borderRadius: 4, overflow: "hidden", marginBottom: 8,
              }}>
                <div style={{
                  height: "100%", background: R.color,
                  width: `${R.pct}%`, borderRadius: 4,
                  transition: "width 0.6s ease",
                }} />
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 11, color: "#5C5647", opacity: 0.6,
              }}>
                <span>Mild</span><span>Moderate</span><span>High</span>
              </div>
            </div>

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
            <p style={{ fontSize: 12, opacity: 0.7, letterSpacing: 2, marginBottom: 8 }}>
              BASED ON YOUR PROFILE, WE RECOMMEND
            </p>
            <h3 style={{
              fontFamily: "var(--ff-head)", fontSize: 26,
              color: "#F2E6CE", marginBottom: 4,
            }}>Royal Swag Lung Detox Tea</h3>
            <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 24 }}>
              7 Ayurvedic herbs · 20 bags · 30-day supply
            </p>
            <Link href="/product" style={{
              display: "inline-block",
              background: "#C49A2A", color: "#2D3D15",
              padding: "16px 36px", borderRadius: 8,
              fontWeight: 700, fontSize: 16, textDecoration: "none",
              marginBottom: 16,
            }}>Start My Lung Detox — ₹349 →</Link>
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
