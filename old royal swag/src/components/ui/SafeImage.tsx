"use client";

import { OptimizedImage, type OptimizedImageProps } from "@/components/ui/OptimizedImage";

export type SafeImageProps = Omit<OptimizedImageProps, "fill" | "width" | "height"> & {
  imgClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

/** Next.js Image wrapper with WebP, blur placeholder, and JPEG fallback. */
export function SafeImage({
  imgClassName,
  className,
  fill = true,
  width,
  height,
  ...props
}: SafeImageProps) {
  const mergedClass = [className, imgClassName].filter(Boolean).join(" ") || undefined;

  if (fill || (!width && !height)) {
    return <OptimizedImage {...props} fill className={mergedClass} />;
  }

  return (
    <OptimizedImage
      {...props}
      width={width!}
      height={height!}
      className={mergedClass}
    />
  );
}
