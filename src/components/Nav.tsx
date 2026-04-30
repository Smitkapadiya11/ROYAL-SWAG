"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { LeadGuardLink } from "@/components/LeadGuardLink";
import { isProductPath } from "@/lib/is-product-path";
import { S } from "@/lib/config";
import {
  ROYAL_SWAG_LOGO_HEIGHT,
  ROYAL_SWAG_LOGO_SRC,
  ROYAL_SWAG_LOGO_WIDTH,
} from "@/lib/brand-logo";

const LINKS = [
  { label: "Product", href: "/product" },
  { label: "Ingredients", href: "/#herbs" },
  { label: "Our Story", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Lung Test", href: "/lung-test" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerH, setHeaderH] = useState(168);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [scrolled, open]);

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: scrolled ? "#2D3D15" : "#4A6422",
          transition: "background 0.3s",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          padding: scrolled ? "10px 0" : "14px 0",
        }}
      >
        <div
          className="w"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              minWidth: 0,
            }}
          >
            <nav
              className="nav-d"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
              }}
            >
              {LINKS.map((l) => {
                const navStyle = {
                  color: "rgba(242,230,206,0.72)",
                  fontSize: 13,
                  transition: "color 0.2s",
                } as const;
                const handlers = {
                  onMouseEnter: (e: { currentTarget: HTMLAnchorElement }) =>
                    (e.currentTarget.style.color = "#F2E6CE"),
                  onMouseLeave: (e: { currentTarget: HTMLAnchorElement }) =>
                    (e.currentTarget.style.color = "rgba(242,230,206,0.72)"),
                };
                return isProductPath(l.href) ? (
                  <LeadGuardLink key={l.href} href={l.href} style={navStyle} {...handlers}>
                    {l.label}
                  </LeadGuardLink>
                ) : (
                  <Link key={l.href} href={l.href} style={navStyle} {...handlers}>
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Link
            href="/"
            aria-label="Home"
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <Image
              src={ROYAL_SWAG_LOGO_SRC}
              alt=""
              width={ROYAL_SWAG_LOGO_WIDTH}
              height={ROYAL_SWAG_LOGO_HEIGHT}
              priority
              className="nav-main-logo"
              style={{
                background: "transparent",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 12,
              minWidth: 0,
            }}
          >
            <LeadGuardLink
              href="/product"
              className="b b-gold nav-d"
              style={{ fontSize: 13, padding: "9px 20px", flexShrink: 0 }}
            >
              Buy Now — {S.price.now}
            </LeadGuardLink>

            <button
              className="nav-m"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
              style={{
                background: "none",
                border: "none",
                padding: 8,
                display: "none",
                flexDirection: "column",
                gap: 5,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: "#F2E6CE",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  transform: open ? "rotate(45deg) translate(5px,5px)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: "#F2E6CE",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  opacity: open ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: "#F2E6CE",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          style={{
            position: "fixed",
            top: headerH,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 199,
            background: "#2D3D15",
            overflowY: "auto",
            padding: "8px 0 40px",
          }}
        >
          {LINKS.map((l) => {
            const rowStyle = {
              display: "block",
              color: "rgba(242,230,206,0.85)",
              fontSize: 17,
              padding: "16px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            } as const;
            return isProductPath(l.href) ? (
              <LeadGuardLink
                key={l.href}
                href={l.href}
                onProceed={() => setOpen(false)}
                style={rowStyle}
              >
                {l.label}
              </LeadGuardLink>
            ) : (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={rowStyle}>
                {l.label}
              </Link>
            );
          })}
          <div style={{ padding: "20px 24px 0" }}>
            <LeadGuardLink
              href="/product"
              onProceed={() => setOpen(false)}
              className="b b-gold"
              style={{ width: "100%", fontSize: 16, padding: 16 }}
            >
              Buy Now — {S.price.now}
            </LeadGuardLink>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-d { display: none !important; }
          .nav-m { display: flex !important; }
          .nav-main-logo {
            width: 140px !important;
            height: auto !important;
            aspect-ratio: 1 / 1;
          }
        }
        @media (min-width: 769px) {
          .nav-main-logo {
            width: 180px !important;
            min-width: 180px !important;
            height: auto !important;
            aspect-ratio: 1 / 1;
          }
        }
      `}</style>
    </>
  );
}
