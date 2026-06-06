"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ANALYTICS_EVENTS,
  configureGa4,
  initMetaPixel,
  track,
} from "@/lib/analytics";
import { captureUtmFromUrl, getVisitorId, getSessionId } from "@/lib/customer-analytics";

/**
 * Initializes pixels and fires PageView on each App Router navigation (no duplicate with inline pixel PageView on first load — deduped).
 */
export default function AnalyticsProvider() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    getVisitorId();
    getSessionId();
    captureUtmFromUrl();
    initMetaPixel();
    configureGa4();
  }, []);

  useEffect(() => {
    const qs = searchParams?.toString();
    const pathKey = qs ? `${pathname}?${qs}` : pathname;
    if (lastPath.current === pathKey) return;
    lastPath.current = pathKey;

    const referrer = typeof document !== "undefined" ? document.referrer || "" : "";
    track(ANALYTICS_EVENTS.PAGE_VIEW, {
      page: pathname,
      referrer,
      utm_source: searchParams?.get("utm_source") ?? undefined,
      utm_campaign: searchParams?.get("utm_campaign") ?? undefined,
    });
  }, [pathname, searchParams]);

  return null;
}
