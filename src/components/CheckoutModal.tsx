"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export interface SelectedPack {
  id: string;
  bags: string;
  days: string;
  price: number;
  mrp: number;
  tag: string;
}

export interface CheckoutModalProps {
  isOpen: boolean;
  pack?: SelectedPack;
  onConfirm?: () => void;
  onClose: () => void;
  /** When applied with discountedAmount below pack.price, show coupon pricing + button total */
  couponCode?: string | null;
  /** Final payable amount after coupon (e.g. same as Razorpay amount) */
  discountedAmount?: number;
}

const FALLBACK_PACK: SelectedPack = {
  id: "20",
  bags: "20 Bags",
  days: "30-Day Supply",
  price: 349,
  mrp: 499,
  tag: "",
};

export default function CheckoutModal({
  isOpen,
  pack = FALLBACK_PACK,
  onConfirm,
  onClose,
  couponCode = null,
  discountedAmount,
}: CheckoutModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  const savings = pack.mrp - pack.price;
  const savingsPct = Math.round((savings / pack.mrp) * 100);

  const originalAmount = pack.price;
  const finalPayAmount =
    couponCode &&
    typeof discountedAmount === "number" &&
    discountedAmount < originalAmount &&
    discountedAmount >= 0
      ? discountedAmount
      : originalAmount;
  const couponApplied = Boolean(couponCode) && finalPayAmount < originalAmount;
  const couponSaved = couponApplied ? originalAmount - finalPayAmount : 0;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(26,26,20,0.72)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        animation: "modal-fade-in 0.18s ease",
      }}
    >
      <div
        style={{
          background: "#F2E6CE",
          borderRadius: 20,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          overflow: "hidden",
          animation: "modal-slide-up 0.22s ease",
        }}
      >
        <div
          style={{
            background: "#2D3D15",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "3px",
                color: "rgba(196,154,42,0.8)",
                marginBottom: 2,
              }}
            >
              CONFIRM YOUR ORDER
            </p>
            <p style={{ fontSize: 14, color: "#F2E6CE", fontWeight: 500 }}>
              Royal Swag Lung Detox Tea
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F2E6CE",
              fontSize: 18,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "24px 24px 0" }}>
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              background: "#fff",
              borderRadius: 12,
              padding: "16px",
              marginBottom: 20,
              border: "1px solid #D4C8A8",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 8,
                background: "#F2E6CE",
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src="/images/product-2.jpg"
                alt="Royal Swag Lung Detox Tea"
                fill
                sizes="72px"
                style={{ objectFit: "contain", padding: 4 }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A14", marginBottom: 2 }}>
                {pack.bags} — {pack.days}
              </p>
              <p style={{ fontSize: 12, color: "#5C5647", marginBottom: 8 }}>
                Lung Detox Tea · 7 Ayurvedic Herbs
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--ff-head, Georgia, serif)",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#4A6422",
                  }}
                >
                  ₹{pack.price}
                </span>
                <span style={{ fontSize: 13, color: "#aaa", textDecoration: "line-through" }}>
                  ₹{pack.mrp}
                </span>
                {savings > 0 && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: "#C49A2A",
                      color: "#2D3D15",
                      borderRadius: 4,
                      padding: "2px 7px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    SAVE {savingsPct}%
                  </span>
                )}
              </div>

              {couponApplied && (
                <div style={{ marginTop: 12 }}>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#9ca3af",
                      fontSize: 14,
                    }}
                  >
                    ₹{originalAmount}
                  </span>
                  <span
                    style={{
                      color: "#16a34a",
                      fontWeight: 700,
                      fontSize: 20,
                      marginLeft: 8,
                    }}
                  >
                    ₹{finalPayAmount}
                  </span>
                  <div style={{ color: "#16a34a", fontSize: 13, marginTop: 4 }}>
                    {couponCode} saved ₹{couponSaved}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {[
              { icon: "🚚", text: "Free Delivery" },
              { icon: "↩", text: "30-Day Guarantee" },
              { icon: "📦", text: "Ships in 24hrs" },
            ].map((p) => (
              <div
                key={p.text}
                style={{
                  background: "#fff",
                  border: "1px solid #D4C8A8",
                  borderRadius: 8,
                  padding: "10px 6px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 3 }}>{p.icon}</div>
                <p style={{ fontSize: 10, fontWeight: 600, color: "#1A1A14" }}>{p.text}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(196,154,42,0.08)",
              border: "1px dashed rgba(196,154,42,0.45)",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 16 }}>🎟</span>
            <p style={{ fontSize: 13, color: "#5C5647" }}>
              Have a coupon? <strong style={{ color: "#4A6422" }}>Apply LUNG25</strong> at checkout
              for 25% off.
            </p>
          </div>
        </div>

        <div style={{ padding: "0 24px 24px" }}>
          <button
            onClick={() => onConfirm?.()}
            style={{
              width: "100%",
              padding: "16px",
              background: "#4A6422",
              color: "#F2E6CE",
              border: "none",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 10,
              transition: "background 0.18s",
              letterSpacing: "0.2px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2D3D15")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#4A6422")}
          >
            Continue to Payment — ₹{finalPayAmount}
          </button>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px",
              background: "transparent",
              color: "#5C5647",
              border: "1px solid #D4C8A8",
              borderRadius: 10,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#4A6422";
              e.currentTarget.style.color = "#4A6422";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#D4C8A8";
              e.currentTarget.style.color = "#5C5647";
            }}
          >
            ← Go back and change pack
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
