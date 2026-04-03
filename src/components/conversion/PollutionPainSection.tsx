"use client";

const CARDS = [
  {
    id: "1",
    text: "PM2.5 particles enter lungs and STAY there — permanently — without active detox",
  },
  {
    id: "2",
    text: "Delhi, Mumbai, Surat air quality = smoking 10–22 cigarettes daily (WHO data)",
  },
  {
    id: "3",
    text: "Lung damage from pollution is SILENT — no pain until 40% capacity is already lost",
  },
  {
    id: "4",
    text: "Most people only act after breathing problems. By then, recovery takes 3x longer.",
  },
] as const;

const BG = "#0D3B1F";

export default function PollutionPainSection() {
  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ backgroundColor: BG }}
      aria-labelledby="pollution-pain-heading"
    >
      <div className="container-rs max-w-4xl mx-auto">
        <h2
          id="pollution-pain-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4 leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          What Pollution Does To Your Lungs Every Single Day
        </h2>
        <p className="text-center text-sm text-white/60 mb-10 max-w-xl mx-auto">
          Stop the silent daily damage pollution causes — before you feel the worst of it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CARDS.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-red-900/40 bg-gradient-to-br from-[#3f0f17] to-[#2a0a12] px-5 py-5 text-left shadow-lg"
            >
              <p className="text-sm sm:text-base text-red-50/95 leading-relaxed font-medium">{c.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-base sm:text-lg font-semibold text-[#d4a574] max-w-2xl mx-auto leading-snug">
          The best time to detox your lungs was 5 years ago. The second best time is today.
        </p>
      </div>
    </section>
  );
}
