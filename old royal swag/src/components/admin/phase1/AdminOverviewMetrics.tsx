"use client";

import useSWR from "swr";

type Lead = { risk_level: string; created_at: string };
type Order = { status: string; amount: number };

const leadsFetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  const json = (await r.json().catch(() => ({}))) as {
    leads?: Lead[];
    error?: string;
  };
  if (!r.ok) {
    throw new Error(json.error || "Failed to load leads");
  }
  return { leads: json.leads ?? [] };
};

const ordersFetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  const json = (await r.json().catch(() => ({}))) as {
    orders?: Order[];
    error?: string;
  };
  if (!r.ok) {
    throw new Error(json.error || "Failed to load orders");
  }
  return { orders: json.orders ?? [] };
};

function MetricCard({
  label,
  value,
  sub,
  subColor,
  icon,
  highlight = false,
  gold = false,
}: {
  label: string;
  value: string | number;
  sub: string;
  subColor: string;
  icon: string;
  highlight?: boolean;
  gold?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        gold
          ? "border-[#9A6F1A]/20 bg-[#9A6F1A]/5"
          : highlight
            ? "border-red-200/50 bg-red-50/50"
            : "border-[rgba(200,210,190,0.5)] bg-white/50"
      }`}
      style={{ backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-start justify-between">
        <p className="font-sans text-sm font-medium text-[#45483f]">{label}</p>
        <span className="text-xl" aria-hidden>
          {icon}
        </span>
      </div>
      <p
        className={`font-display text-4xl font-bold ${gold ? "text-[#9A6F1A]" : "text-[#324023]"}`}
      >
        {value}
      </p>
      <p className={`font-sans text-xs ${subColor}`}>{sub}</p>
    </div>
  );
}

export default function AdminOverviewMetrics() {
  const { data: leadsData } = useSWR("/api/admin/phase1/leads", leadsFetcher);
  const { data: ordersData } = useSWR("/api/admin/phase1/orders", ordersFetcher);

  const leads = leadsData?.leads ?? [];
  const orders = ordersData?.orders ?? [];

  const todayStart = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();

  const todayLeads = leads.filter(
    (l) => new Date(l.created_at).getTime() >= todayStart
  ).length;

  const highRiskCount = leads.filter(
    (l) => l.risk_level.toLowerCase() === "high"
  ).length;

  const activeOrders = orders.filter(
    (o) => o.status.toLowerCase() !== "cancelled"
  );
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const pendingOrders = orders.filter(
    (o) => o.status.toLowerCase() === "pending"
  ).length;

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Total Leads"
        value={leads.length}
        sub={`+${todayLeads} today`}
        subColor="text-green-700"
        icon="🫁"
      />
      <MetricCard
        label="High Risk"
        value={highRiskCount}
        sub="Needs follow-up"
        subColor="text-red-600"
        icon="⚠️"
        highlight={highRiskCount > 0}
      />
      <MetricCard
        label="Total Orders"
        value={orders.length}
        sub={`${pendingOrders} pending`}
        subColor="text-amber-700"
        icon="🛍️"
      />
      <MetricCard
        label="Total Revenue"
        value={`₹${totalRevenue.toLocaleString("en-IN")}`}
        sub="Excl. cancelled"
        subColor="text-[#45483f]"
        icon="₹"
        gold
      />
    </div>
  );
}
