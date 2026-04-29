import Image from "next/image";
import Link from "next/link";
import { S } from "@/lib/config";
import LungSlider from "@/components/LungSlider";
import HerbsCircle from "@/components/HerbsCircle";
import MadeFor from "@/components/MadeFor";

export default function Home() {
  const routineSteps = [
    {
      n: "01",
      title: "Brew",
      desc: "One bag in 85–95°C water. Steep 5 minutes. No milk.",
      icon: (
        <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
          <path d="M10 16h24v16a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8V16Z" fill="none" stroke="#4A6422" strokeWidth="2.2" />
          <path d="M34 20h4a4 4 0 0 1 0 8h-4" fill="none" stroke="#4A6422" strokeWidth="2.2" />
          <path d="M16 11c0-2 2-2.8 2-4.5M23 11c0-2 2-2.8 2-4.5M30 11c0-2 2-2.8 2-4.5" fill="none" stroke="#C49A2A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      n: "02",
      title: "Drink",
      desc: "Twice daily — morning empty stomach and before bed.",
      icon: (
        <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
          <path d="M14 10h20l-2.5 24a4 4 0 0 1-4 3.6h-7a4 4 0 0 1-4-3.6L14 10Z" fill="none" stroke="#4A6422" strokeWidth="2.2" />
          <path d="M14 15h20" stroke="#C49A2A" strokeWidth="2.2" />
          <circle cx="24" cy="24" r="4.5" fill="none" stroke="#4A6422" strokeWidth="2.2" />
        </svg>
      ),
    },
    {
      n: "03",
      title: "Breathe",
      desc: "Feel change by Day 7. Full lung detox in 30 days.",
      icon: (
        <svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
          <path d="M24 9v30" stroke="#4A6422" strokeWidth="2.2" />
          <path d="M24 19c-2-4-7-6-11-3.2-4.8 3.3-3.7 12.2 2 14.2 5.3 1.8 8.4-2.9 9-7.1" fill="none" stroke="#4A6422" strokeWidth="2.2" />
          <path d="M24 19c2-4 7-6 11-3.2 4.8 3.3 3.7 12.2-2 14.2-5.3 1.8-8.4-2.9-9-7.1" fill="none" stroke="#4A6422" strokeWidth="2.2" />
          <path d="M10 36c2.5 1.8 5.1 2.7 8 2.7M30 38.7c3 0 5.5-.9 8-2.7" fill="none" stroke="#C49A2A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* ═══ 1. HERO ═══════════════════════════════════════════════ */}
      <section style={{ background: "transparent", padding: "48px 0 64px" }}>
        <div className="w">
          <div id="hero-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56, alignItems: "center",
          }}>
            {/* Text col */}
            <div>
              <span className="ey">Tar Out · Lung Detox Tea</span>
              <h1 style={{ color: "#2D3D15", marginBottom: 4, letterSpacing: "-0.5px" }}>
                Your lungs work hard.<br />
                <em style={{ fontStyle: "italic", color: "#4A6422" }}>
                  Give them a break.
                </em>
              </h1>
              <div className="rl" />
              <p style={{ fontSize: 17, maxWidth: 400, marginBottom: 28, color: "#5C5647", lineHeight: 1.75 }}>
                7 Ayurvedic herbs, a cup a day — because every morning in India,
                your lungs absorb what they were never designed to handle.
                Time to actually do something about it.
              </p>

              {/* Price badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#fff", border: "1px solid #D4C8A8",
                borderRadius: 10, padding: "12px 20px", marginBottom: 24,
              }}>
                <span style={{
                  fontFamily: "var(--ff-head)", fontSize: 30,
                  fontWeight: 700, color: "#4A6422",
                }}>{S.price.now}</span>
                <span style={{ fontSize: 14, color: "#bbb", textDecoration: "line-through" }}>
                  {S.price.was}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  background: "#C49A2A", color: "#2D3D15",
                  borderRadius: 4, padding: "2px 8px",
                }}>SAVE ₹150</span>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                <Link href="/product" className="b b-olive">Order Now →</Link>
                <Link href="/lung-test" className="b b-ghost">Free Lung Test</Link>
              </div>

              {/* Stats */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(4,auto)",
                gap: "0 24px", paddingTop: 20,
                borderTop: "1px solid #D4C8A8",
              }}>
                {S.stats.map(s => (
                  <div key={s.l}>
                    <div style={{
                      fontFamily: "var(--ff-head)", fontSize: 20,
                      fontWeight: 600, color: "#4A6422", lineHeight: 1, marginBottom: 4,
                    }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: "#5C5647" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product image col */}
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", width: "80%", height: "80%",
                background: "#4A6422", opacity: 0.06, borderRadius: "50%",
              }} />
              <Image
                src="/images/product-2.jpg"
                alt="Royal Swag Lung Detox Tea 20 bags"
                width={520} height={520}
                priority
                style={{
                  objectFit: "contain", width: "100%",
                  height: "auto", maxWidth: 520,
                  position: "relative", zIndex: 1,
                }}
              />
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            #hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
            #hero-grid > div:last-child { order: -1; }
            #hero-grid div[style*="repeat(4"] { grid-template-columns: repeat(2,auto) !important; row-gap: 16px !important; }
          }
        `}</style>
      </section>

      {/* ═══ 2. TRUST BAR ══════════════════════════════════════════ */}
      <div style={{ background: "#2D3D15", padding: "14px 0" }}>
        <div className="w" style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "center", gap: "6px 32px",
        }}>
          {[
            "FSSAI Certified", "AYUSH Certified Unit", "ISO & GMP",
            "Free Delivery", "COD Available", "30-Day Guarantee",
          ].map(t => (
            <span key={t} style={{
              color: "rgba(242,230,206,0.55)", fontSize: 11,
              fontWeight: 500, letterSpacing: "1.5px",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ═══ 3. LUNG SLIDER ════════════════════════════════════════ */}
      <LungSlider />

      {/* ═══ 4. HERBS ══════════════════════════════════════════════ */}
      <HerbsCircle />

      {/* ═══ 5. HOW IT WORKS ═══════════════════════════════════════ */}
      <section style={{
        background: "transparent", padding: "80px 0",
        borderTop: "1px solid rgba(212,200,168,0.5)",
      }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="ey">Simple Routine</span>
            <h2>Three Steps. Every Day.</h2>
            <div className="rl-c" />
          </div>
          <div id="steps-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)",
            gap: 2, background: "#D4C8A8", borderRadius: 12, overflow: "hidden",
          }}>
            {routineSteps.map(s => (
              <div key={s.n} style={{ background: "#fff", padding: "48px 32px", textAlign: "center" }}>
                <div style={{
                  width: 58,
                  height: 58,
                  margin: "0 auto 18px",
                  borderRadius: "50%",
                  border: "1px solid #D4C8A8",
                  background: "#F9F6F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {s.icon}
                </div>
                <div style={{
                  fontFamily: "var(--ff-head)", fontSize: 52, fontWeight: 700,
                  color: "#D4C8A8", lineHeight: 1, marginBottom: 20,
                }}>{s.n}</div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "#5C5647", maxWidth: 200, margin: "0 auto" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) { #steps-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ═══ 6. REVIEWS ════════════════════════════════════════════ */}
      <section style={{
        background: "transparent", padding: "80px 0",
        borderTop: "1px solid rgba(212,200,168,0.5)",
      }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="ey">Real Results</span>
            <h2>What Customers Say</h2>
            <div className="rl-c" />
            <p style={{ fontSize: 14, color: "#5C5647" }}>4.7 stars · 847+ verified Amazon reviews</p>
          </div>
          <div id="reviews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {S.reviews.slice(0, 3).map(r => (
              <div key={r.name} className="card" style={{ padding: "28px" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 18,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", background: "#4A6422",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#F2E6CE", fontSize: 13, fontWeight: 600, flexShrink: 0,
                  }}>{r.initials}</div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                    background: "#F2E6CE", color: "#4A6422",
                    border: "1px solid #4A6422", padding: "3px 8px", borderRadius: 4,
                  }}>WAS: {r.risk.toUpperCase()}</span>
                </div>
                <div style={{ color: "#C49A2A", fontSize: 14, marginBottom: 12, letterSpacing: 3 }}>★★★★★</div>
                <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7, color: "#5C5647" }}>
                  <strong style={{ color: "#2D3D15", fontWeight: 500 }}>Before: </strong>{r.before}
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#4A6422", fontWeight: 500 }}>
                  After: {r.after}
                </p>
                <p style={{
                  marginTop: 16, paddingTop: 14, borderTop: "1px solid #D4C8A8",
                  fontSize: 12, color: "#5C5647",
                }}>— {r.name}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link href="/reviews" className="b b-ghost">See All Reviews</Link>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) { #reviews-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ══ MADE FOR (includes Detox Bridge heading) ═══════════════ */}
      <MadeFor />

      {/* ═══ 8. FINAL CTA ══════════════════════════════════════════ */}
      <section style={{ background: "#2D3D15", padding: "88px 0", textAlign: "center" }}>
        <div className="w">
          <span className="ey" style={{ color: "rgba(196,154,42,0.7)" }}>Start Today</span>
          <h2 style={{ color: "#F2E6CE", maxWidth: 520, margin: "0 auto 16px" }}>
            Your Lungs Have<br />Waited Long Enough.
          </h2>
          <div className="rl-c" style={{ background: "#C49A2A" }} />
          <p style={{ color: "rgba(242,230,206,0.72)", fontSize: 16, marginBottom: 8 }}>
            {S.price.now} · 20 Tea Bags · Free Delivery · COD Available
          </p>
          <p style={{ color: "rgba(242,230,206,0.45)", fontSize: 13, marginBottom: 36 }}>
            Ships within 24 hours · 30-day money-back guarantee
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/product" className="b b-gold">Order Now — {S.price.now} →</Link>
            <Link href="/lung-test" className="b b-ghost-w">Free Lung Test</Link>
          </div>
        </div>
      </section>

      {/* ═══ MOBILE STICKY CTA ═════════════════════════════════════ */}
      <div className="sticky-m" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        zIndex: 100, background: "#2D3D15",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: "#F2E6CE", fontWeight: 600, fontSize: 13,
            overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
          }}>Royal Swag Lung Detox Tea</div>
          <div style={{ color: "#C49A2A", fontSize: 12 }}>{S.price.now} · Free delivery</div>
        </div>
        <Link href="/product" className="b b-gold" style={{ flexShrink: 0, padding: "10px 20px" }}>
          Buy Now
        </Link>
      </div>

      <style>{`
        .sticky-m { display: none; }
        @media (max-width: 768px) {
          .sticky-m { display: flex !important; }
          main { padding-bottom: 68px !important; }
        }
      `}</style>
    </>
  );
}
