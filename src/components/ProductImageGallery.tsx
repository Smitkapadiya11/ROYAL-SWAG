"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  images: readonly string[];
};

const arrowBtnClass =
  "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-lg font-bold text-white shadow-lg transition hover:bg-black/75 hover:scale-105 active:scale-95 md:h-12 md:w-12";

export default function ProductImageGallery({ images }: Props) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const n = images.length;
  const goPrev = useCallback(() => {
    setActive((i) => (i - 1 + n) % n);
  }, [n]);
  const goNext = useCallback(() => {
    setActive((i) => (i + 1) % n);
  }, [n]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen, goPrev, goNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - touchStartX.current;
    touchStartX.current = null;
    if (dx > 56) goPrev();
    else if (dx < -56) goNext();
  };

  return (
    <>
      <div className="gallery-item mx-auto max-w-4xl px-4">
        <div
          className="group relative select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            aria-label="Previous image"
            className={`${arrowBtnClass} left-2 md:left-3`}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next image"
            className={`${arrowBtnClass} right-2 md:right-3`}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            →
          </button>

          <button
            type="button"
            className="relative block w-full cursor-zoom-in overflow-hidden rounded-xl bg-[var(--brand-sage)]/30 text-left shadow-md ring-1 ring-[var(--brand-sage)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open product image fullscreen"
          >
            <div className="relative aspect-square w-full overflow-hidden md:aspect-[4/3]">
              <Image
                key={`main-${active}`}
                src={images[active]}
                alt={`Royal Swag Lung Detox Tea — product photo ${active + 1} of ${n}`}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.35] md:group-hover:duration-700"
                draggable={false}
                priority={active === 0}
                loading={active === 0 ? "eager" : "lazy"}
              />
            </div>
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white md:hidden">
              Tap to zoom
            </span>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2 md:gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show product image ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-[var(--brand-ivory)] transition sm:h-16 sm:w-16 ${
                i === active
                  ? "ring-[var(--brand-green)] opacity-100"
                  : "ring-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Product image fullscreen"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
            aria-label="Close fullscreen"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Previous image"
            className={`${arrowBtnClass} left-2 md:left-6`}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next image"
            className={`${arrowBtnClass} right-2 md:right-6`}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            →
          </button>
          <div
            className="relative h-[min(85vh,900px)] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              key={`lb-${active}`}
              src={images[active]}
              alt={`Royal Swag product ${active + 1} of ${n} — full size`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60">
            {active + 1} / {n} · Click outside or press Esc to close
          </p>
        </div>
      )}
    </>
  );
}
