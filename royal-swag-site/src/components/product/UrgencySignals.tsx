"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { URGENCY_CONFIG } from "@/lib/urgency-config";
import { cn } from "@/lib/utils";

const SOCIAL_PROOF_MESSAGES = [
  "🛒 12 people ordered in the last 24 hours",
  "⭐ Rated 4.8/5 by 2,400+ customers",
  "🚀 Fast delivery to Delhi, Mumbai, Surat & more",
  "🌿 100% Ayurvedic — No Side Effects",
] as const;

function getDeliveryUrgencyLine(): string {
  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const hour = ist.getHours();
  return hour < 14
    ? "Order now — ships TODAY"
    : "Order now — ships tomorrow morning";
}

type UrgencySignalsProps = {
  className?: string;
  showTrustStrip?: boolean;
};

export function TrustStrip({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-center font-sans text-[11px] leading-relaxed text-on-surface-variant md:text-xs",
        className
      )}
    >
      🔒 Secure Payment · 🚚 Free Delivery · ↩️ 30-Day Returns · ✅ FSSAI Approved
    </p>
  );
}

export default function UrgencySignals({
  className,
  showTrustStrip = false,
}: UrgencySignalsProps) {
  const reduceMotion = useReducedMotion();
  const [msgIndex, setMsgIndex] = useState(0);
  const deliveryLine = useMemo(() => getDeliveryUrgencyLine(), []);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % SOCIAL_PROOF_MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const orderCount = URGENCY_CONFIG.orderCount;
  const messages = SOCIAL_PROOF_MESSAGES.map((m, i) =>
    i === 0 ? m.replace("12", String(orderCount)) : m
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-[#FF9800]">
        <span aria-hidden>📦</span>
        Only{" "}
        <span className="font-number tabular-nums">{URGENCY_CONFIG.stockCount}</span>{" "}
        packs left at this price
      </p>

      <div
        className="relative min-h-[1.25rem] overflow-hidden"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="font-sans text-xs text-on-surface-variant"
          >
            {messages[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="font-sans text-xs font-semibold text-primary">
        🚚 {deliveryLine}
      </p>

      {showTrustStrip ? <TrustStrip className="mt-1" /> : null}
    </div>
  );
}
