"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import {
  captureUtmFromUrl,
  CUSTOMER_EVENTS,
  getSessionId,
  getVisitorId,
} from "@/lib/customer-analytics";

const SCROLL_MARKS = [25, 50, 75, 90, 100] as const;

/** Session-only tracking (scroll, button clicks) — does not fire Meta/GA4. */
export default function SiteTracker() {
  const pathname = usePathname() || "/";
  const scrollFired = useRef<Set<number>>(new Set());

  useEffect(() => {
    getVisitorId();
    getSessionId();
    captureUtmFromUrl();
  }, []);

  useEffect(() => {
    scrollFired.current = new Set();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);

      for (const mark of SCROLL_MARKS) {
        if (!scrollFired.current.has(mark) && pct >= mark) {
          scrollFired.current.add(mark);
          track(
            CUSTOMER_EVENTS.SCROLL_DEPTH,
            { depth: mark, page: pathname },
            { platforms: ["internal"] }
          );
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tracked = target.closest("[data-track-button]") as HTMLElement | null;
      if (!tracked) return;

      const buttonId =
        tracked.getAttribute("data-track-button") || tracked.id || "unknown";
      const buttonText =
        tracked.getAttribute("data-track-label") ||
        tracked.textContent?.trim().slice(0, 80) ||
        buttonId;

      track(
        CUSTOMER_EVENTS.BUTTON_CLICK,
        {
          button_id: buttonId,
          button_text: buttonText,
          page: pathname,
        },
        { platforms: ["internal"] }
      );
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}
