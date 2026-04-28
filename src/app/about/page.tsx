import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Royal Swag | 10 Years Ayurvedic Manufacturing | Surat Gujarat",
  description:
    "Founded 2015. AYUSH certified. ISO, GMP, FSSAI certified. Featured in Mirzapur (Amazon Prime) & Dhurndhar (Netflix). 4.7★ on Amazon.",
  alternates: { canonical: "https://royalswag.in/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
