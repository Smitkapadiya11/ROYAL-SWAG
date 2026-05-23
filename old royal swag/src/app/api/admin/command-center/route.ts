import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type FunnelStage = { stage: string; count: number; dropPct: number };

function todayStartISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function countEvents(names: string[], rows: { event_name: string }[]): number {
  const set = new Set(names);
  return rows.filter((r) => set.has(r.event_name)).length;
}

function buildFunnel(
  stages: { stage: string; names: string[] }[],
  rows: { event_name: string }[]
): FunnelStage[] {
  const counts = stages.map((s) => ({
    stage: s.stage,
    count: countEvents(s.names, rows),
  }));
  const top = counts[0]?.count || 0;
  return counts.map((c, i) => {
    const prev = i === 0 ? c.count : counts[i - 1].count;
    const dropPct =
      i === 0 || prev === 0 ? 0 : Math.round(((prev - c.count) / prev) * 100);
    return { ...c, dropPct: Math.max(0, dropPct) };
  });
}

function riskToScore(level: string): number {
  const l = level.toLowerCase();
  if (l.includes("high")) return 9;
  if (l.includes("moderate")) return 6;
  return 3;
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = getSupabaseAdmin();
    const todayStart = todayStartISO();
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const [
      eventsRes,
      eventsTodayRes,
      liveRecentRes,
      ordersRes,
      ordersTodayRes,
      leadsRes,
      leadsTodayRes,
    ] = await Promise.all([
      admin
        .from("events")
        .select("id,event_name,session_id,page,city,created_at,data")
        .order("created_at", { ascending: false })
        .limit(100),
      admin
        .from("events")
        .select("event_name,session_id,page")
        .gte("created_at", todayStart),
      admin
        .from("events")
        .select("session_id")
        .gte("created_at", fiveMinAgo)
        .not("session_id", "is", null),
      admin
        .from("orders")
        .select(
          "id,order_number,full_name,city,pack_type,amount,status,created_at,email"
        )
        .order("created_at", { ascending: false })
        .limit(50),
      admin
        .from("orders")
        .select("amount,status,email,created_at")
        .gte("created_at", todayStart),
      admin
        .from("lung_test_leads")
        .select("id,name,email,phone,city,level,score,created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      admin
        .from("lung_test_leads")
        .select("id,level,score,email,created_at")
        .gte("created_at", todayStart),
    ]);

    const recentEvents = eventsRes.data ?? [];
    const todayEvents = eventsTodayRes.data ?? [];
    const orders = ordersRes.data ?? [];
    const todayOrders = ordersTodayRes.data ?? [];
    const leads = leadsRes.data ?? [];
    const todayLeads = leadsTodayRes.data ?? [];

    const liveSessions = new Set(
      (liveRecentRes.data ?? []).map((e) => e.session_id as string)
    );

    const paidToday = todayOrders.filter(
      (o) => String(o.status).toLowerCase() === "paid"
    );
    const todayRevenue = paidToday.reduce((s, o) => s + (Number(o.amount) || 0), 0);
    const lungLeadsToday = todayLeads.length;
    const purchasesToday = paidToday.length;
    const lungConversionPct =
      lungLeadsToday > 0 ? Math.round((purchasesToday / lungLeadsToday) * 100) : 0;

    const avgRiskScore =
      todayLeads.length > 0
        ? Math.round(
            (todayLeads.reduce((s, l) => s + (Number(l.score) || riskToScore(l.level)), 0) /
              todayLeads.length) *
              10
          ) / 10
        : 0;

    const purchaseFunnel = buildFunnel(
      [
        { stage: "Homepage Visit", names: [ANALYTICS_EVENTS.PAGE_VIEW] },
        {
          stage: "Product Page",
          names: [ANALYTICS_EVENTS.PAGE_VIEW],
        },
        {
          stage: "Add to Cart",
          names: [ANALYTICS_EVENTS.ADD_TO_CART, ANALYTICS_EVENTS.CHECKOUT_INIT],
        },
        { stage: "Checkout", names: [ANALYTICS_EVENTS.CHECKOUT_INIT] },
        { stage: "Purchase", names: [ANALYTICS_EVENTS.PURCHASE] },
      ],
      todayEvents
    );

    // Refine product page count: page_view on /product
    const productViews = todayEvents.filter(
      (e) =>
        e.event_name === ANALYTICS_EVENTS.PAGE_VIEW &&
        (e.page?.includes("/product") ?? false)
    ).length;
    const homeViews = todayEvents.filter(
      (e) =>
        e.event_name === ANALYTICS_EVENTS.PAGE_VIEW &&
        (e.page === "/" || e.page === "")
    ).length;
    purchaseFunnel[0].count = homeViews || purchaseFunnel[0].count;
    purchaseFunnel[1].count = productViews;

    const lungFunnel = buildFunnel(
      [
        { stage: "Lung Test Start", names: [ANALYTICS_EVENTS.LUNG_TEST_START] },
        {
          stage: "Questions Complete",
          names: [ANALYTICS_EVENTS.LUNG_TEST_QUESTIONS_DONE],
        },
        {
          stage: "Result Viewed",
          names: [
            ANALYTICS_EVENTS.LUNG_RESULT_VIEW,
            ANALYTICS_EVENTS.LUNG_TEST_COMPLETE,
          ],
        },
        { stage: "Buy Now Clicked", names: [ANALYTICS_EVENTS.LUNG_BUY_CLICK] },
        { stage: "Purchase", names: [ANALYTICS_EVENTS.PURCHASE] },
      ],
      todayEvents
    );

    const paidEmails = new Set(
      orders
        .filter((o) => String(o.status).toLowerCase() === "paid" && o.email)
        .map((o) => String(o.email).toLowerCase())
    );

    return NextResponse.json({
      metrics: {
        liveVisitors: liveSessions.size,
        todayOrders: paidToday.length,
        todayRevenue,
        lungLeadsToday,
        lungConversionPct,
        avgRiskScore,
      },
      purchaseFunnel,
      lungFunnel,
      recentOrders: orders.map((o) => ({
        id: o.order_number || o.id,
        name: o.full_name,
        city: o.city,
        pack: o.pack_type,
        amount: o.amount,
        status: o.status,
        time: o.created_at,
      })),
      recentLeads: leads.map((l) => ({
        id: l.id,
        name: l.name,
        city: l.city ? "Yes" : "No",
        riskLevel: l.level,
        email: l.email,
        time: l.created_at,
        followUp: paidEmails.has(String(l.email || "").toLowerCase())
          ? "Converted"
          : "Pending",
      })),
      liveFeed: recentEvents.slice(0, 20).map((e) => ({
        id: e.id,
        event_name: e.event_name,
        city: e.city || "Unknown",
        page: e.page || "/",
        created_at: e.created_at,
      })),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load dashboard";
    console.error("[command-center]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
