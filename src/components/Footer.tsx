import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/config";

const LOGO_SRC = "/images/ROYAL%20SWAG_logo.png";

export default function Footer() {
  return (
    <footer style={{ background: "var(--rs-deep)", color: "var(--rs-cream)", paddingTop: 64, paddingBottom: 32 }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 48, marginBottom: 56,
        }}>
          {/* Brand */}
          <div>
            <Image
              src={LOGO_SRC}
              alt="Royal Swag"
              width={40}
              height={40}
              style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85, marginBottom: 16 }}
            />
            <p style={{ color: "rgba(242,230,206,0.65)", fontSize: 14, lineHeight: 1.8, maxWidth: 220, marginBottom: 16 }}>
              Ayurvedic lung detox tea. 7 herbs. 10 years of expertise. Trusted across 4 continents.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "IG", href: SITE.social.instagram },
                { label: "YT", href: SITE.social.youtube },
                { label: "FB", href: SITE.social.facebook },
                { label: "X",  href: SITE.social.twitter },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ color: "rgba(242,230,206,0.5)", fontSize: 12, fontWeight: 500, letterSpacing: 1 }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, color: "var(--rs-cream)", marginBottom: 20 }}>
              Navigate
            </p>
            {[
              { label: "Buy Now",        href: "/product" },
              { label: "Ingredients",    href: "/#herbs" },
              { label: "Our Story",      href: "/about" },
              { label: "Reviews",        href: "/reviews" },
              { label: "Free Lung Test", href: "/lung-test" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{
                display: "block", color: "rgba(242,230,206,0.55)",
                fontSize: 14, marginBottom: 10,
              }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, color: "var(--rs-cream)", marginBottom: 20 }}>
              Contact
            </p>
            <a href={SITE.whatsapp.url} style={{ display: "block", color: "rgba(242,230,206,0.55)", fontSize: 14, marginBottom: 10 }}>
              {SITE.phone.display}
            </a>
            <a href={`mailto:${SITE.email}`} style={{ display: "block", color: "rgba(242,230,206,0.55)", fontSize: 14, marginBottom: 10 }}>
              {SITE.email}
            </a>
            <p style={{ color: "rgba(242,230,206,0.4)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              {SITE.address.line1}<br />{SITE.address.line2}
            </p>
          </div>

          {/* Certifications */}
          <div>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, color: "var(--rs-cream)", marginBottom: 20 }}>
              Certified By
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {SITE.certifications.map((c) => (
                <span key={c} style={{
                  border: "1px solid rgba(242,230,206,0.2)", borderRadius: "var(--r-sm)",
                  padding: "4px 12px", fontSize: 12, fontWeight: 500,
                  color: "rgba(242,230,206,0.6)", letterSpacing: 1,
                }}>
                  {c}
                </span>
              ))}
            </div>
            <a href={SITE.whatsapp.url} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(196,154,42,0.15)", border: "1px solid rgba(196,154,42,0.3)",
              borderRadius: "var(--r-md)", padding: "10px 16px",
              color: "var(--rs-gold)", fontSize: 13, fontWeight: 500,
            }}>
              Order on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: 24,
          display: "flex", flexWrap: "wrap", gap: 16,
          justifyContent: "space-between", alignItems: "center",
        }}>
          <p style={{ fontSize: 12, color: "rgba(242,230,206,0.35)", margin: 0 }}>
            © {SITE.founded}–2026 {SITE.company}
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 12, color: "rgba(242,230,206,0.35)" }}>
                {l.label}
              </Link>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "rgba(242,230,206,0.25)", width: "100%", lineHeight: 1.6, margin: 0 }}>
            FSSAI Lic. No. {SITE.fssai} · These statements have not been evaluated by FSSAI as a drug.
            This product is not intended to diagnose, treat, cure, or prevent any disease. Results may vary.
          </p>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href={SITE.whatsapp.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          background: "#25D366", color: "#fff",
          width: 52, height: 52, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          textDecoration: "none",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </footer>
  );
}
