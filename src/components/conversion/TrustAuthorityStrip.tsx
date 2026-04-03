"use client";

import Link from "next/link";
import { FSSAI_VERIFY_URL } from "@/lib/conversion-constants";

type TrustItem =
  | { icon: string; text: string }
  | { icon: string; text: string; href: string };

const ROW1: TrustItem[] = [
  { icon: "🌿", text: "100% Ayurvedic Herbs" },
  { icon: "✅", text: "FSSAI Certified", href: FSSAI_VERIFY_URL },
  { icon: "🔬", text: "Formulated by Ayurvedic Practitioners" },
  { icon: "📦", text: "Sold to 5000+ Customers" },
  { icon: "↩️", text: "30-Day Money Back — No Questions" },
];

export default function TrustAuthorityStrip({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const cardLight =
    "border-[var(--brand-sage)] bg-white/80 text-[var(--brand-dark)] hover:border-[var(--brand-green)]";
  const cardDark =
    "border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15";

  return (
    <div className={`py-8 md:py-10 px-4 ${className}`}>
      <div className="container-rs max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {ROW1.map((item) =>
            "href" in item ? (
              <Link
                key={item.text}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs sm:text-sm font-semibold shadow-sm transition-colors ${
                  variant === "dark" ? cardDark : cardLight
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.text}
              </Link>
            ) : (
              <div
                key={item.text}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs sm:text-sm font-semibold shadow-sm ${
                  variant === "dark" ? cardDark : cardLight
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.text}
              </div>
            )
          )}
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
