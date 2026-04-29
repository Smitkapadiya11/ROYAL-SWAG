import Image from "next/image";
import Link from "next/link";
import { S } from "@/lib/config";

export default function Home() {
  return (
    <>
      {/* ═══ 1. HERO ═══════════════════════════════════════════════ */}
      <section style={{ background: "#F2E6CE", padding: "48px 0 64px" }}>
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
                Your Lungs<br />
                <em style={{ fontStyle: "italic", color: "#4A6422" }}>Deserve Better.</em>
              </h1>
              <div className="rl" />
              <p style={{ fontSize: 17, maxWidth: 400, marginBottom: 28, color: "#5C5647", lineHeight: 1.75 }}>
                7 ancient Ayurvedic herbs — formulated to cleanse, repair,
                and protect your lungs from pollution and smoking damage.
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

      {/* ═══ 3. LUNG COMPARISON ════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "80px 0" }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="ey">Why It Matters</span>
            <h2>Healthy Lungs vs<br />
              <em style={{ fontStyle: "italic", color: "#4A6422" }}>Polluted Lungs</em>
            </h2>
            <div className="rl-c" />
            <p style={{ maxWidth: 440, margin: "0 auto", fontSize: 15, color: "#5C5647" }}>
              See exactly what pollution and smoking do inside your lungs —
              and how Royal Swag reverses it.
            </p>
          </div>

          {/* Before / After */}
          <div id="lung-compare" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 2, background: "#D4C8A8", borderRadius: 12,
            overflow: "hidden", marginBottom: 48,
          }}>
            {/* Unhealthy */}
            <div style={{ background: "#fff", padding: "40px 32px", textAlign: "center" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(160,32,32,0.08)", border: "1px solid rgba(160,32,32,0.2)",
                borderRadius: 20, padding: "5px 16px", marginBottom: 28,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#A02020", display: "inline-block" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#A02020" }}>POLLUTED LUNGS</span>
              </div>
              <svg viewBox="0 0 200 220" width="160" height="176" style={{ margin: "0 auto 24px", display: "block" }}>
                <rect x="92" y="10" width="16" height="40" rx="8" fill="#8B4513" opacity="0.7"/>
                <ellipse cx="70" cy="130" rx="52" ry="70" fill="#8B4513" opacity="0.3"/>
                <ellipse cx="70" cy="130" rx="45" ry="62" fill="#A0522D" opacity="0.4"/>
                <ellipse cx="130" cy="130" rx="52" ry="70" fill="#8B4513" opacity="0.3"/>
                <ellipse cx="130" cy="130" rx="45" ry="62" fill="#A0522D" opacity="0.4"/>
                <circle cx="58" cy="110" r="12" fill="#5C3317" opacity="0.6"/>
                <circle cx="80" cy="145" r="9" fill="#5C3317" opacity="0.5"/>
                <circle cx="55" cy="155" r="7" fill="#5C3317" opacity="0.45"/>
                <circle cx="140" cy="105" r="11" fill="#5C3317" opacity="0.6"/>
                <circle cx="122" cy="140" r="8" fill="#5C3317" opacity="0.5"/>
                <circle cx="148" cy="155" r="10" fill="#5C3317" opacity="0.55"/>
                <path d="M50 120 Q60 130 55 145" stroke="#8B6914" strokeWidth="4" fill="none" opacity="0.6"/>
                <path d="M138 115 Q148 128 143 148" stroke="#8B6914" strokeWidth="4" fill="none" opacity="0.6"/>
                <path d="M100 50 Q80 70 70 90" stroke="#6B3A2A" strokeWidth="5" fill="none" strokeLinecap="round"/>
                <path d="M100 50 Q120 70 130 90" stroke="#6B3A2A" strokeWidth="5" fill="none" strokeLinecap="round"/>
              </svg>
              <div style={{ marginBottom: 20 }}>
                {[
                  { label: "Airways", status: "Blocked",    color: "#A02020" },
                  { label: "Mucus",   status: "Excessive",  color: "#A02020" },
                  { label: "Oxygen",  status: "Restricted", color: "#A02020" },
                  { label: "Energy",  status: "Depleted",   color: "#A02020" },
                ].map(r => (
                  <div key={r.label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: "1px solid #f0e8e8",
                  }}>
                    <span style={{ fontSize: 13, color: "#5C5647" }}>{r.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: r.color }}>{r.status}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#A02020", fontStyle: "italic", lineHeight: 1.6 }}>
                Daily symptoms: morning cough, breathlessness, chest heaviness, fatigue
              </p>
            </div>

            {/* Healthy */}
            <div style={{ background: "#F7FBF4", padding: "40px 32px", textAlign: "center" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(74,100,34,0.08)", border: "1px solid rgba(74,100,34,0.25)",
                borderRadius: 20, padding: "5px 16px", marginBottom: 28,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4A6422", display: "inline-block" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#4A6422" }}>AFTER ROYAL SWAG</span>
              </div>
              <svg viewBox="0 0 200 220" width="160" height="176" style={{ margin: "0 auto 24px", display: "block" }}>
                <rect x="92" y="10" width="16" height="40" rx="8" fill="#4A6422" opacity="0.8"/>
                <ellipse cx="70" cy="130" rx="52" ry="70" fill="#4A6422" opacity="0.15"/>
                <ellipse cx="70" cy="130" rx="45" ry="62" fill="#4A6422" opacity="0.25"/>
                <ellipse cx="130" cy="130" rx="52" ry="70" fill="#4A6422" opacity="0.15"/>
                <ellipse cx="130" cy="130" rx="45" ry="62" fill="#4A6422" opacity="0.25"/>
                <path d="M100 50 Q80 70 70 90" stroke="#4A6422" strokeWidth="5" fill="none" strokeLinecap="round"/>
                <path d="M100 50 Q120 70 130 90" stroke="#4A6422" strokeWidth="5" fill="none" strokeLinecap="round"/>
                <path d="M70 90 Q58 105 55 120" stroke="#6B9B5A" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M70 90 Q75 110 72 130" stroke="#6B9B5A" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M130 90 Q142 105 145 120" stroke="#6B9B5A" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M130 90 Q125 110 128 130" stroke="#6B9B5A" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <circle cx="58" cy="125" r="8" fill="#C49A2A" opacity="0.3"/>
                <circle cx="78" cy="150" r="6" fill="#C49A2A" opacity="0.25"/>
                <circle cx="142" cy="122" r="8" fill="#C49A2A" opacity="0.3"/>
                <circle cx="122" cy="148" r="6" fill="#C49A2A" opacity="0.25"/>
                <path d="M52 125 L57 130 L66 120" stroke="#4A6422" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M136 122 L141 127 L150 117" stroke="#4A6422" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ marginBottom: 20 }}>
                {[
                  { label: "Airways",  status: "Clear",     color: "#4A6422" },
                  { label: "Mucus",    status: "Dissolved", color: "#4A6422" },
                  { label: "Oxygen",   status: "Flowing",   color: "#4A6422" },
                  { label: "Energy",   status: "Restored",  color: "#4A6422" },
                ].map(r => (
                  <div key={r.label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: "1px solid rgba(74,100,34,0.1)",
                  }}>
                    <span style={{ fontSize: 13, color: "#5C5647" }}>{r.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: r.color }}>{r.status}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#4A6422", fontStyle: "italic", lineHeight: 1.6 }}>
                Most customers feel the difference by Day 7. Full detox in 30 days.
              </p>
            </div>
          </div>

          {/* Stat strip */}
          <div id="lung-stats" style={{
            background: "#2D3D15", borderRadius: 12, padding: "32px 40px",
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            gap: 24, textAlign: "center",
          }}>
            {[
              { v: "9.78×",   l: "India PM2.5 vs WHO limit" },
              { v: "10 Yrs",  l: "Tar stays after quitting" },
              { v: "Day 7",   l: "When customers feel change" },
              { v: "30 Days", l: "Full detox cycle" },
            ].map(s => (
              <div key={s.v}>
                <div style={{
                  fontFamily: "var(--ff-head)", fontSize: 26,
                  fontWeight: 600, color: "#C49A2A", marginBottom: 6,
                }}>{s.v}</div>
                <div style={{ fontSize: 12, color: "rgba(242,230,206,0.5)", lineHeight: 1.5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            #lung-compare { grid-template-columns: 1fr !important; }
            #lung-stats   { grid-template-columns: repeat(2,1fr) !important; }
          }
        `}</style>
      </section>

      {/* ═══ 4. HERBS ══════════════════════════════════════════════ */}
      <section style={{ background: "#F2E6CE", padding: "80px 0" }} id="herbs">
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="ey">The Formula</span>
            <h2>Seven Herbs.<br />
              <em style={{ fontStyle: "italic", color: "#4A6422" }}>One Purpose.</em>
            </h2>
            <div className="rl-c" />
            <p style={{ maxWidth: 400, margin: "0 auto", fontSize: 15, color: "#5C5647" }}>
              No extracts. No fillers. Every herb chosen for one specific reason.
            </p>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 2, background: "#D4C8A8", borderRadius: 12,
            overflow: "hidden", border: "1px solid #D4C8A8",
          }}>
            {S.herbs.map((h, i) => (
              <div key={h.id} style={{ background: "#fff" }}>
                <div style={{
                  position: "relative", width: "100%",
                  aspectRatio: "4/3", overflow: "hidden", background: "#F2E6CE",
                }}>
                  <Image
                    src={h.img}
                    alt={h.name}
                    fill
                    sizes="(max-width:768px) 100vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", top: 12, left: 12,
                    background: "#2D3D15", color: "#C49A2A",
                    fontSize: 10, fontWeight: 700, letterSpacing: 2,
                    padding: "4px 10px", borderRadius: 4,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div style={{ padding: "20px 22px 26px" }}>
                  <span style={{
                    fontSize: 10, letterSpacing: 2.5, fontWeight: 600,
                    color: "#C49A2A", textTransform: "uppercase" as const,
                  }}>{h.role}</span>
                  <h3 style={{ fontSize: 18, marginTop: 6, marginBottom: 3, color: "#1A1A14" }}>{h.name}</h3>
                  <p style={{ fontSize: 12, fontStyle: "italic", color: "#aaa", marginBottom: 8 }}>{h.bot}</p>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "#5C5647" }}>{h.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. HOW IT WORKS ═══════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "80px 0" }}>
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
            {[
              { n: "01", title: "Brew",    desc: "One bag in 85–95°C water. Steep 5 minutes. No milk." },
              { n: "02", title: "Drink",   desc: "Twice daily — morning empty stomach and before bed." },
              { n: "03", title: "Breathe", desc: "Feel change by Day 7. Full lung detox in 30 days." },
            ].map(s => (
              <div key={s.n} style={{ background: "#fff", padding: "48px 32px", textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--ff-head)", fontSize: 52, fontWeight: 700,
                  color: "#F2E6CE", lineHeight: 1, marginBottom: 20,
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
      <section style={{ background: "#F2E6CE", padding: "80px 0" }}>
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

      {/* ═══ 7. WHO NEEDS THIS ═════════════════════════════════════ */}
      <section style={{ background: "#2D3D15", padding: "80px 0" }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="ey" style={{ color: "rgba(196,154,42,0.7)" }}>Who It&apos;s For</span>
            <h2 style={{ color: "#F2E6CE" }}>Made for Three People</h2>
            <div className="rl-c" style={{ background: "#C49A2A" }} />
          </div>
          <div id="who-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { title: "Ex-Smokers",     desc: "Tar stays in your lungs up to 10 years after quitting. Quitting alone is not enough — active repair is essential." },
              { title: "City Dwellers",  desc: "India's PM2.5 is 9.78× the WHO safe limit. This tea is your daily defence from the inside out." },
              { title: "Wellness Buyers", desc: "Every herb shown with its Sanskrit name and exact purpose. No hidden blends. Full transparency." },
            ].map(c => (
              <div key={c.title} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: "32px 26px",
              }}>
                <h3 style={{ color: "#F2E6CE", fontSize: 18, marginBottom: 12 }}>{c.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(242,230,206,0.6)" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) { #who-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ═══ 8. FINAL CTA ══════════════════════════════════════════ */}
      <section style={{ background: "#4A6422", padding: "80px 0", textAlign: "center" }}>
        <div className="w">
          <span className="ey" style={{ color: "rgba(196,154,42,0.7)" }}>Start Today</span>
          <h2 style={{ color: "#F2E6CE", maxWidth: 520, margin: "0 auto 16px" }}>
            Your Lungs Have<br />Waited Long Enough.
          </h2>
          <div className="rl-c" style={{ background: "#C49A2A" }} />
          <p style={{ color: "rgba(242,230,206,0.72)", fontSize: 16, marginBottom: 32 }}>
            {S.price.now} · 20 Tea Bags · Free Delivery · COD Available
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
