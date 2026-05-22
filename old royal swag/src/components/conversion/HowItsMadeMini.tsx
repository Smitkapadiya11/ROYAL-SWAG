"use client";

const STEPS = [
  {
    icon: "🌱",
    title: "Herbs sourced from certified Ayurvedic farms in India",
  },
  {
    icon: "❄️",
    title: "Cold-blended to preserve active compounds",
  },
  {
    icon: "📦",
    title: "Packed in moisture-proof sachets — stays fresh for 18 months",
  },
] as const;

export default function HowItsMadeMini({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-6 sm:px-6 ${
        dark
          ? "border-white/15 bg-black/20 text-white"
          : "border-[var(--brand-sage)] bg-[var(--brand-ivory)] text-[var(--brand-dark)]"
      }`}
    >
      <h3
        className={`text-center text-lg font-bold mb-5 ${dark ? "text-white" : ""}`}
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        How It&apos;s Made
      </h3>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={`flex gap-3 rounded-xl p-3 ${dark ? "bg-white/5" : "bg-white/60"}`}
          >
            <span className="text-2xl shrink-0" aria-hidden="true">
              {s.icon}
            </span>
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-[#4ade80]" : "text-[var(--brand-green)]"}`}>
                Step {i + 1}
              </span>
              <p className={`mt-1 text-sm leading-snug ${dark ? "text-white/85" : "text-[var(--brand-dark)]/80"}`}>
                {s.title}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
