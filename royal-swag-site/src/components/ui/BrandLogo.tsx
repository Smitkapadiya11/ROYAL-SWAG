"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ROYAL_SWAG_LOGO_SRC } from "@/lib/brand-logo";

export default function BrandLogo({
  variant = "on-light",
  className = "",
}: {
  variant?: "on-light" | "on-dark";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const filter =
    variant === "on-light"
      ? "brightness(0) saturate(100%) invert(18%) sepia(25%) saturate(800%) hue-rotate(70deg) brightness(0.4)"
      : "none";

  if (failed) {
    return (
      <span
        className={cn(
          "font-display text-lg font-bold tracking-tight",
          variant === "on-dark" ? "text-parchment" : "text-primary",
          className
        )}
      >
        Royal Swag
      </span>
    );
  }

  return (
    <Image
      src={ROYAL_SWAG_LOGO_SRC}
      alt="Royal Swag"
      width={512}
      height={200}
      className={cn("h-10 w-auto object-contain", className)}
      style={{ filter }}
      priority
      onError={() => setFailed(true)}
    />
  );
}
