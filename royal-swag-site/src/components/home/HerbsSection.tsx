"use client";

import { useState } from "react";

const herbs = [
  {
    name: "Tulsi",
    hindi: "तुलसी",
    benefit: "Immunity & Anti-inflammatory",
    desc: "Sacred basil known for powerful immunomodulatory effects. Fights respiratory infections naturally.",
    img: "/images/herbs/tulsi.jpg",
    color: "#2d5a27",
  },
  {
    name: "Vasaka",
    hindi: "वासका",
    benefit: "Chest Congestion Relief",
    desc: "Relieves chest congestion and persistent coughing. Natural bronchodilator.",
    img: "/images/herbs/vasaka.jpeg",
    color: "#3d6b35",
  },
  {
    name: "Mulethi",
    hindi: "मुलेठी",
    benefit: "Throat Soothing",
    desc: "Soothes the throat and acts as a natural expectorant. Reduces inflammation.",
    img: "/images/herbs/mulethi.jpeg",
    color: "#6b4e1a",
  },
  {
    name: "Pippali",
    hindi: "पिप्पली",
    benefit: "Lung Capacity",
    desc: "Clears respiratory pathways and boosts lung capacity significantly.",
    img: "/images/herbs/pippali.jpeg",
    color: "#4a3a1a",
  },
  {
    name: "Pushkarmool",
    hindi: "पुष्करमूल",
    benefit: "Bronchodilator",
    desc: "A potent bronchodilator supporting clear, open breathing all day.",
    img: "/images/herbs/pushkarmool.jpg",
    color: "#2a4a2a",
  },
  {
    name: "Kantakari",
    hindi: "कटेरी",
    benefit: "Anti-Inflammation",
    desc: "Effectively manages respiratory ailments and reduces inflammation.",
    img: "/images/herbs/kantakari.jpg",
    color: "#3a5a2a",
  },
];

type Herb = (typeof herbs)[number];

function HerbCard({
  herb,
  hovered,
  onHover,
  className = "",
}: {
  herb: Herb;
  hovered: boolean;
  onHover: (name: string | null) => void;
  className?: string;
}) {
  return (
    <div
      className={`cursor-pointer overflow-hidden rounded-2xl ${className}`}
      style={{ height: "320px" }}
      onMouseEnter={() => onHover(herb.name)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className="relative h-full w-full transition-all duration-500 ease-out"
        style={{ transform: hovered ? "scale(1.02)" : "scale(1)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${herb.color}, #9A6F1A)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={herb.img}
            alt={herb.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out"
            style={{ transform: hovered ? "scale(1.1)" : "scale(1)" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
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
    </div>
  );
}

export function HerbsSection() {
  const [hoveredHerb, setHoveredHerb] = useState<string | null>(null);

  return (
    <section id="herbs" className="flex flex-col gap-6 overflow-hidden py-10">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-[32px] font-bold text-[#324023] md:text-4xl">
            The Sacred Seven
          </h2>
          <p className="mt-1 font-sans text-sm text-[#45483f] md:text-base">
            Ancient herbs. Modern science.
          </p>
        </div>
        <span className="flex items-center gap-1 font-sans text-xs text-[#9A6F1A] md:hidden">
          Swipe
          <span style={{ display: "inline-block", marginLeft: "2px" }}>→</span>
        </span>
      </div>

      <div
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {herbs.map((herb) => (
          <HerbCard
            key={herb.name}
            herb={herb}
            hovered={hoveredHerb === herb.name}
            onHover={setHoveredHerb}
            className="w-56 shrink-0 snap-center"
          />
        ))}
      </div>

      <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
        {herbs.map((herb) => (
          <HerbCard
            key={herb.name}
            herb={herb}
            hovered={hoveredHerb === herb.name}
            onHover={setHoveredHerb}
          />
        ))}
      </div>
    </section>
  );
}
