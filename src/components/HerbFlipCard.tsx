"use client";

import { useRef } from "react";
import { gsap } from "gsap";

interface Props {
  herb: string;
  benefit: string;
  detail: string;
  icon: string;
  color: string;
}

export default function HerbFlipCard({ herb, benefit, detail, icon }: Props) {
  const inner = useRef<HTMLDivElement>(null);
  const flip = (deg: number) => {
    if (!inner.current) return;
    gsap.to(inner.current, { rotationY: deg, duration: 0.5, ease: "power2.inOut" });
  };

  return (
    <div
      style={{ width: 200, height: 260, perspective: "1200px", cursor: "pointer" }}
      onMouseEnter={() => flip(180)}
      onMouseLeave={() => flip(0)}
      onTouchStart={() => flip(180)}
      onTouchEnd={() => flip(0)}
    >
      <div
        ref={inner}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "linear-gradient(135deg,#1A3A1A,#2D6A2D)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 20,
            boxShadow: "0 8px 32px rgba(26,58,26,0.25)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            {icon}
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: "#E8C84A",
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {herb}
            </div>
            <div style={{ color: "rgba(250,246,238,0.7)", fontSize: 12, marginTop: 6 }}>{benefit}</div>
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(250,246,238,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 20,
              padding: "4px 12px",
            }}
          >
            Hover to learn more
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg,#FAF6EE,#F0E8D5)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            boxShadow: "0 8px 32px rgba(26,58,26,0.15)",
            border: "2px solid rgba(196,154,42,0.3)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
          <div
            style={{
              color: "#1A3A1A",
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {herb}
          </div>
          <div
            style={{
              color: "#C49A2A",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {benefit}
          </div>
          <div style={{ color: "#4A4A4A", fontSize: 12, lineHeight: 1.7, textAlign: "center" }}>{detail}</div>
        </div>
      </div>
    </div>
  );
}
