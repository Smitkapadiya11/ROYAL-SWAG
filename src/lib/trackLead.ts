export type TrackOrderLeadPayload = {
  name: string;
  mobile: string;
  email: string;
  address?: string;
  city?: string;
  pincode?: string;
  state?: string;
  amount?: number;
  package?: string;
};

export type TrackOrderLeadResult = {
  success: boolean;
  orderId?: string;
  duplicate?: boolean;
};

export async function trackOrderLead(
  data: TrackOrderLeadPayload
): Promise<TrackOrderLeadResult | null> {
  try {
    const res = await fetch("/api/track-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = (await res.json()) as {
      success?: boolean;
      orderId?: string;
      duplicate?: boolean;
      error?: string;
    };
    if (!res.ok) {
      console.error("trackOrderLead failed:", res.status, json);
      return null;
    }
    return {
      success: Boolean(json.success),
      orderId: typeof json.orderId === "string" ? json.orderId : undefined,
      duplicate: Boolean(json.duplicate),
    };
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
