"use client";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/config";

// ─── DATA ────────────────────────────────────────────────
const stats = [
  { value: "2016",           label: "Founded" },
  { value: "8+ Years",       label: "Industry Exp." },
  { value: "4.7 ★",         label: "Amazon Rating" },
  { value: "4+ Continents", label: "Global Reach" },
];

const certBadges = ["ISO", "GMP", "FSSAI", "AYUSH", "LEAN"];

const certDetails = [
  { badge: "ISO",   title: "ISO Certified",       desc: "International quality management standards at every production stage" },
  { badge: "GMP",   title: "GMP Unit",             desc: "Pharmaceutical-grade hygiene and process control" },
  { badge: "FSSAI", title: "FSSAI Licensed",       desc: "Safe for daily consumption — compliant with India's food safety authority" },
  { badge: "AYUSH", title: "AYUSH Certified Unit", desc: "India's highest government recognition for Ayurvedic manufacturing" },
  { badge: "LEAN",  title: "Lean Manufacturing",   desc: "Zero-waste precision production — consistent quality every batch" },
];

const whyBuilt = [
  { icon: "🚬", title: "Ex-Smoker",      desc: "Tar & inflammation stay in your lungs up to 10 years after quitting. Quitting alone is not enough — active repair is essential." },
  { icon: "🏙️", title: "City Dweller",  desc: "India's PM2.5 is 9.78x the WHO safe limit. Delhi recorded zero clean air days in 2025. This tea is daily defence from the inside." },
  { icon: "🧘", title: "Wellness Buyer", desc: "You read labels. We show you every herb, its Sanskrit name, and exactly why it is in this formula. No hidden blends." },
];

const herbs = [
  { name: "Vasaka",      botanical: "Adhatoda vasica",       benefit: "Breaks down mucus, opens airways — Charaka's primary lung herb" },
  { name: "Mulethi",     botanical: "Glycyrrhiza glabra",    benefit: "Soothes inflamed airways, reduces chronic cough" },
  { name: "Tulsi",       botanical: "Ocimum sanctum",        benefit: "Anti-inflammatory, fights respiratory infections" },
  { name: "Pippali",     botanical: "Piper longum",          benefit: "Expands lung capacity, improves oxygen absorption" },
  { name: "Kantakari",   botanical: "Solanum xanthocarpum",  benefit: "Relieves bronchitis, clears blocked airways" },
  { name: "Bibhitaki",   botanical: "Terminalia bellirica",  benefit: "Prevents infection, clears accumulated lung toxins" },
  { name: "Pushkarmool", botanical: "Inula racemosa",        benefit: "Deep lung purification, reduces pulmonary inflammation" },
];

const trustPoints = [
  "10 years of Ayurvedic manufacturing from Surat, Gujarat — not a new or unknown brand",
  "AYUSH Certified Unit — India's highest government recognition for Ayurvedic manufacturing",
  "ISO · GMP · FSSAI — triple-verified quality at every production stage",
  "Lean Manufacturing facility — consistent quality, zero compromise on every batch",
  "Formula developed through real customer trials and doctor-validated therapeutic ratios",
  "Royal Swag Herbal Cigarettes featured in Mirzapur (Amazon Prime) & Dhurndhar (Netflix)",
  "4.7 stars · 847+ verified Amazon reviews — real buyers, real breathing results",
  "100% natural — zero artificial additives, zero chemicals, full ingredient transparency",
  "Free delivery · COD available · 30-day results commitment",
];

// THREE founders — do not change the order
const founders = [
  {
    initials: "HS",
    name: "Hitesh Sabhadiya",
    role: "Founder & CEO",
    img: "/images/hitesh.jpeg",
    bio: "The driving force behind Royal Swag. Hitesh built Eximburg International with one goal: give India a smarter, cleaner alternative to tobacco. Under his leadership, Royal Swag grew from a local Surat brand into a multi-continent exporter — now featured on Amazon Prime and Netflix.",
  },
  {
    initials: "MK",
    name: "Manoj Koshiya",
    role: "Co-Founder",
    img: "/images/manoj.jpeg",
    bio: "The quality and product architect at Eximburg. Manoj leads R&D, formulation, and manufacturing quality control — ensuring every batch meets ISO, GMP, FSSAI and AYUSH standards before it ships. His attention to process consistency is what makes Royal Swag's results reproducible at scale.",
  },
  {
    initials: "JS",
    name: "Jaideep Singh",
    role: "Business Director — E-Commerce & Operations",
    img: "/images/jaideep singh.jpeg",
    bio: "The digital growth engine of Royal Swag. 12 years of e-commerce experience. Jaideep leads Amazon strategy, D2C operations and business analytics — making sure Royal Swag reaches the right buyer, on the right platform, at exactly the right moment.",
  },
];

// ─── REUSABLE STYLES ─────────────────────────────────────
const label: React.CSSProperties = {
  fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
  color: "#4A6422", marginBottom: 8,
};
const sectionHeading: React.CSSProperties = {
  fontSize: "clamp(22px, 4vw, 32px)",
  fontWeight: 800, color: "#2D3D15",
  marginBottom: 16, lineHeight: 1.25,
};

// ─── PAGE ─────────────────────────────────────────────────
export default function AboutContent() {
  void SITE_CONFIG; // referenced for config-based info used in the footer CTA

  return (
    <main style={{ background: "#fff", color: "#1A1A14" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(135deg, #2D3D15 0%, #4A6422 100%)",
        color: "#fff", padding: "64px 24px 48px", textAlign: "center",
      }}>
        <p style={{ fontSize: 12, letterSpacing: 3, opacity: 0.7, marginBottom: 12 }}>
          BY EXIMBURG INTERNATIONAL PVT. LTD. · EST. 2016 · SURAT, GUJARAT
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
          Royal Swag Lung Detox Tea
        </h1>
        <p style={{ fontSize: 16, opacity: 0.85, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.6 }}>
          10 years of Ayurvedic manufacturing expertise. AYUSH certified. Trusted across 4 continents.
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32, marginBottom: 40 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#C49A2A" }}>{s.value}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Cert badge pills */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {certBadges.map((b) => (
            <span key={b} style={{
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700,
            }}>
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ── OTT BANNER ── */}
      <section style={{ background: "#C49A2A", padding: "18px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#1A1A1A" }}>
          🎥 As Seen on Screen —{" "}
          <strong>Mirzapur (Amazon Prime)</strong> · <strong>Dhurndhar (Netflix)</strong>
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#333" }}>
          Royal Swag Herbal Cigarettes featured on India&apos;s most-watched platforms.{" "}
          <em>The same trusted brand. Now delivering lung healing — in a cup.</em>
        </p>
      </section>

      {/* ── WHO WE ARE ── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px" }}>
        <p style={label}>Who We Are</p>
        <h2 style={sectionHeading}>Born in Surat. Built for India&apos;s Lungs.</h2>
        <p style={{ fontSize: 16, lineHeight: 1.85, color: "#5C5647", marginBottom: 16 }}>
          Royal Swag is the flagship wellness brand of Eximburg International Pvt. Ltd. — proudly
          headquartered in Surat, the Growth Capital of India and the diamond &amp; textile powerhouse
          of Gujarat. Founded in 2016, we bring nearly a decade of Ayurvedic manufacturing expertise.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.85, color: "#5C5647" }}>
          We started with India&apos;s first research-backed herbal cigarette and have since built a
          complete wellness range — with Lung Detox Tea as our most rigorously developed product.
          Sold on Amazon India, Amazon US, and theroyalswag.com — trusted by buyers across India,
          the Middle East, Europe and Southeast Asia.
        </p>
      </section>

      {/* ── WHY WE BUILT THIS ── */}
      <section style={{ background: "#F2E6CE", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ ...label, textAlign: "center" }}>Why We Built This</p>
          <h2 style={{ ...sectionHeading, textAlign: "center", marginBottom: 40 }}>
            Three People Who Need This Tea
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {whyBuilt.map((c) => (
            <div key={c.title} style={{
                background: "#fff", borderRadius: 12, padding: "28px 24px",
                borderLeft: "4px solid #4A6422",
              }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{c.icon}</div>
              <h3 style={{ fontWeight: 700, color: "#2D3D15", marginBottom: 8, fontSize: 17 }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: "#5C5647", lineHeight: 1.75, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW DEVELOPED ── */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
        <p style={label}>Development Process</p>
        <h2 style={sectionHeading}>How This Tea Was Actually Developed</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 36 }}>
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
            <h3 style={{ fontWeight: 700, color: "#2D3D15", marginBottom: 10, fontSize: 17 }}>
              Born from Real Buyer Feedback
            </h3>
            <p style={{ fontSize: 15, color: "#5C5647", lineHeight: 1.85 }}>
              Royal Swag Lung Detox Tea wasn&apos;t created in a boardroom. It came directly from our
              existing herbal cigarette customers — real people who told us what their lungs still
              needed after quitting. We ran trials across ex-smokers, urban commuters, and wellness
              buyers, refining the formula batch by batch until the results were consistent and
              repeatable. No shortcuts. No guesswork.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👨‍⚕️</div>
            <h3 style={{ fontWeight: 700, color: "#2D3D15", marginBottom: 10, fontSize: 17 }}>
              Validated with Medical Guidance
            </h3>
            <p style={{ fontSize: 15, color: "#5C5647", lineHeight: 1.85, marginBottom: 16 }}>
              Before we shipped a single box, we sat down with qualified Ayurvedic doctors and
              healthcare professionals to validate every herb, ratio, and dose. Every ingredient has
              a defined reason for being there. Nothing is in this formula for show.
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D3D15", fontStyle: "italic", margin: 0 }}>
              &ldquo;This is a health product built with clinical respect and complete buyer honesty.&rdquo;
            </p>
          </div>
        </div>
        <div style={{
          marginTop: 32, background: "#F2E6CE", borderRadius: 10,
          padding: "20px 24px", borderLeft: "4px solid #4A6422",
        }}>
          <p style={{ margin: 0, fontSize: 15, color: "#5C5647", lineHeight: 1.75, fontStyle: "italic" }}>
            Most brands launch a product, then find customers. We did the opposite. Our Lung Detox
            Tea formula was stress-tested by real buyers first — and only launched when the results
            earned their approval.
          </p>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section style={{ background: "var(--rs-deep)", color: "#fff", padding: "60px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...label, color: "var(--rs-gold)", textAlign: "center" }}>Quality Standards</p>
          <h2 style={{ ...sectionHeading, color: "#fff", textAlign: "center", marginBottom: 12 }}>
            Our Manufacturing Standard
          </h2>
          <p style={{ textAlign: "center", opacity: 0.75, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Every batch produced in our state-of-the-art Surat facility — holding five of the most
            demanding quality certifications in Indian wellness.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {certDetails.map((c) => (
              <div key={c.badge} style={{
                display: "flex", gap: 20, alignItems: "flex-start",
                background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "16px 20px",
              }}>
                <span style={{
                  background: "var(--rs-gold)", color: "#1A1A1A", borderRadius: 6,
                  padding: "4px 12px", fontWeight: 800, fontSize: 11,
                  flexShrink: 0, alignSelf: "center", letterSpacing: 1,
                }}>
                  {c.badge}
                </span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{c.title}</div>
                  <div style={{ fontSize: 13, opacity: 0.72, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7-HERB FORMULA ── */}
      <section style={{ padding: "60px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <p style={{ ...label, textAlign: "center" }}>The Formula</p>
          <h2 style={{ ...sectionHeading, textAlign: "center", marginBottom: 8 }}>
            The 7-Herb Ayurvedic Formula
          </h2>
          <p style={{ textAlign: "center", color: "var(--rs-text)", marginBottom: 40, fontSize: 15 }}>
            Rooted in the Charaka Samhita — 5,000 years of wisdom. Zero fillers. Zero extracts.
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}>
            {herbs.map((h, i) => (
              <div key={h.name} style={{
                background: "var(--rs-cream)", borderRadius: 12, padding: "24px 20px",
                borderTop: "3px solid var(--rs-olive)",
              }}>
                <div style={{ fontSize: 11, color: "var(--rs-olive)", fontWeight: 700, marginBottom: 6, letterSpacing: 2 }}>
                  HERB {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--rs-deep)", marginBottom: 2 }}>{h.name}</div>
                <div style={{ fontSize: 12, fontStyle: "italic", color: "var(--rs-text)", marginBottom: 12 }}>{h.botanical}</div>
                <p style={{ fontSize: 14, color: "var(--rs-text)", lineHeight: 1.7, margin: 0 }}>{h.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BULLETS ── */}
      <section style={{ background: "var(--rs-cream)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ ...sectionHeading, textAlign: "center", marginBottom: 36 }}>
            Why You Can Trust Royal Swag
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {trustPoints.map((point) => (
              <div key={point} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "var(--rs-olive)", fontSize: 18, flexShrink: 0, marginTop: 2, fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 14, color: "var(--rs-text)", lineHeight: 1.7 }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDERS — 3 PEOPLE ── */}
      <section style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ ...label, textAlign: "center" }}>Leadership</p>
          <h2 style={{ ...sectionHeading, textAlign: "center", marginBottom: 48 }}>
            The Team Behind Royal Swag
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 28,
          }}>
            {founders.map((f) => (
              <div key={f.name} style={{
                background: "#F2E6CE", borderRadius: 16, padding: "36px 28px",
                textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #4A6422",
                  marginBottom: 18, flexShrink: 0,
                  position: "relative",
                }}>
                  <Image
                    src={f.img}
                    alt={f.name}
                    fill
                    sizes="80px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h3 style={{ fontWeight: 800, color: "#2D3D15", marginBottom: 4, fontSize: 17 }}>
                  {f.name}
                </h3>
                <p style={{ fontSize: 12, color: "#4A6422", fontWeight: 700, marginBottom: 16, lineHeight: 1.4 }}>
                  {f.role}
                </p>
                <p style={{ fontSize: 14, color: "#5C5647", lineHeight: 1.75, margin: 0 }}>
                  {f.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        background: "linear-gradient(135deg, #2D3D15 0%, #4A6422 100%)",
        color: "#fff", padding: "64px 24px", textAlign: "center",
      }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, marginBottom: 12 }}>
          Your Lungs Have Waited Long Enough.
        </h2>
        <p style={{ opacity: 0.85, fontSize: 16, marginBottom: 6 }}>
          ₹349 · 20 Tea Bags · Free Delivery · COD Available
        </p>
        <p style={{ opacity: 0.65, fontSize: 13, marginBottom: 36 }}>
          theroyalswag.com · Amazon India · Amazon US
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/product" style={{
            background: "#C49A2A", color: "#1A1A1A", padding: "15px 36px",
            borderRadius: 8, fontWeight: 800, fontSize: 17, textDecoration: "none",
          }}>
            Order Now — ₹349 →
          </Link>
          <Link href="/lung-test" style={{
            background: "transparent", color: "#fff", padding: "15px 36px",
            borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: "none",
            border: "2px solid rgba(255,255,255,0.45)",
          }}>
            Take Free Lung Test
          </Link>
        </div>
        <p style={{ fontSize: 11, opacity: 0.45, marginTop: 40, lineHeight: 1.8 }}>
          Eximburg International Pvt. Ltd. · Surat, Gujarat 394185 · ISO · GMP · FSSAI · AYUSH
          <br />
          These statements have not been evaluated by FSSAI as a drug. This product is not intended
          to diagnose, treat, cure, or prevent any disease. Results may vary.
        </p>
      </section>

    </main>
  );
}
