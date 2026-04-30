"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

/** Left side ( clipped overlay ): before detox — illustrative lung imagery */
const BEFORE_SRC = "/images/lung-before.jpg";
/** Right side (base layer): after detox — illustrative lung imagery */
const AFTER_SRC = "/images/lung-after.jpg";

export default function LungSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);
  const [containerWidth, setContainerWidth] = useState(900);

  useEffect(() => {
    const update = () => {
      if (ref.current) setContainerWidth(ref.current.offsetWidth);
    };
    update();
    const obs = new ResizeObserver(update);
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const update = useCallback((x: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = Math.max(0, Math.min(x - r.left, r.width));
    setPos((px / r.width) * 100);
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => {
      if (drag) update(e.clientX);
    };
    const mu = () => setDrag(false);
    const tm = (e: TouchEvent) => {
      if (drag) update(e.touches[0].clientX);
    };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", tm, { passive: false });
    window.addEventListener("touchend", mu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", mu);
    };
  }, [drag, update]);

  return (
    <section
      style={{
        background: "transparent",
        padding: "80px 0",
        borderTop: "1px solid rgba(212,200,168,0.5)",
      }}
    >
      <div className="w">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="ey">Why It Matters</span>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,42px)", marginBottom: 8 }}>
            Healthy Lungs vs<br />
            <em style={{ fontStyle: "italic", color: "#4A6422" }}>Polluted Lungs</em>
          </h2>
          <div className="rl-c" />
          <p
            style={{
              maxWidth: 460,
              margin: "0 auto",
              fontSize: 15,
              color: "#5C5647",
              lineHeight: 1.67,
            }}
          >
            Drag the slider. Same scan style hospitals use — polluted side versus cleaner tissue side by
            side.
          </p>
        </div>

        {/* ── Slider stage ── */}
        <div
          ref={ref}
          onMouseDown={(e) => {
            setDrag(true);
            update(e.clientX);
          }}
          onTouchStart={(e) => {
            setDrag(true);
            update(e.touches[0].clientX);
          }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            aspectRatio: "4 / 3",
            borderRadius: 16,
            overflow: "hidden",
            cursor: "col-resize",
            userSelect: "none",
            touchAction: "none",
            border: "1px solid #D4C8A8",
            boxShadow: "0 6px 40px rgba(45,61,21,0.12)",
            background: "#000",
          }}
        >
          {/* BASE — AFTER (full width); visible on the right of the handle */}
          <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <Image
              src={AFTER_SRC}
              alt="Lung after Royal Swag Detox Tea"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 900px"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* After label — right */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 4,
              background: "rgba(74,100,34,0.92)",
              color: "#fff",
              padding: "7px 14px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#fff",
                display: "inline-block",
              }}
            />
            After
          </div>

          {/* TOP — BEFORE (clipped); visible on the left of the handle */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${pos}%`,
              overflow: "hidden",
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: containerWidth,
                height: "100%",
              }}
            >
              <Image
                src={BEFORE_SRC}
                alt="Lung before Royal Swag Detox Tea"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 900px"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Before label — left */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                zIndex: 4,
                background: "rgba(160,32,32,0.92)",
                color: "#fff",
                padding: "7px 14px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "inline-block",
                }}
              />
              Before
            </div>
          </div>

          {/* ── DRAG HANDLE ── */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${pos}%`,
              transform: "translateX(-50%)",
              width: 56,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "col-resize",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 3,
                background: "#fff",
                boxShadow: "0 0 12px rgba(0,0,0,0.4)",
              }}
            />
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#fff",
                border: "3px solid #4A6422",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                zIndex: 1,
              }}
            >
              <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
                <path
                  d="M8 1L2 7L8 13"
                  stroke="#4A6422"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 1L22 7L16 13"
                  stroke="#4A6422"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 12,
            color: "#5C5647",
            opacity: 0.7,
            letterSpacing: 1,
          }}
        >
          ← DRAG TO COMPARE →
        </p>

        {/* Stats */}
        <div
          id="lung-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginTop: 48,
            padding: "28px 32px",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #D4C8A8",
          }}
        >
          {[
            { v: "9.78×", l: "India PM2.5 vs WHO" },
            { v: "10 Yrs", l: "Tar stays after quitting" },
            { v: "Day 7", l: "When customers feel change" },
            { v: "30 Days", l: "Full detox cycle" },
          ].map((s) => (
            <div key={s.v} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--ff-head)",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#4A6422",
                  marginBottom: 4,
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: 12, color: "#5C5647", lineHeight: 1.62 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #lung-stats { grid-template-columns: repeat(2,1fr) !important; padding: 18px 14px !important; }
        }
      `}</style>
    </section>
  );
}
