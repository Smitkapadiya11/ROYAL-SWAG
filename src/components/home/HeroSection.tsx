"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const leaves = [
  { top: '8%',  left: '3%',   size: 55, delay: 0,   dur: 3 },
  { top: '15%', right: '5%',  size: 45, delay: 0.5, dur: 2.5 },
  { top: '55%', left: '2%',   size: 50, delay: 0.3, dur: 3.5 },
  { top: '65%', right: '4%',  size: 48, delay: 1,   dur: 2.8 },
  { top: '35%', left: '6%',   size: 40, delay: 0.7, dur: 3.2 },
  { top: '80%', right: '7%',  size: 52, delay: 0.2, dur: 2.6 },
  { top: '25%', left: '15%',  size: 35, delay: 1.2, dur: 3.8 },
  { top: '75%', left: '12%',  size: 42, delay: 0.9, dur: 2.9 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      
      ctx = gsap.context(() => {
        // 1. FLOATING LEAVES: Fast, natural floating with wind effect
        gsap.to('.floating-leaf', {
          y: -80,
          x: 'random(-40, 40)',
          rotation: 'random(-45, 45)',
          scale: 'random(0.7, 1.4)',
          duration: 'random(2, 3.5)',   // VERY FAST
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          stagger: { each: 0.4, from: 'random' }
        });

        // 2. STEAM ANIMATION
        gsap.set(".steam-path", { opacity: 0, y: 0 });
        gsap.to('.steam-path', {
          y: -90,
          opacity: 0,
          duration: 1.5,   // Very fast
          repeat: -1,
          ease: 'power2.in',
          stagger: 0.5,
        });
        gsap.from('.steam-path', {
          opacity: 0.8,
          y: 0,
          duration: 1.5,
          repeat: -1,
          ease: 'power2.in',
          stagger: 0.5,
        });

        // 3. HERO ENTRANCE: Snappy premium feel
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.from('.hero-logo', {
            y: -80, opacity: 0, duration: 0.9, scale: 0.8
          })
          .from('.hero-tagline', {
            y: 50, opacity: 0, duration: 0.7, scale: 0.95
          }, '-=0.5')
          .from('.hero-subtitle', {
            y: 30, opacity: 0, duration: 0.6
          }, '-=0.4')
          .from('.hero-cta-btn', {
            scale: 0.5, opacity: 0, duration: 0.6,
            ease: 'back.out(3)'
          }, '-=0.3');

        // New hero stats animation
        gsap.from('.hero-stat', {
          y: 20, opacity: 0, scale: 0.5,
          duration: 0.6, stagger: 0.15,
          ease: 'back.out(2)', delay: 1.2,
        });

        // 4. CTA BUTTON: Magnetic breathing pulse
        gsap.to('.hero-cta-btn', {
          scale: 1.08,
          boxShadow: '0 0 40px rgba(45,106,79,0.6)',
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
        });

        // 5. SCROLL PARALLAX: Smooth depth effect
        ScrollTrigger.create({
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          onUpdate: (self) => {
            gsap.set(".hero-bg-circle-1", { y: self.progress * -80, scale: 1 + self.progress * 0.1 });
            gsap.set(".hero-bg-circle-2", { y: self.progress * -50 });
            gsap.set(".hero-logo", { y: self.progress * -100, opacity: 1 - self.progress * 0.3 });
            gsap.set(".floating-leaf", { y: `+=${self.progress * -20}` });
          }
        });

      }, sectionRef);
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero-section relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[var(--brand-ivory)] pb-20 pt-24">
      
      {/* Background circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-bg-circle-1 absolute top-0 -left-20 w-[600px] h-[600px] rounded-full bg-[var(--brand-sage)]/20 blur-3xl" />
        <div className="hero-bg-circle-2 absolute bottom-0 -right-20 w-[400px] h-[400px] rounded-full bg-[var(--brand-green)]/10 blur-3xl" />
      </div>

      {/* Floating Leaves (FIX 2) */}
      {leaves.map((leaf, i) => (
        <div
          key={i}
          className="floating-leaf"
          style={{
            position: "absolute",
            top: leaf.top,
            left: leaf.left ?? "auto",
            right: leaf.right ?? "auto",
            width: leaf.size,
            height: leaf.size,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <svg
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="50" cy="50" rx="30" ry="45"
              fill="#2d6a4f"
              opacity="0.7"
              transform="rotate(-20 50 50)"
            />
            <line
              x1="50" y1="10" x2="50" y2="90"
              stroke="#1b4332"
              strokeWidth="2"
              opacity="0.8"
              transform="rotate(-20 50 50)"
            />
            <line x1="35" y1="40" x2="50" y2="50"
              stroke="#1b4332" strokeWidth="1.2" opacity="0.8"
              transform="rotate(-20 50 50)"/>
            <line x1="35" y1="55" x2="50" y2="60"
              stroke="#1b4332" strokeWidth="1.2" opacity="0.8"
              transform="rotate(-20 50 50)"/>
            <line x1="65" y1="40" x2="50" y2="50"
              stroke="#1b4332" strokeWidth="1.2" opacity="0.8"
              transform="rotate(-20 50 50)"/>
          </svg>
        </div>
      ))}

      {/* Main Content Container */}
      <div className="relative z-10 text-center flex flex-col items-center max-w-2xl px-4">
        
        {/* Steam Animation wrapper */}
        <div className="relative w-full h-[100px] flex justify-center items-end mb-4 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <svg
              key={i}
              className="steam-path absolute"
              style={{ left: `calc(50% + ${-8 + (i * 8)}px)`, bottom: "20px" }}
              width="4"
              height="60"
              viewBox="0 0 4 60"
            >
              <path d="M2 60 C0 45 4 35 2 20 C0 10 3 5 2 0" stroke="#c9a84c" strokeWidth="4" fill="none" opacity="0.7" strokeLinecap="round" />
            </svg>
          ))}
        </div>

        {/* Logo / Tagline */}
        <div className="hero-logo group">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black text-[var(--brand-green)] tracking-tight leading-none mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            ROYAL SWAG
          </h1>
          <p className="hero-tagline text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[var(--brand-gold)] mb-6">
            estd. 2016
          </p>
        </div>

        <div className="max-w-lg mb-10">
          <p className="hero-subtitle text-xl sm:text-2xl text-[var(--brand-dark)]/80 font-medium">
            Breathe Clean. Live Free.
          </p>
          <p className="hero-subtitle mt-4 text-sm sm:text-base text-[var(--brand-dark)]/60 leading-relaxed max-w-md mx-auto">
            At Royal Swag, we provide a unique wellness experience that is inspired by the depth of traditional herbal medicine.
          </p>
          <p className="hero-subtitle mt-4 text-sm sm:text-base text-[var(--brand-dark)]/60 leading-relaxed max-w-md mx-auto">
            In today&apos;s world filled with more pollution, more fast-paced living, and more exposure to environmental elements than ever before, taking care of your lungs has become as necessary as it is vital to your health. Our Lung Detox Tea has been formulated specifically for the purpose of helping you support everyday normality through a careful selection of time-tested herbs that are safe and effective for daily use.
          </p>
          <p className="hero-subtitle mt-4 text-sm sm:text-base text-[var(--brand-dark)]/60 leading-relaxed max-w-md mx-auto">
            Starting with the belief that true wellness comes from consistency and simplicity, each of our formulas is meant to be a seamless part of your everyday routine. With every cup you drink, you will have a chance to experience the effects of having just finished an ordinary cup of tea as an opportunity to recover from life&apos;s daily demands.
          </p>
          <p className="hero-subtitle mt-4 text-sm sm:text-base text-[var(--brand-dark)]/60 leading-relaxed max-w-md mx-auto">
            The production of each of our blends is a direct reflection of our commitment to delivering only the purest, highest-quality herbal ingredients to you as quickly and, as safely, as possible, while also providing a smoother, more calming infusion to promote a lighter breathing experience.
          </p>
          <p className="hero-subtitle mt-4 text-sm sm:text-base text-[var(--brand-dark)]/60 leading-relaxed max-w-md mx-auto">
            Royal Swag believes in more than merely selling products — it believes in taking an ordinary habit, enjoying it as much as possible, and turning that habit into a conscious act of self-care.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/lung-test"
          className="hero-cta-btn inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[var(--brand-green)] text-[var(--brand-gold)] font-bold text-lg shadow-xl"
        >
          Test Your Lungs →
        </Link>
        <div className="flex gap-8 mt-6 justify-center">
          <div className="text-center">
            <div className="hero-stat text-3xl font-bold text-green-800">5000+</div>
            <div className="text-sm text-gray-500">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="hero-stat text-3xl font-bold text-green-800">100%</div>
            <div className="text-sm text-gray-500">Natural</div>
          </div>
          <div className="text-center">
            <div className="hero-stat text-3xl font-bold text-green-800">30-Day</div>
            <div className="text-sm text-gray-500">Guarantee</div>
          </div>
        </div>
      </div>
    </section>
  );
}
