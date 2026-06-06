export default function FaqJsonLd() {
  const faqs = [
    {
      q: "What is Royal Swag Lung Detox Tea?",
      a: "Royal Swag Lung Detox Tea is a 100% Ayurvedic herbal tea formulated with 7 potent herbs to cleanse lungs of tar, reduce morning cough, and improve respiratory capacity. FSSAI certified and lab-tested."
    },
    {
      q: "Is it safe for daily use?",
      a: "Yes, it is completely natural with no synthetic additives. It can be consumed daily as part of your morning or evening routine. Consult your doctor if you are on medication."
    },
    {
      q: "How long before I see results?",
      a: "Most customers report reduced coughing and easier breathing within 7-14 days. For comprehensive lung detox, a full 30-day course is recommended."
    },
    {
      q: "Can smokers and ex-smokers use this?",
      a: "Absolutely. The formula is specifically designed to help both active smokers and ex-smokers expel accumulated tar and restore lung capacity over time."
    },
    {
      q: "Is Cash on Delivery available?",
      a: "Yes, COD is available across India. Free delivery is included on all orders."
    },
    {
      q: "What is your return policy?",
      a: "We offer a 30-day money-back guarantee. If you are not satisfied, contact us within 30 days of purchase for a full refund."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
