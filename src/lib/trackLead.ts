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

export async function trackOrderLead(data: TrackOrderLeadPayload) {
  try {
    const res = await fetch("/api/track-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error("trackOrderLead failed:", res.status, errBody);
    }
  } catch (err) {
    console.error("trackOrderLead failed:", err);
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
