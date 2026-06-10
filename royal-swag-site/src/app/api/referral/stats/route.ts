import { NextRequest, NextResponse } from "next/server";
import { generateReferralForOrder, getReferralStats } from "@/lib/referral";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { apiNoStoreHeaders } from "@/lib/api-security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order");
  if (!orderId) {
    return NextResponse.json(
      { error: "order required" },
      { status: 400, headers: apiNoStoreHeaders() }
    );
  }

  const gen = await generateReferralForOrder(orderId);
  if ("error" in gen) {
    return NextResponse.json(
      { error: gen.error },
      { status: 404, headers: apiNoStoreHeaders() }
    );
  }

  const admin = getSupabaseAdmin();
  const { data: order } = await admin
    .from("orders")
    .select("phone")
    .or(`id.eq.${orderId},order_number.eq.${orderId}`)
    .maybeSingle();

  if (!order?.phone) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404, headers: apiNoStoreHeaders() }
    );
  }

  const stats = await getReferralStats(order.phone, gen.code);

  return NextResponse.json(stats, { headers: apiNoStoreHeaders() });
}
