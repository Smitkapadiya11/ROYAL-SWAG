"use client";

import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { PRODUCT_IMAGE_ALT } from "@/lib/product-images";

type ProductGalleryProps = {
  images: string[];
  activeIdx: number;
  activeImage: string;
  fallback: string;
  onSelect: (idx: number, src: string) => void;
  onMainError?: () => void;
  onThumbError?: (src: string) => void;
};

function ThumbButton({
  src,
  idx,
  active,
  onSelect,
  onError,
  className,
}: {
  src: string;
  idx: number;
  active: boolean;
  onSelect: (idx: number, src: string) => void;
  onError: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(idx, src)}
      className={`relative shrink-0 overflow-hidden rounded-lg transition-all ${className ?? ""} ${
        active
          ? "border-2 border-primary ring-2 ring-primary/20"
          : "border border-glass-border hover:border-primary/40"
      }`}
      aria-label={`View product image ${idx + 1}`}
      aria-current={active ? "true" : undefined}
    >
      <OptimizedImage
        src={src}
        alt=""
        fill
        sizes="72px"
        className="object-cover"
        onImageError={onError}
      />
    </button>
  );
}

export default function ProductGallery({
  images,
  activeIdx,
  activeImage,
  fallback,
  onSelect,
  onMainError,
  onThumbError,
}: ProductGalleryProps) {
  const mainSrc = activeImage || fallback;

  return (
    <section className="relative w-full min-w-0 overflow-hidden md:max-h-[calc(100vh-7rem)]">
      <div
        className="absolute left-1/2 top-1/4 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-container/10 blur-3xl md:left-1/3"
        aria-hidden
      />

      <div className="hidden min-w-0 md:block">
        <div className="glass-card group relative min-w-0 overflow-hidden rounded-xl p-4 shadow-sm">
          <div className="relative aspect-square w-full max-h-[min(480px,calc(100vh-12rem))]">
            <OptimizedImage
              src={mainSrc}
              alt={PRODUCT_IMAGE_ALT}
              fill
              priority
              sizes="(max-width: 1024px) 50vw, 480px"
              objectFit="contain"
              className="rounded-lg transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              onImageError={onMainError}
            />
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-glass-border bg-glass-surface px-3 py-1 shadow-sm backdrop-blur-md">
              <span className="text-sm text-ayurvedic-gold">★</span>
              <span className="font-number text-xs font-bold tabular-nums text-primary">
                4.9
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 lg:grid-cols-8 lg:gap-2">
          {images.map((img, i) => (
            <ThumbButton
              key={img}
              src={img}
              idx={i}
              active={activeIdx === i}
              onSelect={onSelect}
              onError={() => onThumbError?.(img)}
              className="aspect-square h-auto w-full"
            />
          ))}
        </div>
      </div>

      <div className="md:hidden">
        <div className="glass-card group relative aspect-square w-full overflow-hidden rounded-xl p-4 shadow-sm">
          <OptimizedImage
            src={mainSrc}
            alt={PRODUCT_IMAGE_ALT}
            fill
            priority
            sizes="100vw"
            objectFit="contain"
            className="rounded-lg transition-transform duration-700 ease-out group-hover:scale-105"
            onImageError={onMainError}
          />
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-glass-border bg-glass-surface px-3 py-1 shadow-sm backdrop-blur-md">
            <span className="text-sm text-ayurvedic-gold">★</span>
            <span className="font-number text-xs font-bold tabular-nums text-primary">
              4.9
            </span>
          </div>
        </div>

        <div
          className="mt-4 flex gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((img, i) => (
            <ThumbButton
              key={img}
              src={img}
              idx={i}
              active={activeIdx === i}
              onSelect={onSelect}
              onError={() => onThumbError?.(img)}
              className="h-16 w-16"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
