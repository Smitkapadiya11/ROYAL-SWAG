"use client";

type ProductGalleryProps = {
  images: string[];
  activeIdx: number;
  activeImage: string;
  fallback: string;
  onSelect: (idx: number, src: string) => void;
  onMainError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onThumbError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
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
  onError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(idx, src)}
      className={`shrink-0 overflow-hidden rounded-lg transition-all ${className ?? ""} ${
        active
          ? "border-2 border-primary ring-2 ring-primary/20"
          : "border border-glass-border hover:border-primary/40"
      }`}
      aria-label={`View product image ${idx + 1}`}
      aria-current={active ? "true" : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
        onError={onError}
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
  return (
    <section className="relative w-full min-w-0 overflow-hidden md:max-h-[calc(100vh-7rem)]">
      <div
        className="absolute left-1/2 top-1/4 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-container/10 blur-3xl md:left-1/3"
        aria-hidden
      />

      {/* Desktop: vertical thumbs + main image */}
      <div className="hidden min-w-0 md:flex md:gap-4">
        <div
          className="flex max-h-[min(520px,calc(100vh-8rem))] w-[72px] shrink-0 flex-col gap-2 overflow-y-auto pr-1"
          style={{ scrollbarWidth: "thin" }}
        >
          {images.map((img, i) => (
            <ThumbButton
              key={img}
              src={img}
              idx={i}
              active={activeIdx === i}
              onSelect={onSelect}
              onError={onThumbError}
              className="h-16 w-16"
            />
          ))}
        </div>

        <div className="glass-card group relative min-w-0 flex-1 overflow-hidden rounded-xl p-4 shadow-sm">
          <div className="relative aspect-square max-h-[min(520px,calc(100vh-8rem))] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-full w-full rounded-lg object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              src={activeImage || fallback}
              alt="Lung Detox Tea"
              onError={onMainError}
            />
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-glass-border bg-glass-surface px-3 py-1 shadow-sm backdrop-blur-md">
              <span className="text-sm text-ayurvedic-gold">★</span>
              <span className="font-number text-xs font-bold tabular-nums text-primary">
                4.9
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: main image + horizontal thumbs */}
      <div className="md:hidden">
        <div className="glass-card group relative aspect-square w-full overflow-hidden rounded-xl p-4 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-full w-full rounded-lg object-contain transition-transform duration-700 ease-out group-hover:scale-105"
            src={activeImage || fallback}
            alt="Lung Detox Tea"
            onError={onMainError}
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
              onError={onThumbError}
              className="h-16 w-16"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
