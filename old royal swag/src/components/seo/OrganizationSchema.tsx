import { SITE_ORIGIN } from "@/lib/config";
import { siteConfig } from "@/lib/siteConfig";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Royal Swag",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/images/royal-swag-logo.png`,
    description:
      "Modern Ayurvedic lung detox tea — Tulsi, Vasaka, Mulethi, Pippali. Made in India.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: siteConfig.phoneTel || `+${siteConfig.whatsappNumber}`,
      availableLanguage: ["English", "Hindi"],
      areaServed: "IN",
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.youtube,
      siteConfig.social.facebook,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
