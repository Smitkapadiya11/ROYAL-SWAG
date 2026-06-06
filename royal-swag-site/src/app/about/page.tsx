"use client";

import { useEffect } from "react";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { SafeImage } from "@/components/ui/SafeImage";
import { FounderPhoto } from "@/components/about/FounderPhoto";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { cn } from "@/lib/utils";

const TIMELINE = [
  {
    year: "2016",
    dot: "#9A6F1A",
    title: "Herbal Cigarettes",
    desc: "Founded with a mission to help India quit smoking. We engineered the nation's first 100% tobacco-free and nicotine-free herbal cigarettes.",
  },
  {
    year: "",
    dot: "#c5c8bc",
    title: "The Realization",
    desc: "While helping users quit was a success, the underlying lung damage from past habits and rising urban pollution remained unaddressed.",
  },
  {
    year: "Today",
    dot: "#495738",
    title: "Lung Detox Tea",
    desc: "Merging centuries-old Ayurvedic wisdom with modern clinical extraction, we formulated our signature Lung Detox Tea.",
  },
] as const;

const FOUNDERS = [
  {
    name: "Hitesh Sabhadiya",
    role: "Co-Founder",
    focus: "Product & Ayurvedic Research",
    img: "/images/hitesh.jpeg",
  },
  {
    name: "Manoj Koshiya",
    role: "Co-Founder",
    focus: "Operations & Growth",
    img: "/images/manoj.jpeg",
  },
  {
    name: "Jaideep Singh",
    role: "Co-Founder",
    focus: "Brand & Marketing",
    img: "/images/jaideep%20singh.jpeg",
  },
] as const;

const CERT_GRID = [
  { icon: "✓", label: "ISO Certified" },
  { icon: "🔬", label: "GMP Quality" },
  { icon: "🛡", label: "FSSAI Approved" },
  { icon: "🌿", label: "AYUSH Ministry" },
] as const;

const FOOTER_LINKS = [
  "ISO Certified",
  "GMP Quality",
  "FSSAI Approved",
  "AYUSH Ministry",
  "LEAN Manufacturing",
] as const;

export default function AboutPage() {
  useEffect(() => {
    document.body.classList.add("about-page");
    return () => document.body.classList.remove("about-page");
  }, []);

  return (
    <div className="page-mobile-pad relative flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-parchment font-sans text-on-surface antialiased">
      {/* Mobile hero */}
      <section className="relative flex flex-col items-center gap-6 px-5 pb-16 pt-24 text-center md:hidden">
        <h1 className="font-display text-[36px] font-bold leading-[42px] text-primary-container">
          Born in Surat.
          <br />
          <span className="text-ayurvedic-gold">Built for India&apos;s Lungs.</span>
        </h1>
        <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-glass-border shadow-lg">
          <SafeImage
            className="h-full w-full"
            src="/images/hero/asset2.jpeg"
            alt="Lush tea fields"
            label="Tea Fields"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
            aria-hidden
          />
        </div>
      </section>

      {/* Desktop hero */}
      <section className="site-container hidden gap-12 py-16 md:grid md:grid-cols-2 md:items-center md:py-20">
        <div className="text-left">
          <h1 className="font-display text-[42px] font-bold leading-tight text-primary-container lg:text-5xl">
            Born in Surat.
            <br />
            <span className="text-ayurvedic-gold">Built for India&apos;s Lungs.</span>
          </h1>
          <p className="mt-6 max-w-md font-sans text-lg leading-relaxed text-on-surface-variant">
            From helping India quit smoking to healing lungs damaged by pollution
            and past habits — our story is rooted in Surat and built for every
            Indian city.
          </p>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-glass-border shadow-lg">
          <SafeImage
            className="h-full w-full"
            src="/images/hero/asset2.jpeg"
            alt="Lush tea fields"
            label="Tea Fields"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
            aria-hidden
          />
        </div>
      </section>

      <section className="site-container relative py-16 md:py-20">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="font-display text-[32px] font-semibold text-primary md:text-4xl">
            Our Journey
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-ayurvedic-gold opacity-80" />
        </div>

        <div className="relative ml-5 flex flex-col gap-14 border-l-2 border-surface-container-highest pl-10 md:mx-auto md:max-w-3xl">
          {TIMELINE.map((item, i) => (
            <div key={i} className="relative">
              <div
                className="absolute -left-[49px] top-1 h-5 w-5 rounded-full border-4 border-parchment shadow-sm"
                style={{ background: item.dot }}
              />
              <div
                className={cn(
                  "glass-card rounded-2xl p-5 shadow-sm transition-colors hover:bg-surface-container-highest/30 md:p-6",
                  item.year === "Today" &&
                    "border border-primary-fixed bg-primary-fixed/30"
                )}
              >
                {item.year ? (
                  <span className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ayurvedic-gold">
                    {item.year}
                  </span>
                ) : null}
                <h3 className="mb-2 font-display text-2xl font-semibold text-primary-container">
                  {item.title}
                </h3>
                <p className="font-sans text-base leading-6 text-on-surface-variant">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="site-container py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center md:text-left">
          <h2 className="font-display text-[32px] font-semibold text-primary md:text-4xl">
            The Journey to Clarity
          </h2>
          <p className="mt-2 font-sans text-base text-on-surface-variant">
            Drag to compare lung health before and after 30 days of Royal Swag.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-3xl">
          <BeforeAfterSlider
            beforeSrc="/images/lungs-before.png"
            afterSrc="/images/lungs-after.png"
            beforeLabel="Before"
            afterLabel="After 30 Days"
          />
        </div>
      </section>

      <section className="site-container py-16 md:py-20">
        <div className="relative overflow-hidden rounded-[40px] border border-glass-border bg-[#eff6e1] px-5 py-12 shadow-sm md:px-10 md:py-14">
          <div
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-surface-container-high opacity-60 blur-3xl"
            aria-hidden
          />
          <div className="relative z-10 mb-10 text-center">
            <h2 className="font-display text-[32px] font-semibold text-primary md:text-4xl">
              The Visionaries
            </h2>
            <p className="mx-auto mt-2 max-w-xs font-sans text-base text-on-surface-variant md:max-w-md">
              The minds architecting Ayurvedic respiratory care.
            </p>
          </div>
          <div className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {FOUNDERS.map((f) => (
              <div
                key={f.name}
                className="glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="flex w-full items-center justify-center bg-gradient-to-br from-[#e9f1dc] to-[#dee5d1]"
                  style={{ minHeight: "280px" }}
                >
                  <FounderPhoto src={f.img} alt={f.name} />
                </div>
                <div className="bg-white/50 p-5">
                  <h4 className="font-display text-xl font-bold text-[#324023]">
                    {f.name}
                  </h4>
                  <p className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A6F1A]">
                    {f.role}
                  </p>
                  <div className="mt-2 border-t border-[rgba(200,210,190,0.4)] pt-2">
                    <p className="font-sans text-sm text-[#45483f]">{f.focus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-16 md:py-20" id="certifications">
        <div className="mb-10 text-center">
          <h2 className="font-display text-[32px] font-semibold text-primary md:text-4xl">
            Uncompromising Quality
          </h2>
          <p className="mx-auto mt-3 max-w-sm font-sans text-base text-on-surface-variant">
            World-class facilities. Highest global safety standards.
          </p>
        </div>

        {/* Mobile cert grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {CERT_GRID.map((c) => (
            <div
              key={c.label}
              className="glass-card flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center shadow-sm"
            >
              <span className="text-[40px] text-ayurvedic-gold">{c.icon}</span>
              <span className="font-sans text-sm font-semibold text-primary-container">
                {c.label}
              </span>
            </div>
          ))}
          <div className="col-span-2 flex flex-row items-center justify-center gap-4 rounded-2xl bg-primary-container p-6 text-on-primary-container shadow-sm">
            <span className="text-3xl text-ayurvedic-gold">🏭</span>
            <span className="font-display text-2xl font-semibold">
              LEAN Manufacturing
            </span>
          </div>
        </div>

        {/* Desktop cert grid */}
        <div className="hidden gap-4 md:grid md:grid-cols-3 lg:grid-cols-5">
          {[...CERT_GRID, { icon: "🏭", label: "LEAN Manufacturing" }].map(
            (c) => (
              <div
                key={c.label}
                className="glass-card flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center shadow-sm transition-transform hover:-translate-y-1"
              >
                <span className="text-4xl text-ayurvedic-gold">{c.icon}</span>
                <span className="font-sans text-sm font-semibold text-primary-container">
                  {c.label}
                </span>
              </div>
            )
          )}
        </div>
      </section>

      <footer className="flex w-full flex-col gap-8 rounded-t-[40px] bg-primary px-5 py-12 pb-28 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:hidden">
        <BrandLogo variant="on-dark" className="h-10 w-auto" />
        <div className="flex flex-col gap-5">
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l}
              href="#certifications"
              className="font-sans text-sm font-semibold text-white/90 transition-colors hover:text-ayurvedic-gold"
            >
              {l}
            </Link>
          ))}
        </div>
        <div className="mt-6 border-t border-white/10 pt-6 font-sans text-base text-white/50">
          © {new Date().getFullYear()} Royal Swag Lung Detox. All Rights Reserved.
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}
