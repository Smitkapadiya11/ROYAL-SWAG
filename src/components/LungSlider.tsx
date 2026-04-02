"use client";

// Image path: /images/lungs.png
// If image doesn't load, verify file exists in /public/images/

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export default function LungSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(Math.max((x / rect.width) * 100, 3), 97);
    setSliderPos(pct);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const move = (e: PointerEvent) => updateSlider(e.clientX);
    const up = () => setIsDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [isDragging, updateSlider]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    setIsDragging(true);
    updateSlider(e.clientX);
  };

  if (!mounted) {
    return (
      <section
        style={{ background: "linear-gradient(180deg, #030d06 0%, #071a0a 100%)" }}
        className="flex min-h-[600px] w-full items-center justify-center px-4 py-16"
      >
        <div
          className="h-96 w-full max-w-3xl animate-pulse rounded-2xl"
          style={{ background: "#0a2010" }}
        />
      </section>
    );
  }

  return (
    <section
      style={{ background: "linear-gradient(180deg, #020b05 0%, #061508 50%, #020b05 100%)" }}
      className="relative w-full overflow-hidden px-4 py-14"
    >
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "15%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(22,163,74,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Section heading */}
      <div className="relative z-10 mb-3 text-center">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "#4ade80" }}
        >
          The Science Behind Royal Swag
        </p>
        <h2
          className="mb-3 text-3xl font-bold text-white md:text-5xl"
          style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}
        >
          See The Difference
        </h2>
        <p className="mx-auto max-w-md text-sm md:text-base" style={{ color: "#6b9e7a" }}>
          Drag the slider ← → to reveal your lung transformation in 30 days
        </p>
      </div>

      {/* BEFORE / AFTER label bar */}
      <div className="relative z-10 mx-auto mb-3 flex max-w-3xl justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ef4444" }}>
          ← BEFORE
        </span>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4ade80" }}>
          AFTER 30 DAYS →
        </span>
      </div>

      {/* SLIDER CONTAINER */}
      <div
        ref={containerRef}
        className="relative mx-auto h-[300px] touch-none overflow-hidden rounded-2xl md:h-[420px]"
        style={{
          width: "100%",
          maxWidth: "700px",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          boxShadow: "0 0 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
        onPointerDown={handlePointerDown}
      >
        {/* ── AFTER SIDE (full background — healthy green) ── */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #052a10 0%, #0a3a18 50%, #0d4a20 100%)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative h-full w-full"
              style={{
                filter: "brightness(1.15) saturate(1.4) hue-rotate(5deg)",
              }}
            >
              <Image
                src="/images/lungs.png"
                alt="Healthy lungs after Royal Swag Lung Detox Tea"
                fill
                sizes="(max-width: 700px) 100vw, 700px"
                style={{ objectFit: "cover", objectPosition: "center" }}
                draggable={false}
                priority
              />
            </div>
          </div>
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0, 60, 20, 0.25)", mixBlendMode: "multiply" }}
          />
        </div>

        {/* ── BEFORE SIDE (clipped to left — polluted dark) ── */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #1a0505 0%, #2a0808 50%, #1a0a0a 100%)" }}
          >
            <div
              className="relative h-full w-full"
              style={{
                filter: "grayscale(1) brightness(0.35) contrast(1.4) sepia(0.3)",
              }}
            >
              <Image
                src="/images/lungs.png"
                alt="Polluted lungs before Royal Swag"
                fill
                sizes="(max-width: 700px) 100vw, 700px"
                style={{ objectFit: "cover", objectPosition: "center" }}
                draggable={false}
                priority
              />
            </div>
            <div
              className="absolute inset-0"
              style={{ background: "rgba(90, 8, 8, 0.5)", mixBlendMode: "multiply" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 30% 40%, rgba(50,20,20,0.6) 0%, transparent 60%),
                                radial-gradient(ellipse at 60% 70%, rgba(30,10,10,0.4) 0%, transparent 50%)`,
              }}
            />
          </div>
        </div>

        {/* ── BEFORE LABELS (left side) ── */}
        <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
          {[
            { icon: "🚬", text: "Smoking" },
            { icon: "🏭", text: "Air Pollution" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-white"
              style={{
                background: "rgba(0,0,0,0.8)",
                fontSize: "11px",
                fontWeight: 600,
                backdropFilter: "blur(4px)",
              }}
            >
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-16 left-4 z-20 flex flex-col gap-2">
          {[
            { icon: "😮‍💨", text: "Poor Breathing" },
            { icon: "😴", text: "Low Energy" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-white"
              style={{
                background: "rgba(0,0,0,0.8)",
                fontSize: "11px",
                fontWeight: 600,
                backdropFilter: "blur(4px)",
              }}
            >
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* ── AFTER LABELS (right side) ── */}
        <div className="absolute right-4 top-4 z-20 flex flex-col items-end gap-2">
          {[
            { icon: "💚", text: "Detoxified" },
            { icon: "🌿", text: "Clear Airways" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-white"
              style={{
                background: "rgba(0,100,40,0.9)",
                fontSize: "11px",
                fontWeight: 600,
                backdropFilter: "blur(4px)",
              }}
            >
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-16 right-4 z-20 flex flex-col items-end gap-2">
          {[
            { icon: "⚡", text: "Full Energy" },
            { icon: "🫁", text: "Strong Lungs" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-white"
              style={{
                background: "rgba(0,100,40,0.9)",
                fontSize: "11px",
                fontWeight: 600,
                backdropFilter: "blur(4px)",
              }}
            >
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* ── DIVIDER LINE + HANDLE ── */}
        <div
          className="absolute top-0 bottom-0 z-30 flex items-center justify-center"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)", width: "4px" }}
        >
          <div
            className="absolute top-0 bottom-0 w-0.5"
            style={{
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 0 8px rgba(255,255,255,0.5)",
            }}
          />

          <div
            className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.7), 0 0 0 3px rgba(255,255,255,0.3)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M8 5l-7 7 7 7M16 5l7 7-7 7"
                stroke="#166534"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* ── BOTTOM HINT BAR ── */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
          <div
            className="flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
          >
            <span style={{ color: "#ef4444", fontSize: "12px" }}>● BEFORE</span>
            <span style={{ color: "#9ca3af", fontSize: "11px" }}>← drag →</span>
            <span style={{ color: "#4ade80", fontSize: "12px" }}>AFTER ●</span>
          </div>
        </div>
      </div>

      {/* Herb pills row */}
      <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
        {[
          { emoji: "🌿", name: "Tulsi", benefit: "Antibacterial" },
          { emoji: "🍃", name: "Vasaka", benefit: "Clears Toxins" },
          { emoji: "🌱", name: "Mulethi", benefit: "Repairs Lining" },
          { emoji: "🫚", name: "Pippali", benefit: "Lung Strength" },
        ].map(({ emoji, name, benefit }) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: "rgba(22,101,52,0.3)",
              border: "1px solid rgba(74,222,128,0.2)",
              backdropFilter: "blur(4px)",
            }}
          >
            <span style={{ fontSize: "16px" }}>{emoji}</span>
            <div>
              <p className="font-semibold text-white" style={{ fontSize: "12px", lineHeight: 1.2 }}>
                {name}
              </p>
              <p style={{ color: "#4ade80", fontSize: "10px" }}>{benefit}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <div className="relative z-10 mt-8 text-center">
        <p className="mb-4 text-sm" style={{ color: "#6b9e7a" }}>
          Trusted by 5000+ customers across India
        </p>
        <Link
          href="/product"
          className="inline-block rounded-xl font-bold transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            color: "white",
            padding: "16px 40px",
            fontSize: "18px",
            boxShadow: "0 8px 32px rgba(22,163,74,0.4)",
            textDecoration: "none",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(22,163,74,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(22,163,74,0.4)";
          }}
        >
          Start Your 30-Day Lung Detox — Rs 359 →
        </Link>
        <p className="mt-3 text-xs" style={{ color: "#4b7a59" }}>
          🔒 Secure Payment &nbsp;|&nbsp; 🚚 Free Delivery &nbsp;|&nbsp; ↩️ 30-Day Guarantee
        </p>
      </div>
    </section>
  );
}
