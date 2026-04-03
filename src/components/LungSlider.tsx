"use client";

// BEFORE & AFTER: separate photographic assets.

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const BEFORE_IMAGE = "/images/lungs-before.png";
const AFTER_IMAGE = "/images/lungs-after.png";

const BEFORE_FILTER = "brightness(0.85) contrast(1.1)";
const AFTER_FILTER = "brightness(1.05) saturate(1.1)";

/** Fixed smoke particles (inside clipped BEFORE layer only). */
const SMOKE_PARTICLES = [
  { id: "s1", x: 8, y: 72, size: 28, duration: 7, delay: 0 },
  { id: "s2", x: 18, y: 58, size: 22, duration: 6, delay: 1.2 },
  { id: "s3", x: 28, y: 80, size: 32, duration: 8, delay: 0.4 },
  { id: "s4", x: 38, y: 65, size: 20, duration: 5.5, delay: 2 },
  { id: "s5", x: 48, y: 78, size: 26, duration: 7.5, delay: 0.8 },
  { id: "s6", x: 15, y: 42, size: 18, duration: 6.5, delay: 1.5 },
  { id: "s7", x: 55, y: 55, size: 24, duration: 7, delay: 2.5 },
  { id: "s8", x: 62, y: 70, size: 20, duration: 5, delay: 0.2 },
  { id: "s9", x: 72, y: 62, size: 30, duration: 8, delay: 1 },
  { id: "s10", x: 22, y: 88, size: 22, duration: 6, delay: 3 },
] as const;

export default function LungSlider() {
  const [sliderPos, setSliderPos] = useState(72);
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

  const clipBefore = `inset(0 ${100 - sliderPos}% 0 0)`;

  if (!mounted) {
    return (
      <section
        style={{ background: "linear-gradient(180deg, #030d06 0%, #071a0a 100%)" }}
        className="flex min-h-[600px] w-full items-center justify-center px-4 py-16"
      >
        <div className="h-96 w-full max-w-3xl animate-pulse rounded-2xl bg-[#0a2010]" />
      </section>
    );
  }

  return (
    <section
      style={{ background: "linear-gradient(180deg, #020b05 0%, #061508 50%, #020b05 100%)" }}
      className="relative w-full overflow-hidden px-4 py-14"
    >
      <style>{`
        @keyframes lungSliderBreatheImg {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03) translateY(-3px); }
        }
        .lung-slider-after-breathe {
          animation: lungSliderBreatheImg 4s ease-in-out infinite;
        }
        @keyframes lungSliderSmokeRise {
          0% { transform: translateY(0) scale(1); opacity: 0.35; }
          40% { opacity: 0.22; }
          100% { transform: translateY(-42px) scale(1.2); opacity: 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute"
          style={{
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
          className="absolute"
          style={{
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

      <div className="relative z-10 mb-3 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#4ade80]">
          The Science Behind Royal Swag
        </p>
        <h2 className="mb-3 text-3xl font-bold text-white md:text-5xl" style={{ fontFamily: "serif" }}>
          See The Difference
        </h2>
        <p className="mx-auto max-w-md text-sm text-[#6b9e7a] md:text-base">
          Drag the slider ← → to reveal your lung transformation in 30 days
        </p>
      </div>

      <div className="relative z-10 mx-auto mb-3 flex max-w-3xl justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[#ef4444]">← BEFORE</span>
        <span className="text-xs font-bold uppercase tracking-widest text-[#4ade80]">AFTER 30 DAYS →</span>
      </div>

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
        {/* LAYER 1 — AFTER (full width, bottom; badges only visible where BEFORE clip does not cover) */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(135deg, #041a08, #0a3015)" }}
        >
          <div className="lung-slider-after-breathe relative h-full w-full">
            <Image
              src={AFTER_IMAGE}
              alt="Healthy lungs after care"
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover"
              style={{ filter: AFTER_FILTER }}
              draggable={false}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{ background: "rgba(10, 60, 20, 0.2)" }}
          />
          <div
            className="pointer-events-none absolute right-4 top-4 z-10 flex flex-col items-end gap-2"
            aria-hidden="true"
          >
            {[
              { icon: "💚", text: "Detoxified" },
              { icon: "🌿", text: "Clear Airways" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-800/90 px-3 py-1.5 text-[11px] font-bold text-green-50 shadow-lg backdrop-blur-sm"
              >
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div
            className="pointer-events-none absolute bottom-16 right-4 z-10 flex flex-col items-end gap-2"
            aria-hidden="true"
          >
            {[
              { icon: "⚡", text: "Full Energy" },
              { icon: "🫁", text: "Strong Lungs" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-800/90 px-3 py-1.5 text-[11px] font-bold text-green-50 shadow-lg backdrop-blur-sm"
              >
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LAYER 2 — BEFORE (clipped to left of slider); badges + smoke only appear in this region */}
        <div className="absolute inset-0 z-[5]" style={{ clipPath: clipBefore }}>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #1a0404, #2a0606)" }}
          />
          <div className="relative h-full w-full">
            <Image
              src={BEFORE_IMAGE}
              alt="Polluted lungs before Royal Swag"
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover object-center"
              style={{ filter: BEFORE_FILTER }}
              draggable={false}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{ background: "rgba(80, 5, 5, 0.35)" }}
          />
          {SMOKE_PARTICLES.map((p) => (
            <div
              key={p.id}
              className="pointer-events-none absolute rounded-full z-[2]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: "radial-gradient(circle, rgba(180,120,80,0.35) 0%, transparent 70%)",
                animation: `lungSliderSmokeRise ${p.duration}s ${p.delay}s ease-out infinite`,
              }}
            />
          ))}
          <div
            className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-2"
            aria-hidden="true"
          >
            {[
              { icon: "🚬", text: "Smoking" },
              { icon: "🏭", text: "Air Pollution" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-red-400/20 bg-black/[0.82] px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md"
              >
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div
            className="pointer-events-none absolute bottom-16 left-4 z-10 flex flex-col gap-2"
            aria-hidden="true"
          >
            {[
              { icon: "😮‍💨", text: "Poor Breathing" },
              { icon: "😴", text: "Low Energy" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-red-400/20 bg-black/[0.82] px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md"
              >
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute top-0 bottom-0 z-30 flex items-center justify-center"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)", width: "4px" }}
        >
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
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

        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-black/65 px-4 py-1.5 backdrop-blur-md">
            <span className="text-[12px] text-[#ef4444]">● BEFORE</span>
            <span className="text-[11px] text-gray-400">← drag →</span>
            <span className="text-[12px] text-[#4ade80]">AFTER ●</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
        {[
          { emoji: "🌿", name: "Tulsi", benefit: "Antibacterial" },
          { emoji: "🍃", name: "Vasaka", benefit: "Clears Toxins" },
          { emoji: "🌱", name: "Mulethi", benefit: "Repairs Lining" },
          { emoji: "🫚", name: "Pippali", benefit: "Lung Strength" },
        ].map(({ emoji, name, benefit }) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded-full border border-green-400/20 bg-[rgba(22,101,52,0.3)] px-4 py-2 backdrop-blur-sm"
          >
            <span className="text-base">{emoji}</span>
            <div>
              <p className="text-xs font-semibold leading-tight text-white">{name}</p>
              <p className="text-[10px] text-[#4ade80]">{benefit}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-8 text-center">
        <p className="mb-4 text-sm text-[#6b9e7a]">Trusted by 5000+ customers across India</p>
        <Link
          href="/product"
          className="inline-block rounded-xl bg-gradient-to-br from-green-600 to-green-700 px-10 py-4 text-lg font-bold text-white shadow-[0_8px_32px_rgba(22,163,74,0.4)] transition hover:-translate-y-0.5"
        >
          Start Your 30-Day Lung Detox — Rs 359 →
        </Link>
        <p className="mt-3 text-xs text-[#4b7a59]">
          🔒 Secure Payment &nbsp;|&nbsp; 🚚 Free Delivery &nbsp;|&nbsp; ↩️ 30-Day Guarantee
        </p>
      </div>
    </section>
  );
}
