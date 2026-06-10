"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import BrandLogo from "@/components/ui/BrandLogo";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useTranslations } from "@/contexts/LocaleContext";
import { Container } from "@/components/layout/Container";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import {
  isHeaderHiddenPath,
  isMinimalHeaderPath,
  isNavLinkActive,
  MAIN_NAV_LINKS,
} from "@/lib/site-header";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  active,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "site-header-nav-link group relative font-body text-sm transition-colors",
        active
          ? "font-semibold text-primary"
          : "font-medium text-on-surface-variant hover:text-primary",
        className
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
          active ? "w-full" : "w-0 group-hover:w-full"
        )}
      />
    </Link>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-primary"
    >
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function HeaderShell({
  children,
  scrolled,
  className,
}: {
  children: React.ReactNode;
  scrolled: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollOverlayOpacity = useTransform(scrollY, [0, 20], [0, 1]);

  if (reduceMotion) {
    return (
      <header
        data-site-header
        className={cn(
          "site-chrome-header site-header sticky top-0 z-[100] w-full border-b transition-[background,box-shadow] duration-300 ease-out",
          scrolled
            ? "border-primary/10 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] backdrop-blur-md"
            : "border-primary/[0.08] bg-[var(--color-cream)] backdrop-blur-none",
          className
        )}
      >
        {children}
      </header>
    );
  }

  return (
    <motion.header
      data-site-header
      className={cn(
        "site-chrome-header site-header relative sticky top-0 z-[100] w-full border-b border-primary/[0.08] bg-[var(--color-cream)]",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 border-b border-primary/10 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] backdrop-blur-md"
        style={{ opacity: scrollOverlayOpacity }}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </motion.header>
  );
}

function MinimalHeader({ scrolled }: { scrolled: boolean }) {
  return (
    <HeaderShell scrolled={scrolled} className="h-[60px] md:h-[72px]">
      <Container className="flex h-full items-center justify-center">
        <Link href="/" aria-label="Royal Swag home">
          <BrandLogo variant="on-light" className="h-10 min-h-[40px] w-auto" />
        </Link>
      </Container>
    </HeaderShell>
  );
}

function FullHeader() {
  const pathname = usePathname() ?? "/";
  const { t } = useTranslations();
  const scrolled = useScrollPosition(20);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <HeaderShell scrolled={scrolled} className="h-[60px] md:h-[72px]">
      <div ref={headerRef} className="relative w-full">
        <Container className="relative flex h-[60px] items-center justify-between gap-3 md:h-[72px]">
          <Link
            href="/"
            className="relative z-[102] flex shrink-0 items-center"
            aria-label="Royal Swag home"
          >
            <BrandLogo variant="on-light" className="h-10 min-h-[40px] w-auto" />
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex lg:gap-8"
            aria-label="Main"
          >
            {MAIN_NAV_LINKS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isNavLinkActive(pathname, item.href)}
              />
            ))}
          </nav>

          <div className="relative z-[102] flex shrink-0 items-center gap-2">
            <LanguageToggle className="hidden sm:inline-flex" />
            <Link
              href="/lung-test"
              className="hidden items-center rounded-full bg-primary px-[18px] py-2 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              {t("nav.freeLungTest")}
            </Link>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/5 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="site-header-mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </Container>

        <div
          id="site-header-mobile-menu"
          className={cn(
            "site-header-mobile-panel overflow-hidden border-t border-primary/10 bg-[var(--color-cream)] lg:hidden",
            menuOpen && "site-header-mobile-panel--open"
          )}
          aria-hidden={!menuOpen}
        >
          <nav
            className="flex flex-col gap-1 px-5 py-4"
            aria-label="Mobile main"
          >
            {MAIN_NAV_LINKS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isNavLinkActive(pathname, item.href)}
                onNavigate={closeMenu}
                className="py-3 text-base"
              />
            ))}
            <div className="mt-3 flex items-center justify-between gap-3 px-1">
              <span className="font-body text-sm text-on-surface-variant">{t("lang.toggle")}</span>
              <LanguageToggle compact />
            </div>
            <Link
              href="/lung-test"
              onClick={closeMenu}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-[18px] py-2.5 font-body text-sm font-semibold text-white"
            >
              {t("nav.freeLungTest")}
            </Link>
          </nav>
        </div>
      </div>
    </HeaderShell>
  );
}

export default function Header() {
  const pathname = usePathname() ?? "/";
  const scrolled = useScrollPosition(20);

  if (isHeaderHiddenPath(pathname)) {
    return null;
  }

  if (isMinimalHeaderPath(pathname)) {
    return <MinimalHeader scrolled={scrolled} />;
  }

  return <FullHeader />;
}
