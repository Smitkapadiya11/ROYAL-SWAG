import Image from "next/image";
import Link from "next/link";
import {
  ROYAL_SWAG_LOGO_HEIGHT,
  ROYAL_SWAG_LOGO_SRC,
  ROYAL_SWAG_LOGO_WIDTH,
} from "@/lib/brand-logo";
import { SITE_CONFIG } from "@/lib/config";

const SOCIAL_LINKS = [
  { label: "Instagram", initial: "I", href: SITE_CONFIG.social.instagram },
  { label: "YouTube", initial: "Y", href: SITE_CONFIG.social.youtube },
  { label: "Facebook", initial: "f", href: SITE_CONFIG.social.facebook },
  { label: "Twitter", initial: "X", href: SITE_CONFIG.social.twitter },
];

const WA_HREF = `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${SITE_CONFIG.whatsapp.orderMessage}`;

export default function Footer() {
  return (
    <footer
      className="border-t border-white/[0.08] bg-[var(--brand-green)] text-white"
      role="contentinfo"
    >
      <div className="container-rs pt-12 pb-8">
        <div className="grid gap-10 min-[769px]:grid-cols-4 min-[769px]:gap-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src={ROYAL_SWAG_LOGO_SRC}
                alt="Royal Swag Logo"
                width={ROYAL_SWAG_LOGO_WIDTH}
                height={ROYAL_SWAG_LOGO_HEIGHT}
                className="h-12 w-auto rounded-lg min-[769px]:rounded-xl"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mb-5">
              Premium Ayurvedic lung detox tea crafted from ancient herbs. Breathe clean. Live free.
            </p>
            <address className="not-italic text-xs text-white/45 leading-relaxed">
              <p className="font-semibold text-white/60 mb-1">{SITE_CONFIG.company}</p>
              <p>{SITE_CONFIG.address.line1}</p>
              <p>{SITE_CONFIG.address.line2}</p>
            </address>
            <p className="mt-3 text-[11px] text-white/35">
              FSSAI Lic. No. {SITE_CONFIG.fssai}
            </p>
          </div>

          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/lung-test", label: "Free Lung Test" },
                { href: "/product", label: "Our Product" },
                { href: "/about", label: "About Us" },
                { href: "/reviews", label: "Reviews" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 hover:text-[var(--brand-gold)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-[var(--brand-gold)] transition-colors"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--brand-gold)] transition-colors flex items-center gap-1.5"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="text-white/40 text-xs pt-1">Mon–Sat, 10am–6pm IST</li>
            </ul>

            <div className="flex flex-wrap gap-3 mt-6">
              {SOCIAL_LINKS.map(({ label, initial, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Royal Swag on ${label}`}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] transition-colors text-xs font-bold"
                >
                  {initial}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © 2016–2026 Royal Swag. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
