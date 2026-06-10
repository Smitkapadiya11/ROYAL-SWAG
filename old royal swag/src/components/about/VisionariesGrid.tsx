"use client";

import type { ReactNode } from "react";
import { Grid } from "@/components/layout";
import { cn } from "@/lib/utils";

const FOUNDERS = [
  {
    name: "Hitesh Sabhadiya",
    role: "Co-Founder",
    focus: "Product & Ayurvedic Research",
    img: "/images/hitesh.jpeg",
    shape: "arch" as const,
    accent: "#495738",
    featured: false,
  },
  {
    name: "Manoj Koshiya",
    role: "Co-Founder",
    focus: "Operations & Growth",
    img: "/images/manoj.jpeg",
    shape: "circle" as const,
    accent: "#9A6F1A",
    featured: true,
  },
  {
    name: "Jaideep Singh",
    role: "Co-Founder",
    focus: "Brand & Marketing",
    img: "/images/jaideep singh.jpeg",
    shape: "hex" as const,
    accent: "#324023",
    featured: false,
  },
] as const;

function imageSrc(path: string) {
  if (!path.includes(" ")) return path;
  return path
    .split("/")
    .map((seg) => (seg.includes(" ") ? encodeURIComponent(seg) : seg))
    .join("/");
}

function FounderImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("h-full w-full object-cover object-top", className)}
      onError={(e) => {
        e.currentTarget.src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='240' viewBox='0 0 200 240'%3E%3Crect fill='%23324023' width='200' height='240'/%3E%3Ctext x='50%25' y='50%25' fill='rgba(255,255,255,0.35)' font-size='14' text-anchor='middle' dy='.3em'%3ERoyal Swag%3C/text%3E%3C/svg%3E";
      }}
    />
  );
}

function ShapeFrame({
  shape,
  featured,
  accent,
  children,
}: {
  shape: (typeof FOUNDERS)[number]["shape"];
  featured?: boolean;
  accent: string;
  children: ReactNode;
}) {
  if (shape === "circle") {
    return (
      <div
        className={cn(
          "relative mx-auto aspect-square w-full max-w-[220px] md:max-w-[260px]",
          featured && "md:max-w-[280px]"
        )}
      >
        <div
          className="absolute -inset-2 rounded-full opacity-40 blur-md"
          style={{ background: accent }}
          aria-hidden
        />
        <div
          className="relative h-full w-full overflow-hidden rounded-full border-4 border-white shadow-[0_12px_40px_rgba(50,64,35,0.18)]"
          style={{ boxShadow: `0 0 0 3px ${accent}33, 0 16px 40px rgba(50,64,35,0.15)` }}
        >
          {children}
        </div>
      </div>
    );
  }

  if (shape === "hex") {
    return (
      <div className="relative mx-auto w-full max-w-[240px] md:max-w-[260px]">
        <div
          className="relative aspect-[4/5] overflow-hidden shadow-[0_12px_36px_rgba(50,64,35,0.14)]"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 18%, 100% 82%, 50% 100%, 0% 82%, 0% 18%)",
          }}
        >
          {children}
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 18%, 100% 82%, 50% 100%, 0% 82%, 0% 18%)",
            boxShadow: `inset 0 0 0 3px ${accent}40`,
          }}
          aria-hidden
        />
      </div>
    );
  }

  // arch
  return (
    <div className="relative mx-auto w-full max-w-[240px] md:max-w-[250px]">
      <div
        className="relative aspect-[3/4] overflow-hidden shadow-[0_12px_36px_rgba(50,64,35,0.14)]"
        style={{
          borderRadius: "999px 999px 24px 24px",
        }}
      >
        {children}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#324023]/50 to-transparent"
          aria-hidden
        />
      </div>
    </div>
  );
}

function FounderCard({
  founder,
  index,
}: {
  founder: (typeof FOUNDERS)[number];
  index: number;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col items-center text-center transition-transform duration-500 hover:-translate-y-1",
        founder.featured && "md:-mt-6 md:scale-105",
        index === 0 && "md:translate-y-4",
        index === 2 && "md:translate-y-8"
      )}
    >
      <ShapeFrame
        shape={founder.shape}
        featured={founder.featured}
        accent={founder.accent}
      >
        <FounderImage src={founder.img} alt={founder.name} />
      </ShapeFrame>

      <div
        className={cn(
          "mt-5 w-full max-w-[260px] rounded-2xl border border-white/60 bg-white/55 px-5 py-4 backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-lg",
          founder.featured && "border-ayurvedic-gold/30 bg-white/70"
        )}
      >
        <h4 className="font-display text-xl font-bold text-primary md:text-[1.35rem]">
          {founder.name}
        </h4>
        <p className="mt-1 font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-ayurvedic-gold">
          {founder.role}
        </p>
        <div className="mx-auto mt-3 h-px w-10 bg-primary/15" />
        <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant">
          {founder.focus}
        </p>
      </div>
    </article>
  );
}

export function VisionariesGrid() {
  return (
    <div className="relative z-10">
      {/* Decorative shapes */}
      <div
        className="pointer-events-none absolute left-[8%] top-[12%] hidden h-16 w-16 rotate-12 rounded-2xl border border-ayurvedic-gold/20 md:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[18%] right-[6%] hidden h-20 w-20 rounded-full border-2 border-dashed border-primary/15 md:block"
        aria-hidden
      />

      <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} className="gap-10 lg:gap-6 xl:gap-10">
        {FOUNDERS.map((founder, i) => (
          <FounderCard key={founder.name} founder={founder} index={i} />
        ))}
      </Grid>
    </div>
  );
}
