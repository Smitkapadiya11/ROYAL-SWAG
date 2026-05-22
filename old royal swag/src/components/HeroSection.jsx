'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RoyalButton from './ui/Button';
import { trackEvent } from '../lib/events';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();

  const handleBuyNow = () => {
    trackEvent('hero_cta_click');
    router.push('/product');
  };

  const handleLungTestClick = () => {
    trackEvent('lung_test_click');
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-36px)] bg-[#F4EDD6] flex items-center pt-20 pb-10 md:py-0 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Copy */}
        <div className="flex flex-col items-start z-10 order-2 md:order-1">
          <p className="text-[#9A6F1A] font-semibold text-sm tracking-widest uppercase mb-4">
            TAR OUT · LUNG DETOX TEA
          </p>
          <h1 className="text-[#495738] font-serif font-bold text-[32px] leading-tight md:text-[52px] mb-6">
            Your lungs work hard.<br/>Give them a break.
          </h1>
          <p className="text-[#2A3020] text-lg md:text-xl mb-8 opacity-90 max-w-[90%]">
            Seven Ayurvedic herbs. One cup a day. Built for people who breathe polluted air, smoke, or used to.
          </p>
          
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-[#495738] text-xl line-through opacity-60">₹499</span>
            <span className="text-[#9A6F1A] text-3xl font-bold">₹349</span>
            <span className="bg-[#9A6F1A] text-[#F4EDD6] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              SAVE ₹150
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
            <RoyalButton 
              onClick={handleBuyNow}
              className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg md:relative fixed bottom-[10%] md:bottom-auto left-4 right-4 md:left-auto md:right-auto z-50 md:z-auto"
              style={{ width: 'calc(100% - 32px)', margin: '0 auto' }}
            >
              Buy Now — ₹349
            </RoyalButton>
            
            <Link 
              href="/lung-test" 
              onClick={handleLungTestClick}
              className="text-[#9A6F1A] font-medium underline underline-offset-4 hover:text-[#495738] transition-colors"
            >
              Take the Free Lung Test →
            </Link>
          </div>

          <div className="mt-8 flex items-center space-x-2 text-[12px] text-[#495738] opacity-70 flex-wrap">
            <span>✓ FSSAI Certified</span>
            <span>·</span>
            <span>✓ AYUSH Approved</span>
            <span>·</span>
            <span>✓ ISO & GMP</span>
            <span>·</span>
            <span>✓ 4.7★ (847+ reviews)</span>
          </div>
        </div>

        {/* Right Product Image */}
        <div className="relative flex justify-center items-center z-0 order-1 md:order-2 h-[400px] md:h-auto">
          <div className="relative animate-floating">
            <div className="absolute -top-6 -right-6 md:-right-12 z-20 bg-[#495738] text-[#F4EDD6] px-4 py-2 rounded-full text-sm font-medium shadow-xl animate-pulse whitespace-nowrap">
              147 people ordered today
            </div>
            <Image
              src="/assets/Royal_Swag_Lung_Detox_Tea_202605230218.jpeg"
              alt="Royal Swag Lung Detox Tea"
              width={500}
              height={500}
              className="object-contain drop-shadow-2xl"
              style={{ transform: 'rotate(15deg)' }}
              priority
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-floating {
          animation: floating 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
