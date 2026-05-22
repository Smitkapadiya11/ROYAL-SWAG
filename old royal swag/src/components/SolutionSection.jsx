'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { trackEvent } from '../lib/events';

export default function SolutionSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!hasTracked) {
            trackEvent('section_view', { section: 'solution' });
            setHasTracked(true);
          }
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasTracked]);

  const scrollToHerbs = (e) => {
    e.preventDefault();
    const herbsSection = document.getElementById('herbs-section');
    if (herbsSection) {
      herbsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-24 bg-[#F4EDD6] overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col items-center">
        
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <h2 className="text-[32px] md:text-[42px] font-serif font-bold text-[#495738] mb-8">
            A 3,000-year-old answer.<br/>Brewed for today's air.
          </h2>
          <div className="space-y-4 text-lg text-[#2A3020] opacity-90 text-left md:text-center">
            <p>
              In ancient Ayurveda, specific herbs were prescribed to clear respiratory passages and strengthen the lungs against natural irritants.
            </p>
            <p>
              Today, we face unnatural irritants: vehicle exhaust, industrial smog, and chemical aerosols.
            </p>
            <p>
              We studied these ancient texts and refined the formulations. The result is a precise blend of 7 herbs designed to break down tar, clear mucus, and help your lungs repair themselves.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full mb-16">
          {/* Left Visual: Manuscript */}
          <div 
            className={`relative w-full max-w-[400px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <Image
              src="/assets/ancient_manuscript.png"
              alt="Ancient Ayurvedic Manuscript"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Visual: Product */}
          <div 
            className={`relative w-full max-w-[400px] aspect-square transition-all duration-1000 delay-300 transform ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <Image
              src="/assets/Royal_Swag_Lung_Detox_Tea_202605230218.jpeg"
              alt="Royal Swag Lung Detox Tea Box"
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>

        <button 
          onClick={scrollToHerbs}
          className="text-[#9A6F1A] font-semibold text-lg hover:text-[#495738] transition-colors uppercase tracking-wider underline underline-offset-4"
        >
          See the 7 herbs ↓
        </button>

      </div>
    </section>
  );
}
