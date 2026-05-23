"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";

type SafeImageProps = {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  imgClassName?: string;
};

export function SafeImage({
  src,
  alt,
  label,
  className,
  imgClassName,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <ImagePlaceholder
        label={label || alt}
        className={cn("h-full w-full", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("h-full w-full object-cover", imgClassName, className)}
      onError={() => setFailed(true)}
    />
  );
}
