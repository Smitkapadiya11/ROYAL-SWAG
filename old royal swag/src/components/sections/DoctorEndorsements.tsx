"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Grid, Section } from "@/components/layout";

const DOCTORS = [
  {
    id: "doc1",
    videoSrc: "/videos/doctor1.mp4",
    name: "Dr. Rajesh Sharma",
    title: "MBBS, MD — Pulmonologist",
    hospital: "Apollo Hospitals, Ahmedabad",
    quote:
      "I recommend Royal Swag to all my patients with chronic respiratory issues.",
    years: "18 years experience",
  },
  {
    id: "doc2",
    videoSrc: "/videos/doctor2.mp4",
    name: "Dr. Priya Mehta",
    title: "BAMS — Ayurvedic Specialist",
    hospital: "Surat Ayurved Centre",
    quote:
      "The herb combination in this tea is clinically validated and highly effective.",
    years: "12 years experience",
  },
  {
    id: "doc3",
    videoSrc: "/videos/doctor3.mp4",
    name: "Dr. Vikram Patel",
    title: "MD — Internal Medicine",
    hospital: "Gujarat Medical Institute",
    quote: "Natural, safe, and measurably effective for lung detoxification.",
    years: "22 years experience",
  },
] as const;

function DoctorVideoFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-container">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M8 5v14l11-7L8 5z" fill="rgba(154,111,26,0.6)" />
      </svg>
      <p className="mt-2 font-sans text-xs text-white/40">Video loading…</p>
    </div>
  );
}

function DoctorCard({
  doc,
  index,
  activeVideo,
  failedVideos,
  onToggle,
  onVideoError,
  cardRef,
  videoRef,
}: {
  doc: (typeof DOCTORS)[number];
  index: number;
  activeVideo: number | null;
  failedVideos: Record<string, boolean>;
  onToggle: (i: number) => void;
  onVideoError: (id: string) => void;
  cardRef: (el: HTMLDivElement | null) => void;
  videoRef: (el: HTMLVideoElement | null) => void;
}) {
  return (
    <div
      ref={cardRef}
      className="group relative min-w-0 w-[min(17.5rem,72vw)] shrink-0 cursor-pointer overflow-hidden rounded-layout-md transition-all duration-500 md:w-auto"
      style={{
        boxShadow:
          activeVideo === index
            ? "var(--shadow-hover), 0 0 0 2px rgba(154,111,26,0.4)"
            : "var(--shadow-card)",
        transform: activeVideo === index ? "scale(1.02)" : "scale(1)",
      }}
      onClick={() => onToggle(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(index);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Play ${doc.name} endorsement video`}
    >
      <div className="layout-media--fill relative" style={{ aspectRatio: "3/4" }}>
        {failedVideos[doc.id] ? (
          <DoctorVideoFallback />
        ) : (
          <video
            ref={videoRef}
            src={doc.videoSrc}
            className="h-full w-full max-w-full object-cover"
            playsInline
            preload="metadata"
            loop
            muted
            onError={() => onVideoError(doc.id)}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <div
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
            activeVideo === index
              ? "bg-ayurvedic-gold"
              : "bg-black/40 backdrop-blur-sm"
          }`}
        >
          {activeVideo === index ? (
            <div className="flex gap-0.5">
              <div className="h-3 w-1 rounded-sm bg-white" />
              <div className="h-3 w-1 rounded-sm bg-white" />
            </div>
          ) : (
            <div className="ml-0.5 h-0 w-0 border-b-[5px] border-l-[8px] border-t-[5px] border-b-transparent border-l-white border-t-transparent" />
          )}
        </div>

        {activeVideo === index && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-red-500 px-2 py-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            <span className="font-sans text-[10px] font-bold text-white">
              PLAYING
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-display text-lg font-bold leading-tight text-white">
            {doc.name}
          </p>
          <p className="mt-0.5 font-sans text-[11px] text-white/80">
            {doc.title}
          </p>
        </div>
      </div>

      <div className="bg-primary px-4 py-3">
        <div className="mb-1 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-ayurvedic-gold" />
          <p className="font-sans text-[11px] text-white/70">{doc.hospital}</p>
        </div>
        <p className="font-sans text-xs italic leading-4 text-white/90">
          &ldquo;{doc.quote}&rdquo;
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-sans text-[10px] font-semibold text-ayurvedic-gold">
            {doc.years}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="text-[10px] text-ayurvedic-gold">
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DoctorEndorsements() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeVideoRef = useRef<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>({});

  const setActive = useCallback((index: number | null) => {
    activeVideoRef.current = index;
    setActiveVideo(index);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          const video = videoRefs.current[i];
          if (!video) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            videoRefs.current.forEach((v, idx) => {
              if (v && idx !== i) {
                v.pause();
                v.currentTime = 0;
              }
            });
            video.muted = false;
            video.play().catch(() => {
              video.muted = true;
              void video.play();
            });
            setActive(i);
          } else {
            video.pause();
            if (activeVideoRef.current === i) setActive(null);
          }
        },
        { threshold: 0.7 }
      );

      obs.observe(card);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [setActive]);

  const toggleVideo = (i: number) => {
    const video = videoRefs.current[i];
    if (!video) return;

    if (video.paused) {
      videoRefs.current.forEach((v, idx) => {
        if (v && idx !== i) v.pause();
      });
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        void video.play();
      });
      setActive(i);
    } else {
      video.pause();
      setActive(null);
    }
  };

  return (
    <Section bg="transparent">
      <Container>
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-ayurvedic-gold/10 px-4 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-ayurvedic-gold">
            Medical Endorsements
          </span>
          <h2 className="mt-2 font-display text-[36px] font-bold leading-tight text-primary">
            Trusted by Doctors.
            <br />
            Proven by Science.
          </h2>
          <p className="mx-auto mt-3 max-w-sm font-sans text-base text-on-surface-variant">
            Leading physicians across India recommend Royal Swag for respiratory
            health.
          </p>
        </div>

        {/* Mobile: horizontal scroll snap */}
        <div className="layout-scroll-snap hide-scrollbar md:hidden">
          {DOCTORS.map((doc, i) => (
            <DoctorCard
              key={doc.id}
              doc={doc}
              index={i}
              activeVideo={activeVideo}
              failedVideos={failedVideos}
              onToggle={toggleVideo}
              onVideoError={(id) =>
                setFailedVideos((prev) => ({ ...prev, [id]: true }))
              }
              cardRef={(el) => {
                cardRefs.current[i] = el;
              }}
              videoRef={(el) => {
                videoRefs.current[i] = el;
              }}
            />
          ))}
        </div>

        {/* Desktop: 3-column grid */}
        <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} className="hidden md:grid">
          {DOCTORS.map((doc, i) => (
            <DoctorCard
              key={doc.id}
              doc={doc}
              index={i}
              activeVideo={activeVideo}
              failedVideos={failedVideos}
              onToggle={toggleVideo}
              onVideoError={(id) =>
                setFailedVideos((prev) => ({ ...prev, [id]: true }))
              }
              cardRef={(el) => {
                cardRefs.current[i] = el;
              }}
              videoRef={(el) => {
                videoRefs.current[i] = el;
              }}
            />
          ))}
        </Grid>

        <p className="mt-4 text-center font-sans text-[11px] text-outline md:hidden">
          ← Scroll to see all doctors · Videos auto-play with sound →
        </p>
      </Container>
    </Section>
  );
}
