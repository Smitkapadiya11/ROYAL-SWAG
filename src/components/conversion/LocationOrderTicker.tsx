"use client";

const SEGMENTS = [
  "Priya from Mumbai just ordered",
  "Amit from Delhi just ordered",
  "Sunita from Surat just ordered",
  "Ravi from Bangalore just ordered",
  "Kavita from Hyderabad just ordered",
  "Arjun from Pune just ordered",
] as const;

const LINE = SEGMENTS.join(" · ") + " · ";

export default function LocationOrderTicker() {
  return (
    <div
      className="relative w-full overflow-hidden border-t border-[var(--brand-sage)]/40 bg-[#0D3B1F]/95 py-2.5"
      aria-hidden="true"
    >
      <div className="flex w-max animate-[rs-ticker_45s_linear_infinite]">
        <span className="shrink-0 px-4 text-[11px] sm:text-xs text-white/70 whitespace-nowrap">{LINE}</span>
        <span className="shrink-0 px-4 text-[11px] sm:text-xs text-white/70 whitespace-nowrap">{LINE}</span>
      </div>
      <style>{`
        @keyframes rs-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
