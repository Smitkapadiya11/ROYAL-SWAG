"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/**
 * Frosted glass panel — brand glass token with hover lift.
 */
export default function GlassCard({
  children,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/50 bg-glass p-6 shadow-glass",
        "backdrop-blur-glass transition-all duration-[400ms] ease-glass",
        "hover:scale-[1.02] hover:border-white/60 hover:backdrop-blur-[16px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
