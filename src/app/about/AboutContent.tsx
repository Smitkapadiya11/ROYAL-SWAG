"use client";
import Link from "next/link";
import { LeadGuardLink } from "@/components/LeadGuardLink";
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
  { icon: "🚬", title: "Ex-Smoker",      desc: "Tar and irritation can stay in lung tissue for years after you quit. Stopping smoking was step one. Clearing what's left needs daily help." },
  { icon: "🏙️", title: "City Dweller",  desc: "India's PM2.5 is nearly 10× what WHO calls safe. Delhi saw zero clean-air days in 2025. One cup a day won't fix the air — it backs up what your lungs are already fighting." },
  { icon: "🧘", title: "If you read labels", desc: "You want Sanskrit names, botanical names, and why each herb is here — not a \"proprietary blend\" hide-and-seek game. We lay it all out." },
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
  "Ten years of Ayurvedic manufacturing from Surat — we're not a fly-by-night label.",
  "AYUSH-certified unit: that's the government stamp serious Ayurveda factories chase.",
  "Every batch clears ISO, GMP, and FSSAI checks before it leaves Surat.",
  "Lean production here means less mess between batches — fewer surprises for you.",
  "This tea was revised again and again using feedback from real buyers, then checked with doctors.",
  "Same Royal Swag family as the herbal cigarettes you saw in Mirzapur (Prime) and Dhurndhar (Netflix).",
  "4.7★ and 847+ Amazon reviews — normal people, normal cough-and-traffic stories.",
  "What's on the label is what goes in the cup. No mystery powders.",
  "Pan-India free delivery, COD where we offer it, and a 30-day window if it's not your thing.",
];

// THREE founders — do not change the order
const founders = [
  {
    initials: "HS",
    name: "Hitesh Sabhadiya",
    role: "Founder & CEO",
    img: "/images/hitesh.jpeg",
    bio: "Started Eximburg to give India a cleaner ritual than tobacco. Royal Swag grew from Surat into something people order across continents — you've probably spotted us on Prime or Netflix.",
  },
  {
    initials: "MK",
    name: "Manoj Koshiya",
    role: "Co-Founder",
    img: "/images/manoj.jpeg",
    bio: "Owns R&D and the shop floor. If ISO, GMP, FSSAI, or AYUSH flags something, that batch doesn't ship. Full stop.",
  },
  {
    initials: "JS",
    name: "Jaideep Singh",
    role: "Business Director — E-Commerce & Operations",
    img: "/images/jaideep singh.jpeg",
    bio: "Twelve years selling online. He runs Amazon listings, our site, and the spreadsheets that show what's actually moving each week.",
  },
];

// ─── REUSABLE STYLES ─────────────────────────────────────
const label: React.CSSProperties = {
  fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase",
  color: "#4A6422", marginBottom: 8,
};
const sectionHeading: React.CSSProperties = {
  fontSize: "clamp(22px, 4vw, 32px)",
  fontWeight: 800, color: "#2D3D15",
  marginBottom: 16, lineHeight: 1.3,
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
        <p style={{ fontSize: 12, letterSpacing: "0.06em", opacity: 0.7, marginBottom: 12 }}>
          BY EXIMBURG INTERNATIONAL PVT. LTD. · EST. 2016 · SURAT, GUJARAT
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
          Royal Swag Lung Detox Tea
        </h1>
        <p style={{ fontSize: 16, opacity: 0.85, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.67 }}>
          Ten years making Ayurvedic goods from Surat. AYUSH-certified factory. Buyers in four continents reorder.
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
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#333", lineHeight: 1.62 }}>
          Royal Swag herbal smokes showed up on big streaming shows in India.{" "}
          <em>Same team. This time it&apos;s lung-care tea in your kitchen.</em>
        </p>
      </section>

      {/* ── WHO WE ARE ── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px" }}>
        <p style={label}>Who We Are</p>
        <h2 style={sectionHeading}>Born in Surat. Built for India&apos;s Lungs.</h2>
        <p style={{ fontSize: 16, lineHeight: 1.67, color: "#5C5647", marginBottom: 16 }}>
          Royal Swag is Eximburg International&apos;s consumer brand — home base Surat, Gujarat.
          We&apos;ve run this factory lane since 2016.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.67, color: "#5C5647" }}>
          We began with India&apos;s first research-backed herbal cigarette.
          Lung Detox Tea ate the most R&amp;D hours — every tweak came from buyer feedback and doctor sign-off.
          Amazon India, Amazon US, and theroyalswag.com ship it.
          Buyers reorder from India, the Gulf, Europe, and Southeast Asia.
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
            <p style={{ fontSize: 15, color: "#5C5647", lineHeight: 1.67 }}>
              Lung Detox Tea didn&apos;t start on a whiteboard. Our herbal-cigarette buyers kept saying their chest still felt heavy after quitting.
              We listened. We ran small batches for ex-smokers, office commuters, and people who simply read every ingredient line.
              Adjusted ratios until cough-and-winded feedback looked the same month after month.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👨‍⚕️</div>
            <h3 style={{ fontWeight: 700, color: "#2D3D15", marginBottom: 10, fontSize: 17 }}>
              Validated with Medical Guidance
            </h3>
            <p style={{ fontSize: 15, color: "#5C5647", lineHeight: 1.67, marginBottom: 16 }}>
              Before cartons left Surat, Ayurvedic doctors checked each herb, ratio, and dose.
              Anything that was there only because marketing liked the ring of it did not stay in the mix.
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D3D15", fontStyle: "italic", margin: 0 }}>
              &ldquo;We treated this like medicine paperwork — not a trending hashtag.&rdquo;
            </p>
          </div>
        </div>
        <div style={{
          marginTop: 32, background: "#F2E6CE", borderRadius: 10,
          padding: "20px 24px", borderLeft: "4px solid #4A6422",
        }}>
          <p style={{ margin: 0, fontSize: 15, color: "#5C5647", lineHeight: 1.67, fontStyle: "italic" }}>
            Plenty of labels launch first and hunt for buyers later. We had buyers asking for a lung tea before the SKU even had a barcode.
            We shipped wide only once those same people said the cup actually helped.
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
          <p style={{ textAlign: "center", opacity: 0.75, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.67 }}>
            Made in our Surat plant — ISO, GMP, FSSAI, AYUSH, LEAN on the wall because customs officers and moms both ask.
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
                  flexShrink: 0, alignSelf: "center",
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
          <p style={{ textAlign: "center", color: "var(--rs-text)", marginBottom: 40, fontSize: 15, lineHeight: 1.67 }}>
            The blend nods to Charaka Samhita thinking — old-school Ayurveda text, not a lab gimmick.
            Still zero fillers and zero extracts today.
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
                <div style={{ fontSize: 11, color: "var(--rs-olive)", fontWeight: 700, marginBottom: 6, letterSpacing: "0.06em" }}>
                  HERB <span className="brand-number-sm">{String(i + 1).padStart(2, "0")}</span>
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
                <span style={{ fontSize: 14, color: "var(--rs-text)", lineHeight: 1.67 }}>{point}</span>
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
                <p style={{ fontSize: 12, color: "#4A6422", fontWeight: 700, marginBottom: 16, lineHeight: 1.6 }}>
                  {f.role}
                </p>
                <p style={{ fontSize: 14, color: "#5C5647", lineHeight: 1.67, margin: 0 }}>
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
          <LeadGuardLink href="/product" style={{
            background: "#C49A2A", color: "#1A1A1A", padding: "15px 36px",
            borderRadius: 8, fontWeight: 800, fontSize: 17, textDecoration: "none",
          }}>
            Order Now — ₹349 →
          </LeadGuardLink>
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
