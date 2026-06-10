"use client";

import type { ReactNode } from "react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
  className?: string;
};

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: RevealProps) {
  return (
    <ScrollReveal className={className} delay={delay} direction={direction}>
      {children}
    </ScrollReveal>
  );
}
