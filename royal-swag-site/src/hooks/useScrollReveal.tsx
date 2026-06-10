"use client";

import { motion, useInView, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useRef, type ReactNode } from "react";
import {
  sectionRevealFadeVariants,
  sectionRevealLeftVariants,
  sectionRevealRightVariants,
  sectionRevealTransition,
  sectionRevealVariants,
  sectionRevealViewport,
} from "@/lib/motionVariants";

type ScrollRevealDirection = "up" | "left" | "right" | "fade";

const directionVariants = {
  up: sectionRevealVariants,
  left: sectionRevealLeftVariants,
  right: sectionRevealRightVariants,
  fade: sectionRevealFadeVariants,
} as const;

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: ScrollRevealDirection;
} & Omit<HTMLMotionProps<"div">, "children">;

/**
 * Scroll-triggered section reveal (Framer Motion viewport).
 * Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  ...rest
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  const variants = directionVariants[direction];

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={sectionRevealViewport}
      variants={variants}
      transition={{ ...sectionRevealTransition, delay: delay / 1000 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export { useReducedMotion };

/** Intersection-based visibility for custom counters / effects */
export function useInViewReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, sectionRevealViewport);
  const reduceMotion = useReducedMotion();
  return { ref, visible: reduceMotion || inView, reduceMotion };
}
