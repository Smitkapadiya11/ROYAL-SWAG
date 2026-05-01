"use client";

import { useState } from "react";

export interface CODSelectedPackage {
  label: string;
  amount: number;
  bags: number;
}

interface CODOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: CODSelectedPackage;
}

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

export default function CODOrderModal({
  isOpen,
  onClose,
  selectedPackage,
}: CODOrderModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name required";
    const digits = form.mobile.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) e.mobile = "Valid 10-digit Indian mobile required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Valid email required";
    if (form.address.trim().length < 10)
      e.address = "Full address required (min 10 chars)";
    if (!form.city.trim()) e.city = "City required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Valid 6-digit pincode required";
    if (!form.state) e.state = "Select your state";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setLoading(true);
    try {
      const mobileClean = form.mobile.replace(/\D/g, "").slice(-10);
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: mobileClean,
          email: form.email.trim().toLowerCase(),
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.pincode.trim(),
          state: form.state,
          package: selectedPackage.label,
          amount: selectedPackage.amount,
          status: "cod_pending",
          payment_method: "COD",
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data.success) {
        setStep("success");
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: `1.5px solid ${errors[field] ? "#dc2626" : "#d1d5db"}`,
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    background: "#fff",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  const errorStyle: React.CSSProperties = {
    color: "#dc2626",
    fontSize: "11px",
    marginTop: "3px",
  };

  const phone = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917096553300"
  ).replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hi Royal Swag Team! 🌿\n\nNew COD Order:\n\nName: ${form.name}\nMobile: ${form.mobile.replace(/\D/g, "").slice(-10)}\nPackage: ${selectedPackage.label}\nAmount: ₹${selectedPackage.amount} (Cash on Delivery)\nAddress: ${form.address}, ${form.city}, ${form.pincode}, ${form.state}`
  );

  function handleClose() {
    onClose();
    setStep("form");
    setForm({
      name: "",
      mobile: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
      state: "",
    });
    setErrors({});
  }

  if (step === "success") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
        role="presentation"
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "36px 24px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cod-success-title"
        >
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
          <h2
            id="cod-success-title"
            style={{
              color: "#14532d",
              fontSize: "22px",
              fontWeight: "800",
              marginBottom: "8px",
            }}
          >
            Order Placed!
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              marginBottom: "24px",
            }}
          >
            Your Cash on Delivery order is confirmed. We will call you before
            dispatch.
          </p>

          <div
            style={{
              background: "#f0fdf4",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #dcfce7",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Name</span>
              <span
                style={{
                  color: "#14532d",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                {form.name}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #dcfce7",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Package</span>
              <span
                style={{
                  color: "#14532d",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                {selectedPackage.label}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #dcfce7",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Amount</span>
              <span
                style={{
                  color: "#14532d",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                ₹{selectedPackage.amount} COD
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "13px" }}>Delivery</span>
              <span
                style={{
                  color: "#14532d",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                {form.city}, {form.state}
              </span>
            </div>
          </div>

          <a
            href={`https://wa.me/${phone}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "14px",
              background: "#25d366",
              color: "#fff",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "15px",
              textDecoration: "none",
              marginBottom: "10px",
            }}
          >
            📲 Track Order on WhatsApp
          </a>

          <button
            type="button"
            onClick={handleClose}
            style={{
              width: "100%",
              padding: "12px",
              background: "transparent",
              color: "#9ca3af",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cod-modal-title"
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
              Cash on Delivery
            </p>
            <h3
              id="cod-modal-title"
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
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "16px",
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
            <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
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
              {selectedPackage.label}
              <span style={{ fontWeight: 600, color: "#15803d" }}>
                {" "}
                · {selectedPackage.bags} bags
              </span>
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "800",
                color: "#14532d",
              }}
            >
              ₹{selectedPackage.amount}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#16a34a",
                fontWeight: "600",
              }}
            >
              PAY ON DELIVERY
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
              value={form.name}
              onChange={(ev) => update("name", ev.target.value)}
              style={inputStyle("name")}
              autoComplete="name"
            />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>

          <div>
            <label style={labelStyle}>Mobile Number *</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={(ev) =>
                update("mobile", ev.target.value.replace(/\D/g, "").slice(0, 10))
              }
              style={inputStyle("mobile")}
              autoComplete="tel"
            />
            {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
          </div>

          <div>
            <label style={labelStyle}>Email Address *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(ev) => update("email", ev.target.value)}
              style={inputStyle("email")}
              autoComplete="email"
            />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

          <div>
            <label style={labelStyle}>Delivery Address *</label>
            <input
              type="text"
              placeholder="House no, Street, Area, Landmark"
              value={form.address}
              onChange={(ev) => update("address", ev.target.value)}
              style={inputStyle("address")}
              autoComplete="street-address"
            />
            {errors.address && <p style={errorStyle}>{errors.address}</p>}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>City *</label>
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(ev) => update("city", ev.target.value)}
                style={inputStyle("city")}
                autoComplete="address-level2"
              />
              {errors.city && <p style={errorStyle}>{errors.city}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Pincode *</label>
              <input
                type="text"
                placeholder="6-digit"
                value={form.pincode}
                onChange={(ev) =>
                  update("pincode", ev.target.value.replace(/\D/g, "").slice(0, 6))
                }
                style={inputStyle("pincode")}
                autoComplete="postal-code"
              />
              {errors.pincode && <p style={errorStyle}>{errors.pincode}</p>}
            </div>
          </div>

          <div>
            <label style={labelStyle}>State *</label>
            <select
              value={form.state}
              onChange={(ev) => update("state", ev.target.value)}
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
              ? "Placing Order..."
              : `Confirm COD Order — ₹${selectedPackage.amount}`}
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "12px",
              margin: 0,
            }}
          >
            🔒 Your details are safe · Pay cash when order arrives
          </p>
        </div>
      </div>
    </div>
  );
}
