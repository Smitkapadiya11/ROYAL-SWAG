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
import { pageMetadata } from "@/lib/seo-metadata";
import { buildPricingPlans } from "@/lib/product-pricing";

export const metadata = pageMetadata("/", {
  title: "Royal Swag — Herbal Lung Detox Tea | Breathe Clean. Live Free.",
  description:
    "India's #1 Ayurvedic lung detox tea. Formulated with Tulsi, Vasaka, Mulethi & Pippali. Trusted by 5,000+ customers. Free delivery. 30-day guarantee.",
});

const IVORY = "#faf7f2";
const LOADER_END = "#061508";
const PAIN = "#0D3B1F";
const PAIN_BOTTOM = "#0a2e18";
const BRAND_GREEN = "#1a3a2a";

export default function HomePage() {
  const minPrice = Math.min(...buildPricingPlans().map((p) => p.priceRupees));

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
      <div className="relative z-[1] mt-0 bg-[var(--brand-ivory)] py-12 min-[769px]:py-20">
        <div className="container-rs relative z-[1] mx-auto max-w-3xl px-4">
          <HowItsMadeMini />
        </div>
      </div>
      <SectionHairline />
      <FaqSection />
      <SectionBridge from={IVORY} to={BRAND_GREEN} />
      <FinalCTASection />
      <MobileStickyBar
        subline={`From Rs ${minPrice} · Secure checkout · Ships tomorrow`}
      />
    </PageClientWrapper>
  );
}
