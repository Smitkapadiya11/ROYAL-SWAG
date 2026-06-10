"use client";

import { createContext, useContext } from "react";
import type { RsLead } from "@/lib/lead-capture-storage";

export type LeadCaptureContextValue = {
  showModal: boolean;
  openLeadModal: (thenRun: () => void) => void;
  closeLeadModal: () => void;
  leadData: RsLead | null;
  isLeadCaptured: boolean;
};

export const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

export function useLeadCapture(): LeadCaptureContextValue {
  const ctx = useContext(LeadCaptureContext);
  if (!ctx) {
    throw new Error("useLeadCapture must be used within LeadCaptureProvider");
  }
  return ctx;
}
