"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LeadGuardLink } from "@/components/LeadGuardLink";
import { isProductPath } from "@/lib/is-product-path";
import { SITE } from "@/lib/config";

const LOGO_SRC = "/images/new_logo.png";

const NAV_LINKS = [
  { label: "Product",     href: "/product" },
  { label: "Ingredients", href: "/#herbs" },
  { label: "Our Story",   href: "/about" },
  { label: "Reviews",     href: "/reviews" },
  { label: "Lung Test",   href: "/lung-test" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "var(--rs-deep)" : "var(--rs-olive)",
      transition: "background 0.3s ease",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", minHeight: 72, padding: "10px 0",
      }}>
        {/* Logo */}
        <Link href="/" aria-label="Home" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Image
            src={LOGO_SRC}
            alt=""
            width={2048}
            height={2048}
            className="rs-header-logo"
            style={{
              background: "transparent",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: 32, alignItems: "center" }} className="rs-desktop-nav">
          {NAV_LINKS.map((l) =>
            isProductPath(l.href) ? (
              <LeadGuardLink
                key={l.href}
                href={l.href}
                style={{ color: "rgba(242,230,206,0.8)", fontSize: 14, fontWeight: 400, letterSpacing: 0.3 }}
              >
                {l.label}
              </LeadGuardLink>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: "rgba(242,230,206,0.8)", fontSize: 14, fontWeight: 400, letterSpacing: 0.3 }}
              >
                {l.label}
              </Link>
            )
          )}
          <LeadGuardLink href="/product" className="btn-gold" style={{ fontSize: 13, padding: "9px 22px" }}>
            Buy Now — {SITE.price.display}
          </LeadGuardLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="rs-mobile-menu-btn"
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 8, display: "none", flexDirection: "column", gap: 5,
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: "block", width: 22, height: 2,
              background: "var(--rs-cream)", borderRadius: 2,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "var(--rs-deep)", padding: "16px 24px 24px",
          display: "flex", flexDirection: "column", gap: 4,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          {NAV_LINKS.map((l) =>
            isProductPath(l.href) ? (
              <LeadGuardLink
                key={l.href}
                href={l.href}
                onProceed={() => setOpen(false)}
                style={{
                  color: "var(--rs-cream)", fontSize: 16, padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)", display: "block",
                }}
              >
                {l.label}
              </LeadGuardLink>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  color: "var(--rs-cream)", fontSize: 16, padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)", display: "block",
                }}
              >
                {l.label}
              </Link>
            )
          )}
          <LeadGuardLink
            href="/product"
            className="btn-gold"
            onProceed={() => setOpen(false)}
            style={{ marginTop: 16, textAlign: "center", padding: "14px", display: "block" }}
          >
            Buy Now — {SITE.price.display}
          </LeadGuardLink>
        </div>
      )}

      <style>{`
        .rs-header-logo {
          width: 140px !important;
          height: auto !important;
          aspect-ratio: 1 / 1;
        }
        @media (min-width: 769px) {
          .rs-header-logo {
            width: 180px !important;
            min-width: 180px !important;
          }
        }
        @media (max-width: 768px) {
          .rs-desktop-nav { display: none !important; }
          .rs-mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
