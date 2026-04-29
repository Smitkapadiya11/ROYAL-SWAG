"use client";
import { useRef, useState, useCallback, useEffect } from "react";

export default function LungSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(860);

  /* track container width for the clipped overlay */
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    update();
    const obs = new ResizeObserver(update);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging) updatePosition(e.clientX); };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, updatePosition]);

  const pct = `${position}%`;

  const UNHEALTHY_ROWS = [
    { k: "Airways", v: "Blocked",    c: "#A02020" },
    { k: "Mucus",   v: "Excessive",  c: "#A02020" },
    { k: "Oxygen",  v: "Restricted", c: "#A02020" },
    { k: "Energy",  v: "Depleted",   c: "#A02020" },
  ];
  const HEALTHY_ROWS = [
    { k: "Airways", v: "Clear",     c: "#4A6422" },
    { k: "Mucus",   v: "Dissolved", c: "#4A6422" },
    { k: "Oxygen",  v: "Flowing",   c: "#4A6422" },
    { k: "Energy",  v: "Restored",  c: "#4A6422" },
  ];

  return (
    <section style={{
      background: "transparent",
      padding: "80px 0",
      borderTop: "1px solid rgba(212,200,168,0.5)",
    }}>
      <div className="w">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="ey">Why It Matters</span>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,42px)", marginBottom: 8 }}>
            Healthy Lungs vs<br />
            <em style={{ fontStyle: "italic", color: "#4A6422" }}>Polluted Lungs</em>
          </h2>
          <div className="rl-c" />
          <p style={{ maxWidth: 420, margin: "0 auto", fontSize: 15, color: "#5C5647" }}>
            Drag the slider to see exactly what pollution and smoking do inside
            your lungs — and how Royal Swag reverses it.
          </p>
        </div>

        {/* ── Slider container ── */}
        <div
          ref={containerRef}
          onMouseDown={() => setDragging(true)}
          onTouchStart={(e) => { setDragging(true); updatePosition(e.touches[0].clientX); }}
          onTouchMove={(e) => { e.preventDefault(); updatePosition(e.touches[0].clientX); }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 860,
            margin: "0 auto",
            borderRadius: 16,
            overflow: "hidden",
            cursor: "col-resize",
            userSelect: "none",
            border: "1px solid #D4C8A8",
            boxShadow: "0 4px 32px rgba(45,61,21,0.08)",
          }}
        >
          {/* ── BASE: POLLUTED (always visible, full width) ── */}
          <div style={{
            background: "#FFF8F5",
            padding: "40px 6% 36px",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(160,32,32,0.08)", border: "1px solid rgba(160,32,32,0.2)",
              borderRadius: 20, padding: "5px 16px", marginBottom: 28,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#A02020", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#A02020" }}>POLLUTED LUNGS</span>
            </div>

            {/* Unhealthy lung SVG */}
            <svg viewBox="0 0 260 280" width="200" height="215" style={{ marginBottom: 28, display: "block" }}>
              <rect x="121" y="12" width="18" height="48" rx="9" fill="#9B5A3A" opacity="0.8"/>
              <path d="M121 56 Q95 72 80 95" stroke="#7A3A22" strokeWidth="7" fill="none" strokeLinecap="round"/>
              <path d="M139 56 Q165 72 180 95" stroke="#7A3A22" strokeWidth="7" fill="none" strokeLinecap="round"/>
              <ellipse cx="75" cy="170" rx="58" ry="72" fill="#C4826A" opacity="0.35"/>
              <ellipse cx="75" cy="170" rx="50" ry="64" fill="#A0522D" opacity="0.45"/>
              <ellipse cx="185" cy="170" rx="58" ry="72" fill="#C4826A" opacity="0.35"/>
              <ellipse cx="185" cy="170" rx="50" ry="64" fill="#A0522D" opacity="0.45"/>
              <circle cx="62" cy="148" r="14" fill="#5C2E10" opacity="0.65"/>
              <circle cx="85" cy="180" r="10" fill="#5C2E10" opacity="0.55"/>
              <circle cx="58" cy="198" r="8" fill="#5C2E10" opacity="0.5"/>
              <circle cx="80" cy="220" r="7" fill="#5C2E10" opacity="0.45"/>
              <circle cx="198" cy="145" r="13" fill="#5C2E10" opacity="0.65"/>
              <circle cx="175" cy="178" r="10" fill="#5C2E10" opacity="0.55"/>
              <circle cx="200" cy="200" r="9" fill="#5C2E10" opacity="0.5"/>
              <circle cx="177" cy="222" r="7" fill="#5C2E10" opacity="0.45"/>
              <path d="M58 160 Q65 175 60 195" stroke="#8B6914" strokeWidth="5" fill="none" opacity="0.6" strokeLinecap="round"/>
              <path d="M195 158 Q202 173 198 193" stroke="#8B6914" strokeWidth="5" fill="none" opacity="0.6" strokeLinecap="round"/>
              <circle cx="75" cy="170" r="50" fill="none" stroke="#A02020" strokeWidth="2" opacity="0.2" strokeDasharray="6 4"/>
              <circle cx="185" cy="170" r="50" fill="none" stroke="#A02020" strokeWidth="2" opacity="0.2" strokeDasharray="6 4"/>
            </svg>

            <div style={{ width: "100%", maxWidth: 300 }}>
              {UNHEALTHY_ROWS.map(r => (
                <div key={r.k} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "9px 0", borderBottom: "1px solid rgba(160,32,32,0.1)",
                }}>
                  <span style={{ fontSize: 14, color: "#5C5647" }}>{r.k}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: r.c, letterSpacing: 0.5 }}>{r.v}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16, fontSize: 13, color: "#A02020", fontStyle: "italic", textAlign: "center", lineHeight: 1.6 }}>
              Morning cough · Breathlessness · Chest heaviness
            </p>
          </div>

          {/* ── OVERLAY: HEALTHY (clipped to slider position) ── */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0,
            width: pct, overflow: "hidden", pointerEvents: "none",
          }}>
            <div style={{
              background: "#F4FBF4",
              padding: "40px 6% 36px",
              width: containerWidth,
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(74,100,34,0.08)", border: "1px solid rgba(74,100,34,0.25)",
                borderRadius: 20, padding: "5px 16px", marginBottom: 28,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4A6422", display: "inline-block" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#4A6422" }}>AFTER ROYAL SWAG</span>
              </div>

              {/* Healthy lung SVG */}
              <svg viewBox="0 0 260 280" width="200" height="215" style={{ marginBottom: 28, display: "block" }}>
                <rect x="121" y="12" width="18" height="48" rx="9" fill="#4A6422" opacity="0.85"/>
                <path d="M121 56 Q95 72 80 95" stroke="#4A6422" strokeWidth="7" fill="none" strokeLinecap="round"/>
                <path d="M139 56 Q165 72 180 95" stroke="#4A6422" strokeWidth="7" fill="none" strokeLinecap="round"/>
                <path d="M80 95 Q66 115 62 140" stroke="#6B9B5A" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M80 95 Q85 118 82 145" stroke="#6B9B5A" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M80 95 Q68 132 72 165" stroke="#6B9B5A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
                <path d="M180 95 Q194 115 198 140" stroke="#6B9B5A" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M180 95 Q175 118 178 145" stroke="#6B9B5A" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M180 95 Q192 132 188 165" stroke="#6B9B5A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
                <ellipse cx="75" cy="170" rx="58" ry="72" fill="#4A6422" opacity="0.1"/>
                <ellipse cx="75" cy="170" rx="50" ry="64" fill="#4A6422" opacity="0.18"/>
                <ellipse cx="185" cy="170" rx="58" ry="72" fill="#4A6422" opacity="0.1"/>
                <ellipse cx="185" cy="170" rx="50" ry="64" fill="#4A6422" opacity="0.18"/>
                <circle cx="60" cy="155" r="10" fill="#C49A2A" opacity="0.25"/>
                <circle cx="85" cy="190" r="8" fill="#C49A2A" opacity="0.2"/>
                <circle cx="65" cy="215" r="7" fill="#C49A2A" opacity="0.2"/>
                <circle cx="200" cy="152" r="10" fill="#C49A2A" opacity="0.25"/>
                <circle cx="175" cy="188" r="8" fill="#C49A2A" opacity="0.2"/>
                <circle cx="198" cy="215" r="7" fill="#C49A2A" opacity="0.2"/>
                <path d="M53 155 L59 161 L70 149" stroke="#4A6422" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M193 152 L199 158 L210 146" stroke="#4A6422" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              <div style={{ width: "100%", maxWidth: 300 }}>
                {HEALTHY_ROWS.map(r => (
                  <div key={r.k} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "9px 0", borderBottom: "1px solid rgba(74,100,34,0.1)",
                  }}>
                    <span style={{ fontSize: 14, color: "#5C5647" }}>{r.k}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: r.c, letterSpacing: 0.5 }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 16, fontSize: 13, color: "#4A6422", fontStyle: "italic", textAlign: "center", lineHeight: 1.6 }}>
                Feel the difference by Day 7. Full detox in 30 days.
              </p>
            </div>
          </div>

          {/* ── DRAG HANDLE ── */}
          <div
            onMouseDown={() => setDragging(true)}
            onTouchStart={(e) => { setDragging(true); updatePosition(e.touches[0].clientX); }}
            style={{
              position: "absolute", top: 0, bottom: 0,
              left: pct, transform: "translateX(-50%)",
              width: 48,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              cursor: "col-resize", zIndex: 10, pointerEvents: "all",
            }}
          >
            <div style={{
              position: "absolute", top: 0, bottom: 0, left: "50%",
              transform: "translateX(-50%)", width: 2,
              background: "#4A6422", opacity: 0.7,
            }} />
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "#2D3D15", border: "3px solid #F2E6CE",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 16px rgba(0,0,0,0.25)", zIndex: 1, flexShrink: 0,
            }}>
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                <path d="M7 1L1 7L7 13" stroke="#F2E6CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 1L19 7L13 13" stroke="#F2E6CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#5C5647", opacity: 0.6 }}>
          ← Drag to compare →
        </p>

        {/* Stats strip */}
        <div id="lung-stats" style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          gap: 16, marginTop: 48,
          padding: "28px 32px",
          background: "#fff", borderRadius: 12, border: "1px solid #D4C8A8",
        }}>
          {[
            { v: "9.78×",   l: "India PM2.5 vs WHO" },
            { v: "10 Yrs",  l: "Tar stays after quitting" },
            { v: "Day 7",   l: "When customers feel change" },
            { v: "30 Days", l: "Full detox cycle" },
          ].map(s => (
            <div key={s.v} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "var(--ff-head)", fontSize: 24,
                fontWeight: 600, color: "#4A6422", marginBottom: 4,
              }}>{s.v}</div>
              <div style={{ fontSize: 12, color: "#5C5647", lineHeight: 1.5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #lung-stats { grid-template-columns: repeat(2,1fr) !important; padding: 20px 16px !important; }
        }
      `}</style>
    </section>
  );
}
