"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { trackUnified } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { VideoTestimonialDto } from "@/app/api/media/testimonials/route";

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function VideoCard({
  item,
  onPlay,
}: {
  item: VideoTestimonialDto;
  onPlay: (item: VideoTestimonialDto) => void;
}) {
  return (
    <article className="flex flex-col">
      <button
        type="button"
        onClick={() => onPlay(item)}
        className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Play video testimonial from ${item.customerName}`}
      >
        <Image
          src={item.thumbnailUrl}
          alt=""
          fill
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg">
            <PlayIcon />
          </span>
        </span>
      </button>
      <h3 className="mt-3 font-body text-base font-bold text-primary">
        {item.customerName}
      </h3>
      {item.city ? (
        <p className="font-body text-sm text-on-surface-variant">{item.city}</p>
      ) : null}
      <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">
        &ldquo;{item.quote}&rdquo;
      </p>
    </article>
  );
}

function VideoModal({
  item,
  onClose,
}: {
  item: VideoTestimonialDto;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    void v.play().catch(() => {
      /* autoplay blocked */
    });
    return () => {
      v.pause();
    };
  }, [item.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Video from ${item.customerName}`}
    >
      <motion.div
        className="relative w-full max-w-sm"
        initial={reduceMotion ? false : { scale: 0.92 }}
        animate={{ scale: 1 }}
        exit={reduceMotion ? undefined : { scale: 0.92 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-10 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl text-primary"
          aria-label="Close video"
        >
          ×
        </button>
        <video
          ref={videoRef}
          className="aspect-[9/16] w-full rounded-2xl bg-black object-contain"
          controls
          preload="none"
          poster={item.thumbnailUrl}
          playsInline
          src={item.videoUrl}
        />
      </motion.div>
    </motion.div>
  );
}

export function VideoTestimonials() {
  const [items, setItems] = useState<VideoTestimonialDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<VideoTestimonialDto | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/media/testimonials");
        const data = (await res.json()) as { testimonials?: VideoTestimonialDto[] };
        if (!cancelled) setItems(data.testimonials ?? []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePlay = useCallback((item: VideoTestimonialDto) => {
    setActive(item);
    trackUnified.videoPlay(item.id);
  }, []);

  if (loading) {
    return (
      <p className="text-center font-body text-sm text-on-surface-variant">
        Loading video stories…
      </p>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-8 text-center">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Video Stories
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold text-primary md:text-3xl">
          Hear It From Our Customers
        </h2>
      </div>

      <div
        className={cn(
          "grid gap-6",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {items.map((item) => (
          <VideoCard key={item.id} item={item} onPlay={handlePlay} />
        ))}
      </div>

      <AnimatePresence>
        {active ? (
          <VideoModal item={active} onClose={() => setActive(null)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
