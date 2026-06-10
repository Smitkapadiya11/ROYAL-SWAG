/**
 * Unified analytics: Meta Pixel + GA4 + Supabase (customer_events).
 */

import {
  captureUtmFromUrl,
  getDeviceType,
  getSessionId,
  getStoredUtm,
  getTrafficSource,
  getVisitorId,
} from "@/lib/customer-analytics";

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "PageView",
  VIEW_CONTENT: "ViewContent",
  ADD_TO_CART: "AddToCart",
  INITIATE_CHECKOUT: "InitiateCheckout",
  PURCHASE: "Purchase",
  LEAD: "Lead",
  COMPLETE_REGISTRATION: "CompleteRegistration",
} as const;

export type TrackPlatform = "meta" | "ga4" | "internal";

export type TrackOptions = {
  platforms?: TrackPlatform[];
  skipDedupe?: boolean;
};

const GA4_EVENT_MAP: Record<string, string> = {
  PageView: "page_view",
  ViewContent: "view_item",
  AddToCart: "add_to_cart",
  InitiateCheckout: "begin_checkout",
  Purchase: "purchase",
  Lead: "generate_lead",
  CompleteRegistration: "sign_up",
};

const INTERNAL_EVENT_MAP: Record<string, string> = {
  PageView: "page_view",
  ViewContent: "view_content",
  AddToCart: "add_to_cart",
  InitiateCheckout: "checkout_start",
  Purchase: "purchase",
  Lead: "lead",
  CompleteRegistration: "complete_registration",
};

let pixelInitialized = false;
let ga4Configured = false;
const recentKeys = new Map<string, number>();
const DEDUPE_MS = 800;

declare global {
  interface Window {
    fbq?: (
      command: string,
      eventOrId?: string,
      params?: Record<string, unknown>
    ) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function dedupeKey(event: string, data?: Record<string, unknown>): string {
  const page = typeof window !== "undefined" ? window.location.pathname : "";
  const id = data?.order_id ?? data?.transaction_id ?? "";
  return `${event}:${page}:${String(id)}`;
}

function shouldFire(
  event: string,
  data?: Record<string, unknown>,
  skip?: boolean
): boolean {
  if (skip) return true;
  const key = dedupeKey(event, data);
  const now = Date.now();
  const last = recentKeys.get(key);
  if (last != null && now - last < DEDUPE_MS) return false;
  recentKeys.set(key, now);
  return true;
}

export async function hashForAdvancedMatching(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalized)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export async function setAdvancedMatching(params: {
  email?: string;
  phone?: string;
}): Promise<void> {
  if (typeof window === "undefined") return;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId || !window.fbq) return;

  const advanced: Record<string, string> = {};
  if (params.email) {
    advanced.em = await hashForAdvancedMatching(params.email);
  }
  if (params.phone) {
    advanced.ph = await hashForAdvancedMatching(normalizePhone(params.phone));
  }
  if (Object.keys(advanced).length === 0) return;

  window.fbq("init", pixelId, advanced);
}

export function initMetaPixel(): void {
  if (typeof window === "undefined" || pixelInitialized) return;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) return;

  if (window.fbq) {
    pixelInitialized = true;
    return;
  }

  import("react-facebook-pixel")
    .then((mod) => {
      if (pixelInitialized) return;
      mod.default.init(pixelId, undefined, { autoConfig: true, debug: false });
      pixelInitialized = true;
    })
    .catch(() => {
      window.fbq?.("init", pixelId);
      pixelInitialized = true;
    });
}

export function configureGa4(): void {
  if (typeof window === "undefined" || ga4Configured) return;
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  if (!gaId || !window.gtag) return;

  window.gtag("config", gaId, {
    send_page_view: false,
    allow_google_signals: true,
  });
  ga4Configured = true;
}

function metaParams(
  event: string,
  data: Record<string, unknown>
): Record<string, unknown> {
  const currency = (data.currency as string) || "INR";
  const value = data.value ?? data.amount ?? data.total;

  if (event === ANALYTICS_EVENTS.PAGE_VIEW) return {};

  return {
    content_name: data.content_name ?? data.pack_name,
    content_type: data.content_type || "product",
    value,
    currency,
    num_items: data.num_items ?? 1,
    order_id: data.order_id,
    lead_type: data.lead_type,
  };
}

function ga4Params(
  event: string,
  data: Record<string, unknown>
): Record<string, unknown> {
  const currency = (data.currency as string) || "INR";
  const value = data.value ?? data.amount ?? data.total;
  const pagePath =
    (data.page as string) ||
    (typeof window !== "undefined" ? window.location.pathname : "/");

  const item = {
    item_id: "lung-detox-tea",
    item_name: (data.content_name ?? data.pack_name ?? "Lung Detox Tea") as string,
    price: value,
    quantity: (data.num_items as number) ?? 1,
  };

  switch (event) {
    case ANALYTICS_EVENTS.VIEW_CONTENT:
      return { currency, value, items: [item], page_path: pagePath };
    case ANALYTICS_EVENTS.ADD_TO_CART:
      return { currency, value, items: [item], page_path: pagePath };
    case ANALYTICS_EVENTS.INITIATE_CHECKOUT:
      return {
        currency,
        value,
        items: [{ ...item, quantity: (data.num_items as number) ?? 1 }],
        page_path: pagePath,
      };
    case ANALYTICS_EVENTS.PURCHASE:
      return {
        currency,
        value,
        transaction_id: data.order_id,
        items: [item],
        page_path: pagePath,
      };
    case ANALYTICS_EVENTS.LEAD:
      return { currency, value, lead_type: data.lead_type, page_path: pagePath };
    default:
      return { ...data, currency, value, page_path: pagePath };
  }
}

function toInternalEvent(event: string): string {
  if (INTERNAL_EVENT_MAP[event]) return INTERNAL_EVENT_MAP[event];
  return event
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/\s+/g, "_")
    .toLowerCase();
}

function postInternal(internalEvent: string, data: Record<string, unknown>): void {
  captureUtmFromUrl();
  const utm = getStoredUtm();
  const page =
    (data.page as string) ||
    (typeof window !== "undefined" ? window.location.pathname : "/");

  const eventData = {
    ...data,
    timestamp: Date.now(),
    page,
    utm_source: utm.utm_source,
    utm_campaign: utm.utm_campaign,
  };

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      session_id: getSessionId(),
      visitor_id: getVisitorId(),
      page,
      event: internalEvent,
      event_data: eventData,
      data: eventData,
      device: getDeviceType(),
      source: getTrafficSource(),
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}

/** Purchase once per order id (avoids thank-you / success page duplicates). */
export function trackPurchaseOnce(
  orderId: string,
  data: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  const key = `rs_purchase_${orderId}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  track(ANALYTICS_EVENTS.PURCHASE, { ...data, order_id: orderId }, {
    skipDedupe: true,
  });
}

export function track(
  event: string,
  data?: Record<string, unknown>,
  options?: TrackOptions
): void {
  if (typeof window === "undefined") return;

  const platforms: TrackPlatform[] = options?.platforms ?? [
    "meta",
    "ga4",
    "internal",
  ];
  const payload = data ?? {};

  if (!shouldFire(event, payload, options?.skipDedupe)) return;

  getSessionId();
  getVisitorId();

  if (platforms.includes("meta") && window.fbq) {
    if (event === ANALYTICS_EVENTS.PAGE_VIEW) {
      window.fbq("track", "PageView");
    } else {
      window.fbq("track", event, metaParams(event, payload));
    }
  }

  if (platforms.includes("ga4") && window.gtag) {
    const ga4Name = GA4_EVENT_MAP[event] ?? event;
    window.gtag("event", ga4Name, ga4Params(event, payload));
  }

  if (platforms.includes("internal")) {
    postInternal(toInternalEvent(event), payload);
  }
}

export type CartItem = {
  productId: string;
  quantity: number;
  price: number;
};

function fire(
  event: string,
  data?: Record<string, unknown>,
  options?: TrackOptions
): void {
  track(event, data, options);
}

/** Unified tracking API — Meta + GA4 + Supabase + session replay hooks */
export const trackUnified = {
  pageView(path: string, referrer?: string) {
    fire(ANALYTICS_EVENTS.PAGE_VIEW, {
      page: path,
      referrer: referrer ?? document.referrer,
      page_title: document.title,
    });
  },
  viewContent(productId: string, price: number) {
    fire(ANALYTICS_EVENTS.VIEW_CONTENT, {
      content_ids: [productId],
      content_type: "product",
      value: price,
      currency: "INR",
    });
  },
  addToCart(productId: string, quantity: number, price: number) {
    fire(ANALYTICS_EVENTS.ADD_TO_CART, {
      content_ids: [productId],
      num_items: quantity,
      value: price * quantity,
      currency: "INR",
    });
  },
  initiateCheckout(items: CartItem[], total: number) {
    fire(ANALYTICS_EVENTS.INITIATE_CHECKOUT, {
      num_items: items.reduce((s, i) => s + i.quantity, 0),
      value: total,
      currency: "INR",
      items,
    });
  },
  purchase(orderId: string, total: number, items: CartItem[]) {
    trackPurchaseOnce(orderId, {
      order_id: orderId,
      value: total,
      currency: "INR",
      num_items: items.reduce((s, i) => s + i.quantity, 0),
      items,
    });
  },
  lungTestStart() {
    fire("lung_test_start", { page: window.location.pathname }, { platforms: ["internal", "meta", "ga4"] });
  },
  lungTestComplete(score: number, riskLevel: string) {
    fire(
      "lung_test_complete",
      { score, risk_level: riskLevel, page: window.location.pathname },
      { platforms: ["internal", "meta", "ga4"] }
    );
  },
  leadCapture(source: string, email?: string) {
    fire(ANALYTICS_EVENTS.LEAD, {
      lead_type: source,
      email,
      page: window.location.pathname,
    });
  },
  buttonClick(buttonId: string, buttonText: string, page: string) {
    fire(
      "button_click",
      { button_id: buttonId, button_text: buttonText, page },
      { platforms: ["internal"] }
    );
  },
  scrollDepth(percentage: number, page: string) {
    fire(
      "scroll_depth",
      { depth: percentage, page },
      { platforms: ["internal"] }
    );
  },
  timeOnPage(seconds: number, page: string) {
    fire(
      "time_on_page",
      { seconds, page },
      { platforms: ["internal"] }
    );
  },
  exitIntent(page: string) {
    fire("exit_intent", { page }, { platforms: ["internal"] });
  },
  videoPlay(videoId: string) {
    fire("video_play", { video_id: videoId, page: window.location.pathname }, {
      platforms: ["internal", "meta", "ga4"],
    });
  },
  whatsappClick(source: string) {
    fire(
      "whatsapp_click",
      { source, page: window.location.pathname },
      { platforms: ["internal", "meta", "ga4"] }
    );
  },
  customEvent(name: string, data: Record<string, unknown>) {
    fire(name, { ...data, page: window.location.pathname });
  },
};
