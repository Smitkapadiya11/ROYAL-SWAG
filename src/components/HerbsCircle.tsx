import Image from "next/image";
import { S } from "@/lib/config";

/**
 * 7-herb showcase in a radial flower grid.
 * Desktop: center hub + 6 surrounding, 7th spans full.
 * Mobile: 2-column circular cards.
 */
export default function HerbsCircle() {
  return (
    <section style={{
      background: "transparent", padding: "80px 0",
      borderTop: "1px solid rgba(212,200,168,0.5)",
    }} id="herbs">
      <div className="w">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="ey">The Formula</span>
          <h2>
            Seven Herbs.<br />
            <em style={{ fontStyle: "italic", color: "#4A6422" }}>One Purpose.</em>
          </h2>
          <div className="rl-c" />
          <p style={{
            maxWidth: 400, margin: "0 auto",
            fontSize: 15, color: "#5C5647",
          }}>
            No extracts. No fillers. Every herb chosen for one specific reason.
          </p>
        </div>

        {/* ── Flower grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "auto",
          gap: 20,
          maxWidth: 860,
          margin: "0 auto",
        }} id="herbs-grid">

          {S.herbs.slice(0, 6).map((h, i) => (
            <HerbCard key={h.id} h={h} index={i} />
          ))}

          {/* 7th herb — full width */}
          <div style={{ gridColumn: "1 / -1" }}>
            <HerbCard h={S.herbs[6]} index={6} wide />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #herbs-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
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
  h, index, wide,
}: {
  h: typeof import("@/lib/config").S.herbs[number];
  index: number;
  wide?: boolean;
}) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #D4C8A8",
      overflow: "hidden",
      display: "flex",
      flexDirection: wide ? "row" : "column",
      alignItems: wide ? "center" : "flex-start",
      gap: wide ? 24 : 0,
    }}>
      {/* Image */}
      <div style={{
        position: "relative",
        width: wide ? 220 : "100%",
        aspectRatio: wide ? "4/3" : "4/3",
        background: "#F2E6CE",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        <Image
          src={h.img}
          alt={h.name}
          fill
          sizes={wide ? "220px" : "(max-width:640px) 50vw, 280px"}
          style={{ objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: "#2D3D15", color: "#C49A2A",
          fontSize: 9, fontWeight: 700, letterSpacing: 2,
          padding: "3px 8px", borderRadius: 4,
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: wide ? "0 24px 0 0" : "18px 18px 22px" }}>
        <span style={{
          fontSize: 9, letterSpacing: 2.5, fontWeight: 600,
          color: "#C49A2A", textTransform: "uppercase" as const,
          display: "block", marginBottom: 4,
        }}>{h.role}</span>
        <h3 style={{
          fontSize: 17, marginBottom: 2, color: "#1A1A14",
        }}>{h.name}</h3>
        <p style={{
          fontSize: 11, fontStyle: "italic",
          color: "#aaa", marginBottom: 8,
        }}>{h.bot}</p>
        <p style={{
          fontSize: 13, lineHeight: 1.65, color: "#5C5647",
        }}>{h.benefit}</p>
      </div>
    </div>
  );
}
