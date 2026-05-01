export type TrackOrderLeadPayload = {
  name: string;
  mobile: string;
  email: string;
  address?: string;
  city?: string;
  pincode?: string;
  state?: string;
};

export async function trackOrderLead(data: TrackOrderLeadPayload) {
  try {
    await fetch("/api/track-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    // Silent fail — never block purchase flow
    console.error("trackOrderLead failed silently:", err);
  }
}

export async function trackLungTestLead(data: { name: string; mobile: string; email: string }) {
  try {
    await fetch("/api/track-lungtest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error("trackLungTestLead failed silently:", err);
  }
}
