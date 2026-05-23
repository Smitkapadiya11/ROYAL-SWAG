"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  paid: "#3B82F6",
  processing: "#8B5CF6",
  shipped: "#F97316",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type OrderRow = {
  id: string;
  order_number: string;
  pack_type: string;
  amount: number;
  status: string;
  created_at: string;
  tracking_number: string | null;
  address_line1: string;
  city: string;
  state: string;
  pincode: string;
};

export type AddressRow = {
  id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};

interface Props {
  profile: ProfileRow | null;
  orders: OrderRow[];
  addresses: AddressRow[];
}

export default function ProfileClient({ profile, orders, addresses }: Props) {
  const [tab, setTab] = useState<"orders" | "profile" | "address">("orders");
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current, { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" });
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  const TABS = [
    { key: "orders" as const, label: "My Orders", count: orders.length },
    { key: "profile" as const, label: "My Details", count: null },
    { key: "address" as const, label: "Addresses", count: addresses.length },
  ];

  return (
    <main style={{ paddingTop: 80, minHeight: "100vh", background: "#FAFCFA" }}>
      <div className="w" style={{ paddingTop: 40, paddingBottom: 80 }} ref={ref}>
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
            <h1
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontSize: "clamp(24px,3vw,36px)",
                color: "#1A3A1A",
              }}
            >
              Hello, {profile?.full_name?.split(" ")[0] || "there"}!
            </h1>
            <p style={{ color: "#6B6B6B", fontSize: 14 }}>{profile?.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            style={{
              background: "none",
              border: "1.5px solid #E0E0E0",
              borderRadius: 10,
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: 13,
              color: "#666",
              fontFamily: "var(--font-sans)",
            }}
          >
            Sign Out
          </button>
        </div>

        <div className="profile-tabs" style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                padding: "10px 20px",
                borderRadius: 50,
                border: "none",
                cursor: "pointer",
                background: tab === t.key ? "#1A3A1A" : "#F0F4F0",
                color: tab === t.key ? "#FAF6EE" : "#444",
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: "nowrap",
                fontFamily: "var(--font-sans)",
                transition: "all 0.2s",
              }}
            >
              {t.label}{" "}
              {t.count !== null && <span style={{ opacity: 0.7 }}>({t.count})</span>}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {orders.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                No orders yet.{" "}
                <Link href="/product" style={{ color: "#2D6A2D", fontWeight: 600 }}>
                  Shop now →
                </Link>
              </div>
            )}
            {orders.map((o) => (
              <div
                key={o.id}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "20px 24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  border: "1px solid #F0F0F0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "#1A3A1A", fontSize: 15 }}>
                      Order #{o.order_number}
                    </div>
                    <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>
                      {format(new Date(o.created_at), "dd MMM yyyy, hh:mm a")}
                    </div>
                    <div style={{ fontSize: 13, color: "#444", marginTop: 6 }}>
                      {o.pack_type} · Rs {o.amount}
                    </div>
                    {o.tracking_number && (
                      <div style={{ fontSize: 12, color: "#2D6A2D", marginTop: 4 }}>
                        Tracking: {o.tracking_number}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      background: (STATUS_COLORS[o.status] ?? "#999") + "22",
                      color: STATUS_COLORS[o.status] ?? "#999",
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {o.status}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid #F8F8F8",
                    fontSize: 12,
                    color: "#999",
                  }}
                >
                  {o.address_line1}, {o.city}, {o.state} — {o.pincode}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "profile" && (
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 32,
              maxWidth: 480,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-playfair-display)", color: "#1A3A1A", marginBottom: 20 }}>
              Your Details
            </h3>
            {[
              { label: "Full Name", value: profile?.full_name || "—" },
              { label: "Mobile", value: profile?.phone || "—" },
              { label: "Email", value: profile?.email || "—" },
              {
                label: "Member Since",
                value: profile?.created_at ? format(new Date(profile.created_at), "MMM yyyy") : "—",
              },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid #F5F5F5",
                  fontSize: 14,
                }}
              >
                <span style={{ color: "#6B6B6B", fontWeight: 500 }}>{r.label}</span>
                <span style={{ color: "#1A3A1A", fontWeight: 600 }}>{r.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "address" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
            {addresses.map((a) => (
              <div
                key={a.id}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "20px 24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  border: a.is_default ? "2px solid #2D6A2D" : "1px solid #F0F0F0",
                }}
              >
                {a.is_default && (
                  <span
                    style={{
                      background: "#E8F5E9",
                      color: "#2D6A2D",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: 20,
                      marginBottom: 8,
                      display: "inline-block",
                    }}
                  >
                    Default
                  </span>
                )}
                <div style={{ fontWeight: 600, color: "#1A3A1A" }}>{a.full_name}</div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 4, lineHeight: 1.6 }}>
                  {a.line1}
                  {a.line2 ? ", " + a.line2 : ""}
                  <br />
                  {a.city}, {a.state} — {a.pincode}
                  <br />
                  📞 {a.phone}
                </div>
              </div>
            ))}
            {addresses.length === 0 && (
              <p style={{ color: "#999", textAlign: "center", padding: "40px 0" }}>No saved addresses</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
