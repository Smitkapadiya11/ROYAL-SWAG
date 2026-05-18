"use client";

import ProductImageGallery from "@/components/ProductImageGallery";
import ProductBuyBox from "@/components/ProductBuyBox";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const BENEFITS = [
  { icon: "🫁", title: "Clears Airways", desc: "Vasaka & Pippali loosen mucus and open bronchial passages" },
  { icon: "🌿", title: "Removes Pollutants", desc: "Tulsi acts as natural air filter, flushing toxins daily" },
  { icon: "💪", title: "Strengthens Immunity", desc: "Mulethi boosts respiratory immunity and reduces inflammation" },
  { icon: "😮‍💨", title: "Easier Breathing", desc: "Feel lighter, breathe deeper within 7 days of regular use" },
];

const STARS = "★★★★★";

export default function ProductPage() {
  return (
    <main style={{ paddingTop: 80, background: "#FAFCFA" }}>
      <div
        style={{
          background: "linear-gradient(90deg,#1A3A1A,#2D6A2D)",
          color: "#FAF6EE",
          textAlign: "center",
          padding: "10px 20px",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        Free delivery on all orders across India · COD available · Ships in 24 hours
      </div>

      <section style={{ background: "#FFFFFF", paddingBottom: 60 }}>
        <div
          className="w product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px,5vw,80px)",
            paddingTop: 48,
            alignItems: "start",
          }}
        >
          <AnimateOnScroll direction="left">
            <ProductImageGallery />
          </AnimateOnScroll>

          <AnimateOnScroll direction="right">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span
                style={{
                  background: "#E8F5E9",
                  color: "#2D6A2D",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 20,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Ayurvedic · FSSAI Certified
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(26px,3vw,40px)",
                color: "#1A3A1A",
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              Royal Swag Lung Detox Tea
            </h1>
            <p style={{ color: "#6B6B6B", fontSize: 15, marginBottom: 16 }}>
              7 Ayurvedic herbs for cleaner, stronger lungs — every single day
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ color: "#F5A623", fontSize: 18 }}>{STARS}</span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>4.8</span>
              <span style={{ color: "#999", fontSize: 13 }}>(2,400+ reviews)</span>
            </div>

            <div style={{ marginBottom: 24 }}>
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid #F0F0F0",
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1A3A1A" }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 2 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "linear-gradient(135deg,#E8F5E9,#F0FAF0)",
                border: "1px solid #B8DDB8",
                borderRadius: 14,
                padding: "14px 18px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "#2D6A2D", fontWeight: 600 }}>Use code for extra 5% off UPI</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1A3A1A", letterSpacing: "0.05em" }}>LUNG5</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText("LUNG5");
                }}
                style={{
                  background: "#2D6A2D",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                COPY
              </button>
            </div>

            <div
              style={{
                background: "#1A3A1A",
                color: "#FAF6EE",
                borderRadius: 10,
                padding: "10px 16px",
                marginBottom: 24,
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>🔥</span> 50,000+ packs sold last month across India
            </div>

            <ProductBuyBox />
          </AnimateOnScroll>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
