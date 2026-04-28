"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DETOX_COUNTER_TARGET } from "@/lib/conversion-constants";

const SESSION_KEY = "rs_scroll_reminder_dismissed";

export default function ScrollDepthReminder() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname !== "/" && pathname !== "/product") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const onScroll = () => {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      const el = document.documentElement;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      if (pct >= 0.7) setVisible(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const close = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setDismissed(true);
    setVisible(false);
  };

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[10050] md:hidden border-t border-white/10 bg-[#0D3B1F] px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
      role="region"
      aria-label="Reminder"
    >
      <button
        type="button"
        onClick={close}
        className="absolute right-2 top-2 rounded p-1 text-white/50 hover:text-white"
        aria-label="Dismiss"
      >
        ✕
      </button>
      <p className="pr-8 text-xs text-white/90 leading-snug">
        Still reading? {DETOX_COUNTER_TARGET.toLocaleString("en-IN")} Indians have already started their detox. ₹349 ·
        Free delivery · 30-day guarantee
      </p>
      <Link
        href="/product"
        onClick={close}
        className="mt-2 inline-flex min-h-[40px] items-center rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-bold text-white"
      >
        Order Now →
      </Link>
    </div>
  );
}
