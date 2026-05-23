"use client";

import { useState } from "react";

export function FounderPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#324023] to-[#495738]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
            fill="rgba(154,111,26,0.6)"
          />
        </svg>
        <p className="mt-2 font-sans text-xs text-white/40">Photo coming soon</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}
