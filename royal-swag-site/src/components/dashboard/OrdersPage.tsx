"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { csvDateFilename, downloadCsv } from "@/lib/admin/export-csv";

type Order = {
  id: string;
  order_id: string;
  full_name: string;
  mobile: string;
  amount: number;
  status: string;
  created_at: string;
  pack: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function OrdersPage() {
  const [status, setStatus] = useState("all");
  const { data, isLoading, mutate } = useSWR(
    `/api/dashboard/orders?status=${status}`,
    fetcher
  );

  const orders: Order[] = data?.orders ?? [];

  const exportCsv = () => {
    if (!orders.length) return;
    downloadCsv(
      [
        ["Order ID", "Customer", "Phone", "Amount", "Status", "Date", "Pack"],
        ...orders.map((o) => [
          o.order_id,
          o.full_name,
          o.mobile,
          String(o.amount),
          o.status,
          o.created_at,
          o.pack,
        ]),
      ],
      csvDateFilename("orders")
    );
  };

  const updateStatus = async (id: string, next: string) => {
    const res = await fetch("/api/dashboard/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    if (!res.ok) {
      toast.error("Could not update status");
      return;
    }
    toast.success("Order updated");
    void mutate();
  };

  const filtered = useMemo(() => orders, [orders]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="dashboard-input w-auto"
        >
          <option value="all">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button type="button" className="dashboard-btn" onClick={exportCsv}>
          Export CSV
        </button>
      </div>

      <div className="dashboard-card overflow-x-auto p-4">
        {isLoading ? (
          <div className="dashboard-skeleton h-40" />
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#9CA3AF]">
            No orders yet — share your product page!
          </p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs">{o.order_id}</td>
                  <td>{o.full_name}</td>
                  <td>{o.mobile}</td>
                  <td className="text-[#F59E0B]">₹{o.amount}</td>
                  <td>{o.status}</td>
                  <td>{new Date(o.created_at).toLocaleString("en-IN")}</td>
                  <td>
                    <select
                      className="dashboard-input w-auto text-xs"
                      value={o.status}
                      onChange={(e) => void updateStatus(o.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
