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

const ALLOWED_PATHS = new Set(["/", "/product"]);
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

  if (!mounted || !ALLOWED_PATHS.has(pathname)) {
    return null;
  }

  const visible = pastHero && !heroBuyDismissed && !showCheckout;

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
