"use client";

import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";

const videos = [
  {
    id: "v1",
    name: "Dr. Sharma",
    city: "Mumbai",
    title: "Pulmonologist",
    quote: "The synergy of these specific herbs provides remarkable clearance.",
    youtubeId: "",
    localVideo: "",
    poster: "/images/product/product-1.jpg",
  },
  {
    id: "v2",
    name: "Priya M.",
    city: "Delhi",
    title: "Customer, 3 months",
    quote: "Morning congestion gone completely after 30 days.",
    youtubeId: "",
    localVideo: "",
    poster: "/images/product/product-2.jpg",
  },
  {
    id: "v3",
    name: "Ramesh K.",
    city: "Surat",
    title: "Ex-Smoker",
    quote: "Breathing is easier than it has been in years.",
    youtubeId: "",
    localVideo: "",
    poster: "/images/product/product-3.jpg",
  },
];

export function VideoTestimonialsSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const active = videos.find((v) => v.id === activeVideo);

  return (
    <section className="mb-12 flex flex-col gap-6 px-5 md:mx-auto md:max-w-6xl md:px-16">
      <h2 className="text-center font-display text-[32px] font-bold text-[#324023]">
        Real Results. Real People.
      </h2>
      <p className="mx-auto max-w-sm text-center font-sans text-base text-[#45483f]">
        Over 2,400 customers breathing easier with Royal Swag.
      </p>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-6">
        {videos.map((v) => (
          <button
            key={v.id}
            type="button"
            className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-3xl glass-card md:aspect-[3/4]"
            onClick={() => setActiveVideo(v.id)}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #324023, #9A6F1A)",
              }}
            >
              <SafeImage
                src={v.poster}
                alt={v.name}
                label={v.name}
                className="h-full w-full"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#2c3325]/95 via-transparent to-transparent" />

            <div
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.2)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[rgba(255,255,255,0.3)]"
              aria-hidden
            >
              <div className="ml-1 h-0 w-0 border-b-[8px] border-l-[14px] border-t-[8px] border-b-transparent border-l-white border-t-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
              <p className="font-display text-base font-semibold text-white">
                {v.name}
              </p>
              <p className="mt-0.5 font-sans text-xs text-white/70">
                {v.city} · {v.title}
              </p>
              <p className="mt-2 font-sans text-sm italic text-white/90">
                &ldquo;{v.quote}&rdquo;
              </p>
            </div>
          </button>
        ))}
      </div>

      {activeVideo && active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-5"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Video testimonial"
        >
          <div
            className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {active.localVideo ? (
              <video
                src={active.localVideo}
                poster={active.poster}
                className="h-full w-full object-cover"
                autoPlay
                controls
                playsInline
              />
            ) : active.youtubeId ? (
              <iframe
                title={active.name}
                src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#324023]">
                <p className="font-sans text-sm text-white/60">Video coming soon</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-lg text-white"
              aria-label="Close video"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
