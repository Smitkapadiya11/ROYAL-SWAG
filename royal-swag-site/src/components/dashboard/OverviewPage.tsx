"use client";

import useSWR from "swr";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function KpiCard({
  label,
  value,
  suffix,
  trend,
  color,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  trend?: number;
  color: string;
}) {
  return (
    <motion.div
      className="dashboard-card p-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tabular-nums" style={{ color }}>
        {value}
        {suffix}
      </p>
      {typeof trend === "number" ? (
        <p className="mt-1 text-xs text-[#9CA3AF]">
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs yesterday
        </p>
      ) : null}
    </motion.div>
  );
}

export default function OverviewPage() {
  const { data, isLoading } = useSWR("/api/dashboard/overview", fetcher, {
    refreshInterval: 30_000,
  });

  const kpis = data?.kpis;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dashboard-skeleton h-28" />
          ))
        ) : (
          <>
            <KpiCard
              label="Today's Visitors"
              value={kpis?.visitors_today ?? 0}
              color="#F0F0F0"
            />
            <KpiCard
              label="Today's Orders"
              value={kpis?.orders_today ?? 0}
              trend={
                kpis?.orders_yesterday
                  ? Math.round(
                      ((kpis.orders_today - kpis.orders_yesterday) /
                        kpis.orders_yesterday) *
                        100
                    )
                  : undefined
              }
              color="#10B981"
            />
            <KpiCard
              label="Today's Revenue"
              value={`₹${kpis?.revenue_today ?? 0}`}
              trend={
                kpis?.revenue_yesterday
                  ? Math.round(
                      ((kpis.revenue_today - kpis.revenue_yesterday) /
                        kpis.revenue_yesterday) *
                        100
                    )
                  : undefined
              }
              color="#F59E0B"
            />
            <KpiCard
              label="Conversion Rate"
              value={kpis?.conversion_rate ?? 0}
              suffix="%"
              color="#10B981"
            />
          </>
        )}
      </div>

      <div className="dashboard-card p-6">
        <h2 className="text-lg font-semibold">Live Analytics</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#9CA3AF]">
          Real-time activity feed, funnel charts, traffic sources, heatmaps, and
          customer journey maps are planned for the next phase. Basic KPIs above
          refresh every 30 seconds from your orders and events data.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-[#9CA3AF]">
          <li>🟢 Live visitor feed — Phase 2</li>
          <li>📉 Conversion funnel — Phase 2</li>
          <li>🗺️ Customer journey Sankey — Phase 2</li>
        </ul>
      </div>
    </div>
  );
}
