import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/config";

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        minHeight: "92vh",
        background: "linear-gradient(160deg, #F2E6CE 0%, #EAD9B5 100%)",
        display: "flex", alignItems: "center",
        padding: "80px var(--section-px) 60px",
      }}>
        <div className="container hero-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64, alignItems: "center",
          width: "100%",
        }}>
          {/* Left */}
          <div>
            <span className="eyebrow">Tar Out · Lung Detox Tea</span>
            <h1 style={{ marginBottom: 20, color: "var(--rs-deep)" }}>
              Your Lungs<br />Deserve Better.
            </h1>
            <div className="divider" />
            <p style={{ fontSize: 18, maxWidth: 440, marginBottom: 36, lineHeight: 1.8 }}>
              7 ancient Ayurvedic herbs — scientifically formulated to cleanse, repair, and protect your lungs from pollution and smoking damage.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
              <Link href="/product" className="btn-primary">
                Order Now — {SITE.price.display} →
              </Link>
              <Link href="/lung-test" className="btn-outline">
                Free Lung Test
              </Link>
            </div>
            {/* Stats row */}
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {SITE.stats.map((s) => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: "var(--font-heading)", fontSize: 22,
                    fontWeight: 600, color: "var(--rs-olive)",
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--rs-text)", letterSpacing: 0.5 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product visual */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{
              background: "linear-gradient(135deg, var(--rs-olive) 0%, var(--rs-deep) 100%)",
              borderRadius: "var(--r-lg)", padding: 40,
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 24, maxWidth: 400, width: "100%",
            }}>
              <Image
                src={SITE.herbs[0].image}
                alt="Vasaka herb — Royal Swag Lung Detox Tea"
                width={180}
                height={180}
                style={{ objectFit: "cover", borderRadius: "50%", border: "4px solid rgba(196,154,42,0.4)" }}
              />
              <div style={{ textAlign: "center", color: "var(--rs-cream)" }}>
                <div style={{
                  fontFamily: "var(--font-heading)", fontSize: 24,
                  fontWeight: 700, marginBottom: 6,
                }}>
                  Royal Swag
                </div>
                <div style={{ fontSize: 13, opacity: 0.75, letterSpacing: 1 }}>
                  LUNG DETOX TEA · 20 BAGS
                </div>
              </div>
              <div style={{
                background: "rgba(196,154,42,0.2)", border: "1px solid rgba(196,154,42,0.4)",
                borderRadius: "var(--r-md)", padding: "12px 24px", textAlign: "center",
              }}>
                <span style={{ color: "var(--rs-gold)", fontWeight: 700, fontSize: 22 }}>
                  {SITE.price.display}
                </span>
                <span style={{ color: "rgba(242,230,206,0.5)", fontSize: 13, marginLeft: 8, textDecoration: "line-through" }}>
                  {SITE.price.mrp}
                </span>
                <div style={{ color: "rgba(242,230,206,0.65)", fontSize: 11, marginTop: 4, letterSpacing: 0.5 }}>
                  FREE DELIVERY · COD AVAILABLE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: "var(--rs-olive)", padding: "20px 0" }}>
        <div className="container" style={{
          display: "flex", justifyContent: "center",
          flexWrap: "wrap", gap: "12px 40px",
        }}>
          {[
            "FSSAI Certified",
            "AYUSH Certified Unit",
            "ISO · GMP",
            "Free Delivery Pan India",
            "COD Available",
            "30-Day Guarantee",
          ].map((item) => (
            <span key={item} style={{
              color: "rgba(242,230,206,0.8)", fontSize: 12,
              fontWeight: 500, letterSpacing: 1.5,
            }}>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── HERBS SECTION ── */}
      <section className="section section--white" id="herbs">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="eyebrow">The Formula</span>
            <h2>7 Herbs. One Purpose.</h2>
            <div className="divider divider--center" />
            <p style={{ maxWidth: 480, margin: "0 auto", fontSize: 16 }}>
              No extracts. No fillers. Every herb chosen for a specific reason.
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 2,
            background: "var(--rs-sand)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
          }}>
            {SITE.herbs.map((herb) => (
              <div key={herb.id} style={{ background: "var(--rs-white)", overflow: "hidden" }}>
                <div style={{ position: "relative", width: "100%", paddingBottom: "70%", overflow: "hidden" }}>
                  <Image
                    src={herb.image}
                    alt={`${herb.name} — ${herb.benefit}`}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "20px 22px 24px" }}>
                  <span style={{ fontSize: 10, letterSpacing: 2, color: "var(--rs-gold)", fontWeight: 600 }}>
                    {herb.role.toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: 18, marginTop: 6, marginBottom: 4, fontWeight: 600 }}>
                    {herb.name}
                  </h3>
                  <p style={{ fontSize: 12, fontStyle: "italic", color: "#999", marginBottom: 8 }}>
                    {herb.botanical}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>{herb.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="eyebrow">Simple Routine</span>
            <h2>Three Steps. Daily.</h2>
            <div className="divider divider--center" />
          </div>
          <div className="steps-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2, background: "var(--rs-sand)",
            borderRadius: "var(--r-lg)", overflow: "hidden",
          }}>
            {[
              { step: "01", title: "Brew",    desc: "Steep one tea bag in 85–95°C water for 5 minutes." },
              { step: "02", title: "Drink",   desc: "Take twice daily — morning on empty stomach and before bed." },
              { step: "03", title: "Breathe", desc: "Notice airways open within days. Full detox in 30 days." },
            ].map((s) => (
              <div key={s.step} style={{
                background: "var(--rs-white)", padding: "48px 36px", textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "var(--font-heading)", fontSize: 52,
                  fontWeight: 700, color: "var(--rs-sand)", marginBottom: 16,
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="section section--white">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="eyebrow">Real Results</span>
            <h2>What Customers Say</h2>
            <div className="divider divider--center" />
            <p style={{ color: "var(--rs-text)", fontSize: 15 }}>
              4.7 stars · 847+ verified Amazon reviews
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}>
            {[
              { name: "Ananya S., Delhi",  text: "Morning cough of 3 years — gone in 3 weeks. Real Ayurveda.",          risk: "Moderate Risk" },
              { name: "Rohit K., Mumbai",  text: "Quit smoking 8 months ago but chest was heavy. Two weeks changed that.", risk: "High Risk" },
              { name: "Priya M., Surat",   text: "Seasonal allergies every October. Started early this year — sailed through.", risk: "Mild Risk" },
            ].map((r) => (
              <div key={r.name} className="card" style={{ padding: "32px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "var(--rs-gold)", marginBottom: 16 }}>
                  WAS: {r.risk.toUpperCase()}
                </div>
                <div style={{ fontSize: 18, color: "var(--rs-gold)", marginBottom: 16, letterSpacing: 2 }}>
                  ★★★★★
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 20, color: "var(--rs-dark)" }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--rs-olive)", margin: 0 }}>
                  — {r.name}
                </p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/reviews" className="btn-outline">
              See All 847 Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section section--olive">
        <div className="container" style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ color: "rgba(242,230,206,0.6)" }}>
            Start Today
          </span>
          <h2 style={{ color: "var(--rs-cream)", marginBottom: 12 }}>
            Your Lungs Have Waited<br />Long Enough.
          </h2>
          <div className="divider divider--center" style={{ background: "var(--rs-gold)" }} />
          <p style={{ color: "rgba(242,230,206,0.75)", fontSize: 17, marginBottom: 36 }}>
            {SITE.price.display} · 20 Tea Bags · Free Delivery · COD Available
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/product" className="btn-gold">
              Order Now — {SITE.price.display} →
            </Link>
            <Link href="/lung-test" style={{
              display: "inline-flex", alignItems: "center",
              color: "rgba(242,230,206,0.8)", fontSize: 15,
              padding: "14px 32px",
              border: "1px solid rgba(242,230,206,0.3)",
              borderRadius: "var(--r-md)",
            }}>
              Take Free Lung Test
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
