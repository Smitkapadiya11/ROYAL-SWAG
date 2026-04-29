"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { S } from "@/lib/config";

const RISK = {
  mild: {
    label: "Mild Risk",
    score: "1–2 / 5",
    color: "#C49A2A",
    bg: "rgba(196,154,42,0.08)",
    pct: 30,
    headline: "Your lungs are coping — but daily pollution is accumulating.",
    detail: "Starting a detox routine now prevents serious damage later. Prevention is easier than cure. The right Ayurvedic herbs will keep your lungs functioning at peak capacity.",
    herbs: ["Tulsi", "Pippali"],
    timeline: "Daily defence in 7 days",
  },
  moderate: {
    label: "Moderate Risk",
    score: "3 / 5",
    color: "#B85C00",
    bg: "rgba(184,92,0,0.08)",
    pct: 62,
    headline: "Active airway inflammation detected in your profile.",
    detail: "Your symptoms indicate active pollution buildup or lung irritation. The right herbs can clear this in 2–3 weeks of consistent daily use. Don't wait for symptoms to worsen.",
    herbs: ["Vasaka", "Mulethi", "Tulsi"],
    timeline: "Visible relief in 14–21 days",
  },
  high: {
    label: "High Risk",
    score: "4–5 / 5",
    color: "#A02020",
    bg: "rgba(160,32,32,0.08)",
    pct: 94,
    headline: "Your lungs need immediate, targeted attention.",
    detail: "This formula was developed specifically for profiles like yours — ex-smokers and those with chronic pollution exposure. Starting today is critical.",
    herbs: ["Vasaka", "Mulethi", "Tulsi", "Pippali", "Kantakari"],
    timeline: "Active repair starts Day 1",
  },
} as const;

type RiskKey = keyof typeof RISK;

function Result() {
  const p = useSearchParams();
  const scoreStr = p?.get("score");
  const name = decodeURIComponent(p?.get("name") ?? "there");

  if (!scoreStr && typeof window !== "undefined") {
    window.location.href = "/lung-test";
    return null;
  }

  const score = parseInt(scoreStr ?? "0");
  const level: RiskKey = score <= 2 ? "mild" : score <= 3 ? "moderate" : "high";
  const R = RISK[level];

  return (
    <>
      {/* Dark header */}
      <section style={{
        background: "#2D3D15", color: "#F2E6CE",
        padding: "100px 20px 80px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <span style={{
            display: "block", fontSize: 11, letterSpacing: 3,
            color: "rgba(196,154,42,0.7)", fontWeight: 600, marginBottom: 12,
          }}>LUNG HEALTH REPORT</span>
          <h1 style={{
            color: "#F2E6CE", fontSize: "clamp(28px,4vw,42px)",
            marginBottom: 8, lineHeight: 1.2,
          }}>
            Hi {name},<br />
            <em style={{ fontStyle: "italic", color: "#C49A2A" }}>your report is ready.</em>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(242,230,206,0.55)", marginTop: 16 }}>
            Based on your {score} of 5 symptom answers
          </p>
        </div>
      </section>

      <section style={{ background: "transparent", padding: "60px 20px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* Score card */}
          <div style={{
            background: R.bg, border: `2px solid ${R.color}`,
            borderRadius: 16, padding: "40px 32px", marginBottom: 24,
          }}>
            {/* Big score number */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                fontFamily: "var(--ff-head)", fontSize: 60,
                fontWeight: 700, color: R.color, lineHeight: 1, marginBottom: 6,
              }}>
                {score}<span style={{ fontSize: 28, opacity: 0.5 }}>/5</span>
              </div>
              <div style={{
                fontSize: 11, letterSpacing: 2, color: "#5C5647", fontWeight: 600,
              }}>YES ANSWERS</div>
            </div>

            {/* Gauge bar */}
            <div style={{
              height: 8, background: "rgba(0,0,0,0.06)",
              borderRadius: 4, overflow: "hidden", marginBottom: 8,
            }}>
              <div style={{
                height: "100%", width: `${R.pct}%`,
                background: R.color, borderRadius: 4,
              }} />
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 10, letterSpacing: 1.5, color: "#5C5647",
              fontWeight: 600, marginBottom: 28,
            }}>
              <span>MILD</span><span>MODERATE</span><span>HIGH</span>
            </div>

            {/* Risk label */}
            <div style={{
              textAlign: "center", padding: "14px 24px",
              background: R.color, borderRadius: 8, marginBottom: 24,
            }}>
              <div style={{
                fontFamily: "var(--ff-head)", fontSize: 22,
                fontWeight: 600, color: "#fff",
              }}>{R.label}</div>
            </div>

            <h3 style={{
              fontSize: 17, color: "#1A1A14", marginBottom: 10,
              textAlign: "center", lineHeight: 1.4,
            }}>{R.headline}</h3>
            <p style={{
              fontSize: 14, lineHeight: 1.75,
              color: "#5C5647", textAlign: "center",
            }}>{R.detail}</p>
          </div>

          {/* Timeline chip */}
          <div style={{
            background: "#fff", border: "1px solid #D4C8A8",
            borderRadius: 12, padding: "18px 24px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
              background: "#F2E6CE",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>⏱</div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "#5C5647", fontWeight: 600, marginBottom: 4 }}>
                EXPECTED TIMELINE
              </div>
              <div style={{ fontSize: 16, color: "#4A6422", fontWeight: 600 }}>
                {R.timeline}
              </div>
            </div>
          </div>

          {/* Recommended herbs */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 17, color: "#1A1A14", marginBottom: 14 }}>
              Herbs your profile needs:
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: 10,
            }}>
              {R.herbs.map(h => {
                const herb = S.herbs.find(x => x.name === h);
                return (
                  <div key={h} style={{
                    background: "#fff", border: "1px solid #D4C8A8",
                    borderRadius: 10, padding: "14px 16px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#4A6422", flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A14" }}>{h}</span>
                    </div>
                    {herb && (
                      <p style={{ fontSize: 12, color: "#5C5647", lineHeight: 1.5, paddingLeft: 16 }}>
                        {herb.benefit}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background: "#4A6422", borderRadius: 16,
            padding: "36px 32px", textAlign: "center",
          }}>
            <p style={{ fontSize: 13, color: "rgba(242,230,206,0.65)", marginBottom: 8 }}>
              Based on your lung health profile, we recommend:
            </p>
            <h3 style={{
              fontFamily: "var(--ff-head)", fontSize: 22,
              color: "#F2E6CE", marginBottom: 6, lineHeight: 1.3,
            }}>
              Royal Swag Lung Detox Tea
            </h3>
            <p style={{ fontSize: 14, color: "#C49A2A", fontWeight: 600, marginBottom: 24 }}>
              7 Herbs · 20 Bags · {S.price.now}
            </p>
            <Link href="/product" style={{
              display: "block",
              background: "#C49A2A", color: "#2D3D15",
              padding: "16px 32px", borderRadius: 8,
              fontWeight: 700, fontSize: 16, textDecoration: "none",
              marginBottom: 12,
            }}>
              Start Your Lung Detox — {S.price.now} →
            </Link>
            <p style={{ fontSize: 12, color: "rgba(242,230,206,0.5)" }}>
              Free delivery · 30-Day Guarantee · Ships in 24 hrs
            </p>
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
        <p style={{ color: "#5C5647", fontSize: 15 }}>Loading your results…</p>
      </div>
    }>
      <Result />
    </Suspense>
  );
}
