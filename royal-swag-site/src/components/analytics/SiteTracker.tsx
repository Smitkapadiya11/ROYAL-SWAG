"use client";

import { useEffect } from "react";
import {
  captureUtmFromUrl,
  getSessionId,
  getVisitorId,
} from "@/lib/customer-analytics";

/** Initializes visitor/session IDs and UTM capture. Event tracking is in TrackingProvider. */
export default function SiteTracker() {
  useEffect(() => {
    getVisitorId();
    getSessionId();
    captureUtmFromUrl();
  }, []);

  return null;
}
