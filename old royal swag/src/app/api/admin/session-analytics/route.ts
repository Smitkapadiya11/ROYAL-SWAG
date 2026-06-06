import { NextRequest, NextResponse } from "next/server";
import { logAdminEnvCheck } from "@/lib/admin/env-check";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/admin/session";
import {
  buildCityOrders,
  buildDeviceSplit,
  buildExitPages,
  buildPeakHours,
  buildSankeyLinks,
  buildTodayFunnel,
  buildTrafficSources,
  filterEvents,
  filterOrders,
  listDistinctSources,
  type AnalyticsFilters,
  type CustomerEventRow,
  type OrderRow,
} from "@/lib/session-analytics-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  logAdminEnvCheck();

  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const defaultFrom = today.toISOString();

  const dateTo = sp.get("dateTo") || new Date().toISOString();
  const dateFrom =
    sp.get("dateFrom") ||
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const filters: AnalyticsFilters = {
    dateFrom,
    dateTo,
    device: (sp.get("device") as AnalyticsFilters["device"]) || "all",
    source: sp.get("source") || "all",
    pack: sp.get("pack") || "all",
  };

  try {
    const admin = getSupabaseAdmin();
    const peakFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [eventsRes, ordersRes, ordersPeakRes] = await Promise.all([
      admin
        .from("customer_events")
        .select(
          "session_id,visitor_id,page,event,event_data,city,device,source,timestamp"
        )
        .gte("timestamp", dateFrom)
        .lte("timestamp", dateTo)
        .order("timestamp", { ascending: false })
        .limit(15000),
      admin
        .from("orders")
        .select("city,pack_type,amount,status,created_at")
        .gte("created_at", dateFrom)
        .lte("created_at", dateTo)
        .eq("status", "paid"),
      admin
        .from("orders")
        .select("city,pack_type,amount,status,created_at")
        .gte("created_at", peakFrom)
        .lte("created_at", dateTo)
        .eq("status", "paid"),
    ]);

    if (eventsRes.error) {
      return NextResponse.json({ error: eventsRes.error.message }, { status: 500 });
    }

    const allEvents = (eventsRes.data ?? []) as CustomerEventRow[];
    const events = filterEvents(allEvents, filters);
    const orders = filterOrders((ordersRes.data ?? []) as OrderRow[], filters, filters.pack);
    const ordersPeak = filterOrders(
      (ordersPeakRes.data ?? []) as OrderRow[],
      { ...filters, dateFrom: peakFrom },
      filters.pack
    );

    const funnel = buildTodayFunnel(events);
    const funnelToday =
      filters.dateFrom <= defaultFrom
        ? funnel
        : buildTodayFunnel(
            filterEvents(
              allEvents.filter((e) => e.timestamp >= defaultFrom),
              { ...filters, dateFrom: defaultFrom }
            )
          );

    return NextResponse.json({
      filters,
      sources: ["all", ...listDistinctSources(allEvents)],
      packs: ["all", "starter", "progress", "result"],
      funnel,
      funnelToday,
      sankeyLinks: buildSankeyLinks(funnel),
      sankeyLinksToday: buildSankeyLinks(funnelToday),
      exitPages: buildExitPages(events),
      deviceSplit: buildDeviceSplit(events),
      trafficSources: buildTrafficSources(events),
      cityOrders: buildCityOrders(orders),
      peakHours: buildPeakHours(ordersPeak),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Analytics failed";
    console.error("[session-analytics]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
