"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ROYAL_SWAG_LOGO_HEIGHT,
  ROYAL_SWAG_LOGO_SRC,
  ROYAL_SWAG_LOGO_WIDTH,
} from "@/lib/brand-logo";

const NAV_LINKS = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/lung-test", label: "Test Your Lungs", emoji: "🫁", gold: true },
  { href: "/product", label: "Our Product", emoji: "🍃" },
  { href: "/about", label: "About", emoji: "📖" },
  { href: "/reviews", label: "Reviews", emoji: "⭐" },
  { href: "/profile", label: "Profile", emoji: "👤" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const gsapRef = useRef<any>(null);

  /* ── GSAP drawer & sticky menu ── */
  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;

      ctx = gsap.context(() => {
        // Init drawer state
        gsap.set(drawerRef.current, { x: "100%" });
        gsap.set(overlayRef.current, { opacity: 0, pointerEvents: "none" });

        // Scroll sticky blur navbar
        ScrollTrigger.create({
          start: "top -80",
          end: 99999,
          onEnter: () => gsap.to(navRef.current, {
            backgroundColor: "rgba(252,249,242,0.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
            duration: 0.3,
          }),
          onLeaveBack: () => gsap.to(navRef.current, {
            backgroundColor: "transparent",
            backdropFilter: "none",
            boxShadow: "none",
            duration: 0.3,
          }),
        });
      });
    };

    init();
    return () => ctx?.revert();
  }, []);

  const openDrawer = async () => {
    setDrawerOpen(true);
    document.body.style.overflow = "hidden";

    if (!gsapRef.current) return;
    const gsap = gsapRef.current;

    gsap.set(overlayRef.current, { pointerEvents: "auto" });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.25 });
    gsap.to(drawerRef.current, {
      x: "0%",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const closeDrawer = () => {
    if (!gsapRef.current) {
      setDrawerOpen(false);
      document.body.style.overflow = "";
      return;
    }
    const gsap = gsapRef.current;

    gsap.to(drawerRef.current, {
      x: "100%",
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setDrawerOpen(false);
        document.body.style.overflow = "";
      },
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.set(overlayRef.current, { delay: 0.2, pointerEvents: "none" });
  };

  const currentPage = NAV_LINKS.find((l) => l.href === pathname) ?? NAV_LINKS[0];

  return (
    <>
      {/* ── Navbar bar ── */}
      <header
        ref={navRef}
        className="navbar fixed top-0 left-0 right-0 z-50 bg-transparent transition-colors duration-200"
        role="banner"
      >
        <div className="container-rs flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none" aria-label="Royal Swag — Home">
            <div className="flex min-w-[80px] shrink-0 items-center justify-center py-2">
              <Image
                src={ROYAL_SWAG_LOGO_SRC}
                alt="Royal Swag Logo"
                width={ROYAL_SWAG_LOGO_WIDTH}
                height={ROYAL_SWAG_LOGO_HEIGHT}
                className="h-auto w-16 object-contain md:w-20"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <span className="text-[10px] font-semibold tracking-[0.25em] text-[var(--brand-gold)] uppercase mt-1">
              estd. 2016
            </span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={openDrawer}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            className="flex flex-col gap-[5px] p-2 rounded-lg hover:bg-[var(--brand-sage)] transition-colors"
          >
            <span className="block w-6 h-[2px] bg-[var(--brand-green)] rounded" />
            <span className="block w-5 h-[2px] bg-[var(--brand-green)] rounded" />
            <span className="block w-6 h-[2px] bg-[var(--brand-green)] rounded" />
          </button>
        </div>
      </header>

      {/* ── Backdrop overlay ── */}
      <div
        ref={overlayRef}
        onClick={closeDrawer}
        className="fixed inset-0 z-[60] bg-black/40"
        aria-hidden="true"
      />

      {/* ── Full-screen Drawer ── */}
      <nav
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-[var(--brand-ivory)] flex flex-col overflow-y-auto shadow-xl"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-16 md:h-20 border-b border-[var(--brand-sage)] shrink-0">
          <Image
            src={ROYAL_SWAG_LOGO_SRC}
            alt="Royal Swag Logo"
            width={ROYAL_SWAG_LOGO_WIDTH}
            height={ROYAL_SWAG_LOGO_HEIGHT}
            className="h-8 w-auto"
          />
          <button
            onClick={closeDrawer}
            aria-label="Close navigation menu"
            className="p-2 rounded-lg hover:bg-[var(--brand-sage)] transition-colors text-[var(--brand-green)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current page indicator */}
        <div className="px-6 py-4 border-b border-[var(--brand-sage)]">
          <p className="text-xs text-[var(--brand-green)]/50 uppercase tracking-widest mb-1">You are here</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-gold)]" aria-hidden="true" />
            <span className="text-sm font-semibold text-[var(--brand-dark)]">
              {currentPage.emoji} {currentPage.label}
            </span>
          </div>
        </div>

        {/* Nav links */}
        <ul className="flex-1 px-3 py-4 space-y-1" role="list">
          {NAV_LINKS.map(({ href, label, emoji, gold }) => {
            const isActive = pathname === href;
            return (
              <li key={href} role="listitem">
                <Link
                  href={href}
                  onClick={closeDrawer}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base transition-all ${
                    gold
                      ? "font-bold text-[var(--brand-gold)] bg-[var(--brand-gold)]/8 hover:bg-[var(--brand-gold)]/15"
                      : isActive
                      ? "font-bold text-[var(--brand-green)] bg-[var(--brand-sage)]"
                      : "font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-sage)] hover:text-[var(--brand-green)]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-xl" aria-hidden="true">{emoji}</span>
                  <span>{label}</span>
                  {gold && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-widest bg-[var(--brand-gold)] text-white px-2 py-0.5 rounded-full">
                      Free
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Drawer footer */}
        <div className="px-6 py-6 border-t border-[var(--brand-sage)] shrink-0">
          <p className="text-xs text-[var(--brand-green)]/40 text-center">
            © 2016–2026 Royal Swag. All rights reserved.
          </p>
        </div>
      </nav>
    </>
  );
}
