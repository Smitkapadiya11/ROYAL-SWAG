import Image from "next/image";
import Link from "next/link";
import { S } from "@/lib/config";

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        background: "var(--deep)", color: "var(--cream)",
        padding: "clamp(80px,10vw,140px) var(--px) clamp(60px,8vw,100px)",
        textAlign: "center",
      }}>
        <div className="wrap">
          <span className="eyebrow" style={{ color: "rgba(196,154,42,0.7)" }}>
            Est. 2015 · Surat, Gujarat
          </span>
          <h1 style={{ color: "var(--cream)", maxWidth: 700, margin: "0 auto 20px" }}>
            Ten Years of<br />
            <em style={{ color: "var(--gold)" }}>Ayurvedic Craft.</em>
          </h1>
          <div className="rule rule-c" style={{ background: "var(--gold)" }} />
          <p style={{
            maxWidth: 540, margin: "0 auto 48px",
            color: "rgba(242,230,206,0.7)", fontSize: 16,
          }}>
            From India&apos;s first herbal cigarette to our most
            rigorously developed product — Royal Swag Lung Detox Tea.
          </p>

          {/* Stats */}
          <div style={{
            display: "inline-grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "var(--r)",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            {S.stats.map(s => (
              <div key={s.l} style={{
                padding: "24px 28px",
                background: "rgba(255,255,255,0.03)",
              }}>
                <div style={{
                  fontFamily: "var(--ff-head)", fontSize: 26,
                  fontWeight: 600, color: "var(--gold)", marginBottom: 4,
                }}>{s.v}</div>
                <div style={{ fontSize: 11, letterSpacing: 1, opacity: 0.5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .about-stats { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </section>

      {/* ── OTT BANNER ── */}
      <div style={{
        background: "var(--gold)",
        padding: "18px var(--px)",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--deep)", margin: 0 }}>
          Featured in Mirzapur (Amazon Prime) &amp; Dhurndhar (Netflix) —
          <em style={{ fontStyle: "italic", fontWeight: 400, marginLeft: 6 }}>
            The same trusted brand. Now in a cup.
          </em>
        </p>
      </div>

      {/* ── WHO WE ARE ── */}
      <section style={{ background: "var(--cream)", padding: "var(--py) 0" }}>
        <div className="wrap">
          <div data-grid style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 64, alignItems: "center",
          }}>
            <div>
              <span className="eyebrow">Who We Are</span>
              <h2>Born in Surat.<br />Built for India&apos;s Lungs.</h2>
              <div className="rule" />
              <p style={{ marginBottom: 16 }}>
                Royal Swag is the flagship wellness brand of Eximburg International
                Pvt. Ltd. — headquartered in Surat, the Growth Capital of India.
                Founded in 2015, we bring 10 years of Ayurvedic manufacturing
                expertise to every product we make.
              </p>
              <p>
                We started with India&apos;s first research-backed herbal cigarette.
                Lung Detox Tea is our most rigorously developed product to date —
                sold on Amazon India, Amazon US, and trusted by buyers across
                India, the Middle East, Europe and Southeast Asia.
              </p>
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}>
              {[
                { v: "4+ Continents", l: "Global Reach" },
                { v: "847+",          l: "Amazon Reviews" },
                { v: "5 Certs",       l: "Quality Standards" },
                { v: "Zero",          l: "Fillers or Extracts" },
              ].map(c => (
                <div key={c.l} style={{
                  background: "var(--white)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r)",
                  padding: "28px 24px",
                }}>
                  <div style={{
                    fontFamily: "var(--ff-head)", fontSize: 24,
                    fontWeight: 600, color: "var(--olive)", marginBottom: 6,
                  }}>{c.v}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{c.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section style={{ background: "var(--white)", padding: "var(--py) 0" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="eyebrow">Manufacturing</span>
            <h2>Five Certifications.<br />Zero Compromise.</h2>
            <div className="rule rule-c" />
          </div>
          <div style={{
            display: "flex", flexDirection: "column", gap: 2,
            borderRadius: "var(--r)", overflow: "hidden",
            border: "1px solid var(--border)",
          }}>
            {[
              { badge: "ISO",   title: "ISO Certified",       desc: "International quality management standards applied at every production stage." },
              { badge: "GMP",   title: "GMP Unit",             desc: "Good Manufacturing Practices — pharmaceutical-grade hygiene and process control." },
              { badge: "FSSAI", title: "FSSAI Licensed",       desc: "Compliant with India's Food Safety and Standards Authority. Safe for daily use." },
              { badge: "AYUSH", title: "AYUSH Certified Unit", desc: "Officially recognised by India's Ministry of AYUSH — the highest government validation for Ayurvedic manufacturing." },
              { badge: "LEAN",  title: "Lean Manufacturing",   desc: "Zero-waste precision system. Consistent quality, minimal contamination risk, batch-to-batch reliability." },
            ].map((c, i) => (
              <div key={c.badge} style={{
                display: "flex", gap: 24, alignItems: "center",
                padding: "20px 28px",
                background: i % 2 === 0 ? "var(--cream)" : "var(--white)",
              }}>
                <span style={{
                  flexShrink: 0, width: 64,
                  background: "var(--deep)", color: "var(--gold)",
                  borderRadius: "var(--r-sm)", padding: "6px 0",
                  textAlign: "center", fontSize: 11,
                  fontWeight: 700, letterSpacing: 1.5,
                }}>{c.badge}</span>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--dark)", fontSize: 15, marginBottom: 2 }}>
                    {c.title}
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ background: "var(--cream)", padding: "var(--py) 0" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="eyebrow">Leadership</span>
            <h2>The Founders</h2>
            <div className="rule rule-c" />
          </div>
          <div data-grid style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}>
            {S.team.map(m => (
              <div key={m.id} className="card" style={{ overflow: "hidden" }}>
                <div style={{
                  position: "relative", width: "100%", paddingBottom: "80%",
                  background: "var(--olive)",
                }}>
                  <Image
                    src={m.img}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--ff-head)", fontSize: 40,
                    fontWeight: 600, color: "rgba(242,230,206,0.3)",
                    zIndex: 0,
                  }}>{m.initials}</div>
                </div>
                <div style={{ padding: "24px 24px 28px" }}>
                  <h3 style={{ fontSize: 19, marginBottom: 4 }}>{m.name}</h3>
                  <p style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: 2,
                    color: "var(--gold)", marginBottom: 12,
                    textTransform: "uppercase",
                  }}>{m.role}</p>
                  <p style={{ fontSize: 13, lineHeight: 1.75 }}>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "var(--olive)", textAlign: "center", padding: "var(--py) 0" }}>
        <div className="wrap">
          <h2 style={{ color: "var(--cream)", marginBottom: 12 }}>
            Your Lungs Deserve Better.
          </h2>
          <div className="rule rule-c" style={{ background: "var(--gold)" }} />
          <p style={{ color: "rgba(242,230,206,0.7)", fontSize: 16, marginBottom: 32 }}>
            {S.price.now} · 20 Tea Bags · Free Delivery · COD Available
          </p>
          <Link href="/product" className="btn btn-gold">
            Order Now — {S.price.now} →
          </Link>
        </div>
      </section>
    </>
  );
}
