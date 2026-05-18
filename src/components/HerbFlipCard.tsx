"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

interface HerbProps {
  name: string;
  role: string;
  latin: string;
  benefit: string;
  detail: string;
  image: string;
}

export default function HerbFlipCard({ name, role, latin, benefit, detail, image }: HerbProps) {
  const inner = useRef<HTMLDivElement>(null);

  const flip = () => {
    if (!inner.current) return;
    gsap.to(inner.current, { rotationY: 180, duration: 0.55, ease: "power2.inOut" });
  };
  const unflip = () => {
    if (!inner.current) return;
    gsap.to(inner.current, { rotationY: 0, duration: 0.55, ease: "power2.inOut" });
  };

  return (
    <div
      style={{ width: "100%", aspectRatio: "3/4", perspective: "1400px", cursor: "pointer", minHeight: 320 }}
      onMouseEnter={flip}
      onMouseLeave={unflip}
      onTouchStart={flip}
      onTouchEnd={unflip}
    >
      <div
        ref={inner}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          }}
        >
          <Image src={image} alt={name} fill sizes="(max-width:768px) 100vw, 280px" style={{ objectFit: "cover", objectPosition: "center" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(5,15,5,0.92) 0%, rgba(5,15,5,0.4) 50%, transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "20px 20px 24px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C49A2A",
                marginBottom: 6,
                fontFamily: "var(--font-sans)",
              }}
            >
              {role}
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(20px,2vw,26px)",
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
                fontFamily: "var(--font-sans)",
                marginBottom: 10,
              }}
            >
              {latin}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.5,
              }}
            >
              {benefit}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-sans)",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                }}
              >
                ↻
              </span>
              Hover for details
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 20,
            overflow: "hidden",
            background: "linear-gradient(145deg, #0D2010 0%, #1A3A1A 100%)",
            border: "1px solid rgba(196,154,42,0.25)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            padding: "0 0 24px 0",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: 130, flexShrink: 0 }}>
            <Image src={image} alt={name} fill sizes="(max-width:768px) 100vw, 280px" style={{ objectFit: "cover", objectPosition: "center top" }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, transparent 40%, #0D2010 100%)",
              }}
            />
          </div>
          <div style={{ padding: "0 22px", flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C49A2A",
                marginBottom: 8,
                fontFamily: "var(--font-sans)",
              }}
            >
              {role}
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(22px,2vw,28px)",
                fontWeight: 700,
                color: "#FAF6EE",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(250,246,238,0.45)",
                fontStyle: "italic",
                marginBottom: 16,
                fontFamily: "var(--font-sans)",
              }}
            >
              {latin}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "rgba(250,246,238,0.85)",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.7,
              }}
            >
              {detail}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
