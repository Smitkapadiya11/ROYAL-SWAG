export default function ProductJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Royal Swag TAR OUT Lung Detox Tea",
    description: "7 Ayurvedic herbs formulated to cleanse lungs of tar, reduce coughing, and improve respiratory capacity. FSSAI certified.",
    image: "https://lungdetox.royalswag.in/images/asset1-hero-product.jpg",
    brand: {
      "@type": "Brand",
      name: "Royal Swag"
    },
    manufacturer: {
      "@type": "Organization",
      name: "Eximburg International Pvt. Ltd."
    },
    identifier: {
      "@type": "PropertyValue",
      name: "FSSAI",
      value: process.env.NEXT_PUBLIC_FSSAI_LICENSE || "FSSAI Certified"
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "599",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      url: "https://lungdetox.royalswag.in/product"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "847"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
