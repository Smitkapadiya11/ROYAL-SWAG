import Image from "next/image";
import Link from "next/link";
import { S } from "@/lib/config";

export default function Home() {
  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════ */}
      <section style={{
        minHeight: "100svh",
        background: "var(--cream)",
        display: "flex", alignItems: "center",
        padding: "80px var(--px) 60px",
      }}>
        <div className="wrap" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "center",
          width: "100%",
        }}>
          {/* Text */}
          <div>
            <span className="eyebrow">Tar Out · Lung Detox Tea</span>
            <h1 style={{ color: "var(--deep)", marginBottom: 4, letterSpacing: "-1px" }}>
              Your Lungs<br />
              <em style={{ fontStyle: "italic", color: "var(--olive)" }}>Deserve Better.</em>
            </h1>
            <div className="rule" />
            <p style={{ fontSize: 17, maxWidth: 420, marginBottom: 36, color: "var(--muted)" }}>
              7 ancient Ayurvedic herbs — formulated to cleanse, repair,
              and protect your lungs from pollution and smoking damage.
            </p>

            {/* Price box */}
            <div style={{
              display: "inline-flex", alignItems: "baseline",
              gap: 10, marginBottom: 28,
              padding: "12px 20px",
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r)",
            }}>
              <span style={{
                fontFamily: "var(--ff-head)", fontSize: 32,
                fontWeight: 700, color: "var(--olive)",
              }}>{S.price.now}</span>
              <span style={{
                fontSize: 15, color: "var(--sand)",
                textDecoration: "line-through",
              }}>{S.price.was}</span>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 1,
                color: "var(--white)", background: "var(--gold)",
                borderRadius: 4, padding: "2px 8px",
              }}>SAVE ₹150</span>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
              <Link href="/product" className="btn btn-olive">
                Order Now →
              </Link>
              <Link href="/lung-test" className="btn btn-ghost">
                Free Lung Test
              </Link>
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, auto)",
              gap: "0 28px",
              paddingTop: 24,
              borderTop: "1px solid var(--border)",
            }}>
              {S.stats.map(s => (
                <div key={s.l}>
                  <div style={{
                    fontFamily: "var(--ff-head)", fontSize: 22,
                    fontWeight: 600, color: "var(--olive)", lineHeight: 1,
                    marginBottom: 4,
                  }}>{s.v}</div>
                  <div style={{ fontSize: 11, letterSpacing: 0.5, color: "var(--muted)" }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product image */}
          <div style={{
            position: "relative",
            display: "flex", justifyContent: "center", alignItems: "center",
          }}>
            <div style={{
              position: "absolute", inset: "8%",
              background: "var(--olive)", opacity: 0.07,
              borderRadius: "50%",
            }} />
            <Image
              src="/images/product/product-2.jpg"
              alt="Royal Swag Tar Out Lung Detox Tea 20 bags"
              width={560} height={560}
              priority
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-wrap { grid-template-columns: 1fr !important; gap: 32px !important; }
            .hero-img   { order: -1; }
            .hero-stats { grid-template-columns: repeat(2, auto) !important; row-gap: 16px !important; }
          }
        `}</style>
      </section>

      {/* ══ TRUST BAR ═════════════════════════════════════ */}
      <div style={{
        background: "var(--deep)", padding: "16px 0",
        overflow: "hidden",
      }}>
        <div style={{
          display: "flex", justifyContent: "center",
          flexWrap: "wrap", gap: "8px 36px",
          padding: "0 var(--px)",
        }}>
          {[
            "FSSAI Certified",
            "AYUSH Certified Unit",
            "ISO & GMP",
            "Free Delivery",
            "COD Available",
            "30-Day Guarantee",
            "Featured on Amazon Prime & Netflix",
          ].map(t => (
            <span key={t} style={{
              color: "rgba(242,230,206,0.55)",
              fontSize: 11, fontWeight: 500, letterSpacing: 1.8,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ══ HERBS ═════════════════════════════════════════ */}
      <section className="section" id="herbs"
        style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="eyebrow">The Formula</span>
            <h2>Seven Herbs.<br />One Purpose.</h2>
            <div className="rule rule-c" />
            <p style={{ maxWidth: 420, margin: "0 auto", fontSize: 15 }}>
              No extracts. No fillers. Every herb chosen for
              one specific reason.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 1,
            background: "var(--sand)",
            borderRadius: "var(--r)",
            overflow: "hidden",
            border: "1px solid var(--sand)",
          }}>
            {S.herbs.map((h, i) => (
              <div key={h.id} style={{
                background: "var(--white)",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{
                  position: "relative",
                  width: "100%", paddingBottom: "65%",
                  overflow: "hidden",
                  background: "var(--cream)",
                }}>
                  <Image
                    src={h.img}
                    alt={h.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", top: 14, left: 14,
                    background: "var(--deep)", color: "var(--gold)",
                    fontSize: 10, fontWeight: 600, letterSpacing: 2,
                    padding: "4px 10px", borderRadius: 4,
                  }}>
                    0{i + 1}
                  </div>
                </div>
                <div style={{ padding: "22px 24px 28px", flex: 1 }}>
                  <span style={{
                    fontSize: 10, letterSpacing: 2.5, fontWeight: 600,
                    color: "var(--gold)", textTransform: "uppercase",
                  }}>
                    {h.role}
                  </span>
                  <h3 style={{
                    fontSize: 19, marginTop: 6, marginBottom: 3,
                    color: "var(--dark)",
                  }}>{h.name}</h3>
                  <p style={{
                    fontSize: 12, fontStyle: "italic",
                    color: "#aaa", marginBottom: 10,
                  }}>{h.bot}</p>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--muted)" }}>
                    {h.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════ */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="eyebrow">Simple Routine</span>
            <h2>Three Steps. Every Day.</h2>
            <div className="rule rule-c" />
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            background: "var(--sand)",
            borderRadius: "var(--r)", overflow: "hidden",
            border: "1px solid var(--sand)",
          }}>
            {[
              { n: "01", title: "Brew",    desc: "Steep one bag in hot water (85–95°C) for 5 minutes. No milk. No sugar needed." },
              { n: "02", title: "Drink",   desc: "Twice daily — morning on an empty stomach and again before bed." },
              { n: "03", title: "Breathe", desc: "Feel airways open within days. A complete lung detox in 30 days." },
            ].map(s => (
              <div key={s.n} style={{
                background: "var(--white)",
                padding: "52px 36px",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "var(--ff-head)",
                  fontSize: 56, fontWeight: 700,
                  color: "var(--cream)", lineHeight: 1,
                  marginBottom: 20,
                }}>{s.n}</div>
                <h3 style={{ fontSize: 21, marginBottom: 14 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.75, maxWidth: 220, margin: "0 auto" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
          <style>{`
            @media (max-width: 768px) {
              .steps-3col { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ══ WHO NEEDS THIS ════════════════════════════════ */}
      <section className="section" style={{ background: "var(--deep)", color: "var(--cream)" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="eyebrow" style={{ color: "rgba(196,154,42,0.7)" }}>
              Who It&apos;s For
            </span>
            <h2 style={{ color: "var(--cream)" }}>Made for Three People</h2>
            <div className="rule rule-c" style={{ background: "var(--gold)" }} />
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}>
            {[
              { icon: "◈", title: "Ex-Smokers",    desc: "Tar stays in your lungs up to 10 years after quitting. Quitting alone is not enough — active repair is essential." },
              { icon: "◉", title: "City Dwellers",  desc: "India's air quality is 9.78x the WHO safe limit. This tea is your daily defence from the inside." },
              { icon: "◇", title: "Wellness Buyers", desc: "We show you every herb, its Sanskrit name, and exactly why it's in this formula. No hidden blends." },
            ].map(c => (
              <div key={c.title} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "var(--r)",
                padding: "36px 28px",
              }}>
                <div style={{
                  fontSize: 24, color: "var(--gold)",
                  marginBottom: 16, fontWeight: 300,
                }}>{c.icon}</div>
                <h3 style={{
                  fontSize: 18, color: "var(--cream)",
                  marginBottom: 12,
                }}>{c.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.65 }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
          <style>{`
            @media (max-width: 768px) {
              .who-3col { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ══ REVIEWS STRIP ═════════════════════════════════ */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="eyebrow">Real Results</span>
            <h2>What Customers Say</h2>
            <div className="rule rule-c" />
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              4.7 stars · 847+ verified reviews
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}>
            {S.reviews.slice(0, 3).map(r => (
              <div key={r.name} className="card" style={{ padding: "32px 28px" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: 20,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "var(--olive)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--cream)", fontSize: 13, fontWeight: 600,
                  }}>{r.initials}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
                    color: "var(--white)", background: "var(--olive)",
                    padding: "3px 10px", borderRadius: 4,
                  }}>{r.risk.toUpperCase()}</span>
                </div>
                <div style={{ color: "var(--gold)", fontSize: 14, marginBottom: 14, letterSpacing: 2 }}>
                  ★★★★★
                </div>
                <p style={{
                  fontSize: 13, color: "var(--muted)",
                  marginBottom: 8, lineHeight: 1.65,
                }}>
                  <strong style={{ color: "var(--deep)", fontWeight: 500 }}>Before: </strong>
                  {r.before}
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--olive)", fontWeight: 500 }}>
                  After: {r.after}
                </p>
                <p style={{
                  marginTop: 20, fontSize: 12, fontWeight: 600,
                  color: "var(--muted)", letterSpacing: 0.3,
                }}>— {r.name}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/reviews" className="btn btn-ghost">
              See All Reviews
            </Link>
          </div>
          <style>{`
            @media (max-width: 768px) {
              .reviews-3col { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════ */}
      <section style={{
        background: "var(--olive)",
        padding: "var(--py) var(--px)",
        textAlign: "center",
      }}>
        <div className="wrap">
          <span className="eyebrow" style={{ color: "rgba(196,154,42,0.7)" }}>
            Start Today
          </span>
          <h2 style={{
            color: "var(--cream)",
            maxWidth: 560, margin: "0 auto 16px",
          }}>
            Your Lungs Have<br />Waited Long Enough.
          </h2>
          <div className="rule rule-c" style={{ background: "var(--gold)" }} />
          <p style={{
            color: "rgba(242,230,206,0.72)", fontSize: 16, marginBottom: 36,
          }}>
            {S.price.now} · 20 Tea Bags · Free Delivery · COD Available
          </p>
          <div style={{
            display: "flex", gap: 14,
            justifyContent: "center", flexWrap: "wrap",
          }}>
            <Link href="/product" className="btn btn-gold">
              Order Now — {S.price.now} →
            </Link>
            <Link href="/lung-test" className="btn btn-ghost-light">
              Take Free Lung Test
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
