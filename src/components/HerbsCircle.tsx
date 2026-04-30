import Image from "next/image";
import { S } from "@/lib/config";

/**
 * 7-herb showcase.
 * Images clipped into clean round shapes on pure white backgrounds.
 * Borderless, modern card layout.
 */
export default function HerbsCircle() {
  return (
    <section style={{
      background: "#fff",
      padding: "88px 0",
      borderTop: "1px solid rgba(212,200,168,0.5)",
    }} id="herbs">
      <div className="w">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="ey">The Formula</span>
          <h2>
            Seven Herbs.<br />
            <em style={{ fontStyle: "italic", color: "#4A6422" }}>One Purpose.</em>
          </h2>
          <div className="rl-c" />
          <p style={{
            maxWidth: 420, margin: "0 auto",
            fontSize: 15, color: "#5C5647", lineHeight: 1.67,
          }}>
            No extracts. No fillers.
            You get whole Tulsi, Vasaka, Mulethi, Pippali, and the full seven. Names you'd recognise from Ayurveda, not a lab slip.
          </p>
        </div>

        {/* ── Grid: 3 columns, 7th full-width ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 28,
          maxWidth: 900,
          margin: "0 auto",
        }} id="herbs-grid">

          {S.herbs.slice(0, 6).map((h) => (
            <HerbCard key={h.id} h={h} />
          ))}

          {/* 7th herb — full width */}
          <div style={{ gridColumn: "1 / -1" }}>
            <HerbCard h={S.herbs[6]} wide />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #herbs-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
          #herbs-grid > div:last-child {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
    </section>
  );
}

function HerbCard({
  h, wide,
}: {
  h: typeof import("@/lib/config").S.herbs[number];
  wide?: boolean;
}) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 18,
      overflow: "hidden",
      display: "flex",
      flexDirection: wide ? "row" : "column",
      alignItems: wide ? "center" : "flex-start",
      gap: wide ? 32 : 0,
      boxShadow: "0 2px 20px rgba(45,61,21,0.07)",
    }}>
      {/* ── Round herb image on white background ── */}
      <div style={{
        width: wide ? 160 : "100%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: wide ? "28px 0 28px 28px" : "28px 28px 0",
      }}>
        <div style={{
          width: wide ? 120 : 96,
          height: wide ? 120 : 96,
          borderRadius: "50%",
          overflow: "hidden",
          background: "#F9F6F0",
          border: "3px solid #F2E6CE",
          position: "relative",
          flexShrink: 0,
          boxShadow: "0 4px 16px rgba(74,100,34,0.12)",
        }}>
          <Image
            src={h.img}
            alt={h.name}
            fill
            sizes={wide ? "120px" : "96px"}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* ── Text ── */}
      <div style={{
        padding: wide ? "28px 28px 28px 0" : "16px 24px 28px",
        flex: 1,
      }}>
        <span style={{
          fontSize: 9, letterSpacing: "0.08em", fontWeight: 700,
          color: "#C49A2A", textTransform: "uppercase" as const,
          display: "block", marginBottom: 6,
        }}>{h.role}</span>
        <h3 style={{
          fontSize: wide ? 20 : 16, marginBottom: 2, color: "#1A1A14", fontWeight: 700,
        }}>{h.name}</h3>
        <p style={{
          fontSize: 11, fontStyle: "italic",
          color: "#999", marginBottom: 10, lineHeight: 1.62,
        }}>{h.bot}</p>
        <p style={{
          fontSize: 13, lineHeight: 1.7, color: "#5C5647",
        }}>{h.benefit}</p>
      </div>
    </div>
  );
}
