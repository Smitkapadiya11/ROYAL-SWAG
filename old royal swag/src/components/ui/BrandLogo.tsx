"use client";

import Image from "next/image";
import {
  LOGO_FILTER_ON_LIGHT,
  ROYAL_SWAG_LOGO_HEIGHT,
  ROYAL_SWAG_LOGO_HEADER_MIN_HEIGHT,
  ROYAL_SWAG_LOGO_SRC,
  ROYAL_SWAG_LOGO_WIDTH,
} from "@/lib/brand-logo";
import { cn } from "@/lib/utils";

export type BrandLogoVariant = "on-dark" | "on-light";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  width?: number;
  className?: string;
  priority?: boolean;
  /** Enforce header min height (40px) while preserving aspect ratio */
  header?: boolean;
};

/**
 * Cream-on-black logo: use as-is on dark backgrounds.
 * On parchment/light surfaces, invert for a dark mark.
 */
export default function BrandLogo({
  variant = "on-dark",
  width = 120,
  className,
  priority = false,
  header = false,
}: BrandLogoProps) {
  const aspect = ROYAL_SWAG_LOGO_WIDTH / ROYAL_SWAG_LOGO_HEIGHT;
  const heightFromWidth = Math.round(width / aspect);
  const minH = header ? ROYAL_SWAG_LOGO_HEADER_MIN_HEIGHT : 0;
  const height = Math.max(heightFromWidth, minH);
  const displayWidth = Math.round(height * aspect);

  return (
    <Image
      src={ROYAL_SWAG_LOGO_SRC}
      alt="Royal Swag"
      width={displayWidth}
      height={height}
      priority={priority}
      className={cn(
        "w-auto object-contain",
        header && "min-h-[40px]",
        className
      )}
      style={{
        width: displayWidth,
        height: "auto",
        maxWidth: "100%",
        ...(variant === "on-light" ? { filter: LOGO_FILTER_ON_LIGHT } : {}),
      }}
    />
  );
}
