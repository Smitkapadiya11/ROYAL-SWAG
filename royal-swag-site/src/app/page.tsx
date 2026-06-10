"use client";

import Link from "next/link";
import FAQSchema from "@/components/seo/FAQSchema";
import { HomeHero } from "@/components/home/HomeHero";
import { HerbsSection } from "@/components/home/HerbsSection";
import { DoctorEndorsements } from "@/components/sections/DoctorEndorsements";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Reveal } from "@/components/ui/Reveal";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { Container, Grid, Section } from "@/components/layout";
import { S } from "@/lib/config";
import { useTranslations } from "@/contexts/LocaleContext";

const BEFORE_AFTER = {
  before: "/images/lungs-before.webp",
  after: "/images/lungs-after.webp",
} as const;

const ritualSteps = [
  { n: 1, title: "Boil", desc: "Bring 200ml of fresh water to a rolling boil." },
  { n: 2, title: "Steep", desc: "Add one tea bag and steep for 3–5 minutes." },
  { n: 3, title: "Breathe", desc: "Inhale the aromatic steam before slowly sipping." },
];

export default function Home() {
  const { t } = useTranslations();

  return (
    <div className="page-mobile-pad w-full min-w-0 overflow-x-hidden">
      <FAQSchema />

      <Section compact bg="cream" className="overflow-hidden">
        <Container className="py-section-gap-mobile lg:py-section-gap">
          <HomeHero />
        </Container>
      </Section>

      <Section compact bg="transparent" className="py-0 md:py-4">
        <Container>
          <Reveal direction="up">
            <div className="rounded-layout-md border-y border-glass-border bg-surface/50 py-8 md:border md:py-10">
              <p className="mb-6 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                {t("home.trusted")}
              </p>
              <Grid cols={{ mobile: 3, tablet: 3, desktop: 3 }} className="text-center">
                <div>
                  <p className="font-display text-2xl font-bold text-primary md:text-3xl">
                    2,400+
                  </p>
                  <p className="mt-1 font-sans text-xs text-on-surface-variant md:text-sm">{t("home.customers")}</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-primary md:text-3xl">
                    ★ 4.8
                  </p>
                  <p className="mt-1 font-sans text-xs text-on-surface-variant md:text-sm">rating</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-primary md:text-3xl">
                    30 Days
                  </p>
                  <p className="mt-1 font-sans text-xs text-on-surface-variant md:text-sm">guarantee</p>
                </div>
              </Grid>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section bg="cream">
        <Container>
          <Grid cols={{ mobile: 1, tablet: 1, desktop: 2 }} className="items-center">
            <Reveal direction="up" delay={0}>
              <div className="text-center md:text-left">
                <p className="font-body text-sm font-semibold tracking-widest text-ayurvedic-gold">✦</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">
                  A Decade of Purity
                </h2>
                <p className="mt-6 font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
                  We believe in the power of nature, elevated by science. Ayurveda understood the
                  complexities of the human respiratory system long before the industrial age —
                  we&apos;ve carefully sourced and blended time-tested botanicals into a revitalizing
                  daily ritual for modern lungs.
                </p>
              </div>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <div className="rounded-layout-md bg-surface p-4 md:p-6">
                <h2 className="text-center font-display text-3xl font-bold text-primary md:text-left md:text-4xl">
                  The Journey to Clarity
                </h2>
                <p className="mt-3 text-center font-body text-sm text-on-surface-variant md:text-left">
                  Drag to compare lung health before and after 30 days of Royal Swag.
                </p>
                <div className="mt-10 min-w-0">
                  <BeforeAfterSlider
                    beforeSrc={BEFORE_AFTER.before}
                    afterSrc={BEFORE_AFTER.after}
                    beforeLabel="Before"
                    afterLabel="After 30 Days"
                  />
                </div>
              </div>
            </Reveal>
          </Grid>
        </Container>
      </Section>

      <Section id="herbs" bg="transparent" compact>
        <Container>
          <Reveal direction="left">
            <HerbsSection />
          </Reveal>
        </Container>
      </Section>

      <DoctorEndorsements />

      <Section bg="cream">
        <Container>
          <Reveal direction="up">
            <h2 className="text-center font-display text-3xl font-bold text-primary md:text-4xl">
              The Daily Ritual
            </h2>
          </Reveal>
          <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} className="mx-auto mt-10 max-w-4xl">
            {ritualSteps.map((s, i) => (
              <Reveal key={s.n} direction="up" delay={i * 100}>
                <article className="glass-card relative rounded-layout-md p-6 pt-10 text-center">
                  <span className="absolute left-1/2 top-4 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary font-body text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold text-primary">{s.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">
                    {s.desc}
                  </p>
                </article>
              </Reveal>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section compact bg="green" className="mb-8">
        <Container className="text-center">
          <h2 className="font-display text-3xl font-bold text-parchment lg:text-4xl">
            Ready to Breathe Cleaner?
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-base text-parchment/80">
            Take the free lung test or order the Progress Pack — free delivery across India with COD
            available.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/lung-test"
              className="inline-flex items-center justify-center rounded-xl bg-ayurvedic-gold px-8 py-3.5 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Free Lung Test
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center justify-center rounded-xl border border-parchment/30 px-8 py-3.5 font-body text-sm font-semibold text-parchment transition-colors hover:bg-white/10"
            >
              Order Now — {S.price.now}
            </Link>
          </div>
        </Container>
      </Section>

      <MobileBottomNav />
    </div>
  );
}
