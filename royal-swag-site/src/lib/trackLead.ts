export type TrackOrderLeadPayload = {
  name: string;
  mobile: string;
  email: string;
  address?: string;
  city?: string;
  pincode?: string;
  state?: string;
  package?: string;
  amount?: number;
  payment_id?: string;
  payment_method?: string;
  status?: string;
};

/** Parsed JSON from POST /api/track-order */
export type TrackOrderApiResponse = {
  success?: boolean;
  orderId?: string;
  duplicate?: boolean;
  error?: string;
};

export async function trackOrderLead(
  data: TrackOrderLeadPayload
): Promise<TrackOrderApiResponse | null> {
  try {
    const response = await fetch("/api/track-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = (await response.json()) as TrackOrderApiResponse;
    if (!response.ok) {
      console.error("trackOrderLead failed:", response.status, result);
      return result ?? null;
    }
    return result;
  } catch (err) {
    console.error("trackOrderLead failed:", err);
    return null;
  }
}

export type TrackLungTestLeadPayload = {
  name: string;
  mobile: string;
  email: string;
  risk_level?: string;
  score?: number;
  answers?: unknown;
};

export async function trackLungTestLead(data: TrackLungTestLeadPayload) {
  try {
    const res = await fetch("/api/track-lungtest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error("trackLungTestLead failed:", res.status, errBody);
    }
  } catch (err) {
    console.error("trackLungTestLead failed:", err);
  }
}
