"use client";

import { useMemo, useRef, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import MetricCard from "./MetricCard";
import { csvDateFilename, downloadCsv } from "@/lib/admin/export-csv";
import {
  ORDER_STATUS_OPTIONS,
  labelToDbStatus,
  statusBadgeClass,
  type OrderStatusLabel,
} from "@/lib/admin/order-status";
import { printLabel, printLabelsBulk } from "@/lib/admin/shipping-label";
import ShippingLabel, {
  downloadLabelPng,
  type ShippingLabelOrder,
} from "@/components/ShippingLabel";
import { cn } from "@/lib/utils";

type Order = {
  id: string;
  order_id: string;
  customer_name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  pack: string;
  amount: number;
  status: OrderStatusLabel;
  status_db: string;
  created_at: string;
};

const PAGE_SIZE = 20;

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error("Failed to load orders");
    return r.json() as Promise<{ orders: Order[] }>;
  });

export default function OrdersSection() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/phase1/orders",
    fetcher
  );
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [downloadOrder, setDownloadOrder] = useState<ShippingLabelOrder | null>(
    null
  );
  const captureRef = useRef<HTMLDivElement>(null);

  const orders = data?.orders ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      const t = new Date(o.created_at).getTime();
      if (dateFrom && t < new Date(dateFrom).setHours(0, 0, 0, 0)) return false;
      if (dateTo && t > new Date(dateTo).setHours(23, 59, 59, 999)) return false;
      if (!q) return true;
      return (
        o.order_id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.mobile.includes(q) ||
        o.pincode.includes(q)
      );
    });
  }, [orders, search, dateFrom, dateTo, statusFilter]);

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== "Cancelled");
    const revenue = active.reduce((sum, o) => sum + (o.amount || 0), 0);
    const pending = orders.filter((o) => o.status === "Pending").length;
    return { total: orders.length, revenue, pending };
  }, [orders]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const toLabelOrder = (o: Order): ShippingLabelOrder => ({
    order_id: o.order_id,
    customer_name: o.customer_name,
    mobile: o.mobile,
    address: o.address,
    city: o.city,
    state: o.state,
    pincode: o.pincode,
    pack: o.pack,
    amount: o.amount,
    created_at: o.created_at,
  });

  const updateStatus = async (id: string, label: OrderStatusLabel) => {
    setEditingId(null);
    const db = labelToDbStatus(label);
    const res = await fetch("/api/admin/phase1/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: db }),
    });
    if (!res.ok) {
      toast.error("Failed to update status");
      return;
    }
    toast.success(`Status updated to ${label}`);
    mutate();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllPage = () => {
    const ids = pageRows.map((o) => o.id);
    const allOnPage = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPage) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const exportCsv = () => {
    const rows: string[][] = [
      [
        "Order ID",
        "Name",
        "Mobile",
        "Address",
        "City",
        "Pincode",
        "Pack",
        "Amount (₹)",
        "Status",
        "Date",
      ],
      ...filtered.map((o) => [
        o.order_id,
        o.customer_name,
        o.mobile,
        o.address,
        o.city,
        o.pincode,
        o.pack,
        String(o.amount),
        o.status,
        o.created_at,
      ]),
    ];
    downloadCsv(rows, csvDateFilename("orders"));
  };

  const handleDownloadLabel = async (order: Order) => {
    setDownloadOrder(toLabelOrder(order));
    requestAnimationFrame(async () => {
      if (!captureRef.current) return;
      await downloadLabelPng(captureRef.current, order.order_id);
      setDownloadOrder(null);
    });
  };

  const bulkPrint = () => {
    const list = orders.filter((o) => selected.has(o.id)).map(toLabelOrder);
    if (list.length === 0) {
      toast.error("Select at least one order");
      return;
    }
    printLabelsBulk(list);
  };

  const inputClass =
    "rounded-lg border border-primary/15 bg-white/70 px-3 py-2 font-body text-sm text-primary outline-none focus:border-primary/40";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Total Orders" value={stats.total} />
        <MetricCard
          label="Total Revenue"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
        />
        <MetricCard label="Pending Orders" value={stats.pending} />
      </div>

      <div className="glass-card flex flex-wrap items-end gap-3 rounded-2xl p-4">
        <label className="flex min-w-[180px] flex-1 flex-col gap-1 font-body text-xs text-on-surface-variant">
          Search
          <input
            type="search"
            placeholder="Order ID, name, mobile, pincode…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 font-body text-xs text-on-surface-variant">
          From
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(0);
            }}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 font-body text-xs text-on-surface-variant">
          To
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(0);
            }}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 font-body text-xs text-on-surface-variant">
          Status
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className={inputClass}
          >
            <option value="all">All</option>
            {ORDER_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={exportCsv} className="btn-primary">
          Download Orders CSV
        </button>
        <button
          type="button"
          onClick={bulkPrint}
          className="rounded-xl border border-primary/25 bg-white/50 px-4 py-2 font-body text-sm font-semibold text-primary hover:bg-white/80"
        >
          Print Selected Labels
        </button>
      </div>

      {isLoading && (
        <p className="font-body text-sm text-on-surface-variant">Loading orders…</p>
      )}
      {error && (
        <p className="font-body text-sm text-red-700">Could not load orders.</p>
      )}

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead>
              <tr className="bg-primary font-body text-xs uppercase tracking-wide text-white">
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={
                      pageRows.length > 0 &&
                      pageRows.every((o) => selected.has(o.id))
                    }
                    onChange={toggleAllPage}
                    aria-label="Select all on page"
                  />
                </th>
                <th className="px-3 py-3">Order ID</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Mobile</th>
                <th className="px-3 py-3">Address</th>
                <th className="px-3 py-3">City</th>
                <th className="px-3 py-3">Pincode</th>
                <th className="px-3 py-3">Pack</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Label</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-white/50 font-body text-sm text-primary transition-colors hover:bg-white/60"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(o.id)}
                      onChange={() => toggleSelect(o.id)}
                      aria-label={`Select ${o.order_id}`}
                    />
                  </td>
                  <td className="px-3 py-3 font-medium">{o.order_id}</td>
                  <td className="px-3 py-3">{o.customer_name}</td>
                  <td className="px-3 py-3">{o.mobile}</td>
                  <td className="max-w-[160px] truncate px-3 py-3" title={o.address}>
                    {o.address}
                  </td>
                  <td className="px-3 py-3">{o.city}</td>
                  <td className="px-3 py-3">{o.pincode}</td>
                  <td className="px-3 py-3">{o.pack}</td>
                  <td className="px-3 py-3">₹{o.amount}</td>
                  <td className="px-3 py-3">
                    {editingId === o.id ? (
                      <select
                        autoFocus
                        defaultValue={o.status}
                        onBlur={() => setEditingId(null)}
                        onChange={(e) =>
                          updateStatus(o.id, e.target.value as OrderStatusLabel)
                        }
                        className="rounded border border-primary/20 bg-white px-2 py-1 text-xs"
                      >
                        {ORDER_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingId(o.id)}
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          statusBadgeClass(o.status)
                        )}
                      >
                        {o.status}
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3 text-on-surface-variant">
                    {new Date(o.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => printLabel(toLabelOrder(o))}
                        className="rounded border border-primary/20 px-2 py-1 text-[11px] hover:bg-white/80"
                      >
                        Print Label
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadLabel(o)}
                        className="rounded border border-primary/20 px-2 py-1 text-[11px] hover:bg-white/80"
                      >
                        Download Label
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-8 text-center text-on-surface-variant"
                  >
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-white/50 px-4 py-3 font-body text-sm">
          <span className="text-on-surface-variant">
            {filtered.length} order{filtered.length === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-primary/20 px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 py-1 text-on-surface-variant">
              {page + 1} / {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-primary/20 px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {downloadOrder && (
        <div className="pointer-events-none fixed -left-[9999px] top-0">
          <ShippingLabel order={downloadOrder} captureRef={captureRef} />
        </div>
      )}
    </div>
  );
}
