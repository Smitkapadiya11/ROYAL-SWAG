"use client";

import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { LeadCaptureContext } from "@/hooks/useLeadCapture";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import {
  getStoredLeadRaw,
  isLeadFresh,
  parseLeadFromRaw,
  parseStoredLead,
  RS_LEAD_UPDATED_EVENT,
} from "@/lib/lead-capture-storage";

function subscribeLead(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(RS_LEAD_UPDATED_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(RS_LEAD_UPDATED_EVENT, handler);
  };
}

/** Snapshot MUST be stable when storage is unchanged — never return a fresh object from JSON.parse here. */
function leadRawSnapshot(): string {
  return getStoredLeadRaw();
}

function leadRawServerSnapshot(): string {
  return "";
}

export default function LeadCaptureProvider({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const pendingRef = useRef<(() => void) | null>(null);

  const leadRaw = useSyncExternalStore(subscribeLead, leadRawSnapshot, leadRawServerSnapshot);
  const leadData = useMemo(() => parseLeadFromRaw(leadRaw), [leadRaw]);

  const isLeadCaptured = useMemo(() => isLeadFresh(leadData), [leadData]);

  const openLeadModal = useCallback((thenRun: () => void) => {
    const stored = parseStoredLead();
    if (isLeadFresh(stored)) {
      thenRun();
      return;
    }
    pendingRef.current = thenRun;
    setShowModal(true);
  }, []);

  const closeLeadModal = useCallback(() => {
    setShowModal(false);
    pendingRef.current = null;
  }, []);

  const handleModalSuccess = useCallback(() => {
    setShowModal(false);
    const fn = pendingRef.current;
    pendingRef.current = null;
    fn?.();
  }, []);

  const value = useMemo(
    () => ({
      showModal,
      openLeadModal,
      closeLeadModal,
      leadData,
      isLeadCaptured,
    }),
    [showModal, openLeadModal, closeLeadModal, leadData, isLeadCaptured]
  );

  return (
    <LeadCaptureContext.Provider value={value}>
      {children}
      <LeadCaptureModal
        isOpen={showModal}
        onClose={closeLeadModal}
        mode="online"
        packageLabel="Royal Swag Lung Detox Tea"
        packageAmount={349}
        onSuccess={() => {
          handleModalSuccess();
        }}
      />
    </LeadCaptureContext.Provider>
  );
}
