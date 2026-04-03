"use client";

import { useEffect, useRef } from "react";

const STORY_LINES = [
  "Born in 2016, Royal Swag was founded in a small kitchen in Surat",
  "by two brothers who watched their father struggle with pollution-induced",
  "breathing problems for years. When conventional medicine offered no",
  "permanent solution, they turned to Ayurveda — and it changed everything.",
  "Today, Royal Swag serves 2,400+ customers across India, and every batch",
  "is still made with the same four core herbs that healed that first chest.",
];

const TEAM = [
  { name: "Arjun Shah", role: "Co-Founder & CEO", initials: "AS" },
  { name: "Rohan Shah", role: "Co-Founder & Head of Formulation", initials: "RS" },
  { name: "Dr. Vandana Patel", role: "Senior Ayurvedic Consultant", initials: "VP" },
];

const CERTS = [
  { label: "Ayush Approved", badge: "🌿" },
  { label: "GMP Compliant", badge: "🏭" },
  { label: "Lab Tested", badge: "🔬" },
];

export default function AboutContent() {
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Line-by-line reveal for story text
        gsap.fromTo(
          ".story-line",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".story-line",
              start: "top 80%",
              once: true,
            },
          }
        );

        gsap.fromTo(".mission-block", { opacity: 0, scale: 0.98 }, {
          opacity: 1, scale: 1, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".mission-block", start: "top 80%", once: true },
        });

        gsap.fromTo(".team-card", { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: ".team-card", start: "top 85%", once: true },
        });

        gsap.fromTo(".cert-badge", { opacity: 0, y: 12 }, {
          opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: ".cert-badge", start: "top 90%", once: true },
        });
      }, storyRef);
    };

    init();
    return () => ctx?.revert();
  }, []);

  return (
    <div ref={storyRef} className="pt-0">

      {/* Brand Story */}
      <section className="py-24 md:py-32 bg-[var(--brand-ivory)]" aria-labelledby="story-heading">
        <div className="container-rs max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-4">Our Story</p>
          <h1
            id="story-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--brand-dark)] mb-12 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Heritage.<br />Purpose.<br />Breath.
          </h1>
          <div className="space-y-2">
            {STORY_LINES.map((line, i) => (
              <p
                key={i}
                className="story-line text-xl md:text-2xl text-[var(--brand-dark)]/70 font-light leading-relaxed opacity-0"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section
        className="py-24 md:py-32 bg-[var(--brand-green)] mission-block opacity-0"
        aria-labelledby="mission-heading"
      >
        <div className="container-rs max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-4">Our Mission</p>
          <h2
            id="mission-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            "We believe clean air is a right, not a privilege."
          </h2>
          <p className="mt-8 text-base text-white/55 max-w-lg mx-auto">
            Pollution isn't going away. But your lungs don't have to suffer for it. Every cup of Royal Swag is our commitment to helping India breathe better — one household at a time.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-32 bg-[var(--brand-ivory)]" aria-labelledby="team-heading">
        <div className="container-rs">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-3">The People</p>
            <h2 id="team-heading" className="text-3xl sm:text-4xl font-bold text-[var(--brand-dark)]"
              style={{ fontFamily: "var(--font-playfair)" }}>
              The Team Behind the Tea
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM.map(({ name, role, initials }) => (
              <div
                key={name}
                className="team-card bg-white rounded-2xl border border-[var(--brand-sage)] shadow-sm p-8 text-center opacity-0"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--brand-green)] text-white font-bold text-lg flex items-center justify-center mx-auto mb-5">
                  {initials}
                </div>
                <h3 className="font-bold text-[var(--brand-dark)] text-base mb-1"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                  {name}
                </h3>
                <p className="text-sm text-[var(--brand-dark)]/50">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-[var(--brand-sage)]/30" aria-labelledby="certs-heading">
        <div className="container-rs">
          <h2 id="certs-heading" className="text-center text-2xl font-bold text-[var(--brand-dark)] mb-10"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Our Certifications
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {CERTS.map(({ label, badge }) => (
              <div
                key={label}
                className="cert-badge bg-white rounded-2xl border border-[var(--brand-sage)] shadow-sm px-6 py-4 flex items-center gap-3 opacity-0"
              >
                <span className="text-2xl" aria-hidden="true">{badge}</span>
                <span className="font-semibold text-[var(--brand-dark)] text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
