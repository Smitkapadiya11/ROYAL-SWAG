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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderConfirmationOrderDetails;
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  orderDetails,
}: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const phone = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917096553300"
  ).replace(/\D/g, "");
  const msg = encodeURIComponent(
    `Hi Royal Swag Team,\n\nMy order is confirmed! ✅\n\nName: ${orderDetails.name}\nPackage: ${orderDetails.package}\nAmount Paid: ₹${orderDetails.amount}\nOrder ID: ${orderDetails.orderId?.slice(0, 8).toUpperCase() || "N/A"}\n\nPlease share shipping details.`
  );

  const oid = orderDetails.orderId;

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
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-confirmation-heading"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "32px 24px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>

        <h2
          id="order-confirmation-heading"
          style={{
            color: "#14532d",
            fontSize: "24px",
            fontWeight: "800",
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
          Thank you {orderDetails.name}! Payment received successfully.
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
              padding: "6px 0",
              borderBottom: "1px solid #dcfce7",
            }}
          >
            <span style={{ color: "#6b7280", fontSize: "13px" }}>
              Amount Paid
            </span>
            <span
              style={{
                color: "#14532d",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              ₹{orderDetails.amount}
            </span>
          </div>
          {oid ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
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
                #{oid.slice(0, 8).toUpperCase()}
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
          📦 Ships in 24 hrs · Free delivery across India
        </p>

        <a
          href={`https://wa.me/${phone}?text=${msg}`}
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
          onClick={onClose}
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
