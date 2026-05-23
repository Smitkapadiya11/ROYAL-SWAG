import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type TrackBody = {
  session_id?: string;
  visitor_id?: string;
  page?: string;
  event?: string;
  event_name?: string;
  event_data?: Record<string, unknown>;
  data?: Record<string, unknown>;
  device?: string;
  source?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackBody;
    const event = body.event || body.event_name;
    if (!event) {
      return NextResponse.json({ error: "event required" }, { status: 400 });
    }

    const eventData = body.event_data ?? body.data ?? {};
    const city = req.headers.get("x-vercel-ip-city") || "Unknown";
    const page =
      body.page ||
      (typeof eventData.page === "string" ? eventData.page : null) ||
      (typeof eventData.url === "string" ? eventData.url : null) ||
      "/";

    const device =
      body.device === "mobile" || body.device === "desktop"
        ? body.device
        : "desktop";

    const source =
      body.source ||
      (typeof eventData.utm_source === "string" ? eventData.utm_source : null) ||
      "direct";

    const sessionId = body.session_id || crypto.randomUUID();
    const visitorId = body.visitor_id || sessionId;

    const admin = getSupabaseAdmin();

    const { error: ceError } = await admin.from("customer_events").insert({
      session_id: sessionId,
      visitor_id: visitorId,
      page,
      event,
      event_data: eventData,
      city,
      device,
      source,
    });

    if (ceError) {
      console.error("[track] customer_events:", ceError.message);
    }

    // Legacy live feed table
    await admin.from("events").insert({
      event_name: event,
      session_id: sessionId,
      page,
      city,
      country: req.headers.get("x-vercel-ip-country") || "Unknown",
      ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "Unknown",
      data: eventData,
    });

    if (ceError) {
      return NextResponse.json({ success: false, error: ceError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[track]", error);
    return NextResponse.json({ success: false, error: "Failed to track event" }, { status: 500 });
  }
}
