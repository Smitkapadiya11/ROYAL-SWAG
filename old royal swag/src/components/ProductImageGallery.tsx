"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const IMAGES = [
  "/images/product/product-1.jpg",
  "/images/product/product-2.jpg",
  "/images/product/product-3.jpg",
  "/images/product/product-4.jpg",
  "/images/product/product-5.jpg",
];

export default function ProductImageGallery() {
  const [active, setActive] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  const switchImage = (idx: number) => {
    if (!mainRef.current) {
      setActive(idx);
      return;
    }
    gsap.to(mainRef.current, {
      opacity: 0,
      scale: 0.97,
      duration: 0.15,
      onComplete: () => {
        setActive(idx);
        gsap.to(mainRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
        });
      },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        ref={mainRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1/1",
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(135deg,#F8FCF8,#EEF6EE)",
          boxShadow: "0 8px 40px rgba(26,58,26,0.12)",
        }}
      >
        <Image
          src={IMAGES[active]}
          alt="Royal Swag Lung Detox Tea"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "contain", padding: 20 }}
          priority
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 11,
            color: "#6B6B6B",
            fontWeight: 500,
          }}
        >
          🔍 Zoom
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {IMAGES.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => switchImage(i)}
            style={{
              flexShrink: 0,
              width: 72,
              height: 72,
              borderRadius: 12,
              overflow: "hidden",
              border: active === i ? "2px solid #2D6A2D" : "2px solid #E0E0E0",
              cursor: "pointer",
              transition: "border-color 0.2s",
              background: "#F8FCF8",
              padding: 0,
            }}
          >
            <Image src={img} alt="" width={72} height={72} style={{ objectFit: "contain", padding: 4 }} />
          </button>
        ))}
      </div>
    </div>
  );
}
