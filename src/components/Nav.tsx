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

  return (
    <>
      {/* ── Main bar ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? "#2D3D15" : "#4A6422",
        transition: "background 0.3s",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        height: 76,
        display: "flex", alignItems: "center",
      }}>
        <div className="w" style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: "flex", alignItems: "center",
            gap: 12, textDecoration: "none", flexShrink: 0,
          }}>
            <div style={{
              width: 48, height: 48,
              background: "rgba(255,255,255,0.08)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1.5px solid rgba(196,154,42,0.4)",
              flexShrink: 0,
            }}>
              <Image
                src="/images/royal-swag-logo.png"
                alt="Royal Swag"
                width={30}
                height={30}
                priority
                style={{
                  filter: "brightness(0) invert(1)",
                  opacity: 0.95,
                  objectFit: "contain",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{
                fontFamily: "var(--ff-head)",
                fontSize: 18, fontWeight: 600,
                color: "#F2E6CE", letterSpacing: "2.5px",
              }}>ROYAL SWAG</span>
              <span style={{
                fontSize: 9,
                color: "rgba(196,154,42,0.7)",
                letterSpacing: "2px",
                marginTop: 4,
              }}>ESTD 2015</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-d" style={{
            display: "flex", alignItems: "center", gap: 28,
          }}>
            {LINKS.map(l => (
              <Link key={l.href} href={l.href}
                style={{ color: "rgba(242,230,206,0.72)", fontSize: 13, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F2E6CE")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,230,206,0.72)")}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/product" className="b b-gold"
              style={{ fontSize: 13, padding: "9px 20px" }}>
              Buy Now — {S.price.now}
            </Link>
          </nav>

          {/* Hamburger */}
          <button
            className="nav-m"
            onClick={() => setOpen(v => !v)}
            aria-label="Open menu"
            style={{
              background: "none", border: "none", padding: 8,
              display: "none", flexDirection: "column", gap: 5,
            }}
          >
            <span style={{
              display: "block", width: 22, height: 2,
              background: "#F2E6CE", borderRadius: 2, transition: "all 0.2s",
              transform: open ? "rotate(45deg) translate(5px,5px)" : "none",
            }} />
            <span style={{
              display: "block", width: 22, height: 2,
              background: "#F2E6CE", borderRadius: 2, transition: "all 0.2s",
              opacity: open ? 0 : 1,
            }} />
            <span style={{
              display: "block", width: 22, height: 2,
              background: "#F2E6CE", borderRadius: 2, transition: "all 0.2s",
              transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none",
            }} />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {open && (
        <div style={{
          position: "fixed", top: 76, left: 0, right: 0, bottom: 0,
          zIndex: 199, background: "#2D3D15",
          overflowY: "auto", padding: "8px 0 40px",
        }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block", color: "rgba(242,230,206,0.85)",
                fontSize: 17, padding: "16px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ padding: "20px 24px 0" }}>
            <Link href="/product" onClick={() => setOpen(false)}
              className="b b-gold"
              style={{ width: "100%", fontSize: 16, padding: 16 }}>
              Buy Now — {S.price.now}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-d { display: none !important; }
          .nav-m { display: flex !important; }
        }
      `}</style>
    </>
  );
}
