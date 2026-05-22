"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { S } from "@/lib/config";
import LungSlider from "@/components/LungSlider";
import HerbFlipCard from "@/components/HerbFlipCard";
import MadeFor from "@/components/MadeFor";

const HERBS = [
  {
    name: "Vasaka",
    role: "The Airway Opener",
    latin: "Adhatoda vasica",
    benefit: "Opens bronchial passages and breaks down mucus",
    detail:
      "Vasaka has been used in Ayurveda for 3,000 years specifically for respiratory conditions. It relaxes bronchial muscles, liquefies stubborn mucus, and makes it easier to expel â€” critical for smokers and city dwellers.",
    image: "/images/vasaka.jpg",
  },
  {
    name: "Tulsi",
    role: "The Sacred Healer",
    latin: "Ocimum sanctum",
    benefit: "Anti-inflammatory, fights respiratory infections",
    detail:
      "Called the Queen of Herbs, Tulsi acts as a natural respiratory filter. It reduces inflammation in the airways, fights viral and bacterial infections, and its volatile oils directly cleanse lung tissue with every cup.",
    image: "/images/tulsi.jpg",
  },
  {
    name: "Mulethi",
    role: "The Soother",
    latin: "Glycyrrhiza glabra",
    benefit: "Soothes inflamed airways, eases chronic cough",
    detail:
      "Mulethi coats the throat and bronchial lining with a protective layer. Glycyrrhizin, its active compound, reduces swelling, suppresses chronic cough reflex, and accelerates healing of irritated tissue.",
    image: "/images/mulethi.jpg",
  },
  {
    name: "Pippali",
    role: "The Reviver",
    latin: "Piper longum",
    benefit: "Expands lung capacity, improves oxygen absorption",
    detail:
      "Long pepper increases bioavailability of the entire formula while directly improving lung capacity. It opens collapsed alveoli and enhances oxygen exchange â€” measurably noticeable when climbing stairs.",
    image: "/images/pippali.jpg",
  },
  {
    name: "Kantakari",
    role: "The Cleanser",
    latin: "Solanum xanthocarpum",
    benefit: "Relieves bronchitis, clears blocked airways",
    detail:
      "Kantakari targets bronchitis and chronic obstruction. It relaxes the smooth muscle of the bronchial tubes, relieves spasms, and clears accumulated debris from the lower respiratory tract.",
    image: "/images/kantakari.jpg",
  },
  {
    name: "Bibhitaki",
    role: "The Protector",
    latin: "Terminalia bellirica",
    benefit: "Prevents infection, clears accumulated lung toxins",
    detail:
      "One of the three fruits in Triphala, Bibhitaki has powerful antimicrobial action. It prevents recurring respiratory infections, clears old toxin deposits, and strengthens the mucous membrane lining.",
    image: "/images/bibhitaki.jpg",
  },
  {
    name: "Pushkarmool",
    role: "The Deep Purifier",
    latin: "Inula racemosa",
    benefit: "Deep lung purification, reduces pulmonary inflammation",
    detail:
      "The rarest herb in our formula. Pushkarmool reaches deep lung tissue, reduces pulmonary inflammation at the cellular level, and helps expel particles from the deepest alveolar spaces â€” essential for high-pollution exposure.",
    image: "/images/pushkarmool.jpg",
  },
] as const;

export default function Home() {
  const router = useRouter();
  const routineSteps = [
    {
      n: "01",
      title: "Brew",
      desc: "One bag in 85â€“95Â°C water. Steep 5 minutes. No milk.",
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
      desc: "Twice daily â€” morning empty stomach and before bed.",
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
      desc: "Most buyers notice breathing feels easier around week two. Stick with one box â€” thatâ€™s the real test.",
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
      {/* â•â•â• 1. HERO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        style={{
          background: "linear-gradient(160deg, #0A1A0A 0%, #0F2A0F 45%, #162E10 100%)",
          padding: "48px 0 64px",
        }}
      >
        <div className="w">
          <div id="hero-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56, alignItems: "center",
          }}>
            {/* Text col */}
            <div>
              <span className="ey">Tar Out Â· Lung Detox Tea</span>
              <h1 style={{ color: "#2D3D15", marginBottom: 4, letterSpacing: "-0.5px" }}>
                Your lungs work hard.<br />
                <em style={{ fontStyle: "italic", color: "#4A6422" }}>
                  Give them a break.
                </em>
              </h1>
              <div className="rl" />
              <p style={{ fontSize: 17, maxWidth: 420, marginBottom: 28, color: "#5C5647", lineHeight: 1.67 }}>
                Seven Ayurvedic herbs. One cup a day.
                Pollution, smoke, dust â€” most of us breathe it whether we choose to or not.
                This tea is for people who want to help their lungs catch up.
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
                  fontSize: 10, fontWeight: 700,
                  background: "#C49A2A", color: "#2D3D15",
                  borderRadius: 4, padding: "2px 8px",
                }}>SAVE â‚¹150</span>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                <button type="button" className="b b-olive" onClick={() => router.push("/product")}>
                  Order Now â†’
                </button>
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

      {/* â•â•â• 2. TRUST BAR â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
              fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* â•â•â• 3. LUNG SLIDER â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <LungSlider />

      {/* â•â•â• 4. HERBS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        id="herbs"
        style={{
          padding: "clamp(64px, 8vw, 112px) 0",
          background: "#FFFFFF",
        }}
      >
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: "clamp(48px,6vw,80px)" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C49A2A",
                fontFamily: "var(--font-sans)",
                marginBottom: 16,
              }}
            >
              The Formula
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(32px,4vw,52px)",
                color: "#0A1A0A",
                marginBottom: 16,
              }}
            >
              Seven Herbs. <em style={{ color: "#2D6A2D" }}>One Purpose.</em>
            </h2>
            <p
              style={{
                maxWidth: 520,
                margin: "0 auto",
                color: "#6B6B6B",
                fontSize: "clamp(15px,1.2vw,17px)",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.7,
              }}
            >
              Hover each card. Real ingredients — names you recognise from Ayurveda, not a lab slip.
              Exactly what you steep in your cup.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "clamp(16px,2vw,24px)",
            }}
          >
            {HERBS.map((h) => (
              <HerbFlipCard key={h.name} {...h} />
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â• 5. HOW IT WORKS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
                <div className="brand-number-lg" style={{ color: "#D4C8A8", marginBottom: 20 }}>{s.n}</div>
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

      {/* â•â•â• 6. REVIEWS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section style={{
        background: "transparent", padding: "80px 0",
        borderTop: "1px solid rgba(212,200,168,0.5)",
      }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="ey">Real Results</span>
            <h2>What Customers Say</h2>
            <div className="rl-c" />
            <p style={{ fontSize: 14, color: "#5C5647" }}>4.7 stars Â· 847+ verified Amazon reviews</p>
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
                    fontSize: 9, fontWeight: 700,
                    background: "#F2E6CE", color: "#4A6422",
                    border: "1px solid #4A6422", padding: "3px 8px", borderRadius: 4,
                  }}>WAS: {r.risk.toUpperCase()}</span>
                </div>
                <div style={{ color: "#C49A2A", fontSize: 14, marginBottom: 12 }}>â˜…â˜…â˜…â˜…â˜…</div>
                <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7, color: "#5C5647" }}>
                  <strong style={{ color: "#2D3D15", fontWeight: 500 }}>Before: </strong>{r.before}
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#4A6422", fontWeight: 500 }}>
                  After: {r.after}
                </p>
                <p style={{
                  marginTop: 16, paddingTop: 14, borderTop: "1px solid #D4C8A8",
                  fontSize: 12, color: "#5C5647",
                }}>â€” {r.name}</p>
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

      {/* â•â• MADE FOR (includes Detox Bridge heading) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <MadeFor />

      {/* â•â•â• 8. FINAL CTA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section style={{ background: "#2D3D15", padding: "88px 0", textAlign: "center" }}>
        <div className="w">
          <span className="ey" style={{ color: "rgba(196,154,42,0.7)" }}>Start Today</span>
          <h2 style={{ color: "#F2E6CE", maxWidth: 520, margin: "0 auto 16px" }}>
            Your Lungs Have<br />Waited Long Enough.
          </h2>
          <div className="rl-c" style={{ background: "#C49A2A" }} />
          <p style={{ color: "rgba(242,230,206,0.72)", fontSize: 16, marginBottom: 8 }}>
            {S.price.now} Â· 20 Tea Bags Â· Free Delivery Â· COD Available
          </p>
          <p style={{ color: "rgba(242,230,206,0.45)", fontSize: 13, marginBottom: 36 }}>
            Ships within 24 hours Â· 30-day money-back guarantee
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" className="b b-gold" onClick={() => router.push("/product")}>
              Order Now â€” {S.price.now} â†’
            </button>
            <Link href="/lung-test" className="b b-ghost-w">Free Lung Test</Link>
          </div>
        </div>
      </section>

      {/* â•â•â• MOBILE STICKY CTA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
          <div style={{ color: "#C49A2A", fontSize: 12 }}>{S.price.now} Â· Free delivery</div>
        </div>
        <button
          type="button"
          className="b b-gold"
          style={{ flexShrink: 0, padding: "10px 20px" }}
          onClick={() => router.push("/product")}
        >
          Buy Now
        </button>
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
