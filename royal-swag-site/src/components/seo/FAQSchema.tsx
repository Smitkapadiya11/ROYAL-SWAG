const FAQ_ITEMS = [
  {
    q: "What is the best lung detox tea in India?",
    a: "Royal Swag Lung Detox Tea is a 100% Ayurvedic blend with Tulsi, Vasaka, Mulethi, and Pippali — formulated for urban pollution, smokers, and anyone seeking to clean lungs naturally. FSSAI certified with 2,400+ happy customers.",
  },
  {
    q: "Is there an Ayurvedic tea for smokers and ex-smokers?",
    a: "Yes. Royal Swag Tar Out Tea uses Pippali and Vasaka to help expel tar buildup and support lung recovery — ideal for active smokers and those who quit within the last 2 years.",
  },
  {
    q: "How to clean lungs naturally at home?",
    a: "Drink Royal Swag Lung Detox Tea daily: steep one bag in hot water, inhale the herbal steam, and sip warm. Combined with clean air habits, most customers notice clearer breathing within 2–3 weeks.",
  },
  {
    q: "Is Royal Swag Lung Detox Tea safe for daily use?",
    a: "Yes. It is completely natural with no synthetic additives. Consult your doctor if you are on medication or pregnant.",
  },
  {
    q: "Is Cash on Delivery available across India?",
    a: "Yes. Free delivery and COD are available pan India. 30-day money-back guarantee applies.",
  },
] as const;

export default function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
