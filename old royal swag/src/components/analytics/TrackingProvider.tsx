"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackUnified } from "@/lib/analytics";
import {
  captureUtmFromUrl,
  getSessionId,
  getVisitorId,
} from "@/lib/customer-analytics";
import {
  flushReplay,
  recordReplayClick,
  recordReplayField,
  recordReplayMove,
  recordReplayPage,
  recordReplayScroll,
} from "@/lib/sessionReplay";

const SCROLL_MARKS = [25, 50, 75, 90, 100] as const;

/** App-wide behavioral tracking — page views, scroll, clicks, replay, exit intent */
export default function TrackingProvider() {
  const pathname = usePathname() || "/";
  const scrollFired = useRef<Set<number>>(new Set());
  const pageEnteredAt = useRef<number>(Date.now());
  const exitFired = useRef(false);
  const lastScrollPct = useRef(0);

  useEffect(() => {
    getVisitorId();
    const sessionId = getSessionId();
    captureUtmFromUrl();
    recordReplayPage(sessionId, pathname);
    pageEnteredAt.current = Date.now();
    scrollFired.current = new Set();
    exitFired.current = false;

    trackUnified.pageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const sessionId = getSessionId();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct =
        scrollable <= 0 ? 100 : Math.round((window.scrollY / scrollable) * 100);
      lastScrollPct.current = pct;

      for (const mark of SCROLL_MARKS) {
        if (!scrollFired.current.has(mark) && pct >= mark) {
          scrollFired.current.add(mark);
          trackUnified.scrollDepth(mark, pathname);
          recordReplayScroll(sessionId, mark);
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      recordReplayClick(sessionId, target, e.clientX, e.clientY);

      const tracked =
        target.closest("[data-track-id]") ||
        target.closest("[data-track-button]");
      if (!tracked) return;

      const el = tracked as HTMLElement;
      const buttonId =
        el.getAttribute("data-track-id") ||
        el.getAttribute("data-track-button") ||
        el.id ||
        "unknown";
      const buttonText =
        el.getAttribute("data-track-label") ||
        el.textContent?.trim().slice(0, 80) ||
        buttonId;

      trackUnified.buttonClick(buttonId, buttonText, pathname);
    };

    const onMouseMove = (e: MouseEvent) => {
      recordReplayMove(sessionId, e.clientX, e.clientY);
    };

    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) {
        const name = (t as HTMLInputElement).name || t.id || "field";
        recordReplayField(sessionId, name, "focus");
      }
    };

    const onFocusOut = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) {
        const name = (t as HTMLInputElement).name || t.id || "field";
        recordReplayField(sessionId, name, "blur");
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (exitFired.current) return;
      if (e.clientY > 50) return;
      exitFired.current = true;
      trackUnified.exitIntent(pathname);
    };

    const flushTimeOnPage = () => {
      const seconds = Math.round((Date.now() - pageEnteredAt.current) / 1000);
      if (seconds > 1) {
        trackUnified.timeOnPage(seconds, pathname);
      }
    };

    const onUnload = () => {
      flushTimeOnPage();
      const replay = flushReplay(sessionId);
      if (replay.length > 0) {
        navigator.sendBeacon(
          "/api/track",
          JSON.stringify({
            event_name: "session_replay",
            session_id: sessionId,
            visitor_id: getVisitorId(),
            page: pathname,
            properties: { events: replay, scroll_pct: lastScrollPct.current },
          })
        );
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);
    document.addEventListener("mouseout", onMouseLeave);
    window.addEventListener("pagehide", onUnload);

    return () => {
      flushTimeOnPage();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("focusout", onFocusOut, true);
      document.removeEventListener("mouseout", onMouseLeave);
      window.removeEventListener("pagehide", onUnload);
    };
  }, [pathname]);

  return null;
}
