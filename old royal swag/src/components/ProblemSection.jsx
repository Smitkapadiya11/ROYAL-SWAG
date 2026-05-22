'use client';
import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../lib/events';

// Animated Counter component
const AnimatedCounter = ({ endValue, suffix = '', duration = 2000, start = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      // If the number is a float
      if (endValue % 1 !== 0) {
        setCount(Number((easeProgress * endValue).toFixed(2)));
      } else {
        setCount(Math.floor(easeProgress * endValue));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [endValue, duration, start]);

  return <span>{count}{suffix}</span>;
};

export default function ProblemSection() {
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
            trackEvent('section_view', { section: 'problem' });
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

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-24 bg-cover bg-center"
      style={{ backgroundImage: 'url("/assets/Aerial_view_of_Indian_city_202605230218.jpeg")' }}
    >
      <div className="absolute inset-0 bg-[#0D1A0F] opacity-80 z-0"></div>
      
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-[#F4EDD6] text-center">
        <h2 className="text-[32px] md:text-[42px] font-serif font-bold mb-4">
          The air you're breathing right now.
        </h2>
        <p className="text-lg md:text-xl opacity-75 mb-16">
          This isn't fear-mongering. These are the numbers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          <div className="flex flex-col items-center">
            <div className="text-[52px] md:text-[72px] font-bold text-[#9A6F1A] leading-none mb-4">
              <AnimatedCounter endValue={9.78} suffix="×" start={isVisible} />
            </div>
            <p className="text-sm md:text-base mb-2 max-w-[250px]">
              India's PM2.5 vs WHO safe limit
            </p>
            <p className="text-xs opacity-50 uppercase tracking-widest">
              Source: IQAir 2024
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-[52px] md:text-[72px] font-bold text-[#9A6F1A] leading-none mb-4">
              <AnimatedCounter endValue={10} suffix=" YEARS" start={isVisible} />
            </div>
            <p className="text-sm md:text-base mb-2 max-w-[250px]">
              Tar stays in lung tissue after quitting smoking
            </p>
            <p className="text-xs opacity-50 uppercase tracking-widest">
              Source: American Lung Association
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-[52px] md:text-[72px] font-bold text-[#9A6F1A] leading-none mb-4">
              <AnimatedCounter endValue={0} suffix=" DAYS" start={isVisible} />
            </div>
            <p className="text-sm md:text-base mb-2 max-w-[250px]">
              Clean-air days Delhi had in 2025
            </p>
            <p className="text-xs opacity-50 uppercase tracking-widest">
              Source: CPCB India
            </p>
          </div>

        </div>

        <p className="text-xl md:text-2xl font-medium text-[#F4EDD6]">
          Your lungs are dealing with this today. Not someday.
        </p>
      </div>
    </section>
  );
}
