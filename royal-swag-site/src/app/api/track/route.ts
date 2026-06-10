import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { apiNoStoreHeaders } from "@/lib/api-security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAllowedTrackEvent, normalizeEventName } from "@/lib/track-allowlist";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type IncomingEvent = {
  session_id?: string;
  visitor_id?: string;
  page?: string;
  event?: string;
  event_name?: string;
  event_data?: Record<string, unknown>;
  data?: Record<string, unknown>;
  properties?: Record<string, unknown>;
  device?: string;
  source?: string;
  referrer?: string;
  page_title?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  order_id?: string;
  lead_id?: string;
};

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

function inferDevice(ua: string): string {
  const lower = ua.toLowerCase();
  if (/ipad|tablet/.test(lower)) return "tablet";
  if (/mobile|android|iphone/.test(lower)) return "mobile";
  return "desktop";
}

function mapRow(
  body: IncomingEvent,
  req: NextRequest,
  eventName: string
): Record<string, unknown> {
  const props = body.properties ?? body.event_data ?? body.data ?? {};
  const city = req.headers.get("x-vercel-ip-city") || "Unknown";
  const country = req.headers.get("x-vercel-ip-country") || "Unknown";
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  const ua = req.headers.get("user-agent") || "";
  const page =
    body.page ||
    (typeof props.page === "string" ? props.page : null) ||
    (typeof props.url === "string" ? props.url : null) ||
    "/";

  const sessionId = body.session_id || crypto.randomUUID();
  const visitorId = body.visitor_id || sessionId;

  return {
    event_name: normalizeEventName(eventName),
    session_id: sessionId,
    visitor_id: visitorId,
    page,
    page_path: page,
    page_title: body.page_title || (typeof props.page_title === "string" ? props.page_title : null),
    referrer: body.referrer || req.headers.get("referer"),
    utm_source: body.utm_source || (typeof props.utm_source === "string" ? props.utm_source : null),
    utm_medium: body.utm_medium || (typeof props.utm_medium === "string" ? props.utm_medium : null),
    utm_campaign:
      body.utm_campaign || (typeof props.utm_campaign === "string" ? props.utm_campaign : null),
    properties: props,
    data: props,
    device_type:
      body.device === "mobile" || body.device === "desktop" || body.device === "tablet"
        ? body.device
        : inferDevice(ua),
    user_agent: ua.slice(0, 512),
    city,
    country,
    ip_hash: forwarded ? hashIp(forwarded) : null,
    ip_address: forwarded || "Unknown",
    order_id: body.order_id || (typeof props.order_id === "string" ? props.order_id : null),
    lead_id: body.lead_id || (typeof props.lead_id === "string" ? props.lead_id : null),
  };
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const batch: IncomingEvent[] = Array.isArray(json) ? json : [json as IncomingEvent];
    const admin = getSupabaseAdmin();
    const rows: Record<string, unknown>[] = [];

    for (const body of batch) {
      const eventName = body.event || body.event_name;
      if (!eventName || !isAllowedTrackEvent(eventName)) continue;
      rows.push(mapRow(body, req, eventName));
    }

    if (rows.length > 0) {
      const { error: eventsError } = await admin.from("events").insert(rows);
      if (eventsError) {
        console.error("[track] events:", eventsError.message);
      }

      const customerRows = rows.map((r) => ({
        session_id: r.session_id,
        visitor_id: r.visitor_id,
        page: r.page_path,
        event: r.event_name,
        event_data: r.properties,
        city: r.city,
        device: r.device_type === "mobile" ? "mobile" : "desktop",
        source: r.utm_source || "direct",
      }));

      const { error: ceError } = await admin.from("customer_events").insert(customerRows);
      if (ceError) {
        console.error("[track] customer_events:", ceError.message);
      }
    }

    return NextResponse.json(
      { success: true, accepted: rows.length },
      { headers: apiNoStoreHeaders() }
    );
  } catch (error) {
    console.error("[track]", error);
    return NextResponse.json(
      { success: true, accepted: 0 },
      { headers: apiNoStoreHeaders() }
    );
  }
}
