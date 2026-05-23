"use client";

import { useMemo, useRef, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
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

const inputClass =
  "rounded-xl border border-[#324023]/30 bg-[#F4EDD6] px-4 py-2 font-sans text-sm text-[#171e11] placeholder:text-[#75786e] focus:border-[#9A6F1A] focus:outline-none focus:ring-2 focus:ring-[#9A6F1A]/20";

const toastStyle = {
  duration: 3000 as const,
  style: {
    background: "#324023",
    color: "#fff",
    borderRadius: "12px",
    fontWeight: 600,
  },
};

const toastErrorStyle = {
  duration: 4000 as const,
  style: {
    background: "#b91c1c",
    color: "#fff",
    borderRadius: "12px",
    fontWeight: 600,
  },
};

export default function OrdersSection() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/phase1/orders",
    fetcher
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [downloadOrder, setDownloadOrder] = useState<ShippingLabelOrder | null>(
    null
  );
  const captureRef = useRef<HTMLDivElement>(null);

  const orders = data?.orders ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.order_id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.mobile.includes(q) ||
        o.pincode.includes(q)
      );
    });
  }, [orders, search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

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
    const db = labelToDbStatus(label);
    const res = await fetch("/api/admin/phase1/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: db }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(
        (body as { error?: string }).error || "Failed to update status",
        toastErrorStyle
      );
      return;
    }
    toast.success(`Status updated to ${label}`, toastStyle);
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

  const toggleAllFiltered = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(filtered.map((o) => o.id)));
    } else {
      setSelected(new Set());
    }
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
    toast.success("CSV downloaded", toastStyle);
  };

  const handleDownloadLabel = async (order: Order) => {
    setDownloadOrder(toLabelOrder(order));
    requestAnimationFrame(async () => {
      if (!captureRef.current) return;
      try {
        await downloadLabelPng(captureRef.current, order.order_id);
        toast.success("Label downloaded", toastStyle);
      } catch {
        toast.error("Failed to download label", toastErrorStyle);
      } finally {
        setDownloadOrder(null);
      }
    });
  };

  const bulkPrint = () => {
    const list = orders.filter((o) => selected.has(o.id)).map(toLabelOrder);
    if (list.length === 0) {
      toast.error("Select at least one order", toastErrorStyle);
      return;
    }
    printLabelsBulk(list);
  };

  const selectedCount = selected.size;

  return (
    <div className="glass-card mb-6 overflow-hidden rounded-xl">
      <div className="flex flex-col gap-4 border-b border-[rgba(255,255,255,0.6)] bg-white/20 p-6 md:flex-row md:items-center md:justify-between">
        <h3 className="font-display text-2xl font-semibold text-[#324023]">Orders</h3>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Order ID, name, mobile, pincode..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className={cn(inputClass, "w-64")}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="all">All Status</option>
            {ORDER_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-xl bg-[#324023] px-4 py-2 font-sans text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            ⬇ Download CSV
          </button>
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={bulkPrint}
              className="flex items-center gap-2 rounded-xl bg-[#9A6F1A] px-4 py-2 font-sans text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            >
              🖨 Print {selectedCount} Labels
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <p className="p-6 font-sans text-sm text-[#45483f]">Loading orders…</p>
      )}
      {error && (
        <p className="p-6 font-sans text-sm text-red-700">Could not load orders.</p>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.6)] bg-white/10 font-sans text-xs font-semibold uppercase tracking-wider text-[#45483f]">
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={
                    filtered.length > 0 &&
                    filtered.every((o) => selected.has(o.id))
                  }
                  onChange={(e) => toggleAllFiltered(e.target.checked)}
                  className="accent-[#324023]"
                  aria-label="Select all filtered orders"
                />
              </th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Pack</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-sans text-sm">
            {pageRows.map((o) => (
              <tr
                key={o.id}
                className="border-b border-[rgba(255,255,255,0.6)] transition-colors hover:bg-white/30"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.has(o.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected((prev) => new Set(prev).add(o.id));
                      } else {
                        setSelected((prev) => {
                          const next = new Set(prev);
                          next.delete(o.id);
                          return next;
                        });
                      }
                    }}
                    className="accent-[#324023]"
                    aria-label={`Select ${o.order_id}`}
                  />
                </td>
                <td className="p-4 font-mono text-xs font-semibold text-[#324023]">
                  {o.order_id}
                </td>
                <td className="p-4">
                  <p className="font-medium text-[#324023]">{o.customer_name}</p>
                  <p className="text-xs text-[#45483f]">{o.mobile}</p>
                </td>
                <td className="p-4 text-[#45483f]">{o.pack}</td>
                <td className="p-4 font-semibold text-[#324023]">₹{o.amount}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) =>
                      updateStatus(o.id, e.target.value as OrderStatusLabel)
                    }
                    className={cn(
                      "cursor-pointer rounded-full border-0 px-2 py-1 text-xs font-semibold focus:outline-none",
                      statusBadgeClass(o.status)
                    )}
                  >
                    {ORDER_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-xs text-[#45483f]">
                  {new Date(o.created_at).toLocaleDateString("en-IN")}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => printLabel(toLabelOrder(o))}
                      className="rounded-lg px-2 py-1 font-sans text-xs text-[#324023] transition-colors hover:bg-white/50 hover:text-[#9A6F1A]"
                    >
                      🖨 Print
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadLabel(o)}
                      className="rounded-lg px-2 py-1 font-sans text-xs text-[#324023] transition-colors hover:bg-white/50 hover:text-[#9A6F1A]"
                    >
                      ⬇ PNG
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-8 text-center font-sans text-sm text-[#45483f]"
                >
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.6)] bg-white/10 p-4">
        <span className="font-sans text-xs text-[#45483f]">
          {filtered.length} order{filtered.length === 1 ? "" : "s"}
          {selectedCount > 0 ? ` · ${selectedCount} selected` : ""}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-[rgba(255,255,255,0.6)] bg-white/30 px-3 py-1 font-sans text-sm text-[#324023] transition-colors hover:bg-white/50 disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            type="button"
            disabled={safePage * PAGE_SIZE >= filtered.length}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-[rgba(255,255,255,0.6)] bg-white/30 px-3 py-1 font-sans text-sm text-[#324023] transition-colors hover:bg-white/50 disabled:opacity-40"
          >
            Next →
          </button>
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
