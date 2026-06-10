"use client";

import Image from "next/image";
import { useState } from "react";
import { blurDataFor } from "@/lib/image-blurs";
import { toWebp } from "@/lib/image-assets";
import { isComboImagePath, productImageSrc } from "@/lib/product-images";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";

type OptimizedImageBase = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  label?: string;
  onImageError?: () => void;
};

type OptimizedImageFill = OptimizedImageBase & {
  fill: true;
  width?: never;
  height?: never;
};

type OptimizedImageSized = OptimizedImageBase & {
  fill?: false;
  width: number;
  height: number;
};

export type OptimizedImageProps = OptimizedImageFill | OptimizedImageSized;

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "100vw",
  objectFit = "cover",
  objectPosition = "center",
  label,
  onImageError,
  fill,
  width,
  height,
}: OptimizedImageProps) {
  const normalized = productImageSrc(src);
  const webp = toWebp(normalized);
  const [currentSrc, setCurrentSrc] = useState(webp);
  const [failed, setFailed] = useState(false);
  const unoptimized = isComboImagePath(currentSrc);

  if (failed) {
    return (
      <ImagePlaceholder
        label={label || alt}
        className={cn("h-full w-full", className)}
      />
    );
  }

  const blur = blurDataFor(currentSrc) ?? blurDataFor(webp);
  const shared = {
    src: currentSrc,
    alt,
    className: cn("max-w-full", className),
    priority,
    sizes,
    placeholder: blur ? ("blur" as const) : undefined,
    blurDataURL: blur,
    style: { objectFit, objectPosition },
    onError: () => {
      if (currentSrc !== normalized) {
        setCurrentSrc(normalized);
        return;
      }
      if (currentSrc !== src) {
        setCurrentSrc(productImageSrc(src));
        return;
      }
      setFailed(true);
      onImageError?.();
    },
    unoptimized,
  };

  if (fill) {
    return <Image {...shared} fill />;
  }

  return (
    <Image
      {...shared}
      width={width!}
      height={height!}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
