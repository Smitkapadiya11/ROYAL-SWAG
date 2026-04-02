"use client";

import Link from "next/link";
import { ReactCompareSlider } from "react-compare-slider";

/** Tree-like lung silhouette (paired lobes + trachea) — same asset on both sides */
function LungSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="52" y="4" width="16" height="40" rx="4" fill="currentColor" />
      <ellipse cx="42" cy="108" rx="34" ry="52" fill="currentColor" />
      <ellipse cx="78" cy="108" rx="34" ry="52" fill="currentColor" />
    </svg>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`absolute rounded-full bg-black/35 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm sm:text-xs ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

const sliderBox =
  "relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden";

function BeforeSlide() {
  return (
    <div
      className={sliderBox}
      style={{
        background: "linear-gradient(160deg, #1a0a0a 0%, #2d1010 55%, #1f0c0c 100%)",
      }}
    >
      <p className="absolute top-3 left-1/2 z-10 -translate-x-1/2 text-center text-lg font-bold text-red-500 sm:text-xl">
        BEFORE
      </p>
      <Badge className="left-2 top-12 sm:left-3 sm:top-14">🚬 Smoking</Badge>
      <Badge className="right-2 top-12 sm:right-3 sm:top-14">🏭 Pollution</Badge>
      <Badge className="bottom-14 left-2 sm:bottom-16 sm:left-3">😮‍💨 Poor Breathing</Badge>
      <Badge className="bottom-14 right-2 sm:bottom-16 sm:right-3">😴 Low Energy</Badge>
      <div className="mt-8 flex w-[55%] max-w-[220px] text-zinc-400">
        <LungSilhouette className="h-auto w-full drop-shadow-lg" />
      </div>
    </div>
  );
}

function AfterSlide() {
  return (
    <div
      className={sliderBox}
      style={{
        background: "linear-gradient(160deg, #0a2a0a 0%, #1a4a1a 55%, #0d3010 100%)",
      }}
    >
      <p className="absolute top-3 left-1/2 z-10 -translate-x-1/2 text-center text-lg font-bold text-green-400 sm:text-xl">
        AFTER 30 DAYS
      </p>
      <Badge className="left-2 top-12 sm:left-3 sm:top-14">🌿 Clean Airways</Badge>
      <Badge className="right-2 top-12 sm:right-3 sm:top-14">💚 Detoxified</Badge>
      <Badge className="bottom-14 left-2 sm:bottom-16 sm:left-3">🫁 Full Breathing</Badge>
      <Badge className="bottom-14 right-2 sm:bottom-16 sm:right-3">⚡ More Energy</Badge>
      <div
        className="mt-8 flex w-[55%] max-w-[220px] text-emerald-300"
        style={{
          filter:
            "brightness(1.2) sepia(0.5) hue-rotate(80deg) saturate(2) drop-shadow(0 0 12px rgba(34,197,94,0.45))",
        }}
      >
        <LungSilhouette className="h-auto w-full" />
      </div>
    </div>
  );
}

function CompareHandle() {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-green-600 text-lg font-bold text-white shadow-lg ring-2 ring-green-400/50"
      aria-hidden="true"
    >
      ↔
    </div>
  );
}

export default function LungSlider() {
  return (
    <section className="bg-[#0a1a0a] py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <h2
          className="mb-2 text-center text-2xl font-bold text-white sm:text-3xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          See The Difference
        </h2>
        <p className="mb-6 text-center text-sm text-gray-400">
          Drag the slider ← → to see your lung transformation
        </p>

        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-green-900/40 shadow-xl">
          <ReactCompareSlider
            className="w-full"
            style={{
              width: "100%",
              height: "clamp(280px, 52vw, 420px)",
            }}
            defaultPosition={50}
            itemOne={<BeforeSlide />}
            itemTwo={<AfterSlide />}
            handle={<CompareHandle />}
          />
        </div>

        <div className="mt-10 text-center">
          <h3
            className="text-xl font-bold text-white sm:text-2xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What Royal Swag Lung Detox Tea Does To Your Lungs
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
            4 powerful Ayurvedic herbs working together to clear, heal, and strengthen your lungs from within.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { emoji: "🌿", name: "Tulsi" },
              { emoji: "🍃", name: "Vasaka" },
              { emoji: "🌱", name: "Mulethi" },
              { emoji: "🫚", name: "Pippali" },
            ].map(({ emoji, name }) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-green-800/60 bg-green-950/50 px-3 py-2 text-sm font-semibold text-green-100"
              >
                <span aria-hidden="true">{emoji}</span>
                {name}
              </span>
            ))}
          </div>

          <Link
            href="/product"
            className="mt-8 inline-flex w-full max-w-md items-center justify-center rounded-lg bg-green-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-green-800 sm:w-auto"
          >
            Start Your Lung Detox — Rs 699
          </Link>
        </div>
      </div>
    </section>
  );
}
