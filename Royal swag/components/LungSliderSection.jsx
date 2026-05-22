'use client';
import React from 'react';
import LungSlider from './LungSlider';

export default function LungSliderSection() {
  return (
    <section className="bg-[#F4EDD6] py-24 w-full">
      <div className="max-w-[1000px] mx-auto px-4 flex flex-col items-center text-center">
        
        <h2 className="text-[32px] md:text-[42px] font-serif font-bold text-[#495738] mb-2">
          Healthy Lungs vs Polluted Lungs
        </h2>
        <p className="text-[#9A6F1A] font-medium text-lg mb-12">
          Drag the slider.
        </p>

        <div className="w-full max-w-[800px] rounded-2xl overflow-hidden shadow-2xl mb-6">
          <LungSlider />
        </div>

        <p className="text-[11px] text-[#495738] opacity-50 uppercase tracking-widest mt-4">
          Illustrative comparison. Not real medical scans. Results may vary.
        </p>
        
      </div>
    </section>
  );
}
