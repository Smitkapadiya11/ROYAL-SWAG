"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

function DesktopCenterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative font-sans text-sm font-medium text-primary transition-colors hover:text-ayurvedic-gold"
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-ayurvedic-gold transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

const CENTER_NAV = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Shop" },
  { href: "/lung-test", label: "Lung Test" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "site-chrome-header sticky top-0 z-50 h-16 w-full border-b border-white/60 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-[0_4px_20px_rgba(73,87,56,0.1)]"
      )}
      style={{ background: "rgba(255,255,255,0.4)" }}
    >
      <div className="relative mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8">
        <Link
          href="/"
          className="relative z-10 flex shrink-0 items-center"
          aria-label="Royal Swag home"
        >
          <BrandLogo variant="on-light" className="h-10 min-h-[40px] w-auto" />
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 md:flex lg:gap-8"
          aria-label="Main"
        >
          {CENTER_NAV.map((n) => (
            <DesktopCenterLink key={n.href} href={n.href} label={n.label} />
          ))}
        </nav>

        <Link
          href="/lung-test"
          className="btn-primary relative z-10 flex shrink-0 items-center gap-2 px-4 py-2.5 text-xs md:px-5 md:text-sm lg:px-6"
        >
          <span className="hidden sm:inline">Free </span>Lung Test
        </Link>
      </div>
    </header>
  );
}
