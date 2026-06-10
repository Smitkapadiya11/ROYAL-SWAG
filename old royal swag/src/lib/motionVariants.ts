import type { Transition, Variants } from "framer-motion";

/** Calm, organic easing — no bounce */
export const EASE_OUT_CALM = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT_CALM = [0.4, 0, 0.2, 1] as const;

export const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const sectionRevealLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

export const sectionRevealRightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

export const sectionRevealFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const sectionRevealTransition: Transition = {
  duration: 0.65,
  ease: EASE_OUT_CALM,
};

export const sectionRevealViewport = {
  once: true,
  margin: "-80px" as const,
};

export const heroContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
};

export const heroLabelVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_CALM, delay: 0 },
  },
};

export const heroTitleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_CALM, delay: 0.15 },
  },
};

export const heroSubtitleVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_CALM, delay: 0.3 },
  },
};

export const heroCtaContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.45 },
  },
};

export const heroCtaItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_CALM },
  },
};

export const heroImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT_CALM, delay: 0.2 },
  },
};

export const herbGridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export const herbCardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT_CALM },
  },
};

export const herbCardHoverTransition: Transition = {
  duration: 0.2,
  ease: EASE_OUT_CALM,
};

export const testimonialGridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export const testimonialCardVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_OUT_CALM },
  },
};

export const lungQuestionStepVariants: Variants = {
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

export const lungQuestionStepTransition: Transition = {
  duration: 0.35,
  ease: EASE_IN_OUT_CALM,
};

export const lungProgressSpring = {
  type: "spring" as const,
  stiffness: 80,
  damping: 20,
};

export const buyButtonHover = { scale: 1.04 };
export const buyButtonTap = { scale: 0.97 };
export const buyButtonHoverTransition: Transition = { duration: 0.18, ease: EASE_OUT_CALM };
export const buyButtonTapTransition: Transition = { duration: 0.1 };

export const buyButtonPulseKeyframes = {
  boxShadow: [
    "0 0 0 0 rgba(50, 64, 35, 0.2)",
    "0 0 0 12px rgba(50, 64, 35, 0)",
    "0 0 0 0 rgba(50, 64, 35, 0)",
  ],
};

export const buyButtonPulseTransition: Transition = {
  duration: 3,
  repeat: Infinity,
  ease: "easeInOut",
};

export const countdownDigitExit = { rotateX: -90, opacity: 0 };
export const countdownDigitEnter = { rotateX: 90, opacity: 0 };
export const countdownDigitAnimate = { rotateX: 0, opacity: 1 };
export const countdownFlipTransition: Transition = { duration: 0.25, ease: EASE_IN_OUT_CALM };

export const whatsappMountVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 25, delay: 2 },
  },
};

export const whatsappHover = { rotate: -8, scale: 1.1 };
export const whatsappHoverTransition: Transition = { duration: 0.2, ease: EASE_OUT_CALM };

export const stickyBarMountVariants: Variants = {
  hidden: { y: 64 },
  visible: {
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT_CALM, delay: 1 },
  },
};

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT_CALM },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: EASE_IN_OUT_CALM },
  },
};

/** Static state when user prefers reduced motion */
export const staticVisible = { opacity: 1, x: 0, y: 0, scale: 1 };
