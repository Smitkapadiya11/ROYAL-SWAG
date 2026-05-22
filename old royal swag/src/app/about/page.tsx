import Image from "next/image";
import Link from "next/link";
import { LeadGuardLink } from "@/components/LeadGuardLink";
import { S } from "@/lib/config";

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{
        background: "#2D3D15",
        padding: "clamp(100px,10vw,140px) 0 clamp(64px,7vw,96px)",
        textAlign: "center",
      }}>
        <div className="w">
          <span className="ey" style={{ color: "rgba(196,154,42,0.7)" }}>
            Est. 2016 · Surat, Gujarat
          </span>
          <h1 style={{
            color: "#F2E6CE", maxWidth: 680, margin: "0 auto 16px",
          }}>
            Nearly a decade of making<br />
            <em style={{ fontStyle: "italic", color: "#C49A2A" }}>
              Ayurvedic products that actually work.
            </em>
          </h1>
          <div className="rl-c" style={{ background: "#C49A2A" }} />
          <p style={{
            color: "rgba(242,230,206,0.7)", fontSize: 17,
            maxWidth: 540, margin: "0 auto 52px", lineHeight: 1.8,
          }}>
            From India&apos;s first research-backed herbal cigarette
            to our most rigorous product to date.
          </p>

          {/* Stats grid */}
          <div style={{
            display: "inline-grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 14, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
          }} id="about-hero-stats">
            {S.stats.map(s => (
              <div key={s.l} style={{
                padding: "22px 28px",
                background: "rgba(255,255,255,0.03)",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "var(--ff-head)", fontSize: 26,
                  fontWeight: 600, color: "#C49A2A", marginBottom: 4,
                }}>{s.v}</div>
                <div style={{
                  fontSize: 11, opacity: 0.5, color: "#F2E6CE",
                }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 640px) {
            #about-hero-stats { grid-template-columns: repeat(2,1fr) !important; }
          }
        `}</style>
      </section>

      {/* ── OTT BANNER ───────────────────────────────────────────── */}
      <div style={{
        background: "#C49A2A", padding: "18px 0", textAlign: "center",
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#2D3D15", margin: 0 }}>
          Featured in Mirzapur (Amazon Prime) &amp; Dhurndhar (Netflix) —
          <em style={{ fontStyle: "italic", fontWeight: 400, marginLeft: 6 }}>
            The same trusted brand. Now in a cup.
          </em>
        </p>
      </div>

      {/* ── ORIGIN STORY ─────────────────────────────────────────── */}
      <section style={{ padding: "80px 0" }}>
        <div className="w">
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 64, alignItems: "center",
          }} id="about-origin-grid">

            <div>
              <span className="ey">Where it started</span>
              <h2 style={{ marginBottom: 8 }}>
                We didn&apos;t build this<br />
                <em style={{ fontStyle: "italic", color: "#4A6422" }}>
                  from a boardroom.
                </em>
              </h2>
              <div className="rl" />
              <p style={{ fontSize: 16, color: "#5C5647", lineHeight: 1.67, marginBottom: 16 }}>
                Royal Swag was born in Surat in 2016 with one product: India&apos;s first
                research-backed herbal cigarette. That product found its customers in
                ex-smokers who wanted the ritual without the poison.
                And those customers told us something that changed everything.
              </p>
              <p style={{ fontSize: 16, color: "#5C5647", lineHeight: 1.67, marginBottom: 16 }}>
                They had quit smoking. But their lungs still felt wrong. The cough.
                The heaviness. Breathlessness that lingered months after the last cigarette.
                They were doing everything right — and their bodies hadn&apos;t caught up.
              </p>
              <p style={{ fontSize: 16, color: "#5C5647", lineHeight: 1.67 }}>
                Lung Detox Tea was built to answer that.
                Not in a lab with extracts and fillers — through 18 months
                of customer trials, Ayurvedic consultation,
                and batch-by-batch refinement until the results were
                consistent enough to put our name on it.
              </p>
            </div>

            <div style={{
              background: "#fff",
              borderRadius: 16, border: "1px solid #D4C8A8",
              padding: "36px 32px",
            }}>
              <p style={{
                fontFamily: "var(--ff-head)", fontSize: 21,
                fontStyle: "italic", color: "#2D3D15",
                lineHeight: 1.6, marginBottom: 20,
              }}>
                &ldquo;Most brands launch a product and then find their customers.
                We found our customers first —
                and then built the product they were asking for.&rdquo;
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#4A6422" }}>
                — Hitesh Sabhadiya, Founder &amp; CEO
              </p>
              <div style={{
                marginTop: 28, paddingTop: 24,
                borderTop: "1px solid #D4C8A8",
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
              }}>
                {[
                  { v: "18 mo",     l: "Customer trials" },
                  { v: "7 herbs",   l: "Final formula" },
                  { v: "3 doctors", l: "Medical validation" },
                  { v: "4 batches", l: "Before launch" },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{
                      fontFamily: "var(--ff-head)", fontSize: 20,
                      fontWeight: 600, color: "#4A6422", marginBottom: 2,
                    }}>{s.v}</div>
                    <div style={{ fontSize: 12, color: "#5C5647" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            #about-origin-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          }
        `}</style>
      </section>

      {/* ── WHO WE ARE ───────────────────────────────────────────── */}
      <section style={{
        background: "transparent", padding: "80px 0",
        borderTop: "1px solid rgba(212,200,168,0.5)",
      }}>
        <div className="w">
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 56, alignItems: "start",
          }} id="about-who-grid">
            <div>
              <span className="ey">Who We Are</span>
              <h2>Born in Surat.<br />Built for India&apos;s Lungs.</h2>
              <div className="rl" />
              <p style={{ marginBottom: 16, fontSize: 15, lineHeight: 1.67, color: "#5C5647" }}>
                Royal Swag is Eximburg International&apos;s tea and herbal line — based in Surat, Gujarat.
                We&apos;ve been making Ayurvedic goods since 2016.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.67, color: "#5C5647" }}>
                We began with India&apos;s first research-backed herbal cigarette.
                Lung Detox Tea took longer to get right — more trials, more tweaks.
                It ships on Amazon India, Amazon US, and our site to buyers here and abroad.
              </p>
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
            }}>
              {[
                { v: "4+ Continents", l: "Global Reach" },
                { v: "847+",          l: "Amazon Reviews" },
                { v: "5 Certs",       l: "Quality Standards" },
                { v: "Zero",          l: "Fillers or Extracts" },
              ].map(c => (
                <div key={c.l} style={{
                  background: "#fff", border: "1px solid #D4C8A8",
                  borderRadius: 12, padding: "28px 24px",
                }}>
                  <div style={{
                    fontFamily: "var(--ff-head)", fontSize: 24,
                    fontWeight: 600, color: "#4A6422", marginBottom: 6,
                  }}>{c.v}</div>
                  <div style={{ fontSize: 12, color: "#5C5647" }}>{c.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            #about-who-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          }
        `}</style>
      </section>

      {/* ── CERTIFICATIONS ───────────────────────────────────────── */}
      <section style={{
        background: "transparent", padding: "80px 0",
        borderTop: "1px solid rgba(212,200,168,0.5)",
      }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="ey">Manufacturing</span>
            <h2>Five Certifications.<br />Zero Compromise.</h2>
            <div className="rl-c" />
          </div>
          <div style={{
            display: "flex", flexDirection: "column", gap: 2,
            borderRadius: 12, overflow: "hidden",
            border: "1px solid #D4C8A8",
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
                background: i % 2 === 0 ? "rgba(212,200,168,0.25)" : "transparent",
              }}>
                <span style={{
                  flexShrink: 0, width: 64,
                  background: "#2D3D15", color: "#C49A2A",
                  borderRadius: 6, padding: "6px 0",
                  textAlign: "center", fontSize: 11,
                  fontWeight: 700, letterSpacing: 1.5,
                }}>{c.badge}</span>
                <div>
                  <p style={{ fontWeight: 600, color: "#1A1A14", fontSize: 15, marginBottom: 2 }}>
                    {c.title}
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.67, color: "#5C5647" }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDERS ─────────────────────────────────────────────── */}
      <section style={{
        background: "transparent", padding: "80px 0",
        borderTop: "1px solid rgba(212,200,168,0.5)",
      }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="ey">Leadership</span>
            <h2>The Founders</h2>
            <div className="rl-c" />
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
          }} id="about-founders">
            {S.team.map(m => (
              <div key={m.id} className="card" style={{ overflow: "hidden" }}>
                {/* Circular photo */}
                <div style={{
                  padding: "32px 28px 20px",
                  display: "flex", justifyContent: "center",
                  background: "#fff",
                }}>
                  <div style={{
                    width: 148, height: 148, borderRadius: "50%",
                    overflow: "hidden", position: "relative",
                    border: "4px solid #F2E6CE",
                    outline: "2px solid #4A6422",
                    background: "#4A6422",
                    flexShrink: 0,
                  }}>
                    <Image
                      src={m.img}
                      alt={m.name}
                      fill
                      sizes="148px"
                      style={{ objectFit: "cover", objectPosition: "top center" }}
                    />
                  </div>
                </div>
                {/* Text */}
                <div style={{ padding: "0 24px 32px", textAlign: "center" }}>
                  <h3 style={{ fontSize: 18, marginBottom: 4 }}>{m.name}</h3>
                  <p style={{
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#C49A2A", textTransform: "uppercase" as const, marginBottom: 14,
                  }}>{m.role}</p>
                  <p style={{ fontSize: 13, color: "#5C5647", lineHeight: 1.67 }}>
                    {m.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            #about-founders { grid-template-columns: 1fr !important; }
          }
          @media (min-width: 901px) and (max-width: 1080px) {
            #about-founders { grid-template-columns: repeat(2,1fr) !important; }
          }
        `}</style>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section style={{ background: "#2D3D15", textAlign: "center", padding: "80px 0" }}>
        <div className="w">
          <h2 style={{ color: "#F2E6CE", marginBottom: 12 }}>
            Your Lungs Deserve Better.
          </h2>
          <div className="rl-c" style={{ background: "#C49A2A" }} />
          <p style={{ color: "rgba(242,230,206,0.7)", fontSize: 16, marginBottom: 32 }}>
            {S.price.now} · 20 Tea Bags · Free Delivery · COD Available
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <LeadGuardLink href="/product" className="b b-gold">
              Order Now — {S.price.now} →
            </LeadGuardLink>
            <Link href="/lung-test" className="b b-ghost-w">
              Free Lung Test
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
