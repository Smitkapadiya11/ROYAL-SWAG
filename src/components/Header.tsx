"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/config";

const LOGO_SRC = "/images/ROYAL%20SWAG_logo.png";

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
        justifyContent: "space-between", height: 68,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image
            src={LOGO_SRC}
            alt="Royal Swag Logo"
            width={36}
            height={36}
            style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.92 }}
          />
          <span style={{
            fontFamily: "var(--font-heading)",
            fontSize: 16, fontWeight: 600,
            color: "var(--rs-cream)", letterSpacing: 1.5,
          }}>
            ROYAL SWAG
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: 32, alignItems: "center" }} className="rs-desktop-nav">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ color: "rgba(242,230,206,0.8)", fontSize: 14, fontWeight: 400, letterSpacing: 0.3 }}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/product" className="btn-gold" style={{ fontSize: 13, padding: "9px 22px" }}>
            Buy Now — {SITE.price.display}
          </Link>
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
          {NAV_LINKS.map((l) => (
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
          ))}
          <Link
            href="/product"
            className="btn-gold"
            onClick={() => setOpen(false)}
            style={{ marginTop: 16, textAlign: "center", padding: "14px", display: "block" }}
          >
            Buy Now — {SITE.price.display}
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .rs-desktop-nav { display: none !important; }
          .rs-mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
