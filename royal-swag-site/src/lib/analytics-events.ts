/** Canonical analytics event names + admin display */

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  SCROLL_DEPTH_50: "scroll_depth_50",
  SCROLL_DEPTH_90: "scroll_depth_90",
  ADD_TO_CART: "add_to_cart",
  CHECKOUT_INIT: "checkout_init",
  WHATSAPP_CLICK: "whatsapp_click",
  LUNG_TEST_START: "lung_test_start",
  LUNG_TEST_QUESTIONS_DONE: "lung_test_questions_complete",
  LUNG_TEST_COMPLETE: "lung_test_complete",
  LUNG_RESULT_VIEW: "lung_test_result_view",
  LUNG_BUY_CLICK: "lung_test_buy_click",
  PURCHASE: "purchase",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

const LABELS: Record<string, string> = {
  page_view: "PageView",
  scroll_depth_50: "ScrollDepth50",
  scroll_depth_90: "ScrollDepth90",
  add_to_cart: "AddToCart",
  checkout_init: "AddToCart",
  whatsapp_click: "WhatsAppClick",
  sticky_bar_buy: "Clicked Buy Now",
  lung_test_start: "LungTestStart",
  lung_test_questions_complete: "Questions Complete",
  lung_test_complete: "LungTestComplete",
  lung_test_result_view: "Result Viewed",
  lung_test_buy_click: "Buy Now Clicked",
  purchase: "Purchase",
  lead: "Lead Captured",
  hero_cta_click: "Hero CTA",
  bundle_select: "Bundle Selected",
};

const COLORS: Record<string, string> = {
  purchase: "#9A6F1A",
  whatsapp_click: "#25D366",
  lung_test_start: "#3b82f6",
  lung_test_questions_complete: "#3b82f6",
  lung_test_complete: "#3b82f6",
  lung_test_result_view: "#3b82f6",
  lung_test_buy_click: "#3b82f6",
  sticky_bar_buy: "#9A6F1A",
  add_to_cart: "#9A6F1A",
  checkout_init: "#9A6F1A",
  page_view: "#6b7280",
  scroll_depth_50: "#6b7280",
  scroll_depth_90: "#6b7280",
};

export function eventActionLabel(eventName: string): string {
  return LABELS[eventName] || eventName.replace(/_/g, " ");
}

export function eventColor(eventName: string): string {
  if (eventName.includes("lung") || eventName.includes("breath")) return COLORS.lung_test_start;
  if (eventName.includes("whatsapp")) return COLORS.whatsapp_click;
  if (eventName === "purchase") return COLORS.purchase;
  return COLORS[eventName] || "#6b7280";
}

export function formatPagePath(page?: string | null): string {
  if (!page) return "/";
  return page.startsWith("/") ? page : `/${page}`;
}
