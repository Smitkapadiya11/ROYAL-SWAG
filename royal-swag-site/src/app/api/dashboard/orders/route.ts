import { NextRequest, NextResponse } from "next/server";
import { requireDashboardAuth } from "@/lib/dashboard-api";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  dbStatusToLabel,
  labelToDbStatus,
  type OrderStatusLabel,
} from "@/lib/admin/order-status";

export async function GET(req: NextRequest) {
  const denied = requireDashboardAuth(req);
  if (denied) return denied;

  const status = req.nextUrl.searchParams.get("status");
  const admin = getSupabaseAdmin();
  let query = admin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (status && status !== "all") {
    query = query.eq("status", labelToDbStatus(status as OrderStatusLabel));
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const orders = (data ?? []).map((o) => ({
    id: o.id,
    order_id: o.order_id || o.id,
    full_name: o.full_name || o.name,
    mobile: o.mobile || o.phone,
    payment_id: o.payment_id || o.razorpay_payment_id,
    address: o.address || o.address_line1,
    city: o.city,
    state: o.state,
    pincode: o.pincode,
    pack: o.pack || o.pack_label,
    amount: o.amount,
    status: dbStatusToLabel(o.status),
    status_db: o.status,
    created_at: o.created_at,
  }));

  return NextResponse.json({ orders });
}

export async function PATCH(req: NextRequest) {
  const denied = requireDashboardAuth(req);
  if (denied) return denied;

  const body = (await req.json()) as { id?: string; status?: string };
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("orders")
    .update({ status: labelToDbStatus(body.status as OrderStatusLabel) })
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
