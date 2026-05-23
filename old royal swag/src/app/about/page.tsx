"use client";

import { useEffect } from "react";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import { S } from "@/lib/config";
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

const FOUNDER_IMAGE_BY_ID: Record<string, string> = {
  hitesh: "/images/founders/hitesh.jpg",
  manoj: "/images/founders/manoj.jpg",
  jaideep: "/images/founders/jaideep.jpg",
};

const founders = S.team.map((m) => ({
  name: m.name,
  initials: m.initials,
  img: FOUNDER_IMAGE_BY_ID[m.id] ?? m.img,
  role: m.role,
}));

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

const MOBILE_NAV = [
  { label: "Home", href: "/", icon: "🏠", active: false },
  { label: "Shop", href: "/product", icon: "🛍", active: false },
  { label: "Test", href: "/lung-test", icon: "🫁", active: false },
  { label: "About", href: "/about", icon: "ℹ", active: true },
] as const;

function heroImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const el = e.currentTarget;
  el.style.background = "linear-gradient(135deg, #324023 0%, #9A6F1A 100%)";
  el.style.display = "block";
  el.removeAttribute("src");
}

function founderImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

export default function AboutPage() {
  useEffect(() => {
    document.body.classList.add("about-page");
    return () => document.body.classList.remove("about-page");
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-parchment font-sans text-on-surface antialiased md:mx-auto md:max-w-4xl">
      {/* Hero */}
      <section className="relative flex flex-col items-center gap-6 px-5 pb-16 pt-12 text-center md:grid md:grid-cols-2 md:items-center md:gap-12 md:px-16 md:pb-20 md:pt-16 md:text-left">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(244,237,214,0.5),transparent)] md:left-0 md:top-0 md:h-full md:w-1/2 md:translate-x-0 md:translate-y-0"
          aria-hidden
        />

        <div>
          <h1 className="font-display text-[36px] font-bold leading-[42px] text-primary-container md:text-[42px] md:leading-tight">
            Born in Surat.
            <br />
            <span className="text-ayurvedic-gold">Built for India&apos;s Lungs.</span>
          </h1>
        </div>

        <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-glass-border shadow-lg md:mt-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-full w-full object-cover"
            src="/images/about-hero.jpg"
            alt="Lush tea fields"
            onError={heroImageError}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
            aria-hidden
          />
        </div>
      </section>

      {/* Timeline */}
      <section className="relative px-5 py-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-[32px] font-semibold text-primary">
            Our Journey
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-ayurvedic-gold opacity-80" />
        </div>

        <div className="relative ml-5 flex flex-col gap-14 border-l-2 border-surface-container-highest pl-10">
          {TIMELINE.map((item, i) => (
            <div key={i} className="relative">
              <div
                className="absolute -left-[49px] top-1 h-5 w-5 rounded-full border-4 border-parchment shadow-sm"
                style={{ background: item.dot }}
              />
              <div
                className={cn(
                  "glass-card rounded-2xl p-5 shadow-sm transition-colors hover:bg-surface-container-highest/30",
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

      {/* Founders */}
      <section className="px-4 py-20">
        <div className="relative overflow-hidden rounded-[40px] border border-glass-border bg-[#eff6e1] px-5 py-12 shadow-sm">
          <div
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-surface-container-high opacity-60 blur-3xl"
            aria-hidden
          />
          <div className="relative z-10 mb-10 text-center">
            <h2 className="font-display text-[32px] font-semibold text-primary">
              The Visionaries
            </h2>
            <p className="mx-auto mt-2 max-w-xs font-sans text-base text-on-surface-variant">
              The minds architecting Ayurvedic respiratory care.
            </p>
          </div>
          <div className="relative z-10 flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-6">
            {founders.map((f) => (
              <div
                key={f.name}
                className="glass-card flex items-center gap-5 rounded-3xl p-5 shadow-sm transition-colors hover:bg-white/50"
              >
                <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-surface-container-highest shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.img}
                    alt={f.name}
                    className="h-full w-full object-cover"
                    onError={founderImageError}
                  />
                  <span className="font-display text-2xl font-semibold text-primary">
                    {f.initials}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold text-primary-container">
                    {f.name}
                  </h3>
                  <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-ayurvedic-gold">
                    {f.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="px-5 py-20" id="certifications">
        <div className="mb-10 text-center">
          <h2 className="font-display text-[32px] font-semibold text-primary">
            Uncompromising Quality
          </h2>
          <p className="mx-auto mt-3 max-w-[280px] font-sans text-base text-on-surface-variant">
            World-class facilities. Highest global safety standards.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CERT_GRID.map((c) => (
            <div
              key={c.label}
              className="glass-card flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1"
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
      </section>

      {/* Page footer (mobile only — site footer on md+) */}
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

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-2xl border-t border-glass-border bg-glass-surface px-2 pb-5 pt-3 shadow-lg backdrop-blur-xl md:hidden"
        aria-label="Mobile primary"
      >
        {MOBILE_NAV.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={cn(
              "flex flex-col items-center justify-center rounded-2xl p-2 transition-all duration-300",
              t.active
                ? "relative -top-1 w-20 scale-105 bg-primary-container text-on-primary-container shadow-sm"
                : "w-16 text-on-surface-variant hover:bg-surface-container-highest/20"
            )}
            aria-current={t.active ? "page" : undefined}
          >
            <span className="text-xl" aria-hidden>
              {t.icon}
            </span>
            <span
              className={cn(
                "mt-1 font-sans",
                t.active ? "text-sm font-semibold" : "text-xs"
              )}
            >
              {t.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
