import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin/session";
import { tryGetSupabaseAdmin } from "@/lib/supabase/admin";
import { dbStatusToLabel } from "@/lib/admin/order-status";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = tryGetSupabaseAdmin();
  if (!admin) {
    console.error(
      "ORDERS ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
    return NextResponse.json(
      { error: "Supabase admin not configured", orders: [] },
      { status: 503 }
    );
  }

  try {
    const { data, error } = await admin
      .from("orders")
      .select(
        "id,order_number,full_name,phone,address_line1,address_line2,city,state,pincode,pack_type,amount,status,created_at"
      )
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      console.error("ORDERS ERROR:", error.message, error.code);
      return NextResponse.json({ error: error.message, orders: [] }, { status: 500 });
    }

    const orders = (data ?? []).map((o) => ({
      id: o.id,
      order_id: o.order_number || o.id,
      customer_name: o.full_name,
      mobile: o.phone,
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
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load orders";
    console.error("ORDERS ERROR:", message);
    return NextResponse.json({ error: message, orders: [] }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = tryGetSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Supabase admin not configured" }, { status: 503 });
  }

  const body = (await req.json()) as { id?: string; status?: string };
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  try {
    const { error } = await admin
      .from("orders")
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq("id", body.id);

    if (error) {
      console.error("ORDERS PATCH ERROR:", error.message, error.code);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
