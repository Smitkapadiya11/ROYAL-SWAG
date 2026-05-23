"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

function HeaderLogo({ className }: { className?: string }) {
  return (
    <BrandLogo
      variant="on-light"
      width={100}
      header
      priority
      className={className}
    />
  );
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Shop" },
  { href: "/lung-test", label: "Lung Test" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
] as const;

function NavLink({
  href,
  label,
  onClick,
  className,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "font-body text-sm font-medium text-primary/85 transition-colors hover:text-primary",
        className
      )}
    >
      {label}
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-6" aria-hidden>
      <span
        className={cn(
          "absolute left-0 top-0 block h-0.5 w-6 rounded-full bg-primary transition-all duration-200",
          open && "top-2 rotate-45"
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-2 block h-0.5 w-6 rounded-full bg-primary transition-all duration-200",
          open && "opacity-0"
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-4 block h-0.5 w-6 rounded-full bg-primary transition-all duration-200",
          open && "top-2 -rotate-45"
        )}
      />
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-16 w-full border-b border-white/60 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-[0_4px_20px_rgba(73,87,56,0.1)]"
        )}
        style={{ background: "rgba(255,255,255,0.4)" }}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Royal Swag home"
          >
            <HeaderLogo />
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-8 md:flex">
            <nav className="flex items-center gap-7" aria-label="Main">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
            <Link
              href="/lung-test"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2 font-body text-sm font-semibold tracking-[0.05em] text-white transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(154,111,26,0.3)] active:translate-y-px"
            >
              Free Lung Test
            </Link>
          </div>

          {/* Mobile */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </header>

      {/* Mobile drawer + backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] md:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-primary/20 backdrop-blur-[2px] transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close menu"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        />

        <aside
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-white/60 bg-parchment/95 shadow-[-8px_0_32px_rgba(50,64,35,0.12)] backdrop-blur-lg transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex h-16 items-center justify-between border-b border-white/50 px-5">
            <HeaderLogo className="h-8" />
            <button
              type="button"
              onClick={closeMenu}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-primary"
              aria-label="Close menu"
            >
              <MenuIcon open />
            </button>
          </div>

          <nav className="flex flex-1 flex-col px-3 py-4" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                onClick={closeMenu}
                className="flex min-h-12 items-center rounded-lg px-4 text-base font-medium"
              />
            ))}
          </nav>

          <div className="border-t border-white/50 p-5">
            <Link
              href="/lung-test"
              onClick={closeMenu}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold tracking-[0.05em] text-white transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(154,111,26,0.3)] active:translate-y-px"
            >
              Free Lung Test
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
