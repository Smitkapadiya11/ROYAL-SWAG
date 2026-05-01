"use client";

import { useEffect } from "react";

export interface OrderConfirmationOrderDetails {
  name: string;
  mobile: string;
  package: string;
  amount: number;
  orderId?: string;
  paymentId?: string;
}

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderConfirmationOrderDetails;
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  orderDetails,
}: OrderConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917096553300";
  const message = encodeURIComponent(
    `✅ Order Confirmed!\n\nHi ${orderDetails.name}, your Royal Swag Lung Detox Tea order is confirmed!\n\n📦 Package: ${orderDetails.package}\n💰 Amount Paid: ₹${orderDetails.amount}\n🆔 Order ID: ${orderDetails.orderId || "N/A"}\n\nWe will ship within 24 hours. Track your order on WhatsApp.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-confirmed-title"
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "32px 24px",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "#dcfce7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "36px",
          }}
        >
          ✅
        </div>

        <h2
          id="order-confirmed-title"
          style={{
            color: "#14532d",
            fontSize: "22px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          Order Confirmed!
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          Thank you {orderDetails.name}! Your order has been placed successfully.
        </p>

        <div
          style={{
            background: "#f0fdf4",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
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
              {orderDetails.package}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#6b7280", fontSize: "13px" }}>
              Amount Paid
            </span>
            <span
              style={{
                color: "#14532d",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              ₹{orderDetails.amount}
            </span>
          </div>
          {orderDetails.orderId ? (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7280", fontSize: "13px" }}>
                Order ID
              </span>
              <span
                style={{
                  color: "#14532d",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                {orderDetails.orderId.slice(0, 8).toUpperCase()}
              </span>
            </div>
          ) : null}
        </div>

        <p
          style={{
            color: "#6b7280",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          📦 Ships within 24 hours · Free delivery · Track on WhatsApp
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
            padding: "14px",
            background: "#25d366",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "15px",
            textDecoration: "none",
            marginBottom: "12px",
            boxSizing: "border-box",
          }}
        >
          📲 Get Order Updates on WhatsApp
        </a>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            background: "transparent",
            color: "#6b7280",
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
