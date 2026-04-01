import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import PageClientWrapper from "./PageClientWrapper";
import BenefitsSection from "@/components/home/BenefitsSection";
import IngredientsSection from "@/components/home/IngredientsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import MobileStickyBar from "@/components/MobileStickyBar";

export const metadata: Metadata = {
  title: "Royal Swag — Herbal Lung Detox Tea | Breathe Clean. Live Free.",
  description:
    "Premium Ayurvedic lung detox tea with Tulsi, Vasaka & Mulethi. Take a free lung health test and discover personalized recommendations. Trusted by 2,400+ customers across India.",
};

const SectionDivider = () => (
  <div className="section-divider w-full overflow-hidden leading-none rotate-180">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-[var(--brand-sage)] opacity-30">
      <path d="M985.66,92.83C906.67,72,793.78,49.7,685.88,45.05S479.13,60.37,404.16,69.83c-71.52,9.13-147.09,14.15-219.16,12.5C111.27,80.63,47.79,65.9,0,50.32V0H1200V69.83C1130.16,69.83,1055.21,113.06,985.66,92.83Z"/>
    </svg>
  </div>
);

export default function HomePage() {
  return (
    <PageClientWrapper>
      <HeroSection />
      <SectionDivider />
      <BenefitsSection />
      <SectionDivider />
      <IngredientsSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <TestimonialsSection />
      <SectionDivider />
      <FaqSection />
      <SectionDivider />
      <FinalCTASection />
      <MobileStickyBar />
    </PageClientWrapper>
  );
}
