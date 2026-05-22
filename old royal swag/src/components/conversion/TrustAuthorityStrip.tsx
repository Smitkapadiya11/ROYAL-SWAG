"use client";

const ROW1 = [
  { icon: "🌿", text: "100% Ayurvedic Herbs" },
  { icon: "🔬", text: "Formulated by Ayurvedic Practitioners" },
  { icon: "📦", text: "Sold to 5000+ Customers" },
  { icon: "↩️", text: "30-Day Money Back — No Questions" },
] as const;

export default function TrustAuthorityStrip({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const cardLight =
    "border-[var(--brand-sage)] bg-white/80 text-[var(--brand-dark)]";
  const cardDark = "border-white/25 bg-white/10 text-white";

  return (
    <div className={`py-8 md:py-10 px-4 ${className}`}>
      <div className="container-rs max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {ROW1.map((item) => (
            <div
              key={item.text}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs sm:text-sm font-semibold shadow-sm ${
                variant === "dark" ? cardDark : cardLight
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
        <p
          className={`mt-6 text-center text-xs sm:text-sm italic ${
            variant === "dark" ? "text-white/55" : "text-[var(--brand-dark)]/50"
          }`}
        >
          As featured in conversations about lung health across India
        </p>
      </div>
    </div>
  );
}
