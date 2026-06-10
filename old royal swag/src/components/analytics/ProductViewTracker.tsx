"use client";

import { useEffect, useRef } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { DEFAULT_BUNDLE } from "@/lib/productPricing";
import { URGENCY_CONFIG } from "@/lib/urgency-config";

/** ViewContent once per /product visit */
export default function ProductViewTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(ANALYTICS_EVENTS.VIEW_CONTENT, {
      content_name: URGENCY_CONFIG.productName,
      content_ids: ["lung-detox-tea"],
      content_type: "product",
      value: DEFAULT_BUNDLE.price,
      currency: "INR",
      page: "/product",
    });
  }, []);

  return null;
}
