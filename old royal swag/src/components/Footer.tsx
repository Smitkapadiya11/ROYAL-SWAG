"use client";

import Link from "next/link";
import { LeadGuardLink } from "@/components/LeadGuardLink";
import { isProductPath } from "@/lib/is-product-path";
import BrandLogo from "@/components/ui/BrandLogo";
import { SocialIconLinks } from "@/components/ui/SocialIconLinks";
import { Container, Grid, Section } from "@/components/layout";
import { siteConfig } from "@/lib/siteConfig";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Lung Test", href: "/lung-test" },
  { label: "Shop", href: "/product" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
  { label: "Contact", href: `mailto:${siteConfig.email}` },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
] as const;

export default function Footer() {
  return (
    <Section
      as="footer"
      compact
      bg="green"
      className="site-chrome-footer rounded-t-layout-lg pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
    >
      <Container>
        <Grid cols={{ mobile: 1, tablet: 2, desktop: 4 }} className="items-start gap-y-8">
          <div className="flex min-w-0 flex-col gap-4">
            <BrandLogo variant="on-dark" className="h-10 w-auto max-w-full" />
            <p className="font-display text-sm font-semibold text-white/90">
              {siteConfig.tagline}
            </p>
            <p className="max-w-xs font-sans text-xs leading-relaxed text-white/50">
              {siteConfig.address}
            </p>
          </div>

          <div className="min-w-0">
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-white/50">
              Links
            </p>
            <nav className="flex flex-col gap-2 font-sans text-sm">
              {NAV_LINKS.map((item) => {
                const className =
                  "text-white/80 transition-colors hover:text-ayurvedic-gold";
                if (item.href.startsWith("mailto:")) {
                  return (
                    <a key={item.label} href={item.href} className={className}>
                      {item.label}
                    </a>
                  );
                }
                return isProductPath(item.href) ? (
                  <LeadGuardLink key={item.href} href={item.href} className={className}>
                    {item.label}
                  </LeadGuardLink>
                ) : (
                  <Link key={item.href} href={item.href} className={className}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="min-w-0">
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-white/50">
              Contact
            </p>
            <div className="flex flex-col gap-2 font-sans text-sm">
              {siteConfig.phone ? (
                <a
                  href={`tel:${siteConfig.phoneTel}`}
                  className="text-white/80 transition-colors hover:text-ayurvedic-gold"
                >
                  {siteConfig.phone}
                </a>
              ) : null}
              <a
                href={`mailto:${siteConfig.email}`}
                className="break-all text-white/80 transition-colors hover:text-ayurvedic-gold"
              >
                {siteConfig.email}
              </a>
              {siteConfig.whatsappOrderLink ? (
                <a
                  href={siteConfig.whatsappOrderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 transition-colors hover:text-ayurvedic-gold"
                >
                  WhatsApp
                </a>
              ) : null}
            </div>
          </div>

          <div className="min-w-0">
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-white/50">
              Legal
            </p>
            <div className="flex flex-col gap-2 font-sans text-sm text-white/80">
              {siteConfig.fssaiLicense && siteConfig.fssaiVerifyLink ? (
                <a
                  href={siteConfig.fssaiVerifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-ayurvedic-gold"
                >
                  FSSAI Lic. No. {siteConfig.fssaiLicense}
                </a>
              ) : null}
              <p className="text-xs leading-relaxed text-white/70">{siteConfig.address}</p>
              {siteConfig.gstin ? (
                <p className="text-xs text-white/70">GSTIN: {siteConfig.gstin}</p>
              ) : null}
            </div>
            <div className="mt-4">
              <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wider text-white/50">
                Social
              </p>
              <SocialIconLinks />
            </div>
          </div>
        </Grid>

        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="font-sans text-xs text-white/40">
              © {new Date().getFullYear()} {siteConfig.companyName} |{" "}
              {LEGAL_LINKS.map((link, i) => (
                <span key={link.href}>
                  {i > 0 ? " | " : null}
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white/70"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </p>
          </div>
          <p className="mt-4 font-sans text-[11px] leading-relaxed text-white/30">
            These statements have not been evaluated by FSSAI as a drug. Not intended
            to diagnose, treat, cure, or prevent any disease. Results may vary.
          </p>
        </div>
      </Container>
    </Section>
  );
}
