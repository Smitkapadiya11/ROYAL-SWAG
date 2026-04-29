"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { S } from "@/lib/config";

const LINKS = [
  { label: "Product",     href: "/product" },
  { label: "Ingredients", href: "/#herbs" },
  { label: "Our Story",   href: "/about" },
  { label: "Reviews",     href: "/reviews" },
  { label: "Lung Test",   href: "/lung-test" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const bg = scrolled ? "var(--deep)" : "var(--olive)";

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: bg, transition: "background 0.35s ease",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="wrap" style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 64,
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <Image
              src="/images/ROYAL SWAG_logo.png"
              alt="Royal Swag"
              width={36} height={36}
              style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }}
            />
            <span style={{
              fontFamily: "var(--ff-head)", fontSize: 16,
              fontWeight: 600, color: "var(--cream)",
              letterSpacing: "2px",
            }}>
              ROYAL SWAG
            </span>
          </Link>

          {/* Desktop links */}
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{
                color: "rgba(242,230,206,0.72)", fontSize: 13,
                fontWeight: 400, letterSpacing: "0.2px",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--cream)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,230,206,0.72)")}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/product" className="btn btn-gold"
              style={{ fontSize: 13, padding: "9px 20px" }}>
              Buy Now — {S.price.now}
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(v => !v)}
            className="nav-burger"
            style={{ background: "none", border: "none", padding: 6, display: "none" }}
            aria-label="Menu"
          >
            <svg width="22" height="16" viewBox="0 0 22 16">
              <rect y="0"  width="22" height="1.5" rx="1" fill="var(--cream)" />
              <rect y="7"  width="22" height="1.5" rx="1" fill="var(--cream)" />
              <rect y="14" width="22" height="1.5" rx="1" fill="var(--cream)" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: "var(--deep)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "8px 0 24px",
        }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{
                display: "block", color: "rgba(242,230,206,0.8)",
                fontSize: 16, padding: "13px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
              {l.label}
            </Link>
          ))}
          <div style={{ padding: "16px 24px 0" }}>
            <Link href="/product" onClick={() => setOpen(false)}
              className="btn btn-gold"
              style={{ width: "100%", justifyContent: "center" }}>
              Buy Now — {S.price.now}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-burger  { display: block !important; }
        }
      `}</style>
    </>
  );
}
