"use client";

import { useCallback, useState } from "react";
import { saveLead } from "@/lib/lead-capture-storage";
import { trackOrderLead } from "@/lib/trackLead";

export type LeadCaptureModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IN_MOBILE_RE = /^[6-9]\d{9}$/;

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
  const [email, setEmail] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const resetErrors = useCallback(() => {
    setNameErr("");
    setPhoneErr("");
    setEmailErr("");
  }, []);

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleProceed = async () => {
    resetErrors();

    let ok = true;
    const nt = name.trim();
    if (!nt) {
      setNameErr("Full name is required.");
      ok = false;
    }

    const pe = validatePhone(phone);
    if (pe) {
      setPhoneErr(pe);
      ok = false;
    }

    const ee = validateEmail(email);
    if (ee) {
      setEmailErr(ee);
      ok = false;
    }

    if (!ok) return;

    const digits = phone.replace(/\D/g, "");
    const emailNorm = email.trim().toLowerCase();
    try {
      saveLead({
        name: nt,
        phone: digits,
        email: emailNorm,
      });
    } catch (e) {
      console.error("[LeadCaptureModal] saveLead failed:", e);
    }
    try {
      await trackOrderLead({
        name: nt,
        mobile: digits,
        email: emailNorm,
      });
    } catch (e) {
      console.error("[LeadCaptureModal] trackOrderLead failed:", e);
    }
    try {
      onSuccess();
    } catch (e) {
      console.error("[LeadCaptureModal] onSuccess failed:", e);
    }
    setName("");
    setPhone("");
    setEmail("");
    resetErrors();
  };

  if (!isOpen) return null;

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
          maxHeight: "min(92vh, 640px)",
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
            <label
              htmlFor="rs-lead-name"
              style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}
            >
              Full name <span style={{ color: "#b91c1c" }}>*</span>
            </label>
            <input
              id="rs-lead-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 16,
                outline: "none",
              }}
            />
            {nameErr && (
              <p style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>{nameErr}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="rs-lead-phone"
              style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}
            >
              Phone number <span style={{ color: "#b91c1c" }}>*</span>
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
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 16,
                outline: "none",
              }}
            />
            {phoneErr && (
              <p style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>{phoneErr}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="rs-lead-email"
              style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}
            >
              Email <span style={{ color: "#b91c1c" }}>*</span>
            </label>
            <input
              id="rs-lead-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 16,
                outline: "none",
              }}
            />
            {emailErr && (
              <p style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>{emailErr}</p>
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
