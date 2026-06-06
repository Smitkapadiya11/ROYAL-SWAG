"use client";

import type { PlanId, PricingPlan } from "@/lib/product-pricing";

type Props = {
  plans: PricingPlan[];
  value: PlanId;
  onChange: (id: PlanId) => void;
};

export default function PricingSelector({ plans, value, onChange }: Props) {
  const p20 = plans.find((p) => p.id === "20");
  const p60 = plans.find((p) => p.id === "60");
  const upgradeDelta = p20 && p60 ? Math.max(0, p60.priceRupees - p20.priceRupees) : null;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {plans.map((plan) => {
          const selected = value === plan.id;
          const is40 = plan.id === "40";
          const is60 = plan.id === "60";

          return (
            <div key={plan.id} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => onChange(plan.id)}
                style={{
                  position: "relative", width: "100%", textAlign: "left",
                  borderRadius: "var(--r-md)", padding: "20px 16px 16px",
                  border: `2px solid ${selected ? "var(--rs-olive)" : "var(--rs-sand)"}`,
                  background: selected ? "rgba(74,100,34,0.06)" : "var(--rs-white)",
                  cursor: "pointer", fontFamily: "var(--font-body)",
                  boxShadow: is60 ? "0 0 0 2px var(--rs-olive)" : "none",
                }}
              >
                {is40 && (
                  <span style={{
                    position: "absolute", top: 8, right: 8,
                    background: "#f97316", color: "#fff",
                    fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                    padding: "3px 8px", borderRadius: 20,
                  }}>MOST POPULAR 🔥</span>
                )}
                {is60 && (
                  <span style={{
                    position: "absolute", top: 8, right: 8,
                    background: "var(--rs-olive)", color: "var(--rs-cream)",
                    fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                    padding: "3px 8px", borderRadius: 20,
                  }}>BEST VALUE 💚</span>
                )}

                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "var(--rs-gold)", textTransform: "uppercase", marginBottom: 4 }}>
                  {plan.title}
                </p>
                <p style={{ fontSize: 13, color: "var(--rs-text)", marginBottom: 8 }}>
                  {plan.bags} tea bags · {plan.days}-Day Supply
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "var(--rs-dark)" }}>
                    Rs {plan.priceRupees}
                  </span>
                  <span style={{ fontSize: 13, textDecoration: "line-through", color: "rgba(0,0,0,0.3)" }}>
                    Rs {plan.mrpRupees}
                  </span>
                  {plan.savingsRupees > 0 && (
                    <span style={{
                      background: "rgba(74,100,34,0.1)", color: "var(--rs-olive)",
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                    }}>
                      Save Rs {plan.savingsRupees}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--rs-dark)", marginBottom: 4 }}>
                  {plan.perDayDisplay}
                </p>
                <p style={{ fontSize: 12, color: "var(--rs-text)", lineHeight: 1.5, marginBottom: 0 }}>
                  {plan.tagline}
                </p>
                {is60 && (
                  <p style={{ fontSize: 11, color: "var(--rs-text)", marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--rs-sand)", lineHeight: 1.5 }}>
                    ⚡ Ayurvedic results need minimum 60 days — this pack completes your full detox cycle
                  </p>
                )}
              </button>
              {plan.id === "20" && (
                <p style={{ fontSize: 11, color: "#b45309", marginTop: 4, paddingLeft: 4, lineHeight: 1.5 }}>
                  ⚠️ Most customers need 40–60 days to feel full results
                </p>
              )}
            </div>
          );
        })}
      </div>

      {upgradeDelta !== null && (
        <p style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "var(--rs-text)", lineHeight: 1.6 }}>
          Going from 20 days to 60 days costs just Rs {upgradeDelta} more — but gives you 3x the results.
        </p>
      )}
    </div>
  );
}
