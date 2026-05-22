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
import StickyCTA from '@/components/StickyCTA';
import FaqJsonLd from '@/components/seo/FaqJsonLd';

export default function Home() {
  return (
    <>
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
      <StickyCTA />
    </>
  );
}
