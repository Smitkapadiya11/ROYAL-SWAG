"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
  const { ref, visible } = useScrollReveal();

  const initial = {
    up: "translateY(40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    fade: "translateY(0)",
  }[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0)" : initial,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.25,0.8,0.25,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
