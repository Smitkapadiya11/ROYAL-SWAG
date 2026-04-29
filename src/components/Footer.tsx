"use client";
import Link from "next/link";
import Image from "next/image";
import { S } from "@/lib/config";

export default function Footer() {
  const links = [
    { l: "Buy Now",         h: "/product" },
    { l: "Ingredients",     h: "/#herbs" },
    { l: "Our Story",       h: "/about" },
    { l: "Reviews",         h: "/reviews" },
    { l: "Free Lung Test",  h: "/lung-test" },
  ];

  return (
    <footer style={{
      background: "var(--deep)",
      color: "rgba(242,230,206,0.55)",
    }}>
      {/* Top grid */}
      <div className="wrap footer-grid" style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: 48,
        padding: "72px var(--px) 56px",
      }}>
        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Image
              src="/images/ROYAL SWAG_logo.png"
              alt="Royal Swag"
              width={36} height={36}
              style={{ filter: "brightness(0) invert(1)", opacity: 0.7 }}
            />
            <span style={{
              fontFamily: "var(--ff-head)", color: "var(--cream)",
              fontSize: 15, fontWeight: 600, letterSpacing: 2,
            }}>ROYAL SWAG</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
            Ayurvedic lung detox tea. 7 herbs.
            10 years of expertise. Trusted across 4 continents.
          </p>
          {/* Cert pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {S.certs.map(c => (
              <span key={c} style={{
                border: "1px solid rgba(242,230,206,0.18)",
                borderRadius: 4, padding: "3px 10px",
                fontSize: 11, fontWeight: 500, letterSpacing: 1,
              }}>{c}</span>
            ))}
          </div>
          {/* Socials */}
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { l: "Instagram", h: S.social.ig },
              { l: "YouTube",   h: S.social.yt },
              { l: "Facebook",  h: S.social.fb },
            ].map(s => (
              <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, letterSpacing: 0.5, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,230,206,0.55)")}
              >{s.l}</a>
            ))}
          </div>
        </div>

        {/* Navigate column */}
        <div>
          <p style={{
            fontFamily: "var(--ff-head)", fontSize: 14,
            color: "var(--cream)", marginBottom: 20, fontWeight: 600,
          }}>Navigate</p>
          {links.map(l => (
            <Link key={l.h} href={l.h} style={{
              display: "block", fontSize: 13,
              marginBottom: 11, transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--cream)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,230,206,0.55)")}
            >{l.l}</Link>
          ))}
        </div>

        {/* Contact column */}
        <div>
          <p style={{
            fontFamily: "var(--ff-head)", fontSize: 14,
            color: "var(--cream)", marginBottom: 20, fontWeight: 600,
          }}>Contact</p>
          <a href={S.wa.url} style={{ display: "block", fontSize: 13, marginBottom: 10 }}>
            {S.phone}
          </a>
          <a href={`mailto:${S.email}`} style={{ display: "block", fontSize: 13, marginBottom: 16 }}>
            {S.email}
          </a>
          <p style={{ fontSize: 12, lineHeight: 1.75 }}>
            {S.address.l1}<br />{S.address.l2}
          </p>
          <a href={S.wa.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-block", marginTop: 20,
              background: "rgba(196,154,42,0.12)",
              border: "1px solid rgba(196,154,42,0.3)",
              borderRadius: "var(--r-sm)", padding: "9px 18px",
              color: "var(--gold)", fontSize: 13, fontWeight: 500,
            }}>
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px var(--px)" }}>
        <div className="wrap" style={{
          display: "flex", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12, alignItems: "center",
        }}>
          <p style={{ fontSize: 12 }}>© 2015–2026 {S.company}</p>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/privacy" style={{ fontSize: 12 }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: 12 }}>Terms</Link>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: 12 }}>
          <p style={{ fontSize: 11, lineHeight: 1.7, opacity: 0.4 }}>
            FSSAI Lic. No. {S.fssai} &nbsp;·&nbsp;
            These statements have not been evaluated by FSSAI as a drug.
            Not intended to diagnose, treat, cure, or prevent any disease.
            Results may vary.
          </p>
        </div>
      </div>

      {/* WhatsApp float button */}
      <a href={S.wa.url} target="_blank" rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 999,
          width: 52, height: 52, borderRadius: "50%",
          background: "#25D366",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </footer>
  );
}
