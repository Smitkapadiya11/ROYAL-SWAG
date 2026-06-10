/** Allowlisted analytics event names for /api/track */

export const TRACK_EVENT_ALLOWLIST = new Set([
  "page_view",
  "view_content",
  "add_to_cart",
  "initiate_checkout",
  "purchase",
  "lung_test_start",
  "lung_test_complete",
  "lung_test_question",
  "lead_capture",
  "button_click",
  "scroll_depth",
  "time_on_page",
  "exit_intent",
  "video_play",
  "whatsapp_click",
  "session_replay",
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
  "Lead",
  "pageview",
  "scroll_depth",
  "button_click",
  "whatsapp_click",
  "checkout_start",
  "complete_registration",
]);

export function normalizeEventName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "_");
}

export function isAllowedTrackEvent(name: string): boolean {
  const normalized = normalizeEventName(name);
  if (TRACK_EVENT_ALLOWLIST.has(name) || TRACK_EVENT_ALLOWLIST.has(normalized)) {
    return true;
  }
  return /^[a-z][a-z0-9_]{1,48}$/.test(normalized);
}
