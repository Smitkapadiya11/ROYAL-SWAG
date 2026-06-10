"use client";

import { siteConfig } from "@/lib/siteConfig";
import { SocialIconLinks } from "@/components/ui/SocialIconLinks";

export default function SocialButtons() {
  if (!siteConfig.whatsappOrderLink) {
    return <SocialIconLinks />;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SocialIconLinks />
      <a
        href={siteConfig.whatsappOrderLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition-all hover:scale-105 hover:border-ayurvedic-gold hover:text-ayurvedic-gold"
      >
        <span className="text-xl" aria-hidden>
          💬
        </span>
      </a>
    </div>
  );
}
