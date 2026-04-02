"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const LUNG_IMG = "/images/lung-healthy.png";

const afterImgFilter =
  "brightness(1.1) saturate(1.4) hue-rotate(0deg)";
const beforeImgFilter =
  "grayscale(0.6) sepia(0.4) brightness(0.5) contrast(1.2) hue-rotate(0deg) saturate(0.3)";

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
          className="relative mx-auto w-full max-w-[700px] select-none overflow-hidden rounded-2xl border border-green-900/50 shadow-xl h-[300px] md:h-[420px] touch-none"
          style={{ userSelect: isDragging ? "none" : "auto" }}
          onPointerDown={onPointerDown}
        >
          {/* LAYER 1 — AFTER (healthy): full-bleed base */}
          <img
            src={LUNG_IMG}
            alt="Healthy lungs after care"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ filter: afterImgFilter }}
            draggable={false}
          />
          <div
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{ background: "rgba(0,80,20,0.15)" }}
            aria-hidden="true"
          />

          {/* LAYER 2 — BEFORE (polluted): same image, clipped left */}
          <img
            src={LUNG_IMG}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ filter: beforeImgFilter, clipPath: clipBefore }}
            draggable={false}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "rgba(80,10,10,0.4)",
              clipPath: clipBefore,
            }}
            aria-hidden="true"
          />

          {/* Labels */}
          <div className="pointer-events-none absolute left-4 top-4 z-10 rounded bg-black/70 px-3 py-1 text-xs font-bold text-white">
            😮 BEFORE — Polluted Lungs
          </div>
          <div className="pointer-events-none absolute right-4 top-4 z-10 rounded bg-[rgba(0,100,40,0.85)] px-3 py-1 text-xs font-bold text-white">
            ✅ AFTER 30 DAYS — Royal Swag
          </div>

          {/* Bad habits — left, when enough “before” visible */}
          {sliderPos > 20 && (
            <div className="pointer-events-none absolute bottom-[60px] left-3 z-10 flex flex-col gap-2">
              {["🚬 Smoking", "🏭 Air Pollution", "😮‍💨 Weak Lungs"].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-semibold text-white sm:text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Benefits — right */}
          {sliderPos < 80 && (
            <div className="pointer-events-none absolute bottom-[60px] right-3 z-10 flex flex-col gap-2">
              {["💚 Detoxified", "🌿 Clear Airways", "⚡ Full Energy"].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-green-800/90 px-2.5 py-1 text-[10px] font-semibold text-green-50 sm:text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Handle: full-height line + centered grip */}
          <div
            className="pointer-events-none absolute inset-y-0 z-20 flex w-10 items-center justify-center"
            style={{ left: `calc(${sliderPos}% - 20px)` }}
          >
            <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-white/90" aria-hidden="true" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              <span className="text-lg font-bold text-green-800" aria-hidden="true">
                ↔
              </span>
            </div>
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
