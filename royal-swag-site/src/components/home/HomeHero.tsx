"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useConversionBar } from "@/contexts/ConversionBarContext";
import { useTranslations } from "@/contexts/LocaleContext";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useCms } from "@/contexts/CmsContext";
import { HERO_PRODUCT_ALT } from "@/lib/image-assets";
import {
  heroContainerVariants,
  heroCtaContainerVariants,
  heroCtaItemVariants,
  heroImageVariants,
  heroLabelVariants,
  heroSubtitleVariants,
  heroTitleVariants,
} from "@/lib/motionVariants";

export function HomeHero() {
  const reduceMotion = useReducedMotion();
  const { dismissHeroBuy } = useConversionBar();
  const { t } = useTranslations();
  const { sections } = useCms();
  const hero = sections.hero as {
    image?: string;
    subtitle?: string;
    cta_text?: string;
  };
  const heroImage = hero.image || "/images/hero/asset1-hero-product.webp";
  const heroSubtitle = hero.subtitle || t("hero.subtitle");
  const lungTestCta = hero.cta_text || t("hero.cta.lungTest");

  return (
    <div className="home-hero-grid">
      <motion.div
        className="home-hero-copy flex flex-col justify-center py-4 md:py-8"
        variants={reduceMotion ? undefined : heroContainerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        <motion.p
          className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ayurvedic-gold"
          variants={reduceMotion ? undefined : heroLabelVariants}
        >
          {t("hero.label")}
        </motion.p>
        <motion.h1
          className="mt-2 break-words font-display text-4xl font-bold leading-[1.05] text-primary sm:text-5xl lg:text-6xl"
          variants={reduceMotion ? undefined : heroTitleVariants}
        >
          {t("hero.tagline").split(". ").map((line, i, arr) => (
            <span key={line}>
              {line}
              {i < arr.length - 1 ? "." : ""}
              {i < arr.length - 1 ? <br /> : null}
            </span>
          ))}
        </motion.h1>
        <motion.p
          className="mt-4 max-w-md font-body text-base leading-relaxed text-on-surface-variant md:text-lg"
          variants={reduceMotion ? undefined : heroSubtitleVariants}
        >
          {heroSubtitle}
        </motion.p>
        <motion.div
          className="mt-8 flex w-full max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap"
          variants={reduceMotion ? undefined : heroCtaContainerVariants}
        >
          <motion.div variants={reduceMotion ? undefined : heroCtaItemVariants}>
            <Link
              href="/lung-test"
              className="btn-primary inline-flex w-full items-center justify-center px-6 py-3.5 sm:w-fit sm:px-8"
            >
              {lungTestCta}
            </Link>
          </motion.div>
          <motion.div variants={reduceMotion ? undefined : heroCtaItemVariants}>
            <Link
              href="/product"
              data-hero-buy-cta
              onClick={() => dismissHeroBuy()}
              className="inline-flex w-full items-center justify-center rounded-xl border border-primary/20 bg-white/50 px-6 py-3.5 font-body text-sm font-semibold text-primary transition-colors hover:bg-white/80 sm:w-fit sm:px-8"
            >
              {t("hero.cta.shop")}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="home-hero-media">
        <motion.div
          className="hero-image-wrapper"
          variants={reduceMotion ? undefined : heroImageVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <OptimizedImage
            src={heroImage}
            alt={HERO_PRODUCT_ALT}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            objectFit="cover"
            objectPosition="center"
          />
          <div
            className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-parchment/25 via-transparent to-transparent lg:block"
            aria-hidden
          />
        </motion.div>
      </div>
    </div>
  );
}
