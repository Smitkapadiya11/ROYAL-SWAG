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
      image: "/images/herbs/tulsi.webp",
      benefit: "Fights pollution-related inflammation and morning respiratory stress",
    },
    Vasaka: {
      image: "/images/herbs/vasaka.webp",
      benefit: "Clears chest heaviness and supports open, easy breathing",
    },
    Mulethi: {
      image: "/images/herbs/mulethi.webp",
      benefit: "Soothes throat irritation and reduces mucus buildup",
    },
    Pippali: {
      image: "/images/herbs/pippali.webp",
      benefit: "Aids smoking recovery and rebuilds lung capacity",
    },
    Pushkarmool: {
      image: "/images/herbs/pushkarmool.webp",
      benefit: "A potent bronchodilator supporting clear, open breathing",
    },
    Kantakari: {
      image: "/images/herbs/kantakari.webp",
      benefit: "Effectively manages respiratory ailments and reduces inflammation",
    },
  },
  videos: {
    doctors: [
      {
        id: "doc1",
        videoSrc: "/videos/doctor1.mp4",
        name: "Dr. Rajesh Sharma",
        title: "MBBS, MD — Pulmonologist",
        hospital: "Apollo Hospitals, Ahmedabad",
        quote:
          "I recommend Royal Swag to all my patients with chronic respiratory issues.",
        years: "18 years experience",
      },
      {
        id: "doc2",
        videoSrc: "/videos/doctor2.mp4",
        name: "Dr. Priya Mehta",
        title: "BAMS — Ayurvedic Specialist",
        hospital: "Surat Ayurved Centre",
        quote:
          "The herb combination in this tea is clinically validated and highly effective.",
        years: "12 years experience",
      },
      {
        id: "doc3",
        videoSrc: "/videos/doctor3.mp4",
        name: "Dr. Vikram Patel",
        title: "MD — Internal Medicine",
        hospital: "Gujarat Medical Institute",
        quote: "Natural, safe, and measurably effective for lung detoxification.",
        years: "22 years experience",
      },
    ],
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
