"use client";
import Link from "next/link";
import { S } from "@/lib/config";
import { LeadGuardLink } from "@/components/LeadGuardLink";
import { isProductPath } from "@/lib/is-product-path";
import LeadGuardExternalLink from "@/components/LeadGuardExternalLink";
import BrandLogo from "@/components/ui/BrandLogo";
import SocialButtons from "@/components/SocialButtons";

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
      background: "#324023",
      color: "rgba(244,237,214,0.75)",
    }}>
      {/* Top grid */}
      <div className="w footer-grid" style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: 48,
        padding: "72px var(--px) 56px",
      }}>
        {/* Brand column */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, marginBottom: 18 }}>
            <BrandLogo variant="on-dark" width={140} />
            <span style={{ fontSize: 9, color: "rgba(244,237,214,0.45)", letterSpacing: "0.08em" }}>
              ESTD 2016
            </span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.67, maxWidth: 260, marginBottom: 24 }}>
            Lung detox tea — seven herbs, Surat-made, ten years of batches people actually reorder.
            Ships across India and abroad.
          </p>
          {/* Cert pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {S.certs.map(c => (
              <span key={c} style={{
                border: "1px solid rgba(242,230,206,0.18)",
                borderRadius: 4, padding: "3px 10px",
                fontSize: 11, fontWeight: 500,
              }}>{c}</span>
            ))}
          </div>
          <SocialButtons />
        </div>

        {/* Navigate column */}
        <div>
          <p style={{
            fontFamily: "var(--ff-head)", fontSize: 14,
            color: "var(--cream)", marginBottom: 20, fontWeight: 600,
          }}>Navigate</p>
          {links.map(l => {
            const navLinkStyle = {
              display: "block", fontSize: 13,
              marginBottom: 11, transition: "color 0.2s",
            } as const;
            const hover = {
              onMouseEnter: (e: { currentTarget: HTMLElement }) =>
                (e.currentTarget.style.color = "var(--cream)"),
              onMouseLeave: (e: { currentTarget: HTMLElement }) =>
                (e.currentTarget.style.color = "rgba(242,230,206,0.55)"),
            };
            return isProductPath(l.h) ? (
              <LeadGuardLink key={l.h} href={l.h} style={navLinkStyle} {...hover}>
                {l.l}
              </LeadGuardLink>
            ) : (
              <Link key={l.h} href={l.h} style={navLinkStyle} {...hover}>
                {l.l}
              </Link>
            );
          })}
        </div>

        {/* Contact column */}
        <div>
          <p style={{
            fontFamily: "var(--ff-head)", fontSize: 14,
            color: "var(--cream)", marginBottom: 20, fontWeight: 600,
          }}>Contact</p>
          <LeadGuardExternalLink href={S.wa.url} style={{ display: "block", fontSize: 13, marginBottom: 10 }}>
            {S.phone}
          </LeadGuardExternalLink>
          <a href={`mailto:${S.email}`} style={{ display: "block", fontSize: 13, marginBottom: 16 }}>
            {S.email}
          </a>
          <p style={{ fontSize: 12, lineHeight: 1.75 }}>
            {S.address.l1}<br />{S.address.l2}
          </p>
          <LeadGuardExternalLink href={S.wa.url}
            style={{
              display: "inline-block", marginTop: 20,
              background: "rgba(196,154,42,0.12)",
              border: "1px solid rgba(196,154,42,0.3)",
              borderRadius: "var(--r-sm)", padding: "9px 18px",
              color: "var(--gold)", fontSize: 13, fontWeight: 500,
            }}>
            Order on WhatsApp
          </LeadGuardExternalLink>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px var(--px)" }}>
        <div className="w" style={{
          display: "flex", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12, alignItems: "center",
        }}>
          <p style={{ fontSize: 12 }}>© 2016–2026 {S.company}</p>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/privacy" style={{ fontSize: 12 }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: 12 }}>Terms</Link>
          </div>
        </div>
        <div className="w" style={{ marginTop: 12 }}>
          <p style={{ fontSize: 11, lineHeight: 1.7, opacity: 0.4 }}>
            FSSAI Lic. No. {S.fssai} &nbsp;·&nbsp;
            These statements have not been evaluated by FSSAI as a drug.
            Not intended to diagnose, treat, cure, or prevent any disease.
            Results may vary.
          </p>
        </div>
      </div>

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
