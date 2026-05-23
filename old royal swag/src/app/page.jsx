import React from 'react';
import HeroSection from '@/components/HeroSection';
import TrustStrip from '@/components/TrustStrip';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import LungSliderSection from '@/components/LungSliderSection';
import HerbsSection from '@/components/HerbsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import WhoSection from '@/components/WhoSection';
import ReviewsSection from '@/components/ReviewsSection';
import VideoSection from '@/components/VideoSection';
import MobileStickyBar from '@/components/ui/MobileStickyBar';
import FaqJsonLd from '@/components/seo/FaqJsonLd';

export default function Home() {
  return (
    <div className="pb-[calc(60px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <FaqJsonLd />
      <HeroSection />
      <TrustStrip />
      <ProblemSection />
      <SolutionSection />
      <LungSliderSection />
      <HerbsSection />
      <HowItWorksSection />
      <WhoSection />
      <ReviewsSection />
      <VideoSection />
      <MobileStickyBar />
    </div>
  );
}
