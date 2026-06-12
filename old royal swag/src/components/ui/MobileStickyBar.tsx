"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCheckoutUi } from "@/contexts/CheckoutUiContext";
import {
  resolveBarCheckout,
  useConversionBar,
} from "@/contexts/ConversionBarContext";
import { EVENTS, trackEvent } from "@/lib/events";
import { stickyBarMountVariants } from "@/lib/motionVariants";

/** Homepage only — product page uses in-flow CTAs + desktop float bar. */
const ALLOWED_PATHS = new Set(["/"]);
const HERO_CTA_SELECTOR = "[data-hero-buy-cta]";

type MobileStickyBarProps = {
  onBuyNow: () => void;
};

export default function MobileStickyBar({ onBuyNow }: MobileStickyBarProps) {
  const pathname = usePathname() ?? "/";
  const { showCheckout } = useCheckoutUi();
  const { config, heroBuyDismissed } = useConversionBar();
  const reduceMotion = useReducedMotion();

  const [pastHero, setPastHero] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { price, productName } = resolveBarCheckout(config);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!ALLOWED_PATHS.has(pathname)) return;

    const heroEl = document.querySelector(HERO_CTA_SELECTOR);
    if (!heroEl) {
      setPastHero(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [pathname]);

  const onAllowedPath = ALLOWED_PATHS.has(pathname);
  const visible =
    mounted && onAllowedPath && pastHero && !heroBuyDismissed && !showCheckout;

  useEffect(() => {
    if (!visible) {
      document.body.classList.remove("has-sticky-bar-visible");
      return;
    }
    document.body.classList.add("has-sticky-bar-visible");
    return () => document.body.classList.remove("has-sticky-bar-visible");
  }, [visible]);

  if (!visible) {
    return null;
  }

  const handleBuy = () => {
    trackEvent(EVENTS.STICKY_BAR_BUY, { page: pathname, price });
    onBuyNow();
  };

  return (
    <motion.div
      className="mobile-sticky-bar"
      role="region"
      aria-label="Quick purchase"
      variants={reduceMotion ? undefined : stickyBarMountVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
    >
      <div className="mobile-sticky-bar__copy">
        <p className="mobile-sticky-bar__title">{productName}</p>
        <p className="mobile-sticky-bar__price">₹{price}</p>
      </div>
      <button
        type="button"
        onClick={handleBuy}
        data-track-button="sticky-buy-now"
        data-track-label="Buy Now"
        className="mobile-sticky-bar__btn"
      >
        Buy Now
      </button>
    </motion.div>
  );
}
