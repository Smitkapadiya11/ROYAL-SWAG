"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { RS_LEAD_KEY, RS_LEAD_UPDATED_EVENT } from "@/lib/lead-capture-storage";

const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const IN_MOBILE_RE = /^[6-9]\d{9}$/;

export interface LeadData {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
}

export interface LeadCaptureModalSuccessMeta {
  orderId?: string;
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: LeadData, meta?: LeadCaptureModalSuccessMeta) => void;
  mode: "online" | "cod";
  packageLabel: string;
  packageAmount: number;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  packageLabel,
  packageAmount,
}: LeadCaptureModalProps) {
  const [form, setForm] = useState<LeadData>({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function update(field: keyof LeadData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name required";
    const mobileDigits = form.mobile.replace(/\D/g, "").slice(-10);
    if (!IN_MOBILE_RE.test(mobileDigits)) {
      e.mobile = "Valid Indian mobile required (10 digits, starts with 6–9)";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Valid email required";
    }
    if (form.address.trim().length < 10) {
      e.address = "Full address required (min 10 chars)";
    }
    if (!form.city.trim()) e.city = "City required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Valid 6-digit pincode required";
    if (!form.state) e.state = "Select your state";
    return e;
  }

  async function handleSubmit() {
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const mobileDigits = form.mobile.replace(/\D/g, "").slice(-10);
    const formNorm: LeadData = {
      ...form,
      name: form.name.trim(),
      mobile: mobileDigits,
      email: form.email.trim().toLowerCase(),
      address: form.address.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      state: form.state,
    };

    setLoading(true);

    try {
      localStorage.setItem(
        RS_LEAD_KEY,
        JSON.stringify({
          ...formNorm,
          timestamp: Date.now(),
        })
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(RS_LEAD_UPDATED_EVENT));
      }

      if (mode === "cod") {
        try {
          const res = await fetch("/api/track-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formNorm,
              package: packageLabel,
              amount: packageAmount,
              status: "cod_pending",
              payment_method: "COD",
            }),
          });
          const data = (await res.json()) as {
            success?: boolean;
            orderId?: string;
          };
          if (!data.success) {
            alert("Something went wrong. Please try again.");
            return;
          }
          onSuccess(formNorm, {
            orderId: typeof data.orderId === "string" ? data.orderId : "",
          });
        } catch {
          alert("Network error. Please try again.");
        }
        return;
      }

      onSuccess(formNorm);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (field: string): CSSProperties => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: `1.5px solid ${errors[field] ? "#dc2626" : "#d1d5db"}`,
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    background: "#fff",
    color: "#111",
  });

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  const errorStyle: CSSProperties = {
    color: "#dc2626",
    fontSize: "11px",
    marginTop: "3px",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "460px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            background: "#14532d",
            borderRadius: "20px 20px 0 0",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                color: "#86efac",
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              {mode === "cod" ? "Cash on Delivery" : "Secure Checkout"}
            </p>
            <h3
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: "700",
                margin: "4px 0 0",
              }}
            >
              Enter Delivery Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            background: "#f0fdf4",
            padding: "14px 24px",
            borderBottom: "1px solid #dcfce7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
              Selected Package
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "15px",
                fontWeight: "700",
                color: "#14532d",
              }}
            >
              {packageLabel}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "800",
                color: "#14532d",
              }}
            >
              ₹{packageAmount}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#16a34a",
                fontWeight: "600",
              }}
            >
              {mode === "cod" ? "PAY ON DELIVERY" : "PAY ONLINE"}
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              style={inputStyle("name")}
            />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>

          <div>
            <label style={labelStyle}>Mobile Number *</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              autoComplete="tel"
              value={form.mobile}
              onChange={(e) =>
                update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              style={inputStyle("mobile")}
            />
            {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
          </div>

          <div>
            <label style={labelStyle}>Email Address *</label>
            <input
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              style={inputStyle("email")}
            />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

          <div>
            <label style={labelStyle}>Delivery Address *</label>
            <input
              type="text"
              placeholder="House no, Street, Area, Landmark"
              autoComplete="street-address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              style={inputStyle("address")}
            />
            {errors.address && <p style={errorStyle}>{errors.address}</p>}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>City *</label>
              <input
                type="text"
                placeholder="City"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                style={inputStyle("city")}
              />
              {errors.city && <p style={errorStyle}>{errors.city}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Pincode *</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="6-digit"
                autoComplete="postal-code"
                value={form.pincode}
                onChange={(e) =>
                  update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                style={inputStyle("pincode")}
              />
              {errors.pincode && <p style={errorStyle}>{errors.pincode}</p>}
            </div>
          </div>

          <div>
            <label style={labelStyle}>State *</label>
            <select
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              style={{ ...inputStyle("state"), background: "#fff" }}
            >
              <option value="">Select your state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && <p style={errorStyle}>{errors.state}</p>}
          </div>

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              background: loading ? "#9ca3af" : "#14532d",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}
          >
            {loading
              ? "Saving..."
              : mode === "cod"
                ? `Confirm COD Order — ₹${packageAmount}`
                : `Continue to Payment — ₹${packageAmount}`}
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "12px",
              margin: 0,
            }}
          >
            {mode === "cod"
              ? "🔒 Your details are safe · Pay cash when order arrives"
              : "🔒 Secured by Razorpay · 100% safe payment"}
          </p>
        </div>
      </div>
    </div>
  );
}
