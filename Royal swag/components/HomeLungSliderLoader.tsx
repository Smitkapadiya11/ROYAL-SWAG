"use client";

import dynamic from "next/dynamic";

const LungSlider = dynamic(() => import("@/components/LungSlider"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        background: "linear-gradient(180deg, #020b05 0%, #061508 100%)",
        minHeight: "580px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-busy="true"
      aria-label="Preparing lung comparison"
    >
      <div className="h-96 w-full max-w-3xl animate-pulse rounded-2xl bg-[#0a2010]" />
    </div>
  ),
});

export default function HomeLungSliderLoader() {
  return <LungSlider />;
}
