"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedStarRating } from "@/components/ui/AnimatedStarRating";
import { Grid } from "@/components/layout";
import {
  sectionRevealViewport,
  testimonialCardVariants,
  testimonialGridVariants,
} from "@/lib/motionVariants";

type Review = {
  readonly name: string;
  readonly initials: string;
  readonly risk: string;
  readonly before: string;
  readonly after: string;
};

export function ReviewCardsGrid({ reviews }: { reviews: readonly Review[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={sectionRevealViewport}
      variants={testimonialGridVariants}
    >
      <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
        {reviews.map((r) => (
          <motion.article
            key={r.name}
            variants={reduceMotion ? undefined : testimonialCardVariants}
            className="glass-card min-w-0 rounded-layout-md p-7 transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(50,64,35,0.12)]"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container font-sans text-sm font-semibold text-parchment">
                {r.initials}
              </div>
              <span className="rounded border border-primary/20 bg-surface px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-wide text-primary">
                Was: {r.risk}
              </span>
            </div>

            <AnimatedStarRating className="mb-4" />

            <p className="mb-3 font-sans text-sm leading-relaxed text-on-surface-variant">
              <strong className="font-medium text-on-surface">Before: </strong>
              {r.before}
            </p>
            <p className="font-sans text-sm font-medium leading-relaxed text-primary">
              After: {r.after}
            </p>

            <p className="mt-5 border-t border-outline-variant/60 pt-4 font-sans text-xs font-semibold text-on-surface-variant">
              — {r.name}
            </p>
          </motion.article>
        ))}
      </Grid>
    </motion.div>
  );
}
