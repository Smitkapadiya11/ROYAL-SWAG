"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type OrderStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type RiskLevel = "MILD" | "MODERATE" | "HIGH";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Order {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  status: OrderStatus;
  amountINR: number;
  packLabel: string;
  paidAt: string | null;
  createdAt: string;
  customer: Customer | null;
}

interface LungTest {
  id: string;
  sessionId: string;
  name: string;
  email: string;
  phone: string;
  score: number;
  riskLevel: RiskLevel;
  q1_pollution: boolean;
  q2_smoking: boolean;
  q3_cough: boolean;
  q4_breathless: boolean;
  q5_occupational: boolean;
  q6_sleep: boolean;
  q7_exercise: boolean;
  q8_diet: boolean;
  submittedAt: string;
  convertedToOrder: boolean;
}

interface Stats {
  paidOrders: number;
  pendingOrders: number;
  failedOrders: number;
  totalRevenue: number;
  totalLungTests: number;
  highRiskTests: number;
  testConversions: number;
}

const Q_LABELS = ["Pollution", "Smoking", "Cough", "Breathless", "Occupational", "Sleep", "Exercise", "Diet"];
const POLL_INTERVAL = 30000;

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { bg: string; color: string; label: string }> = {
    PAID: { bg: "rgba(74,100,34,0.15)", color: "#4A8C3F", label: "Paid" },
    PENDING: { bg: "rgba(196,154,42,0.15)", color: "#B8860B", label: "Pending" },
    FAILED: { bg: "rgba(160,32,32,0.15)", color: "#CC2222", label: "Failed" },
    REFUNDED: { bg: "rgba(100,100,120,0.15)", color: "#666688", label: "Refunded" },
  };
  const s = map[status];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.5px",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const map: Record<RiskLevel, { bg: string; color: string }> = {
    MILD: { bg: "rgba(74,100,34,0.12)", color: "#4A8C3F" },
    MODERATE: { bg: "rgba(196,154,42,0.12)", color: "#B8860B" },
    HIGH: { bg: "rgba(160,32,32,0.12)", color: "#CC2222" },
  };
  const s = map[level];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.5px",
      }}
    >
      {level}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = "#4A6422",
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        padding: "20px 24px",
        borderTop: `3px solid ${accent}`,
      }}
    >
      <p style={{ fontSize: 12, color: "#6B7280", fontWeight: 500, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tests, setTests] = useState<LungTest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"orders" | "tests" | "customers">("orders");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [riskFilter, setRiskFilter] = useState<"ALL" | RiskLevel>("ALL");

  useEffect(() => {
    fetch("/api/admin/verify")
      .then((r) => {
        if (r.ok) setAuthed(true);
        else router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setChecking(false));
  }, [router]);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError(null);
      try {
        const r = await fetch("/api/admin/data", { cache: "no-store" });
        if (r.status === 401) {
          router.replace("/admin/login");
          return;
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const d = await r.json();
        setOrders(d.orders ?? []);
        setTests(d.lungTests ?? []);
        setStats(d.stats ?? null);
        setLastSync(new Date());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Fetch failed");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!authed) return;
    fetchData();
    timerRef.current = setInterval(() => fetchData(true), POLL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [authed, fetchData]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      search === "" ||
      o.razorpayOrderId.toLowerCase().includes(search.toLowerCase()) ||
      o.razorpayPaymentId?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.email.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.phone.includes(search);
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredTests = tests.filter((t) => {
    const matchSearch =
      search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search);
    const matchRisk = riskFilter === "ALL" || t.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const customerMap = new Map<
    string,
    { name: string; email: string; phone: string; orderCount: number; totalSpent: number; hasTest: boolean }
  >();
  orders.forEach((o) => {
    if (!o.customer) return;
    const k = o.customer.email;
    const c = customerMap.get(k) ?? {
      name: o.customer.name,
      email: o.customer.email,
      phone: o.customer.phone,
      orderCount: 0,
      totalSpent: 0,
      hasTest: false,
    };
    if (o.status === "PAID") {
      c.orderCount++;
      c.totalSpent += o.amountINR;
    }
    customerMap.set(k, c);
  });
  tests.forEach((t) => {
    const c = customerMap.get(t.email) ?? {
      name: t.name,
      email: t.email,
      phone: t.phone,
      orderCount: 0,
      totalSpent: 0,
      hasTest: false,
    };
    c.hasTest = true;
    customerMap.set(t.email, c);
  });
  const customers = Array.from(customerMap.values()).filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0F1710",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#F2E6CE", fontSize: 15 }}>Checking session…</p>
      </div>
    );
  }
  if (!authed) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3F4F6",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <nav
        style={{
          background: "#1A2818",
          borderBottom: "1px solid rgba(74,100,34,0.3)",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#F2E6CE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Image src="/images/royal-swag-logo.png" alt="" fill sizes="26px" style={{ objectFit: "contain", padding: 5 }} />
          </div>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#F2E6CE",
                fontFamily: "Georgia, serif",
                letterSpacing: 1,
              }}
            >
              ROYAL SWAG
            </p>
            <p style={{ fontSize: 9, color: "rgba(242,230,206,0.4)", letterSpacing: 2 }}>ADMIN DASHBOARD</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: loading ? "#C49A2A" : "#4CAF50",
                boxShadow: loading ? "none" : "0 0 6px #4CAF50",
                animation: loading ? "pulse 1s infinite" : "none",
              }}
            />
            <span style={{ fontSize: 11, color: "rgba(242,230,206,0.5)" }}>
              {loading ? "Syncing…" : lastSync ? `Updated ${lastSync.toLocaleTimeString()}` : "Loading…"}
            </span>
          </div>

          <button
            onClick={() => fetchData()}
            disabled={loading}
            style={{
              background: "rgba(74,100,34,0.3)",
              border: "1px solid rgba(74,100,34,0.5)",
              borderRadius: 6,
              color: "#a8d5a2",
              fontSize: 12,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            ↻ Refresh
          </button>

          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid rgba(242,230,206,0.2)",
              borderRadius: 6,
              color: "rgba(242,230,206,0.6)",
              fontSize: 12,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 24px 48px" }}>
        {error && (
          <div
            style={{
              background: "rgba(160,32,32,0.1)",
              border: "1px solid rgba(160,32,32,0.3)",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#CC2222",
              fontSize: 13,
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>⚠ {error}</span>
            <button
              onClick={() => setError(null)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#CC2222" }}
            >
              ×
            </button>
          </div>
        )}

        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} sub={`${stats.paidOrders} paid orders`} accent="#4A6422" />
            <StatCard label="Paid Orders" value={stats.paidOrders} accent="#4CAF50" />
            <StatCard label="Pending Orders" value={stats.pendingOrders} accent="#C49A2A" />
            <StatCard label="Failed Orders" value={stats.failedOrders} accent="#CC2222" />
            <StatCard label="Lung Tests" value={stats.totalLungTests} sub={`${stats.highRiskTests} high risk`} accent="#8B6914" />
            <StatCard
              label="Test → Order"
              value={`${stats.totalLungTests > 0 ? Math.round((stats.testConversions / stats.totalLungTests) * 100) : 0}%`}
              sub="conversion rate"
              accent="#6B4C9A"
            />
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #E5E7EB",
              background: "#FAFAFA",
              flexWrap: "wrap",
              gap: 0,
            }}
          >
            {(["orders", "tests", "customers"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setSearch("");
                }}
                style={{
                  padding: "14px 22px",
                  background: "transparent",
                  border: "none",
                  borderBottom: tab === t ? "2px solid #4A6422" : "2px solid transparent",
                  color: tab === t ? "#4A6422" : "#6B7280",
                  fontSize: 13,
                  fontWeight: tab === t ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                }}
              >
                {t === "orders" ? `Orders (${orders.length})` : t === "tests" ? `Lung Tests (${tests.length})` : `Customers (${customerMap.size})`}
              </button>
            ))}

            <div style={{ flex: 1 }} />

            <div style={{ padding: "8px 16px" }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, phone, ID…"
                style={{
                  padding: "8px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: 6,
                  fontSize: 13,
                  outline: "none",
                  width: 240,
                  fontFamily: "inherit",
                  background: "#fff",
                }}
              />
            </div>

            {tab === "orders" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                style={{
                  padding: "8px 12px",
                  marginRight: 16,
                  border: "1px solid #D1D5DB",
                  borderRadius: 6,
                  fontSize: 13,
                  background: "#fff",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {["ALL", "PAID", "PENDING", "FAILED", "REFUNDED"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            {tab === "tests" && (
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as typeof riskFilter)}
                style={{
                  padding: "8px 12px",
                  marginRight: 16,
                  border: "1px solid #D1D5DB",
                  borderRadius: 6,
                  fontSize: 13,
                  background: "#fff",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {["ALL", "HIGH", "MODERATE", "MILD"].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            )}
          </div>

          {tab === "orders" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    {["Order ID", "Status", "Customer", "Email", "Phone", "Pack", "Amount", "Date"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "11px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#6B7280",
                          letterSpacing: "0.5px",
                          borderBottom: "1px solid #E5E7EB",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
                        {loading ? "Loading orders…" : "No orders found"}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o, i) => (
                      <tr
                        key={o.id}
                        style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA", transition: "background 0.1s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F0FDF4")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFA")}
                      >
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <div>
                            <p style={{ fontFamily: "monospace", fontSize: 11, color: "#374151", fontWeight: 600 }}>
                              {o.razorpayOrderId.slice(0, 20)}…
                            </p>
                            {o.razorpayPaymentId && (
                              <p style={{ fontFamily: "monospace", fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>
                                {o.razorpayPaymentId.slice(0, 18)}…
                              </p>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <StatusBadge status={o.status} />
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <p style={{ fontWeight: 500, color: "#111827" }}>{o.customer?.name || "—"}</p>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <p style={{ color: "#374151" }}>{o.customer?.email || "—"}</p>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <p style={{ fontFamily: "monospace", color: "#374151", fontSize: 12 }}>{o.customer?.phone || "—"}</p>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <p style={{ color: "#374151", fontSize: 12 }}>{o.packLabel}</p>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <p style={{ fontWeight: 700, color: "#111827" }}>₹{o.amountINR.toLocaleString("en-IN")}</p>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <p style={{ color: "#6B7280", fontSize: 12, whiteSpace: "nowrap" }}>
                            {o.paidAt
                              ? new Date(o.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
                                " " +
                                new Date(o.paidAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                              : new Date(o.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === "tests" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    {["Name", "Email", "Phone", "Risk", "Score", ...Q_LABELS, "Converted", "Date"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "11px 12px",
                          textAlign: "left",
                          fontSize: 10,
                          fontWeight: 600,
                          color: "#6B7280",
                          letterSpacing: "0.5px",
                          borderBottom: "1px solid #E5E7EB",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.length === 0 ? (
                    <tr>
                      <td colSpan={16} style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
                        {loading ? "Loading tests…" : "No lung tests found"}
                      </td>
                    </tr>
                  ) : (
                    filteredTests.map((t, i) => {
                      const answers = [
                        t.q1_pollution,
                        t.q2_smoking,
                        t.q3_cough,
                        t.q4_breathless,
                        t.q5_occupational,
                        t.q6_sleep,
                        t.q7_exercise,
                        t.q8_diet,
                      ];
                      return (
                        <tr
                          key={t.id}
                          style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF7ED")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFA")}
                        >
                          <td style={{ padding: "12px 12px", borderBottom: "1px solid #F3F4F6" }}>
                            <p style={{ fontWeight: 500, color: "#111827", whiteSpace: "nowrap" }}>{t.name}</p>
                          </td>
                          <td style={{ padding: "12px 12px", borderBottom: "1px solid #F3F4F6" }}>
                            <p style={{ color: "#374151", fontSize: 12 }}>{t.email}</p>
                          </td>
                          <td style={{ padding: "12px 12px", borderBottom: "1px solid #F3F4F6" }}>
                            <p style={{ fontFamily: "monospace", fontSize: 12, color: "#374151" }}>{t.phone}</p>
                          </td>
                          <td style={{ padding: "12px 12px", borderBottom: "1px solid #F3F4F6" }}>
                            <RiskBadge level={t.riskLevel} />
                          </td>
                          <td style={{ padding: "12px 12px", borderBottom: "1px solid #F3F4F6", textAlign: "center" }}>
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: 14,
                                color: t.score >= 6 ? "#CC2222" : t.score >= 3 ? "#B8860B" : "#4A8C3F",
                              }}
                            >
                              {t.score}/8
                            </span>
                          </td>
                          {answers.map((a, qi) => (
                            <td key={qi} style={{ padding: "12px 12px", borderBottom: "1px solid #F3F4F6", textAlign: "center" }}>
                              <span style={{ fontSize: 14, color: a ? "#CC2222" : "#4A8C3F" }}>{a ? "✓" : "○"}</span>
                            </td>
                          ))}
                          <td style={{ padding: "12px 12px", borderBottom: "1px solid #F3F4F6", textAlign: "center" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: t.convertedToOrder ? "#4A8C3F" : "#9CA3AF" }}>
                              {t.convertedToOrder ? "YES" : "NO"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 12px", borderBottom: "1px solid #F3F4F6" }}>
                            <p style={{ color: "#6B7280", fontSize: 11, whiteSpace: "nowrap" }}>
                              {new Date(t.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </p>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === "customers" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    {["Name", "Email", "Phone", "Orders", "Total Spent", "Took Lung Test"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "11px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#6B7280",
                          letterSpacing: "0.5px",
                          borderBottom: "1px solid #E5E7EB",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>
                        {loading ? "Loading customers…" : "No customers yet"}
                      </td>
                    </tr>
                  ) : (
                    customers.map((c, i) => (
                      <tr
                        key={c.email}
                        style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFA")}
                      >
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <p style={{ fontWeight: 600, color: "#111827" }}>{c.name}</p>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <p style={{ color: "#374151" }}>{c.email}</p>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <p style={{ fontFamily: "monospace", fontSize: 13, color: "#374151" }}>{c.phone}</p>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6", textAlign: "center" }}>
                          <span style={{ fontWeight: 700, color: "#111827" }}>{c.orderCount}</span>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                          <p style={{ fontWeight: 700, color: "#111827" }}>₹{c.totalSpent.toLocaleString("en-IN")}</p>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6", textAlign: "center" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: c.hasTest ? "#4A8C3F" : "#9CA3AF" }}>
                            {c.hasTest ? "YES" : "NO"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div
            style={{
              padding: "12px 16px",
              background: "#F9FAFB",
              borderTop: "1px solid #E5E7EB",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <p style={{ fontSize: 12, color: "#9CA3AF" }}>
              {tab === "orders"
                ? `${filteredOrders.length} of ${orders.length} orders`
                : tab === "tests"
                ? `${filteredTests.length} of ${tests.length} tests`
                : `${customers.length} customers`}
            </p>
            <p style={{ fontSize: 11, color: "#9CA3AF" }}>
              Auto-refreshes every 30 seconds · Last sync: {lastSync?.toLocaleTimeString() ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        table td, table th { font-family: 'Inter', -apple-system, sans-serif; }
        @media (max-width: 768px) {
          nav > div { flex-wrap: wrap; gap: 10px; }
        }
      `}</style>
    </div>
  );
}
