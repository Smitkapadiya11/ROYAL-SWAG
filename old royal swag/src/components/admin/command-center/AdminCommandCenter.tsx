"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { createClient } from "@supabase/supabase-js";
import AnimatedNumber from "./AnimatedNumber";
import { exportCSV } from "./export-csv";
import {
  eventActionLabel,
  eventColor,
  formatPagePath,
} from "@/lib/analytics-events";

import SessionAnalyticsDashboard from "./SessionAnalyticsDashboard";

type NavId =
  | "overview"
  | "live"
  | "analytics"
  | "orders"
  | "lung-tests"
  | "customers"
  | "revenue"
  | "settings";

type CommandCenterData = {
  metrics: {
    liveVisitors: number;
    todayOrders: number;
    todayRevenue: number;
    lungLeadsToday: number;
    lungConversionPct: number;
    avgRiskScore: number;
  };
  purchaseFunnel: { stage: string; count: number; dropPct: number }[];
  lungFunnel: { stage: string; count: number; dropPct: number }[];
  recentOrders: {
    id: string;
    name: string;
    city: string;
    pack: string;
    amount: number;
    status: string;
    time: string;
  }[];
  recentLeads: {
    id: string;
    name: string;
    city: string;
    riskLevel: string;
    email: string;
    time: string;
    followUp: string;
  }[];
  liveFeed: {
    id: string;
    event_name: string;
    city: string;
    page: string;
    created_at: string;
  }[];
};

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (r.status === 401) throw new Error("unauthorized");
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

const NAV: { id: NavId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "live", label: "Live Visitors" },
  { id: "analytics", label: "Session Analytics" },
  { id: "orders", label: "Orders" },
  { id: "lung-tests", label: "Lung Tests" },
  { id: "customers", label: "Customers" },
  { id: "revenue", label: "Revenue" },
  { id: "settings", label: "Settings" },
];

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-primary/10 bg-white/60 p-5 shadow-glass backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function RiskGauge({ score }: { score: number }) {
  const color =
    score <= 4 ? "#16a34a" : score <= 7 ? "#d97706" : "#dc2626";
  const pct = Math.min(score / 11, 1);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={88} height={88} viewBox="0 0 88 88">
        <circle
          cx={44}
          cy={44}
          r={36}
          fill="none"
          stroke="rgba(50,64,35,0.12)"
          strokeWidth={8}
        />
        <circle
          cx={44}
          cy={44}
          r={36}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
        />
      </svg>
      <AnimatedNumber
        value={score}
        className="text-xl font-bold text-primary"
      />
      <span className="text-xs text-primary/60">avg pts today</span>
    </div>
  );
}

function FunnelSection({
  title,
  data,
}: {
  title: string;
  data: { stage: string; count: number; dropPct: number }[];
}) {
  const chartData = data.map((d, i) => ({
    ...d,
    fill: `rgba(50, 64, 35, ${0.35 + (i / Math.max(data.length - 1, 1)) * 0.55})`,
  }));

  return (
    <GlassCard className="flex-1 min-w-[280px]">
      <h3 className="mb-4 font-display text-lg font-semibold text-primary">{title}</h3>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="stage"
              width={120}
              tick={{ fontSize: 11, fill: "#324023" }}
            />
            <Tooltip
              contentStyle={{
                background: "#F4EDD6",
                border: "1px solid rgba(50,64,35,0.15)",
                borderRadius: 8,
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 space-y-1 text-xs text-primary/70">
        {data.map((d) => (
          <li key={d.stage} className="flex justify-between gap-2">
            <span>{d.stage}</span>
            <span>
              {d.count}{" "}
              {d.dropPct > 0 && (
                <span className="text-red-600">↓{d.dropPct}%</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export default function AdminCommandCenter() {
  const router = useRouter();
  const [nav, setNav] = useState<NavId>("overview");
  const feedRef = useRef<HTMLDivElement>(null);
  const [liveFeed, setLiveFeed] = useState<CommandCenterData["liveFeed"]>([]);

  const { data, error, mutate, isLoading } = useSWR<CommandCenterData>(
    "/api/admin/command-center",
    fetcher,
    { refreshInterval: 30000 }
  );

  useEffect(() => {
    if (data?.liveFeed) setLiveFeed(data.liveFeed);
  }, [data?.liveFeed]);

  const refreshFeed = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/live-feed", { cache: "no-store" });
      if (!r.ok) return;
      const json = (await r.json()) as { events: CommandCenterData["liveFeed"] };
      if (json.events?.length) {
        setLiveFeed(json.events);
        if (feedRef.current) feedRef.current.scrollTop = 0;
      }
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    if (error instanceof Error && error.message === "unauthorized") {
      router.replace("/admin/login");
    }
  }, [error, router]);

  useEffect(() => {
    refreshFeed();
    const poll = setInterval(refreshFeed, 4000);
    return () => clearInterval(poll);
  }, [refreshFeed]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const sb = createClient(url, key);
    const channel = sb
      .channel("admin-events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
        (payload) => {
          const row = payload.new as CommandCenterData["liveFeed"][0];
          if (!row?.id) return;
          setLiveFeed((prev) => [row, ...prev.filter((e) => e.id !== row.id)].slice(0, 20));
          mutate();
          if (feedRef.current) feedRef.current.scrollTop = 0;
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [mutate]);

  const metrics = data?.metrics;
  const showOverview = nav === "overview" || nav === "revenue" || nav === "live";
  const showOrders = nav === "overview" || nav === "orders";
  const showLeads = nav === "overview" || nav === "lung-tests" || nav === "customers";

  const statusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "paid") return { bg: "rgba(22,163,74,0.15)", color: "#16a34a" };
    if (s === "pending") return { bg: "rgba(217,119,6,0.15)", color: "#d97706" };
    return { bg: "rgba(220,38,38,0.12)", color: "#dc2626" };
  };

  return (
    <div className="flex h-screen overflow-hidden bg-parchment font-body text-primary">
      <aside
        className="flex w-[240px] shrink-0 flex-col bg-primary text-parchment"
        style={{ backgroundColor: "#324023" }}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <p className="font-display text-lg font-bold">Royal Swag</p>
          <p className="text-xs text-parchment/60">Command Center</p>
        </div>
        <nav className="flex-1 py-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setNav(item.id)}
              className={`flex w-full items-center px-5 py-3 text-left text-sm transition ${
                nav === item.id
                  ? "border-l-[3px] border-gold bg-[rgba(154,111,26,0.2)] font-semibold text-parchment"
                  : "border-l-[3px] border-transparent text-parchment/75 hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            router.replace("/admin/login");
          }}
          className="m-4 rounded-xl border border-red-400/30 bg-red-950/30 py-2 text-sm text-red-200"
        >
          Sign out
        </button>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-primary/10 bg-parchment/80 px-6 py-4 backdrop-blur-md">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary">
              {NAV.find((n) => n.id === nav)?.label ?? "Overview"}
            </h1>
            <p className="text-sm text-primary/60">
              Real-time site intelligence · refreshes every 30s
            </p>
          </div>
          <button
            type="button"
            onClick={() => mutate()}
            className="rounded-xl border border-primary/20 bg-white/50 px-4 py-2 text-sm font-medium hover:bg-white"
          >
            Refresh
          </button>
        </header>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="min-w-0 flex-1 overflow-y-auto p-6">
            {isLoading && !data && (
              <p className="text-primary/60">Loading dashboard…</p>
            )}

            {nav === "analytics" && <SessionAnalyticsDashboard />}

            {nav === "settings" && (
              <GlassCard>
                <h3 className="font-display text-lg font-semibold">Settings</h3>
                <p className="mt-2 text-sm text-primary/70">
                  Configure env vars in Vercel: Supabase keys, Resend, Razorpay, MSG91.
                  Enable Realtime on the <code className="text-gold">events</code> table in
                  Supabase.
                </p>
              </GlassCard>
            )}

            {showOverview && metrics && (
              <>
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <GlassCard>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary/60">
                        Live Visitors
                      </span>
                    </div>
                    <AnimatedNumber
                      value={metrics.liveVisitors}
                      className="text-3xl font-bold text-primary"
                    />
                    <p className="mt-1 text-xs text-primary/50">Last 5 minutes</p>
                  </GlassCard>

                  <GlassCard>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary/60">
                      Today&apos;s Orders
                    </p>
                    <AnimatedNumber
                      value={metrics.todayOrders}
                      className="mt-2 text-3xl font-bold text-primary"
                    />
                    <p className="mt-1 text-sm text-gold">
                      ₹
                      <AnimatedNumber value={metrics.todayRevenue} />
                    </p>
                  </GlassCard>

                  <GlassCard>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary/60">
                      Lung Test Leads Today
                    </p>
                    <AnimatedNumber
                      value={metrics.lungLeadsToday}
                      className="mt-2 text-3xl font-bold text-primary"
                    />
                    <p className="mt-1 text-sm text-primary/70">
                      <AnimatedNumber value={metrics.lungConversionPct} />% conversion
                    </p>
                  </GlassCard>

                  <GlassCard className="flex items-center justify-center">
                    <div>
                      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-primary/60">
                        Avg Risk Score
                      </p>
                      <RiskGauge score={metrics.avgRiskScore} />
                    </div>
                  </GlassCard>
                </div>

                {(nav === "overview" || nav === "live") && (
                  <div className="mb-6 flex flex-col gap-6 xl:flex-row">
                    <div className="flex flex-1 flex-col gap-6">
                      <div className="flex flex-col gap-6 lg:flex-row">
                        {data?.purchaseFunnel && (
                          <FunnelSection
                            title="Purchase funnel (today)"
                            data={data.purchaseFunnel}
                          />
                        )}
                        {data?.lungFunnel && (
                          <FunnelSection title="Lung test funnel (today)" data={data.lungFunnel} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {showOrders && data?.recentOrders && (
              <GlassCard className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">Recent Orders</h3>
                  <button
                    type="button"
                    onClick={() =>
                      exportCSV(data.recentOrders, `orders-${Date.now()}.csv`)
                    }
                    className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold"
                  >
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-primary/10 text-xs uppercase text-primary/50">
                        <th className="pb-2 pr-3">Order ID</th>
                        <th className="pb-2 pr-3">Name</th>
                        <th className="pb-2 pr-3">City</th>
                        <th className="pb-2 pr-3">Pack</th>
                        <th className="pb-2 pr-3">Amount</th>
                        <th className="pb-2 pr-3">Status</th>
                        <th className="pb-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentOrders.map((o) => {
                        const st = statusStyle(o.status);
                        return (
                          <tr key={o.id} className="border-b border-primary/5">
                            <td className="py-2.5 pr-3 font-mono text-xs">{o.id}</td>
                            <td className="py-2.5 pr-3">{o.name}</td>
                            <td className="py-2.5 pr-3">{o.city}</td>
                            <td className="py-2.5 pr-3">{o.pack}</td>
                            <td className="py-2.5 pr-3">₹{o.amount}</td>
                            <td className="py-2.5 pr-3">
                              <span
                                className="rounded-full px-2 py-0.5 text-xs font-bold"
                                style={{ background: st.bg, color: st.color }}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-xs text-primary/60">
                              {timeAgo(o.time)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {showLeads && data?.recentLeads && (
              <GlassCard>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">Recent Lung Test Leads</h3>
                  <button
                    type="button"
                    onClick={() =>
                      exportCSV(data.recentLeads, `lung-leads-${Date.now()}.csv`)
                    }
                    className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold"
                  >
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-primary/10 text-xs uppercase text-primary/50">
                        <th className="pb-2 pr-3">Name</th>
                        <th className="pb-2 pr-3">Pollution</th>
                        <th className="pb-2 pr-3">Risk</th>
                        <th className="pb-2 pr-3">Email</th>
                        <th className="pb-2 pr-3">Follow-up</th>
                        <th className="pb-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentLeads.map((l) => (
                        <tr key={l.id} className="border-b border-primary/5">
                          <td className="py-2.5 pr-3">{l.name}</td>
                          <td className="py-2.5 pr-3">{l.city}</td>
                          <td className="py-2.5 pr-3">
                            <span
                              className="rounded-full px-2 py-0.5 text-xs font-bold"
                              style={{
                                background:
                                  l.riskLevel === "High"
                                    ? "rgba(220,38,38,0.12)"
                                    : l.riskLevel === "Moderate"
                                      ? "rgba(217,119,6,0.15)"
                                      : "rgba(22,163,74,0.15)",
                                color:
                                  l.riskLevel === "High"
                                    ? "#dc2626"
                                    : l.riskLevel === "Moderate"
                                      ? "#d97706"
                                      : "#16a34a",
                              }}
                            >
                              {l.riskLevel}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 text-xs">{l.email}</td>
                          <td className="py-2.5 pr-3">{l.followUp}</td>
                          <td className="py-2.5 text-xs text-primary/60">
                            {timeAgo(l.time)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </div>

          {(nav === "overview" || nav === "live") && (
            <aside className="hidden w-[300px] shrink-0 flex-col border-l border-primary/10 bg-parchment/50 lg:flex">
              <div className="border-b border-primary/10 px-4 py-3">
                <h2 className="text-sm font-bold uppercase tracking-wide text-primary">
                  Live visitor feed
                </h2>
              </div>
              <div
                ref={feedRef}
                className="flex-1 overflow-y-auto px-3 py-2"
              >
                {liveFeed.length === 0 && (
                  <p className="p-4 text-center text-xs text-primary/50">
                    Waiting for events…
                  </p>
                )}
                {liveFeed.map((e) => (
                  <div
                    key={e.id}
                    className="mb-2 rounded-xl border border-primary/8 bg-white/40 px-3 py-2.5 text-xs"
                  >
                    <p className="text-primary/50">{timeAgo(e.created_at)}</p>
                    <p className="mt-1 font-medium text-primary">
                      {e.city} · {formatPagePath(e.page)}
                    </p>
                    <p
                      className="mt-0.5 font-semibold"
                      style={{ color: eventColor(e.event_name) }}
                    >
                      {eventActionLabel(e.event_name)}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
