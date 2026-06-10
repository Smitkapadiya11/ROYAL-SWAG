"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import {
  herbCardHoverTransition,
  herbCardVariants,
  herbGridVariants,
  sectionRevealViewport,
} from "@/lib/motionVariants";

const herbs = [
  {
    name: "Tulsi",
    hindi: "तुलसी",
    benefit: "Immunity & Anti-inflammatory",
    desc: "Sacred basil known for powerful immunomodulatory effects. Fights respiratory infections naturally.",
    img: "/images/herbs/tulsi.webp",
    color: "#2d5a27",
  },
  {
    name: "Vasaka",
    hindi: "वासका",
    benefit: "Chest Congestion Relief",
    desc: "Relieves chest congestion and persistent coughing. Natural bronchodilator.",
    img: "/images/herbs/vasaka.webp",
    color: "#3d6b35",
  },
  {
    name: "Mulethi",
    hindi: "मुलेठी",
    benefit: "Throat Soothing",
    desc: "Soothes the throat and acts as a natural expectorant. Reduces inflammation.",
    img: "/images/herbs/mulethi.webp",
    color: "#6b4e1a",
  },
  {
    name: "Pippali",
    hindi: "पिप्पली",
    benefit: "Lung Capacity",
    desc: "Clears respiratory pathways and boosts lung capacity significantly.",
    img: "/images/herbs/pippali.webp",
    color: "#4a3a1a",
  },
  {
    name: "Pushkarmool",
    hindi: "पुष्करमूल",
    benefit: "Bronchodilator",
    desc: "A potent bronchodilator supporting clear, open breathing all day.",
    img: "/images/herbs/pushkarmool.webp",
    color: "#2a4a2a",
  },
  {
    name: "Kantakari",
    hindi: "कटेरी",
    benefit: "Anti-Inflammation",
    desc: "Effectively manages respiratory ailments and reduces inflammation.",
    img: "/images/herbs/kantakari.webp",
    color: "#3a5a2a",
  },
];

type Herb = (typeof herbs)[number];

function HerbCard({
  herb,
  hovered,
  onHover,
  reduceMotion,
}: {
  herb: Herb;
  hovered: boolean;
  onHover: (name: string | null) => void;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      variants={reduceMotion ? undefined : herbCardVariants}
      whileHover={
        reduceMotion
          ? undefined
          : {
              scale: 1.02,
              boxShadow: "0 16px 48px rgba(50, 64, 35, 0.18)",
            }
      }
      transition={herbCardHoverTransition}
      className="herb-card min-w-0 cursor-pointer overflow-hidden rounded-layout-md"
      style={{ height: "320px" }}
      onMouseEnter={() => onHover(herb.name)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className="relative h-full w-full transition-all duration-500 ease-out"
        style={{ transform: hovered ? "scale(1.02)" : "scale(1)" }}
      >
        <div
          className="layout-media--fill relative h-full w-full"
          style={{
            background: `linear-gradient(135deg, ${herb.color}, #9A6F1A)`,
          }}
        >
          <div
            className="relative h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: hovered ? "scale(1.1)" : "scale(1)" }}
          >
            <OptimizedImage
              src={herb.img}
              alt={`Royal Swag ${herb.name} — ${herb.benefit}`}
              fill
              sizes="(max-width: 768px) 72vw, 280px"
              objectFit="cover"
            />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div
          className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-500"
          style={{
            transform: hovered ? "translateY(-60px)" : "translateY(0)",
          }}
        >
          <p className="mb-1 font-sans text-[10px] uppercase tracking-widest text-white/60">
            {herb.hindi}
          </p>
          <h3 className="font-display text-2xl font-bold text-white">
            {herb.name}
          </h3>
          <span className="mt-1 inline-block rounded-full bg-[#9A6F1A]/80 px-2 py-0.5 text-[10px] font-semibold text-white">
            {herb.benefit}
          </span>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-500"
          style={{
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            opacity: hovered ? 1 : 0,
          }}
        >
          <div className="rounded-xl bg-[rgba(20,30,15,0.85)] p-3 backdrop-blur-md">
            <h3 className="mb-1 font-display text-lg font-bold text-white">
              {herb.name}
            </h3>
            <p className="font-sans text-xs leading-5 text-white/80">
              {herb.desc}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HerbsSection() {
  const [hoveredHerb, setHoveredHerb] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-w-0 flex-col gap-6 overflow-hidden">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-[32px] font-bold text-primary md:text-4xl">
            The Sacred Seven
          </h2>
          <p className="mt-1 font-sans text-sm text-on-surface-variant md:text-base">
            Ancient herbs. Modern science.
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 font-sans text-xs text-ayurvedic-gold md:hidden">
          Swipe
          <span aria-hidden>→</span>
        </span>
      </div>

      <motion.div
        className="herbs-section-grid"
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={sectionRevealViewport}
        variants={herbGridVariants}
      >
        {herbs.map((herb) => (
          <HerbCard
            key={herb.name}
            herb={herb}
            hovered={hoveredHerb === herb.name}
            onHover={setHoveredHerb}
            reduceMotion={!!reduceMotion}
          />
        ))}
      </motion.div>
    </div>
  );
}
