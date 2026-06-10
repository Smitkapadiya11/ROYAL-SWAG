import { NextRequest, NextResponse } from "next/server";
import { trackReferralOnOrder } from "@/lib/referral";
import { apiNoStoreHeaders, readJsonBody } from "@/lib/api-security";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!rateLimit(`referral-track:${ip}`, 20, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: apiNoStoreHeaders() }
      );
    }

    const parsed = await readJsonBody(req);
    if (parsed.error) return parsed.error;

    const { orderId, ref, utm_source } = parsed.data as {
      orderId?: string;
      ref?: string;
      utm_source?: string;
    };

    if (!orderId?.trim()) {
      return NextResponse.json(
        { error: "orderId required" },
        { status: 400, headers: apiNoStoreHeaders() }
      );
    }

    const result = await trackReferralOnOrder({
      referredOrderId: orderId.trim(),
      referralCode: ref,
      utmSource: utm_source,
    });

    return NextResponse.json(result, { headers: apiNoStoreHeaders() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: apiNoStoreHeaders() }
    );
  }
}
