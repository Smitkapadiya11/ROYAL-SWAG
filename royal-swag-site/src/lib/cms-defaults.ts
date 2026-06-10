import { S } from "@/lib/config";
import { getPrimaryProductMrp, getPrimaryProductPrice } from "@/lib/product-price";

export const DEFAULT_CMS_CONTENT: Record<string, unknown> = {
  hero: {
    image: "/images/hero/asset1-hero-product.webp",
    tagline: S.tagline,
    tagline_locked: true,
    subtitle: "Decades of research distilled into a premium lung detox tea.",
    cta_text: "Take the Free Lung Test",
  },
  product: {
    name: "Lung Detox Tea",
    short_description:
      "Cleanse, soothe, and rejuvenate your respiratory system with ancient botanical wisdom.",
    price_locked: true,
    price: getPrimaryProductPrice(),
    mrp: getPrimaryProductMrp(),
    discount_badge: "30% OFF",
  },
  herbs: {
    Tulsi: {
      image: "/images/herbs/tulsi.jpg",
      benefit: "Fights pollution-related inflammation and morning respiratory stress",
    },
    Vasaka: {
      image: "/images/herbs/vasaka.jpeg",
      benefit: "Clears chest heaviness and supports open, easy breathing",
    },
    Mulethi: {
      image: "/images/herbs/mulethi.jpeg",
      benefit: "Soothes throat irritation and reduces mucus buildup",
    },
    Pippali: {
      image: "/images/herbs/pippali.jpeg",
      benefit: "Aids smoking recovery and rebuilds lung capacity",
    },
  },
  testimonials: [
    {
      id: "1",
      name: "Priya M.",
      city: "Ahmedabad",
      rating: 5,
      text: "Ex-smoker of 11 years. My morning cough dropped within 3 weeks.",
      date: "2025-11-12",
    },
  ],
  faq: [
    {
      id: "1",
      question: "How long until I see results?",
      answer: "Most customers notice clearer breathing within 2–3 weeks of daily use.",
    },
  ],
  banners: [],
};
