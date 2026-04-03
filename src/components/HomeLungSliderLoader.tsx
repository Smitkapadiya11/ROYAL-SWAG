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
    >
      <p style={{ color: "#4ade80", fontSize: "14px" }}>Loading...</p>
    </div>
  ),
});

export default function HomeLungSliderLoader() {
  return <LungSlider />;
}
