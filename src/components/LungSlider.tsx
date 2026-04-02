"use client";

// BEFORE side: /images/lungs.png (photo + filters). AFTER side: inline SVG only — no product images.

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const GLOW_PARTICLES = [
  { id: 1, x: 8, y: 22, size: 28, opacity: 0.85, duration: 3.2, delay: 0 },
  { id: 2, x: 78, y: 18, size: 22, opacity: 0.7, duration: 2.8, delay: 0.4 },
  { id: 3, x: 15, y: 65, size: 20, opacity: 0.75, duration: 3.5, delay: 0.2 },
  { id: 4, x: 88, y: 58, size: 26, opacity: 0.8, duration: 2.5, delay: 0.8 },
  { id: 5, x: 45, y: 12, size: 18, opacity: 0.65, duration: 3, delay: 0.1 },
  { id: 6, x: 52, y: 78, size: 24, opacity: 0.72, duration: 2.9, delay: 0.5 },
  { id: 7, x: 30, y: 42, size: 16, opacity: 0.6, duration: 3.4, delay: 1 },
  { id: 8, x: 70, y: 38, size: 20, opacity: 0.68, duration: 2.7, delay: 0.3 },
];

function HealthyLungSVG() {
  return (
    <svg
      viewBox="0 0 400 420"
      xmlns="http://www.w3.org/2000/svg"
      className="lung-slider-healthy-svg-inner"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "100%",
      }}
    >
      <defs>
        <radialGradient id="leftLungGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ff6b8a" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#e8334a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9b1c2e" stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id="rightLungGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ff7a90" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#e8334a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9b1c2e" stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id="tracheaGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9eb5" />
          <stop offset="100%" stopColor="#c0253b" />
        </radialGradient>
        <radialGradient id="innerGlow" cx="50%" cy="35%" r="50%">
          <stop offset="0%" stopColor="rgba(255,180,180,0.3)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="healthOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(74,222,128,0.08)" />
          <stop offset="100%" stopColor="rgba(22,163,74,0.05)" />
        </linearGradient>
        <filter id="lungSvgGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="lungSvgSoften">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      <rect x="188" y="20" width="24" height="70" rx="12" fill="url(#tracheaGrad)" filter="url(#lungSvgGlow)" />
      {[35, 45, 55, 65, 75].map((y) => (
        <rect key={y} x="188" y={y} width="24" height="5" rx="2.5" fill="rgba(255,150,160,0.4)" />
      ))}

      <path
        d="M188 88 Q170 100 145 108"
        stroke="#e8334a"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        filter="url(#lungSvgGlow)"
      />
      <path
        d="M212 88 Q230 100 255 108"
        stroke="#e8334a"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        filter="url(#lungSvgGlow)"
      />

      <path
        d="
        M145 108
        C125 115, 95 130, 75 160
        C55 195, 50 230, 52 265
        C54 300, 65 330, 85 350
        C100 365, 120 372, 145 368
        C165 365, 182 352, 188 335
        L188 108
        Z
      "
        fill="url(#leftLungGrad)"
        opacity="0.92"
      />
      <path
        d="
        M145 108
        C125 115, 95 130, 75 160
        C55 195, 50 230, 52 265
        C54 300, 65 330, 85 350
        C100 365, 120 372, 145 368
        C165 365, 182 352, 188 335
        L188 108
        Z
      "
        fill="url(#innerGlow)"
      />

      <path
        d="
        M255 108
        C275 115, 305 130, 325 160
        C345 195, 350 230, 348 265
        C346 300, 335 330, 315 350
        C300 365, 280 372, 255 368
        C235 365, 218 352, 212 335
        L212 108
        Z
      "
        fill="url(#rightLungGrad)"
        opacity="0.92"
      />
      <path
        d="
        M255 108
        C275 115, 305 130, 325 160
        C345 195, 350 230, 348 265
        C346 300, 335 330, 315 350
        C300 365, 280 372, 255 368
        C235 365, 218 352, 212 335
        L212 108
        Z
      "
        fill="url(#innerGlow)"
      />

      <g stroke="#ff9eb5" fill="none" strokeLinecap="round" opacity="0.7">
        <path d="M170 120 Q155 140 145 165" strokeWidth="5" />
        <path d="M145 165 Q130 185 118 205" strokeWidth="4" />
        <path d="M145 165 Q148 190 142 215" strokeWidth="3.5" />
        <path d="M118 205 Q105 220 98 240" strokeWidth="3" />
        <path d="M118 205 Q122 228 116 250" strokeWidth="2.5" />
        <path d="M98 240 Q88 258 84 278" strokeWidth="2.5" />
        <path d="M98 240 Q102 262 96 282" strokeWidth="2" />
        <path d="M84 278 Q78 295 76 315" strokeWidth="2" />
        <path d="M142 215 Q135 235 130 258" strokeWidth="2.5" />
        <path d="M130 258 Q122 275 118 295" strokeWidth="2" />
        <path d="M142 215 Q148 238 144 260" strokeWidth="2" />
        <path d="M170 120 Q175 145 170 170" strokeWidth="4" />
        <path d="M170 170 Q165 195 158 218" strokeWidth="3" />
        <path d="M158 218 Q152 240 148 265" strokeWidth="2.5" />
        <path d="M158 218 Q165 238 163 262" strokeWidth="2" />
      </g>

      <g stroke="#ff9eb5" fill="none" strokeLinecap="round" opacity="0.7">
        <path d="M230 120 Q245 140 255 165" strokeWidth="5" />
        <path d="M255 165 Q270 185 282 205" strokeWidth="4" />
        <path d="M255 165 Q252 190 258 215" strokeWidth="3.5" />
        <path d="M282 205 Q295 220 302 240" strokeWidth="3" />
        <path d="M282 205 Q278 228 284 250" strokeWidth="2.5" />
        <path d="M302 240 Q312 258 316 278" strokeWidth="2.5" />
        <path d="M302 240 Q298 262 304 282" strokeWidth="2" />
        <path d="M316 278 Q322 295 324 315" strokeWidth="2" />
        <path d="M258 215 Q265 235 270 258" strokeWidth="2.5" />
        <path d="M270 258 Q278 275 282 295" strokeWidth="2" />
        <path d="M258 215 Q252 238 256 260" strokeWidth="2" />
        <path d="M230 120 Q225 145 230 170" strokeWidth="4" />
        <path d="M230 170 Q235 195 242 218" strokeWidth="3" />
        <path d="M242 218 Q248 240 252 265" strokeWidth="2.5" />
        <path d="M242 218 Q235 238 237 262" strokeWidth="2" />
      </g>

      <g opacity="0.15" filter="url(#lungSvgSoften)">
        {(
          [
            [100, 200],
            [115, 240],
            [95, 280],
            [130, 310],
            [110, 340],
            [155, 290],
            [160, 340],
            [170, 260],
            [300, 200],
            [285, 240],
            [305, 280],
            [270, 310],
            [290, 340],
            [245, 290],
            [240, 340],
            [230, 260],
          ] as const
        ).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="18" fill="rgba(255,180,180,0.5)" />
        ))}
      </g>

      <g className="lung-slider-blood-pulse" fill="none" strokeLinecap="round">
        <path
          d="M135 155 Q115 175 105 200 Q96 225 100 255"
          stroke="#ff4466"
          strokeWidth="2.5"
        />
        <path d="M150 175 Q140 200 138 230 Q136 258 140 285" stroke="#ff4466" strokeWidth="2" />
        <path d="M168 145 Q172 175 168 205 Q164 235 166 268" stroke="#ff6680" strokeWidth="1.5" />
        <path
          d="M265 155 Q285 175 295 200 Q304 225 300 255"
          stroke="#ff4466"
          strokeWidth="2.5"
        />
        <path d="M250 175 Q260 200 262 230 Q264 258 260 285" stroke="#ff4466" strokeWidth="2" />
        <path d="M232 145 Q228 175 232 205 Q236 235 234 268" stroke="#ff6680" strokeWidth="1.5" />
      </g>

      <path
        d="
        M145 108 C125 115, 100 135, 80 165
        C62 195, 56 230, 58 265
      "
        stroke="rgba(255,200,200,0.4)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="
        M255 108 C275 115, 300 135, 320 165
        C338 195, 344 230, 342 265
      "
        stroke="rgba(255,200,200,0.4)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="
        M145 108
        C125 115, 95 130, 75 160
        C55 195, 50 230, 52 265
        C54 300, 65 330, 85 350
        C100 365, 120 372, 145 368
        C165 365, 182 352, 188 335
        L188 108 Z
        M255 108
        C275 115, 305 130, 325 160
        C345 195, 350 230, 348 265
        C346 300, 335 330, 315 350
        C300 365, 280 372, 255 368
        C235 365, 218 352, 212 335
        L212 108 Z
      "
        fill="url(#healthOverlay)"
      />

      {(
        [
          [90, 190, 1.2],
          [320, 210, 1.0],
          [110, 320, 0.8],
          [295, 300, 0.9],
          [200, 380, 1.1],
          [165, 230, 0.7],
          [240, 245, 0.75],
        ] as const
      ).map(([x, y, scale], i) => (
        <g key={i} transform={`translate(${x},${y}) scale(${scale})`} opacity="0.6">
          <circle r="2.5" fill="#4ade80" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#4ade80" strokeWidth="1.5" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="#4ade80" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

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
      <style>{`
        @keyframes lungSliderBreathe {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 25px rgba(74,222,128,0.4)) drop-shadow(0 0 50px rgba(22,163,74,0.2));
          }
          50% {
            transform: scale(1.04);
            filter: drop-shadow(0 0 40px rgba(74,222,128,0.6)) drop-shadow(0 0 80px rgba(22,163,74,0.35));
          }
        }
        @keyframes lungSliderBloodPulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.65; }
        }
        @keyframes lungSliderGreenGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.92; }
        }
        @keyframes lungSliderGlowPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.15); }
        }
        .lung-slider-breathe-wrap {
          width: 85%;
          height: 85%;
          max-width: 360px;
          max-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lungSliderBreathe 4s ease-in-out infinite;
        }
        .lung-slider-blood-pulse {
          animation: lungSliderBloodPulse 1.5s ease-in-out infinite;
        }
      `}</style>

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

      <div className="relative z-10 mx-auto mb-3 flex max-w-3xl justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ef4444" }}>
          ← BEFORE
        </span>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4ade80" }}>
          AFTER 30 DAYS →
        </span>
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
        {/* AFTER — healthy anatomical SVG (no raster product image) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #041a08, #0a3015, #123820)",
            animation: "lungSliderGreenGlow 4s ease-in-out infinite",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 45%, rgba(22,163,74,0.15) 0%, transparent 70%)",
            }}
          />
          {GLOW_PARTICLES.map((p) => (
            <div
              key={p.id}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                marginLeft: `-${p.size / 2}px`,
                marginTop: `-${p.size / 2}px`,
                opacity: p.opacity,
                background: "radial-gradient(circle, rgba(74,222,128,0.35), transparent)",
                animation: `lungSliderGlowPulse ${p.duration}s ${p.delay}s ease-in-out infinite`,
              }}
            />
          ))}
          <div className="lung-slider-breathe-wrap relative z-[1]">
            <HealthyLungSVG />
          </div>
        </div>

        {/* BEFORE — lungs.png + dark / smoky filters */}
        <div
          className="absolute inset-0 z-[2]"
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
