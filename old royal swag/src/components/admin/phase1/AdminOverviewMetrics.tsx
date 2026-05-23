"use client";

import useSWR from "swr";

type Lead = { risk_level: string; created_at: string };
type Order = { status: string; amount: number };

const leadsFetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error("Failed to load leads");
    return r.json() as Promise<{ leads: Lead[] }>;
  });

const ordersFetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error("Failed to load orders");
    return r.json() as Promise<{ orders: Order[] }>;
  });

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
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
      <div className="glass-card flex flex-col justify-between rounded-xl p-6 md:col-span-3">
        <div className="flex items-start justify-between">
          <p className="font-sans text-sm font-semibold text-[#45483f]">Total Leads</p>
          <span className="text-xl text-[#9A6F1A]" aria-hidden>
            🫁
          </span>
        </div>
        <div className="mt-4">
          <p className="font-number text-[36px] font-bold text-[#495738]">
            {leads.length}
          </p>
          <p className="mt-1 flex items-center gap-1 font-sans text-xs text-green-700">
            ↑ {todayLeads} today
          </p>
        </div>
      </div>

      <div className="glass-card flex flex-col justify-between rounded-xl p-6 md:col-span-3">
        <div className="flex items-start justify-between">
          <p className="font-sans text-sm font-semibold text-[#45483f]">High Risk</p>
          <span className="text-xl text-red-500" aria-hidden>
            ⚠
          </span>
        </div>
        <div className="mt-4">
          <p className="font-number text-[36px] font-bold text-red-600">
            {highRiskCount}
          </p>
          <p className="mt-1 font-sans text-xs text-[#45483f]">Needs follow-up</p>
        </div>
      </div>

      <div className="glass-card flex flex-col justify-between rounded-xl p-6 md:col-span-3">
        <div className="flex items-start justify-between">
          <p className="font-sans text-sm font-semibold text-[#45483f]">Total Orders</p>
          <span className="text-xl text-[#9A6F1A]" aria-hidden>
            🛍
          </span>
        </div>
        <div className="mt-4">
          <p className="font-number text-[36px] font-bold text-[#495738]">
            {orders.length}
          </p>
          <p className="mt-1 font-sans text-xs text-[#45483f]">
            {pendingOrders} pending fulfillment
          </p>
        </div>
      </div>

      <div className="glass-card flex flex-col justify-between rounded-xl border-[#9A6F1A]/20 bg-[#9A6F1A]/5 p-6 md:col-span-3">
        <div className="flex items-start justify-between">
          <p className="font-sans text-sm font-semibold text-[#45483f]">
            Total Revenue
          </p>
          <span className="text-xl text-[#9A6F1A]" aria-hidden>
            ₹
          </span>
        </div>
        <div className="mt-4">
          <p className="font-number text-[36px] font-bold text-[#9A6F1A]">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 font-sans text-xs text-[#45483f]">
            Excl. cancelled orders
          </p>
        </div>
      </div>
    </div>
  );
}
