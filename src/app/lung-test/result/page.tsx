"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { S } from "@/lib/config";

const RISK = {
  mild: {
    label: "Mild Risk", color: "#C49A2A", bg: "rgba(196,154,42,0.06)",
    headline: "Your lungs are coping — but daily pollution is accumulating.",
    detail: "Starting a detox routine now prevents serious damage later. Prevention is easier than cure.",
    herbs: ["Tulsi", "Pippali"],
  },
  moderate: {
    label: "Moderate Risk", color: "#B85C00", bg: "rgba(184,92,0,0.06)",
    headline: "Active airway inflammation detected in your profile.",
    detail: "The right herbs can clear this in 2–3 weeks of consistent daily use. Don't wait.",
    herbs: ["Vasaka", "Mulethi", "Tulsi"],
  },
  high: {
    label: "High Risk", color: "#A02020", bg: "rgba(160,32,32,0.06)",
    headline: "Your lungs need immediate, targeted attention.",
    detail: "This formula was built specifically for profiles like yours — ex-smokers and those with chronic pollution exposure.",
    herbs: ["Vasaka", "Mulethi", "Tulsi", "Pippali", "Kantakari"],
  },
} as const;

type RiskLevel = keyof typeof RISK;

function Result() {
  const p = useSearchParams();
  const scoreRaw = p?.get("score") ?? null;
  const name = decodeURIComponent(p?.get("name") ?? "there");

  if (!scoreRaw && typeof window !== "undefined") {
    window.location.href = "/lung-test";
    return null;
  }

  const score = parseInt(scoreRaw ?? "0");
  const level: RiskLevel = score <= 1 ? "mild" : score <= 3 ? "moderate" : "high";
  const R = RISK[level];

  return (
    <>
      {/* Header */}
      <section style={{
        background: "var(--deep)", color: "var(--cream)",
        padding: "clamp(80px,8vw,120px) var(--px) 64px",
        textAlign: "center",
      }}>
        <div className="wrap">
          <span className="eyebrow" style={{ color: "rgba(196,154,42,0.7)" }}>
            Lung Health Report
          </span>
          <h1 style={{ color: "var(--cream)", marginBottom: 8 }}>
            Hi {name},<br />
            <em style={{ color: "var(--gold)" }}>your report is ready.</em>
          </h1>
        </div>
      </section>

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="wrap" style={{ maxWidth: 640, margin: "0 auto" }}>
          {/* Risk badge */}
          <div style={{
            background: R.bg,
            border: `2px solid ${R.color}`,
            borderRadius: "var(--r)",
            padding: "36px 32px",
            textAlign: "center",
            marginBottom: 32,
          }}>
            <div style={{
              fontFamily: "var(--ff-head)", fontSize: 28,
              fontWeight: 600, color: R.color, marginBottom: 12,
            }}>
              {R.label}
            </div>
            <h3 style={{ fontSize: 17, color: "var(--dark)", marginBottom: 10 }}>
              {R.headline}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--muted)" }}>
              {R.detail}
            </p>
          </div>

          {/* Relevant herbs */}
          <div style={{ marginBottom: 32 }}>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 2,
              color: "var(--muted)", marginBottom: 14,
            }}>
              HERBS IN ROYAL SWAG THAT HELP YOUR PROFILE
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {R.herbs.map(h => {
                const herb = S.herbs.find(x => x.name === h);
                return (
                  <div key={h} style={{
                    background: "var(--white)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-sm)",
                    padding: "8px 16px",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: "var(--olive)", flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>{h}</span>
                    {herb && (
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>
                        — {herb.benefit.split(",")[0]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA card */}
          <div style={{
            background: "var(--olive)",
            borderRadius: "var(--r)",
            padding: "36px 32px",
            textAlign: "center",
          }}>
            <p style={{ color: "rgba(242,230,206,0.65)", fontSize: 13, marginBottom: 6 }}>
              Based on your lung health profile, we recommend:
            </p>
            <h3 style={{
              color: "var(--cream)", fontSize: 20,
              marginBottom: 24, lineHeight: 1.3,
            }}>
              Royal Swag Lung Detox Tea<br />
              <span style={{ color: "var(--gold)" }}>7 Herbs · 20 Bags · {S.price.now}</span>
            </h3>
            <Link href="/product" className="btn btn-gold"
              style={{ width: "100%", justifyContent: "center", padding: 16, fontSize: 16 }}>
              Start Your Lung Detox — {S.price.now} →
            </Link>
            <p style={{ color: "rgba(242,230,206,0.45)", fontSize: 12, marginTop: 12 }}>
              Free delivery · 30-Day Money Back · Ships in 24 hrs
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
      <div style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Loading your results…</p>
      </div>
    }>
      <Result />
    </Suspense>
  );
}
