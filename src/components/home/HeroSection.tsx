"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  ROYAL_SWAG_LOGO_HEIGHT,
  ROYAL_SWAG_LOGO_SRC,
  ROYAL_SWAG_LOGO_WIDTH,
} from "@/lib/brand-logo";
import DetoxCounter from "@/components/conversion/DetoxCounter";
import HeroTypewriter from "@/components/conversion/HeroTypewriter";

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
          .from('.hero-mirror-headline', {
            y: 28, opacity: 0, duration: 0.65
          }, '-=0.35')
          .from('.hero-typewriter-wrap', {
            y: 20, opacity: 0, duration: 0.55
          }, '-=0.3')
          .from('.hero-gold-line', {
            y: 16, opacity: 0, duration: 0.5
          }, '-=0.25')
          .from('.hero-detox-counter', {
            y: 12, opacity: 0, duration: 0.45
          }, '-=0.2')
          .from('.hero-cta-btn', {
            scale: 0.5, opacity: 0, duration: 0.6,
            ease: 'back.out(3)'
          }, '-=0.25')
          .from('.hero-cta-micro', {
            opacity: 0, duration: 0.4
          }, '-=0.15');

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
    <section ref={sectionRef} className="hero-section relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[var(--brand-ivory)] pb-20 pt-0">
      
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
        <div className="hero-logo group flex flex-col items-center">
          <h1 className="m-0 mb-4">
            <Image
              src={ROYAL_SWAG_LOGO_SRC}
              alt="Royal Swag Logo"
              width={ROYAL_SWAG_LOGO_WIDTH}
              height={ROYAL_SWAG_LOGO_HEIGHT}
              className="mx-auto h-14 w-auto sm:h-16 md:h-[4.5rem]"
              priority
            />
          </h1>
          <p className="hero-tagline text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[var(--brand-gold)] mb-6">
            estd. 2016
          </p>
        </div>

        <h2 className="hero-mirror-headline text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-dark)] leading-tight max-w-2xl mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
          Is This Your Morning?
        </h2>

        <div className="mb-6 w-full max-w-xl">
          <HeroTypewriter />
        </div>

        <p className="hero-gold-line text-sm sm:text-base font-semibold text-[var(--brand-gold)] max-w-lg mx-auto mb-6 leading-snug px-2">
          You already knew something was wrong. Royal Swag is how you fix it.
        </p>

        <div className="hero-detox-counter mb-8 w-full max-w-xl mx-auto">
          <DetoxCounter />
        </div>

        <Link
          href="/lung-test"
          className="hero-cta-btn inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[var(--brand-green)] text-[var(--brand-gold)] font-bold text-lg shadow-xl"
        >
          Test Your Lungs →
        </Link>
        <p className="hero-cta-micro mt-3 text-xs text-[var(--brand-dark)]/50 text-center max-w-sm">
          No email required to see your result
        </p>
      </div>
    </section>
  );
}
