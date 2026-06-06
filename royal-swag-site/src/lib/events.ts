import { track, ANALYTICS_EVENTS, type TrackOptions } from "@/lib/analytics";
import { CUSTOMER_EVENTS } from "@/lib/customer-analytics";

export const EVENTS = {
  PAGE_VIEW: CUSTOMER_EVENTS.PAGE_VIEW,
  SCROLL_DEPTH: CUSTOMER_EVENTS.SCROLL_DEPTH,
  BUTTON_CLICK: CUSTOMER_EVENTS.BUTTON_CLICK,
  HERO_CTA: "hero_cta_click",
  BUNDLE_SELECT: "bundle_select",
  ADD_TO_CART: CUSTOMER_EVENTS.ADD_TO_CART,
  CHECKOUT_INIT: CUSTOMER_EVENTS.CHECKOUT_START,
  CHECKOUT_START: CUSTOMER_EVENTS.CHECKOUT_START,
  PURCHASE: CUSTOMER_EVENTS.PURCHASE,
  WHATSAPP_CLICK: CUSTOMER_EVENTS.WHATSAPP_CLICK,
  LUNG_TEST_START: CUSTOMER_EVENTS.LUNG_TEST_START,
  LUNG_TEST_QUESTION: CUSTOMER_EVENTS.LUNG_TEST_QUESTION,
  LUNG_TEST_QUESTIONS_DONE: "lung_test_questions_complete",
  LUNG_TEST_COMPLETE: CUSTOMER_EVENTS.LUNG_TEST_COMPLETE,
  LUNG_RESULT_VIEW: "lung_test_result_view",
  LUNG_BUY_CLICK: "lung_test_buy_click",
  BREATH_TEST_START: "breath_test_start",
  LEAD_CAPTURE: "lead",
  VIDEO_PLAY: "video_play",
  SECTION_VIEW: "section_view",
  STICKY_BAR_BUY: "sticky_bar_buy",
  SCROLL_DEPTH_50: CUSTOMER_EVENTS.SCROLL_DEPTH,
  SCROLL_DEPTH_90: CUSTOMER_EVENTS.SCROLL_DEPTH,
} as const;

const STANDARD_TO_ANALYTICS: Record<string, string> = {
  add_to_cart: ANALYTICS_EVENTS.ADD_TO_CART,
  checkout_start: ANALYTICS_EVENTS.INITIATE_CHECKOUT,
  purchase: ANALYTICS_EVENTS.PURCHASE,
  page_view: ANALYTICS_EVENTS.PAGE_VIEW,
  lead: ANALYTICS_EVENTS.LEAD,
};

/** Legacy helper — routes standard ecommerce events to Meta/GA4/internal; others internal-only. */
export function trackEvent(
  name: string,
  data: Record<string, unknown> = {},
  options?: TrackOptions
): void {
  const analyticsEvent = STANDARD_TO_ANALYTICS[name];
  if (analyticsEvent) {
    track(analyticsEvent, data, options);
    return;
  }
  track(name, data, { ...options, platforms: options?.platforms ?? ["internal"] });
}
