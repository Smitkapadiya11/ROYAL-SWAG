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
        padding: "clamp(32px, 4vw, 60px) var(--px) 60px",
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

      {/* ══ LUNG HEALTH JOURNEY ══════════════════════════════ */}
      <section style={{
        background: "var(--white)",
        padding: "var(--py) 0",
        overflow: "hidden",
      }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="eyebrow">Why It Matters</span>
            <h2>What Happens Inside<br />
              <em style={{ fontStyle: "italic", color: "var(--olive)" }}>
                Your Lungs Every Day
              </em>
            </h2>
            <div className="rule rule-c" />
            <p style={{ maxWidth: 460, margin: "0 auto", fontSize: 15 }}>
              Every breath in a polluted city deposits microscopic particles
              that accumulate over years. Here is what the damage looks like —
              and how Royal Swag reverses it.
            </p>
          </div>

          {/* Timeline cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 2,
            background: "var(--sand)",
            borderRadius: "var(--r)",
            overflow: "hidden",
            border: "1px solid var(--sand)",
            marginBottom: 64,
          }}>
            {[
              {
                icon: (
                  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                    <ellipse cx="16" cy="28" rx="10" ry="14" stroke="#4A6422" strokeWidth="2"/>
                    <ellipse cx="32" cy="28" rx="10" ry="14" stroke="#4A6422" strokeWidth="2"/>
                    <path d="M16 14 Q24 6 32 14" stroke="#4A6422" strokeWidth="2" fill="none"/>
                    <path d="M20 22 Q16 26 18 32" stroke="#C49A2A" strokeWidth="1.5" fill="none"/>
                    <path d="M28 22 Q32 26 30 32" stroke="#C49A2A" strokeWidth="1.5" fill="none"/>
                  </svg>
                ),
                phase: "Phase 1", title: "Daily Exposure",
                desc: "Every breath in Indian cities deposits PM2.5 particles into bronchial passages. Your lungs filter — but they accumulate.",
                color: "var(--olive)",
              },
              {
                icon: (
                  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                    <ellipse cx="16" cy="28" rx="10" ry="14" stroke="#8B6914" strokeWidth="2"/>
                    <ellipse cx="32" cy="28" rx="10" ry="14" stroke="#8B6914" strokeWidth="2"/>
                    <path d="M16 14 Q24 6 32 14" stroke="#8B6914" strokeWidth="2" fill="none"/>
                    <circle cx="18" cy="26" r="3" fill="#C49A2A" opacity="0.4"/>
                    <circle cx="30" cy="30" r="2" fill="#C49A2A" opacity="0.4"/>
                    <circle cx="22" cy="34" r="2.5" fill="#C49A2A" opacity="0.4"/>
                  </svg>
                ),
                phase: "Phase 2", title: "Mucus & Blockage",
                desc: "Airways narrow. Mucus thickens. Morning cough begins. Breathing becomes heavier, especially on exertion.",
                color: "#8B6914",
              },
              {
                icon: (
                  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                    <ellipse cx="16" cy="28" rx="10" ry="14" stroke="#A02020" strokeWidth="2"/>
                    <ellipse cx="32" cy="28" rx="10" ry="14" stroke="#A02020" strokeWidth="2"/>
                    <path d="M16 14 Q24 6 32 14" stroke="#A02020" strokeWidth="2" fill="none"/>
                    <path d="M12 24 Q16 28 12 34" stroke="#A02020" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M36 24 Q32 28 36 34" stroke="#A02020" strokeWidth="1.5" opacity="0.6"/>
                    <circle cx="16" cy="30" r="4" fill="#A02020" opacity="0.15"/>
                    <circle cx="32" cy="30" r="4" fill="#A02020" opacity="0.15"/>
                  </svg>
                ),
                phase: "Phase 3", title: "Inflammation",
                desc: "Chronic inflammation sets in. Tar residue from smoking or pollution bonds to lung tissue. Oxygen capacity drops.",
                color: "#A02020",
              },
              {
                icon: (
                  <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                    <ellipse cx="16" cy="28" rx="10" ry="14" stroke="#2D6A2D" strokeWidth="2"/>
                    <ellipse cx="32" cy="28" rx="10" ry="14" stroke="#2D6A2D" strokeWidth="2"/>
                    <path d="M16 14 Q24 6 32 14" stroke="#2D6A2D" strokeWidth="2" fill="none"/>
                    <path d="M12 26 Q14 30 12 34" stroke="#4A6422" strokeWidth="1.5"/>
                    <path d="M36 26 Q34 30 36 34" stroke="#4A6422" strokeWidth="1.5"/>
                    <path d="M18 28 Q20 22 24 26 Q28 22 30 28" stroke="#C49A2A" strokeWidth="1.5" fill="none"/>
                  </svg>
                ),
                phase: "Royal Swag", title: "Active Repair",
                desc: "Vasaka dissolves mucus. Mulethi reduces inflammation. Pippali expands capacity. 7 herbs working together — daily.",
                color: "var(--olive)",
              },
            ].map((s) => (
              <div key={s.phase} style={{
                background: "var(--white)",
                padding: "36px 28px",
                textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <div style={{
                  width: 72, height: 72,
                  background: "var(--cream)", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                  border: `2px solid ${s.color}20`,
                }}>
                  {s.icon}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 2,
                  color: s.color, display: "block", marginBottom: 8,
                }}>
                  {s.phase.toUpperCase()}
                </span>
                <h3 style={{ fontSize: 17, marginBottom: 12, color: "var(--dark)" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--muted)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Lung stat bar */}
          <div style={{
            background: "var(--deep)", borderRadius: "var(--r)",
            padding: "36px 40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24, textAlign: "center",
          }}>
            {[
              { stat: "9.78×",  label: "India's PM2.5 vs WHO safe limit" },
              { stat: "10 Yrs", label: "Tar stays after quitting smoking" },
              { stat: "0",      label: "Clean air days in Delhi, 2025" },
              { stat: "Day 7",  label: "When most customers notice change" },
            ].map((s) => (
              <div key={s.stat}>
                <div style={{
                  fontFamily: "var(--ff-head)", fontSize: 28,
                  fontWeight: 600, color: "var(--gold)", marginBottom: 6,
                }}>{s.stat}</div>
                <div style={{
                  fontSize: 12, color: "rgba(242,230,206,0.55)", lineHeight: 1.5,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* ══ LUNG TEST CTA ═════════════════════════════════ */}
      <section style={{
        background: "var(--cream)",
        padding: "var(--py) 0",
        borderTop: "1px solid var(--border)",
      }}>
        <div className="wrap">
          <div data-grid style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64, alignItems: "center",
          }}>
            {/* Left */}
            <div>
              <span className="eyebrow">Free Assessment</span>
              <h2 style={{ marginBottom: 12 }}>
                Know Your<br />
                <em style={{ fontStyle: "italic", color: "var(--olive)" }}>
                  Lung Health Score.
                </em>
              </h2>
              <div className="rule" />
              <p style={{ marginBottom: 32, fontSize: 15 }}>
                5 questions. 2 minutes. Get a personalised report
                showing your lung risk level and which herbs
                your profile needs most.
              </p>
              <Link href="/lung-test" className="btn btn-olive">
                Take Free Lung Test →
              </Link>
            </div>

            {/* Right — risk level visual */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { level: "Mild Risk",     color: "#C49A2A", bg: "rgba(196,154,42,0.08)",  pct: 35, herbs: "Tulsi · Pippali" },
                { level: "Moderate Risk", color: "#B85C00", bg: "rgba(184,92,0,0.08)",    pct: 60, herbs: "Vasaka · Mulethi · Tulsi" },
                { level: "High Risk",     color: "#A02020", bg: "rgba(160,32,32,0.08)",   pct: 90, herbs: "Vasaka · Mulethi · Kantakari +2" },
              ].map((r) => (
                <div key={r.level} style={{
                  background: r.bg,
                  border: `1px solid ${r.color}30`,
                  borderRadius: "var(--r-sm)",
                  padding: "18px 20px",
                }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: 10,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{r.level}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>{r.herbs}</span>
                  </div>
                  <div style={{
                    height: 4, background: "rgba(0,0,0,0.08)",
                    borderRadius: 2, overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", width: `${r.pct}%`,
                      background: r.color, borderRadius: 2,
                    }} />
                  </div>
                </div>
              ))}
              <p style={{
                fontSize: 12, color: "var(--muted)",
                textAlign: "center", marginTop: 4,
              }}>
                Your result includes personalised herb recommendations
              </p>
            </div>
          </div>
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
