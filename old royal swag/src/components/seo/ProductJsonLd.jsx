import { siteConfig } from "@/lib/siteConfig";
import { SITE_ORIGIN } from "@/lib/config";
import { getPrimaryProductPrice } from "@/lib/product-price";

export default function ProductJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Royal Swag TAR OUT Lung Detox Tea",
    description:
      "7 Ayurvedic herbs formulated to cleanse lungs of tar, reduce coughing, and improve respiratory capacity. FSSAI certified.",
    image: `${SITE_ORIGIN}/images/hero/asset1-hero-product.webp`,
    brand: {
      "@type": "Brand",
      name: "Royal Swag",
    },
    manufacturer: {
      "@type": "Organization",
      name: siteConfig.companyName,
    },
    ...(siteConfig.fssaiLicense
      ? {
          identifier: {
            "@type": "PropertyValue",
            name: "FSSAI",
            value: siteConfig.fssaiLicense,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: String(getPrimaryProductPrice()),
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      url: `${SITE_ORIGIN}/product`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "847",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
