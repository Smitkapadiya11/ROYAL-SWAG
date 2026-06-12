import { NextRequest, NextResponse } from "next/server";
import { logAdminEnvCheck } from "@/lib/admin/env-check";
import { getSupabaseAdmin } from "@/lib/admin/session";
import { requireDashboardAuthAsync } from "@/lib/dashboard-api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = await requireDashboardAuthAsync(req);
  if (denied) return denied;

  logAdminEnvCheck();

  try {
    const supabaseAdmin = getSupabaseAdmin()

    const [ordersRes, lungRes] = await Promise.all([
      supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(500),
      supabaseAdmin.from('lung_test_leads').select('*').order('created_at', { ascending: false }).limit(500),
    ])

    if (ordersRes.error) {
      console.error('ORDERS ERROR:', ordersRes.error.message, ordersRes.error.code)
    }
    if (lungRes.error) {
      console.error('LEADS ERROR:', lungRes.error.message, lungRes.error.code)
    }

    return NextResponse.json({
      orders: ordersRes.data || [],
      lungTests: lungRes.data || [],
    })
  } catch (error) {
    console.error('Admin data error:', error)
    return NextResponse.json({ orders: [], lungTests: [] })
  }
}
