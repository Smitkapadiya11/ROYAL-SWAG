export const RS_LEAD_KEY = "rs_lead";

/** Dispatched on same-tab writes so listeners can sync without the `storage` event (cross-tab only). */
export const RS_LEAD_UPDATED_EVENT = "rs_lead_updated";

export type RsLead = {
  name: string;
  phone: string;
  email: string;
  timestamp: number;
};

const TTL_MS = 24 * 60 * 60 * 1000;

export function parseStoredLead(): RsLead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RS_LEAD_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<RsLead>;
    if (
      typeof data.name !== "string" ||
      typeof data.phone !== "string" ||
      typeof data.email !== "string" ||
      typeof data.timestamp !== "number"
    ) {
      return null;
    }
    return data as RsLead;
  } catch {
    return null;
  }
}

export function isLeadFresh(lead: RsLead | null): boolean {
  if (!lead?.timestamp) return false;
  return Date.now() - lead.timestamp < TTL_MS;
}

export function saveLead(lead: Omit<RsLead, "timestamp">): RsLead {
  const full: RsLead = {
    ...lead,
    timestamp: Date.now(),
  };
  localStorage.setItem(RS_LEAD_KEY, JSON.stringify(full));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(RS_LEAD_UPDATED_EVENT));
  }
  return full;
}
