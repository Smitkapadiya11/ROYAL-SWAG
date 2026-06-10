import { NextRequest, NextResponse } from "next/server";
import { generateReferralForOrder, incrementReferralShare } from "@/lib/referral";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { apiNoStoreHeaders, readJsonBody } from "@/lib/api-security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const parsed = await readJsonBody(req);
  if (parsed.error) return parsed.error;

  const { orderId } = parsed.data as { orderId?: string };
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const gen = await generateReferralForOrder(orderId);
  if ("error" in gen) {
    return NextResponse.json({ error: gen.error }, { status: 404 });
  }

  const admin = getSupabaseAdmin();
  const { data: order } = await admin
    .from("orders")
    .select("phone")
    .or(`id.eq.${orderId},order_number.eq.${orderId}`)
    .maybeSingle();

  if (order?.phone) {
    await incrementReferralShare(order.phone);
  }

  return NextResponse.json({ ok: true }, { headers: apiNoStoreHeaders() });
}
