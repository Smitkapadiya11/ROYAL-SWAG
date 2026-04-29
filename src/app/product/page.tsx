"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { S } from "@/lib/config";

const PACKS = [
  { id: "20", bags: "20 Bags", days: "30-Day Supply", price: 349, mrp: 499, tag: "" },
  { id: "40", bags: "40 Bags", days: "60-Day Supply", price: 649, mrp: 899, tag: "Most Popular" },
  { id: "60", bags: "60 Bags", days: "90-Day Supply", price: 899, mrp: 1299, tag: "Best Value" },
];

export default function ProductPage() {
  const [pack, setPack] = useState(PACKS[0]);
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const KEY = "rs_offer_end";
    let end = parseInt(localStorage.getItem(KEY) || "0");
    if (!end || end < Date.now()) {
      end = Date.now() + 48 * 3600 * 1000;
      localStorage.setItem(KEY, String(end));
    }
    const tick = () => {
      const d = Math.max(0, end - Date.now());
      const h = String(Math.floor(d / 3600000)).padStart(2, "0");
      const m = String(Math.floor((d % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((d % 60000) / 1000)).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ── PRODUCT HERO ── */}
      <section style={{ background: "transparent", padding: "clamp(40px,6vw,80px) 0" }}>
        <div className="w">
          <div id="product-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "flex-start",
          }}>
            {/* Image panel */}
            <div style={{
              position: "sticky", top: 80,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(212,200,168,0.6)",
              padding: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: 480,
            }}>
              <Image
                src="/images/product-2.jpg"
                alt="Royal Swag Tar Out Lung Detox Tea"
                width={460} height={460}
                priority
                style={{ objectFit: "contain", width: "100%", height: "auto" }}
              />
            </div>

            {/* Info panel */}
            <div>
              {/* Cert badges */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {S.certs.map(c => (
                  <span key={c} style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
                    border: "1px solid #4A6422",
                    color: "#4A6422", borderRadius: 4, padding: "3px 9px",
                  }}>{c}</span>
                ))}
              </div>

              <span className="ey">Tar Out · Lung Detox Tea</span>
              <h1 style={{ fontSize: "clamp(26px, 3vw, 36px)", marginBottom: 4 }}>
                Royal Swag Lung Detox Tea
              </h1>
              <p style={{ fontSize: 14, color: "#5C5647", marginBottom: 20 }}>
                7 Ayurvedic herbs. Zero fillers. Zero extracts. Charaka Samhita formulation.
              </p>

              {/* Countdown */}
              <div style={{
                background: "#2D3D15", borderRadius: 6,
                padding: "12px 16px", marginBottom: 24,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 12, color: "rgba(242,230,206,0.6)", flexShrink: 0 }}>
                  Offer ends in
                </span>
                <span style={{
                  fontFamily: "var(--ff-head)", fontSize: 20, fontWeight: 600,
                  color: "#C49A2A", letterSpacing: 2,
                }}>{time}</span>
              </div>

              {/* Pack selector */}
              <p style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 2,
                color: "#5C5647", marginBottom: 12,
              }}>SELECT PACK</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {PACKS.map(p => (
                  <button key={p.id} onClick={() => setPack(p)}
                    style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px", borderRadius: 6,
                      border: `2px solid ${pack.id === p.id ? "#4A6422" : "rgba(212,200,168,0.6)"}`,
                      background: pack.id === p.id ? "rgba(74,100,34,0.04)" : "#fff",
                      cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        border: `2px solid ${pack.id === p.id ? "#4A6422" : "#D4C8A8"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {pack.id === p.id && (
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4A6422" }} />
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1A14", margin: 0 }}>{p.bags}</p>
                        <p style={{ fontSize: 12, color: "#5C5647", margin: 0 }}>{p.days}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        fontFamily: "var(--ff-head)", fontSize: 18,
                        fontWeight: 600, color: "#4A6422",
                      }}>₹{p.price}</span>
                      <span style={{
                        fontSize: 12, color: "#D4C8A8",
                        textDecoration: "line-through", marginLeft: 6,
                      }}>₹{p.mrp}</span>
                      {p.tag && (
                        <div style={{
                          fontSize: 9, fontWeight: 600, letterSpacing: 1,
                          background: "#C49A2A", color: "#2D3D15",
                          borderRadius: 3, padding: "2px 6px", marginTop: 3,
                        }}>{p.tag.toUpperCase()}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Primary CTA */}
              <a href={S.wa.url} target="_blank" rel="noopener noreferrer"
                className="b b-olive"
                style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: 16, marginBottom: 12 }}>
                Order Now — ₹{pack.price} →
              </a>

              {/* WhatsApp CTA */}
              <a href={S.wa.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, width: "100%", padding: "13px 16px",
                  background: "#E7F7EE", borderRadius: 6,
                  color: "#1A7A3A", fontSize: 14, fontWeight: 500,
                  border: "1px solid #c3e6cb", textDecoration: "none",
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1A7A3A">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order on WhatsApp
              </a>

              {/* Guarantee pills */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12, marginTop: 20,
              }}>
                {[
                  { label: "Free Delivery",    sub: "Pan India" },
                  { label: "30-Day Guarantee", sub: "Full refund" },
                  { label: "Ships in 24hrs",   sub: "Weekdays" },
                ].map(g => (
                  <div key={g.label} style={{
                    textAlign: "center", padding: "14px 8px",
                    background: "#fff", borderRadius: 6,
                    border: "1px solid rgba(212,200,168,0.6)",
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#4A6422", marginBottom: 2 }}>
                      {g.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#5C5647" }}>{g.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            #product-grid { grid-template-columns: 1fr !important; }
            #product-grid > div:first-child { position: static !important; }
          }
        `}</style>
      </section>

      {/* ── HERB STRIP ── */}
      <section style={{ background: "transparent", padding: "80px 0", borderTop: "1px solid rgba(212,200,168,0.5)" }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="ey">What&apos;s Inside</span>
            <h2>The 7-Herb Formula</h2>
            <div className="rl-c" />
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}>
            {S.herbs.map(h => (
              <div key={h.id} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "16px", background: "#fff",
                borderRadius: 6, border: "1px solid rgba(212,200,168,0.6)",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 6,
                  overflow: "hidden", flexShrink: 0, position: "relative",
                }}>
                  <Image src={h.img} alt={h.name} fill
                    style={{ objectFit: "cover" }} sizes="56px" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A14", marginBottom: 2 }}>{h.name}</p>
                  <p style={{ fontSize: 11, fontStyle: "italic", color: "#aaa", marginBottom: 4 }}>{h.bot}</p>
                  <p style={{ fontSize: 12, color: "#5C5647", lineHeight: 1.6 }}>{h.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
