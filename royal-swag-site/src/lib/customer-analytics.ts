/** Client-side customer session tracking → customer_events table */

export const CUSTOMER_EVENTS = {
  PAGE_VIEW: "page_view",
  SCROLL_DEPTH: "scroll_depth",
  BUTTON_CLICK: "button_click",
  WHATSAPP_CLICK: "whatsapp_click",
  ADD_TO_CART: "add_to_cart",
  CHECKOUT_START: "checkout_start",
  PURCHASE: "purchase",
  LUNG_TEST_START: "lung_test_start",
  LUNG_TEST_QUESTION: "lung_test_question",
  LUNG_TEST_COMPLETE: "lung_test_complete",
} as const;

export type CustomerEventName =
  (typeof CUSTOMER_EVENTS)[keyof typeof CUSTOMER_EVENTS];

export type DeviceType = "mobile" | "desktop";

export type CustomerEventPayload = {
  event: string;
  page?: string;
  event_data?: Record<string, unknown>;
  session_id?: string;
  visitor_id?: string;
  device?: DeviceType;
  source?: string;
};

const VISITOR_KEY = "rs_visitor_id";
const SESSION_KEY = "rs_session_id";
const UTM_KEY = "rs_utm";

export type StoredUtm = {
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_content?: string;
};

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getDeviceType(): DeviceType {
  if (typeof window === "undefined") return "desktop";
  return window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
}

export function captureUtmFromUrl(): StoredUtm {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: StoredUtm = {
    utm_source: params.get("utm_source") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_content: params.get("utm_content") || undefined,
  };
  if (utm.utm_source || utm.utm_campaign) {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
  }
  return utm;
}

export function getStoredUtm(): StoredUtm {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    return raw ? (JSON.parse(raw) as StoredUtm) : {};
  } catch {
    return {};
  }
}

export function getTrafficSource(): string {
  const utm = getStoredUtm();
  return utm.utm_source || "direct";
}

export function trackCustomerEvent(payload: CustomerEventPayload): void {
  if (typeof window === "undefined") return;

  const page =
    payload.page ||
    (typeof payload.event_data?.page === "string"
      ? payload.event_data.page
      : window.location.pathname);

  const body = {
    session_id: payload.session_id || getSessionId(),
    visitor_id: payload.visitor_id || getVisitorId(),
    page,
    event: payload.event,
    event_data: payload.event_data ?? {},
    device: payload.device || getDeviceType(),
    source: payload.source || getTrafficSource(),
  };

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}
