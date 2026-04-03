import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import HomeLungSliderLoader from "@/components/HomeLungSliderLoader";
import PageClientWrapper from "./PageClientWrapper";
import BenefitsSection from "@/components/home/BenefitsSection";
import IngredientsSection from "@/components/home/IngredientsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import MobileStickyBar from "@/components/MobileStickyBar";
import PollutionPainSection from "@/components/conversion/PollutionPainSection";
import TrustAuthorityStrip from "@/components/conversion/TrustAuthorityStrip";
import HowItsMadeMini from "@/components/conversion/HowItsMadeMini";
import { SectionBridge, SectionHairline } from "@/components/layout/SectionBridge";

export const metadata: Metadata = {
  title: "Royal Swag — Herbal Lung Detox Tea | Breathe Clean. Live Free.",
  description:
    "Premium Ayurvedic lung detox tea with Tulsi, Vasaka & Mulethi. Take a free lung health test and discover personalized recommendations. Trusted by 2,400+ customers across India.",
};

const IVORY = "#faf7f2";
const LOADER_END = "#061508";
const PAIN = "#0D3B1F";
const PAIN_BOTTOM = "#0a2e18";
const BRAND_GREEN = "#1a3a2a";

export default function HomePage() {
  return (
    <PageClientWrapper>
      <HomeLungSliderLoader />
      <SectionBridge from={LOADER_END} to={IVORY} />
      <HeroSection />
      <SectionBridge from={IVORY} to={PAIN} />
      <PollutionPainSection />
      <SectionBridge from={PAIN_BOTTOM} to={IVORY} />
      <TrustAuthorityStrip className="bg-[var(--brand-ivory)]" />
      <SectionHairline />
      <BenefitsSection />
      <SectionHairline />
      <IngredientsSection />
      <SectionHairline />
      <HowItWorksSection />
      <SectionBridge from={IVORY} to={BRAND_GREEN} />
      <TestimonialsSection />
      <SectionBridge from={BRAND_GREEN} to={IVORY} />
      <div className="bg-[var(--brand-ivory)] py-12 min-[769px]:py-20">
        <div className="container-rs max-w-3xl mx-auto px-4">
          <HowItsMadeMini />
        </div>
      </div>
      <SectionHairline />
      <FaqSection />
      <SectionBridge from={IVORY} to={BRAND_GREEN} />
      <FinalCTASection />
      <MobileStickyBar />
    </PageClientWrapper>
  );
}
