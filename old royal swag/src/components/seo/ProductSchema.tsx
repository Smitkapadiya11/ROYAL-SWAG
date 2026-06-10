import { SITE_ORIGIN } from "@/lib/config";
import { PRODUCT_SKU, getPrimaryProductPrice } from "@/lib/product-price";
import { MAIN_PRODUCT_IMAGE, PRODUCT_GALLERY } from "@/lib/product-images";
import { siteConfig } from "@/lib/siteConfig";

export default function ProductSchema() {
  const price = getPrimaryProductPrice();
  const images = [...new Set([MAIN_PRODUCT_IMAGE, ...PRODUCT_GALLERY])].map(
    (path) => `${SITE_ORIGIN}${path}`
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Royal Swag Lung Detox Tea",
    brand: { "@type": "Brand", name: "Royal Swag" },
    description:
      "Ayurvedic lung detox tea with Tulsi, Vasaka, Mulethi and Pippali. FSSAI certified. Helps cleanse lungs, reduce cough, and support respiratory wellness.",
    image: images,
    sku: PRODUCT_SKU,
    offers: {
      "@type": "Offer",
      price: String(price),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      url: `${SITE_ORIGIN}/product`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "2400",
    },
    ...(siteConfig.fssaiLicense
      ? {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "FSSAI License",
            value: siteConfig.fssaiLicense,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
