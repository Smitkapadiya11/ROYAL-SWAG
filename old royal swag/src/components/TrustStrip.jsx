'use client';
import React from 'react';
import Image from 'next/image';

const items = [
  { icon: '🌿', text: '100% Ayurvedic' },
  { icon: '🏭', text: 'Made in India · Surat' },
  { icon: '🧪', text: 'Lab-Tested Batches' },
  { icon: '📦', text: 'Free Delivery Pan India' },
  { icon: '💵', text: 'COD Available' },
  { icon: '↩️', text: '30-Day Money Back' }
];

export default function TrustStrip() {
  return (
    <section className="bg-[#F4EDD6] border-y border-[#49573820] py-4 w-full overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col items-center space-y-4">
        
        {/* Horizontal Scroll Text Items */}
        <div className="w-full overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex items-center space-x-6 md:space-x-0 md:justify-between min-w-max md:min-w-0 w-full pb-2 md:pb-0 px-2 md:px-0">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                <div className="w-6 h-6 rounded-full bg-[#5C946E] flex items-center justify-center text-xs">
                  {item.icon}
                </div>
                <span className="text-[#495738] text-sm font-medium">{item.text}</span>
                {index < items.length - 1 && (
                  <span className="hidden md:block text-[#49573840] mx-4">|</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certification Badges */}
        <div className="flex justify-center w-full max-w-[400px]">
          <Image
            src="/assets/Set_of_4_certification_badge_202605230220.jpeg"
            alt="Certification Badges"
            width={400}
            height={80}
            className="object-contain opacity-80"
          />
        </div>

      </div>
    </section>
  );
}
