import { NextRequest, NextResponse } from "next/server";
import { requireDashboardAuth } from "@/lib/dashboard-api";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function startOfDay(d = new Date()): string {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
}

export async function GET(req: NextRequest) {
  const denied = requireDashboardAuth(req);
  if (denied) return denied;

  const admin = getSupabaseAdmin();
  const today = startOfDay();
  const yesterday = startOfDay(new Date(Date.now() - 86400000));

  const [ordersToday, ordersYesterday, leadsToday, eventsToday] = await Promise.all([
    admin.from("orders").select("amount").gte("created_at", today),
    admin
      .from("orders")
      .select("amount")
      .gte("created_at", yesterday)
      .lt("created_at", today),
    admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", today),
    admin.from("events").select("session_id").gte("created_at", today),
  ]);

  const todayRevenue = (ordersToday.data ?? []).reduce((s, o) => s + (o.amount || 0), 0);
  const yesterdayRevenue = (ordersYesterday.data ?? []).reduce((s, o) => s + (o.amount || 0), 0);
  const todayOrders = ordersToday.data?.length ?? 0;
  const yesterdayOrders = ordersYesterday.data?.length ?? 0;
  const visitors = new Set((eventsToday.data ?? []).map((e) => e.session_id).filter(Boolean)).size;

  return NextResponse.json({
    kpis: {
      visitors_today: visitors,
      orders_today: todayOrders,
      revenue_today: todayRevenue,
      conversion_rate:
        visitors > 0 ? Math.round((todayOrders / visitors) * 1000) / 10 : 0,
      orders_yesterday: yesterdayOrders,
      revenue_yesterday: yesterdayRevenue,
    },
    analytics_phase: "next",
  });
}
