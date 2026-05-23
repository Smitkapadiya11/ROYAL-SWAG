"use client";

import Link from "next/link";
import { S } from "@/lib/config";
import { LeadGuardLink } from "@/components/LeadGuardLink";
import { isProductPath } from "@/lib/is-product-path";
import LeadGuardExternalLink from "@/components/LeadGuardExternalLink";
import BrandLogo from "@/components/ui/BrandLogo";
import SocialButtons from "@/components/SocialButtons";

const NAV_LINKS = [
  { l: "Buy Now", h: "/product" },
  { l: "Our Story", h: "/about" },
  { l: "Reviews", h: "/reviews" },
  { l: "Free Lung Test", h: "/lung-test" },
];

const CERT_LINKS = [
  "ISO Certified",
  "GMP Quality",
  "AYUSH Ministry",
  "LEAN Manufacturing",
] as const;

const fssaiLicense =
  process.env.NEXT_PUBLIC_FSSAI_LICENSE?.trim() || "Licensed";

export default function Footer() {
  return (
    <footer className="site-chrome-footer w-full rounded-t-3xl bg-primary px-5 py-10 md:px-16 md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
        <div className="flex flex-col gap-4">
          <BrandLogo variant="on-dark" className="h-10 w-auto" />
          <p className="max-w-xs font-sans text-xs leading-relaxed text-white/50">
            {S.address.l1}
            <br />
            {S.address.l2}
          </p>
          <div className="hidden flex-wrap gap-2 md:flex">
            {S.certs.map((c) => (
              <span
                key={c}
                className="rounded border border-white/20 px-2.5 py-1 font-sans text-[11px] font-medium text-white/70"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="hidden md:block">
            <SocialButtons />
          </div>
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <div className="flex flex-wrap gap-x-8 gap-y-4 font-sans text-sm">
            <a
              href="https://foscos.fssai.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 transition-colors hover:text-ayurvedic-gold"
            >
              FSSAI Lic. No. {fssaiLicense}
            </a>
            {CERT_LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className="text-white/80 transition-colors hover:text-ayurvedic-gold"
              >
                {l}
              </a>
            ))}
          </div>

          <nav className="flex flex-col gap-2 font-sans text-sm md:items-end">
            {NAV_LINKS.map((item) => {
              const className =
                "text-white/80 transition-colors hover:text-ayurvedic-gold";
              return isProductPath(item.h) ? (
                <LeadGuardLink key={item.h} href={item.h} className={className}>
                  {item.l}
                </LeadGuardLink>
              ) : (
                <Link key={item.h} href={item.h} className={className}>
                  {item.l}
                </Link>
              );
            })}
            <LeadGuardExternalLink
              href={S.wa.url}
              className="text-white/80 transition-colors hover:text-ayurvedic-gold"
            >
              {S.phone}
            </LeadGuardExternalLink>
            <a
              href={`mailto:${S.email}`}
              className="text-white/80 transition-colors hover:text-ayurvedic-gold"
            >
              {S.email}
            </a>
          </nav>

          <div className="flex gap-6 md:hidden">
            <SocialButtons />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-sans text-xs text-white/40">
            © {new Date().getFullYear()} Royal Swag Lung Detox. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-sans text-xs text-white/40 transition-colors hover:text-white/70"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-sans text-xs text-white/40 transition-colors hover:text-white/70"
            >
              Terms
            </Link>
          </div>
        </div>
        <p className="mt-4 font-sans text-[11px] leading-relaxed text-white/30">
          These statements have not been evaluated by FSSAI as a drug. Not intended
          to diagnose, treat, cure, or prevent any disease. Results may vary.
        </p>
      </div>
    </footer>
  );
}
