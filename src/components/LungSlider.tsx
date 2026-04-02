"use client";

// IMPORTANT: Place lung image at /public/images/lung-healthy.webp
// Reference image: AdobeStock anatomical lung X-ray style

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const LUNG_IMG = "/images/lung-healthy.webp";

export default function LungSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const w = rect.width;
    if (w <= 0) return;
    const pct = ((clientX - rect.left) / w) * 100;
    setSliderPos(Math.min(95, Math.max(5, pct)));
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const move = (e: PointerEvent) => updateFromClientX(e.clientX);
    const up = () => setIsDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [isDragging, updateFromClientX]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateFromClientX(e.clientX);
  };

  const clipBefore = `inset(0 ${100 - sliderPos}% 0 0)`;

  return (
    <section className="bg-[#071209] py-16 px-4">
      <div className="mx-auto max-w-[700px]">
        <h2
          className="mb-2 text-center text-2xl font-bold text-white sm:text-3xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          See The Difference
        </h2>
        <p className="mb-8 text-center text-sm text-gray-400">
          Drag the slider to see what Royal Swag Lung Detox Tea does to your lungs in 30 days
        </p>

        <div
          ref={containerRef}
          role="slider"
          aria-valuemin={5}
          aria-valuemax={95}
          aria-valuenow={Math.round(sliderPos)}
          aria-label="Before and after lung comparison"
          className="relative mx-auto w-full max-w-[700px] cursor-grab select-none overflow-hidden rounded-2xl border border-green-900/50 shadow-xl active:cursor-grabbing h-[300px] touch-none md:h-[420px]"
          style={{ userSelect: isDragging ? "none" : "auto" }}
          onPointerDown={onPointerDown}
        >
          {/* LAYER 1 — AFTER (healthy) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(135deg, #0a2a0a, #1a5a1a)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LUNG_IMG}
              alt="Healthy lungs after Royal Swag"
              className="h-full w-full object-cover"
              style={{
                filter: "brightness(1.1) saturate(1.3)",
                mixBlendMode: "normal",
              }}
              draggable={false}
            />
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,60,20,0.2)" }}
              aria-hidden="true"
            />
          </div>

          {/* LAYER 2 — BEFORE (polluted), clipped */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: clipBefore }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, #1a0505, #2d0f0f)" }}
              aria-hidden="true"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LUNG_IMG}
              alt="Polluted lungs before Royal Swag"
              className="h-full w-full object-cover"
              style={{
                filter:
                  "grayscale(0.8) sepia(0.5) brightness(0.4) contrast(1.3) saturate(0.2)",
              }}
              draggable={false}
            />
            <div
              className="absolute inset-0"
              style={{ background: "rgba(80,10,10,0.45)" }}
              aria-hidden="true"
            />
          </div>

          {/* Labels */}
          <div className="pointer-events-none absolute left-4 top-4 z-20">
            <span
              className="rounded-full px-3 py-1.5 text-xs font-bold text-white"
              style={{ background: "rgba(0,0,0,0.75)" }}
            >
              😮 BEFORE — Polluted Lungs
            </span>
          </div>
          <div className="pointer-events-none absolute right-4 top-4 z-20">
            <span
              className="rounded-full px-3 py-1.5 text-xs font-bold text-white"
              style={{ background: "rgba(0,100,40,0.9)" }}
            >
              ✅ AFTER 30 DAYS
            </span>
          </div>

          {/* Bad habit badges — BEFORE side */}
          <div className="pointer-events-none absolute bottom-12 left-3 z-20 flex flex-col gap-2">
            {["🚬 Smoking", "🏭 Air Pollution", "😮‍💨 Weak Lungs"].map((b) => (
              <span
                key={b}
                className="rounded-full px-2 py-1 text-white"
                style={{ background: "rgba(0,0,0,0.7)", fontSize: "11px" }}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Benefit badges — AFTER side */}
          <div className="pointer-events-none absolute bottom-12 right-3 z-20 flex flex-col items-end gap-2">
            {["💚 Detoxified", "🌿 Clear Airways", "⚡ Full Energy"].map((b) => (
              <span
                key={b}
                className="rounded-full px-2 py-1 text-white"
                style={{ background: "rgba(0,100,40,0.85)", fontSize: "11px" }}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Slider handle */}
          <div
            className="pointer-events-none absolute inset-y-0 z-30 flex w-11 flex-col items-center justify-center"
            style={{ left: `calc(${sliderPos}% - 22px)` }}
          >
            <div
              className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
              style={{ width: "3px", background: "rgba(255,255,255,0.9)" }}
              aria-hidden="true"
            />
            <div
              className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.6)" }}
            >
              <span style={{ fontSize: "18px", color: "#166534" }} aria-hidden="true">
                ↔
              </span>
            </div>
          </div>

          {/* Bottom instruction (inside card) */}
          <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-20 flex justify-center">
            <span
              className="rounded-full px-3 py-1 text-white"
              style={{ background: "rgba(0,0,0,0.5)", fontSize: "11px" }}
            >
              ← Drag to reveal transformation →
            </span>
          </div>
        </div>

        <p className="mt-3 text-center text-xs italic text-gray-400">
          ← Drag to reveal your lung transformation →
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {[
            { emoji: "🌿", name: "Tulsi" },
            { emoji: "🍃", name: "Vasaka" },
            { emoji: "🌱", name: "Mulethi" },
            { emoji: "🫚", name: "Pippali" },
          ].map(({ emoji, name }) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 rounded-full bg-green-900 px-4 py-2 text-xs font-semibold text-green-300"
            >
              <span aria-hidden="true">{emoji}</span>
              {name}
            </span>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/product"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-green-700"
          >
            Start Your 30-Day Lung Detox — Rs 359
          </Link>
        </div>
      </div>
    </section>
  );
}
