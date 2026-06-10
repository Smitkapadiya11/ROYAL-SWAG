"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { exportCSV } from "./export-csv";

type AnalyticsData = {
  filters: {
    dateFrom: string;
    dateTo: string;
    device: string;
    source: string;
    pack: string;
  };
  sources: string[];
  packs: string[];
  funnel: { stage: string; count: number; dropPct: number }[];
  funnelToday: { stage: string; count: number; dropPct: number }[];
  sankeyLinks: { from: string; to: string; value: number }[];
  sankeyLinksToday: { from: string; to: string; value: number }[];
  exitPages: { page: string; count: number }[];
  deviceSplit: { name: string; value: number }[];
  trafficSources: { source: string; sessions: number; events: number }[];
  cityOrders: { city: string; orders: number }[];
  peakHours: { hour: number; orders: number }[];
};

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

const PIE_COLORS = ["#324023", "#9A6F1A", "#5C946E", "#16a34a"];

function GlassCard({
  children,
  className = "",
  title,
  exportRows,
  exportName,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  exportRows?: Record<string, unknown>[];
  exportName?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-primary/10 bg-white/60 p-5 shadow-glass backdrop-blur-xl ${className}`}
    >
      {(title || exportRows) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title && (
            <h3 className="font-display text-base font-semibold text-primary">{title}</h3>
          )}
          {exportRows && exportName && (
            <button
              type="button"
              onClick={() => exportCSV(exportRows, exportName)}
              className="shrink-0 rounded-lg border border-gold/40 bg-gold/10 px-2 py-1 text-xs font-semibold text-gold"
            >
              Export CSV
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function SankeyFlow({
  funnel,
  links,
}: {
  funnel: { stage: string; count: number; dropPct: number }[];
  links: { from: string; to: string; value: number }[];
}) {
  const max = Math.max(...funnel.map((f) => f.count), 1);

  return (
    <div className="space-y-3">
      {funnel.map((stage, i) => {
        const widthPct = Math.max(8, (stage.count / max) * 100);
        const link = links.find((l) => l.from === stage.stage);
        return (
          <div key={stage.stage}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-primary">{stage.stage}</span>
              <span className="text-primary/70">
                {stage.count}
                {stage.dropPct > 0 && (
                  <span className="ml-2 text-red-600">↓{stage.dropPct}%</span>
                )}
              </span>
            </div>
            <div
              className="h-10 rounded-lg transition-all duration-700"
              style={{
                width: `${widthPct}%`,
                background: `linear-gradient(90deg, rgba(50,64,35,${0.35 + (i / funnel.length) * 0.5}) 0%, #324023 100%)`,
              }}
            />
            {link && i < funnel.length - 1 && (
              <div className="ml-4 h-4 border-l-2 border-dashed border-gold/40" aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SessionAnalyticsDashboard() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }, []);

  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [device, setDevice] = useState("all");
  const [source, setSource] = useState("all");
  const [pack, setPack] = useState("all");

  const query = useMemo(() => {
    const from = new Date(dateFrom);
    from.setHours(0, 0, 0, 0);
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    const p = new URLSearchParams({
      dateFrom: from.toISOString(),
      dateTo: to.toISOString(),
      device,
      source,
      pack,
    });
    return `/api/admin/session-analytics?${p}`;
  }, [dateFrom, dateTo, device, source, pack]);

  const { data, error, isLoading, mutate } = useSWR<AnalyticsData>(query, fetcher, {
    refreshInterval: 30000,
  });

  const selectClass =
    "rounded-lg border border-primary/15 bg-white/80 px-3 py-2 text-sm text-primary";

  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="mb-4 font-display text-xl font-bold text-primary">
          Session analytics filters
        </h2>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs text-primary/60">
            From
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={selectClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-primary/60">
            To
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={selectClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-primary/60">
            Device
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className={selectClass}
            >
              <option value="all">All devices</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-primary/60">
            Source
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={selectClass}
            >
              {(data?.sources ?? ["all"]).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-primary/60">
            Pack
            <select value={pack} onChange={(e) => setPack(e.target.value)} className={selectClass}>
              {(data?.packs ?? ["all"]).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => mutate()}
            className="self-end rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-parchment"
          >
            Apply
          </button>
        </div>
      </GlassCard>

      {isLoading && <p className="text-sm text-primary/60">Loading analytics…</p>}
      {error && <p className="text-sm text-red-700">Failed to load analytics.</p>}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <GlassCard
              title={`Today's funnel drop-off (${today})`}
              exportRows={data.funnelToday}
              exportName={`funnel-today-${dateTo}.csv`}
            >
              <SankeyFlow
                funnel={data.funnelToday}
                links={data.sankeyLinksToday ?? data.sankeyLinks}
              />
            </GlassCard>

            <GlassCard
              title="Top exit pages"
              exportRows={data.exitPages}
              exportName={`exit-pages-${dateTo}.csv`}
            >
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.exitPages} layout="vertical" margin={{ left: 8 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="page"
                      width={100}
                      tick={{ fontSize: 10, fill: "#324023" }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#324023" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <GlassCard title="Device split">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.deviceSplit}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {data.deviceSplit.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard
              title="City heatmap (orders)"
              exportRows={data.cityOrders}
              exportName={`cities-${dateTo}.csv`}
              className="md:col-span-2"
            >
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.cityOrders}>
                    <XAxis dataKey="city" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#9A6F1A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <GlassCard
              title="Traffic sources (UTM)"
              exportRows={data.trafficSources}
              exportName={`sources-${dateTo}.csv`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-primary/10 text-xs uppercase text-primary/50">
                      <th className="pb-2 pr-3">Source</th>
                      <th className="pb-2 pr-3">Sessions</th>
                      <th className="pb-2">Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.trafficSources.map((row) => (
                      <tr key={row.source} className="border-b border-primary/5">
                        <td className="py-2 pr-3 font-medium">{row.source}</td>
                        <td className="py-2 pr-3">{row.sessions}</td>
                        <td className="py-2">{row.events}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            <GlassCard
              title="Peak hours — orders (last 7 days)"
              exportRows={data.peakHours.map((h) => ({
                hour: `${h.hour}:00`,
                orders: h.orders,
              }))}
              exportName={`peak-hours-${dateTo}.csv`}
            >
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.peakHours}>
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(h) => `${h}h`}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip labelFormatter={(h) => `${h}:00`} />
                    <Bar dataKey="orders" fill="#324023" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <GlassCard
            title="Full-period purchase funnel"
            exportRows={data.funnel}
            exportName={`funnel-${dateFrom}-${dateTo}.csv`}
          >
            <SankeyFlow funnel={data.funnel} links={data.sankeyLinks} />
          </GlassCard>
        </>
      )}
    </div>
  );
}
