"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { format } from "date-fns";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import type { LabelOrder } from "@/components/BarcodeLabel";

const BarcodeLabel = dynamic(() => import("./BarcodeLabel"), { ssr: false });

const STATUS_OPTIONS = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"] as const;
const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  paid: "#3B82F6",
  processing: "#8B5CF6",
  shipped: "#F97316",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

export type AdminOrderRow = LabelOrder & {
  status: string;
  payment_id: string | null;
  updated_at?: string;
};

export type AdminProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

interface Props {
  orders: AdminOrderRow[];
  profiles: AdminProfileRow[];
}

export default function AdminDashboard({ orders: initialOrders, profiles }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [tab, setTab] = useState<"orders" | "customers">("orders");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [printOrder, setPrintOrder] = useState<AdminOrderRow | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current, { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" });
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.full_name?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      o.order_number?.toLowerCase().includes(q) ||
      o.city?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: orders.length,
    revenue: orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.amount, 0),
    paid: orders.filter((o) => o.status === "paid").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
  };

  const exportCSV = () => {
    const csv = Papa.unparse(
      filtered.map((o) => ({
        "Order #": o.order_number,
        Name: o.full_name,
        Phone: o.phone,
        Email: o.email || "",
        Pack: o.pack_type,
        Amount: o.amount,
        Status: o.status,
        City: o.city,
        State: o.state,
        Pincode: o.pincode,
        Address: o.address_line1 + (o.address_line2 ? ", " + o.address_line2 : ""),
        "Payment ID": o.payment_id || "",
        Date: format(new Date(o.created_at), "dd/MM/yyyy HH:mm"),
      }))
    );
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "royalswag_orders_" + format(new Date(), "ddMMyyyy") + ".csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    if (error) {
      toast.error("Update failed");
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    toast.success("Status updated");
  };

  return (
    <div ref={ref} style={{ paddingTop: 80, minHeight: "100vh", background: "#F4F6F4" }}>
      <div className="w" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair-display)", fontSize: 32, color: "#1A3A1A" }}>
              Admin Dashboard
            </h1>
            <p style={{ color: "#6B6B6B", fontSize: 14 }}>Royal Swag · Eximburg International</p>
          </div>
          <button
            type="button"
            onClick={exportCSV}
            className="btn-gold"
            style={{ padding: "12px 24px", fontSize: 14, border: "none", borderRadius: 8, cursor: "pointer" }}
          >
            ↓ Export CSV
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {[
            { label: "Total Orders", value: stats.total, color: "#1A3A1A" },
            {
              label: "Revenue",
              value: "Rs " + stats.revenue.toLocaleString("en-IN"),
              color: "#2D6A2D",
            },
            { label: "Paid", value: stats.paid, color: "#3B82F6" },
            { label: "Shipped", value: stats.shipped, color: "#F97316" },
            { label: "Customers", value: profiles.length, color: "#8B5CF6" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "white",
                borderRadius: 16,
                padding: "20px 24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#999",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["orders", "customers"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{
                padding: "10px 24px",
                borderRadius: 50,
                border: "none",
                cursor: "pointer",
                background: tab === t ? "#1A3A1A" : "#E8EEE8",
                color: tab === t ? "#FAF6EE" : "#444",
                fontWeight: 600,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
              }}
            >
              {t === "orders" ? "Orders" : "Customers"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, order#, city..."
            style={{
              flex: 1,
              minWidth: 200,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1.5px solid #E0E8E0",
              background: "white",
              fontSize: 14,
              fontFamily: "var(--font-sans)",
              outline: "none",
            }}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1.5px solid #E0E8E0",
              background: "white",
              fontSize: 14,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {tab === "orders" && (
          <div
            style={{
              background: "white",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#1A3A1A", color: "#FAF6EE" }}>
                    {["Order #", "Customer", "Phone", "Pack", "Amount", "Status", "Date", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "14px 16px",
                            textAlign: "left",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => (
                    <tr
                      key={o.id}
                      style={{
                        borderBottom: "1px solid #F5F5F5",
                        background: i % 2 === 0 ? "#FAFCFA" : "white",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 700,
                          color: "#1A3A1A",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {o.order_number}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 600 }}>{o.full_name}</div>
                        <div style={{ fontSize: 11, color: "#999" }}>
                          {o.city}, {o.state}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#444", whiteSpace: "nowrap" }}>{o.phone}</td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#2D6A2D",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {o.pack_type}
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, whiteSpace: "nowrap" }}>
                        Rs {o.amount}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <select
                          value={o.status}
                          onChange={(e) => void updateStatus(o.id, e.target.value)}
                          style={{
                            background: (STATUS_COLORS[o.status] ?? "#999") + "22",
                            color: STATUS_COLORS[o.status] ?? "#999",
                            border: "none",
                            borderRadius: 8,
                            padding: "4px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#999", whiteSpace: "nowrap" }}>
                        {format(new Date(o.created_at), "dd/MM/yy")}
                      </td>
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          onClick={() => setPrintOrder(o)}
                          style={{
                            background: "#1A3A1A",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          🖨 Print Label
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              style={{
                padding: "12px 20px",
                color: "#999",
                fontSize: 12,
                borderTop: "1px solid #F5F5F5",
              }}
            >
              Showing {filtered.length} of {orders.length} orders
            </div>
          </div>
        )}

        {tab === "customers" && (
          <div
            style={{
              background: "white",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#1A3A1A", color: "#FAF6EE" }}>
                    {["Name", "Email", "Phone", "Joined"].map((h) => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: "1px solid #F5F5F5",
                        background: i % 2 === 0 ? "#FAFCFA" : "white",
                      }}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.full_name || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "#444" }}>{p.email || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "#2D6A2D" }}>{p.phone || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "#999" }}>
                        {p.created_at ? format(new Date(p.created_at), "dd/MM/yyyy") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {printOrder && <BarcodeLabel order={printOrder} onClose={() => setPrintOrder(null)} />}
    </div>
  );
}
