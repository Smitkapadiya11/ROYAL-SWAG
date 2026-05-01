"use client";

import { useCallback, useState } from "react";
import { RS_LEAD_KEY, RS_LEAD_UPDATED_EVENT } from "@/lib/lead-capture-storage";

export type LeadCaptureModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IN_MOBILE_RE = /^[6-9]\d{9}$/;

const INDIAN_STATES = [
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
] as const;

type FieldKey = "name" | "phone" | "address" | "city" | "pincode" | "state" | "email";
type FieldErrors = Partial<Record<FieldKey, string>>;

function validatePhone(v: string): string | null {
  const digits = v.replace(/\D/g, "");
  if (digits.length !== 10) return "Enter a valid 10-digit mobile number.";
  if (!IN_MOBILE_RE.test(digits)) return "Enter a valid Indian mobile number (starts with 6–9).";
  return null;
}

function validateEmail(v: string): string | null {
  const t = v.trim();
  if (!t) return "Email is required.";
  if (!EMAIL_RE.test(t)) return "Enter a valid email address.";
  return null;
}

export default function LeadCaptureModal({ isOpen, onClose, onSuccess }: LeadCaptureModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleProceed = async () => {
    resetErrors();

    const nt = name.trim();
    if (!nt) {
      setErrors((prev) => ({ ...prev, name: "Full name is required." }));
      return;
    }

    const pe = validatePhone(phone);
    if (pe) {
      setErrors((prev) => ({ ...prev, phone: pe }));
      return;
    }

    const addr = address.trim();
    if (!addr || addr.length < 10) {
      setErrors((prev) => ({
        ...prev,
        address: "Enter full address (min 10 chars)",
      }));
      return;
    }

    const ct = city.trim();
    if (!ct) {
      setErrors((prev) => ({ ...prev, city: "Enter your city" }));
      return;
    }

    const pc = pincode.trim();
    if (!/^\d{6}$/.test(pc)) {
      setErrors((prev) => ({ ...prev, pincode: "Enter valid 6-digit pincode" }));
      return;
    }

    if (!state) {
      setErrors((prev) => ({ ...prev, state: "Select your state" }));
      return;
    }
    if (!INDIAN_STATES.includes(state as (typeof INDIAN_STATES)[number])) {
      setErrors((prev) => ({
        ...prev,
        state: "Please select a valid state from the list.",
      }));
      return;
    }

    const ee = validateEmail(email);
    if (ee) {
      setErrors((prev) => ({ ...prev, email: ee }));
      return;
    }

    const digits = phone.replace(/\D/g, "");
    const emailNorm = email.trim().toLowerCase();

    try {
      localStorage.setItem(
        RS_LEAD_KEY,
        JSON.stringify({
          name: nt,
          mobile: digits,
          email: emailNorm,
          address: addr,
          city: ct,
          pincode: pc,
          state,
          timestamp: Date.now(),
        })
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(RS_LEAD_UPDATED_EVENT));
      }
    } catch (e) {
      console.error("[LeadCaptureModal] rs_lead save failed:", e);
    }

    try {
      onSuccess();
    } catch (e) {
      console.error("[LeadCaptureModal] onSuccess failed:", e);
    }

    setName("");
    setPhone("");
    setAddress("");
    setCity("");
    setPincode("");
    setState("");
    setEmail("");
    resetErrors();
  };

  if (!isOpen) return null;

  const labelBase = {
    display: "block" as const,
    fontSize: "13px",
    fontWeight: "600" as const,
    marginBottom: "6px",
    color: "#374151",
  };

  return (
    <div
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(15, 23, 15, 0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rs-lead-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          padding: "28px 24px 24px",
          maxHeight: "min(92vh, 720px)",
          overflowY: "auto",
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            border: "none",
            background: "transparent",
            fontSize: 22,
            lineHeight: 1,
            cursor: "pointer",
            color: "#64748b",
            padding: 4,
          }}
        >
          ×
        </button>

        <h2
          id="rs-lead-modal-title"
          style={{
            fontFamily: "var(--ff-head, Georgia, serif)",
            fontSize: 20,
            fontWeight: 700,
            color: "#1a2e16",
            marginBottom: 8,
            paddingRight: 28,
          }}
        >
          Almost there — just your details
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 22 }}>
          We&apos;ll send your order confirmation on WhatsApp.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label htmlFor="rs-lead-name" style={labelBase}>
              Full name <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="rs-lead-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: errors.name ? "1px solid #dc2626" : "1px solid #d1d5db",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
            {errors.name && (
              <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="rs-lead-phone" style={labelBase}>
              Phone number <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="rs-lead-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit mobile"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: errors.phone ? "1px solid #dc2626" : "1px solid #d1d5db",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
            {errors.phone && (
              <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label style={labelBase}>
              Delivery Address <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="House no, Street, Area"
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: errors.address ? "1px solid #dc2626" : "1px solid #d1d5db",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
            {errors.address && (
              <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.address}</p>
            )}
          </div>

          {/* City and Pincode side by side */}
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelBase}>
                City <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Your city"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: errors.city ? "1px solid #dc2626" : "1px solid #d1d5db",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />
              {errors.city && (
                <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.city}</p>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelBase}>
                Pincode <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="6-digit pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: errors.pincode ? "1px solid #dc2626" : "1px solid #d1d5db",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />
              {errors.pincode && (
                <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
                  {errors.pincode}
                </p>
              )}
            </div>
          </div>

          {/* State dropdown */}
          <div>
            <label htmlFor="rs-lead-state" style={labelBase}>
              State <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <select
              id="rs-lead-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: errors.state ? "1px solid #dc2626" : "1px solid #d1d5db",
                fontSize: "15px",
                boxSizing: "border-box",
                background: "#fff",
              }}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && (
              <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.state}</p>
            )}
          </div>

          <div>
            <label htmlFor="rs-lead-email" style={labelBase}>
              Email <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="rs-lead-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: errors.email ? "1px solid #dc2626" : "1px solid #d1d5db",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
            {errors.email && (
              <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.email}</p>
            )}
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <button
            type="button"
            onClick={handleProceed}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: 10,
              border: "none",
              background: "#4A6422",
              color: "#F2E6CE",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Submit Details
          </button>
        </div>
      </div>
    </div>
  );
}
