import { NextRequest, NextResponse } from "next/server";
import { generateReferralForOrder } from "@/lib/referral";
import { apiNoStoreHeaders, readJsonBody } from "@/lib/api-security";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!rateLimit(`referral-gen:${ip}`, 15, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: apiNoStoreHeaders() }
      );
    }

    const parsed = await readJsonBody(req);
    if (parsed.error) return parsed.error;

    const { orderId } = parsed.data as { orderId?: string };
    if (!orderId?.trim()) {
      return NextResponse.json(
        { error: "orderId required" },
        { status: 400, headers: apiNoStoreHeaders() }
      );
    }

    const result = await generateReferralForOrder(orderId.trim());
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 404, headers: apiNoStoreHeaders() }
      );
    }

    return NextResponse.json(
      { code: result.code, link: result.link, orderId: result.orderId },
      { headers: apiNoStoreHeaders() }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: apiNoStoreHeaders() }
    );
  }
}
