'use client';
import React, { useState, useEffect } from 'react';

const messages = [
  "🚚 FREE delivery across India · COD available",
  "🎁 Today only — ₹349 (was ₹499). Save ₹150.",
  "⏰ Order before 6 PM → Ships in 2 Days",
  "🛡️ 30-day money-back guarantee. No questions."
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-[9999] w-full bg-[#5C946E] text-white h-[36px] flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center max-w-[1200px] px-4">
        {messages.map((msg, idx) => (
          <p
            key={idx}
            className={`absolute text-sm font-medium transition-opacity duration-500 text-center whitespace-nowrap ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
}
