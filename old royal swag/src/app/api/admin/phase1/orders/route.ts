import { NextRequest, NextResponse } from "next/server";
import { logAdminEnvCheck } from "@/lib/admin/env-check";
import { getSupabaseAdmin } from "@/lib/admin/session";
import { dbStatusToLabel } from "@/lib/admin/order-status";

export const dynamic = "force-dynamic";

export async function GET() {
  logAdminEnvCheck();

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .not("payment_id", "is", null)
      .neq("payment_id", "")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ORDERS QUERY ERROR:", error);
      return NextResponse.json({ error: error.message, orders: [] }, { status: 500 });
    }

    const orders = (data ?? []).map((o) => ({
      id: o.id,
      order_id: o.order_number || o.id,
      full_name: o.full_name,
      mobile: o.phone,
      payment_id: o.payment_id,
      address: [o.address_line1, o.address_line2].filter(Boolean).join(", "),
      city: o.city,
      state: o.state,
      pincode: o.pincode,
      pack: o.pack_type,
      amount: o.amount,
      status: dbStatusToLabel(o.status || "pending"),
      status_db: o.status,
      created_at: o.created_at,
    }));

    return NextResponse.json({ orders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load orders";
    console.error("ORDERS ROUTE ERROR:", message);
    return NextResponse.json({ error: message, orders: [] }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  logAdminEnvCheck();

  const body = (await req.json()) as {
    id?: string;
    status?: string;
    label_printed?: boolean;
  };
  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  if (!body.status && body.label_printed === undefined) {
    return NextResponse.json({ error: "status or label_printed required" }, { status: 400 });
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status) patch.status = body.status;
  if (body.label_printed !== undefined) patch.label_printed = body.label_printed;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("orders").update(patch).eq("id", body.id);

    if (error) {
      console.error("ORDERS PATCH ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    console.error("ORDERS PATCH ROUTE ERROR:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
