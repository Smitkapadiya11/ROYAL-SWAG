export const RS_LEAD_KEY = "rs_lead";

/** Dispatched on same-tab writes so listeners can sync without the `storage` event (cross-tab only). */
export const RS_LEAD_UPDATED_EVENT = "rs_lead_updated";

export type RsLead = {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  timestamp: number;
};

const TTL_MS = 24 * 60 * 60 * 1000;

/** Normalize parsed JSON (supports legacy `phone` instead of `mobile`). */
export function parseLeadFromRaw(raw: string): RsLead | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<RsLead> & { phone?: string };
    const mobile =
      typeof data.mobile === "string"
        ? data.mobile
        : typeof data.phone === "string"
          ? data.phone
          : "";
    if (
      typeof data.name !== "string" ||
      typeof data.email !== "string" ||
      typeof data.timestamp !== "number" ||
      !mobile
    ) {
      return null;
    }
    return {
      name: data.name,
      mobile,
      email: data.email,
      address: typeof data.address === "string" ? data.address : "",
      city: typeof data.city === "string" ? data.city : "",
      pincode: typeof data.pincode === "string" ? data.pincode : "",
      state: typeof data.state === "string" ? data.state : "",
      timestamp: data.timestamp,
    };
  } catch {
    return null;
  }
}

export function parseStoredLead(): RsLead | null {
  if (typeof window === "undefined") return null;
  try {
    return parseLeadFromRaw(localStorage.getItem(RS_LEAD_KEY) ?? "");
  } catch {
    return null;
  }
}

/** Raw string for `useSyncExternalStore` — must be referentially stable when storage unchanged. */
export function getStoredLeadRaw(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(RS_LEAD_KEY) ?? "";
  } catch {
    return "";
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
