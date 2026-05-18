"use client";

import { useState } from "react";
import { PACKS, APP_SITE } from "@/lib/config";
import CheckoutModal from "@/components/CheckoutModal";
import LeadCaptureModal, { type LeadData } from "@/components/LeadCaptureModal";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import LeadGuardExternalLink from "@/components/LeadGuardExternalLink";
import AnimatedOrderButton from "@/components/AnimatedOrderButton";

export default function ProductBuyBox() {
  const [packIndex, setPackIndex] = useState(1);
  const pack = PACKS[packIndex];
  const [checkout, setCheckout] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOrderConfirmed, setShowOrderConfirmed] = useState(false);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState({
    name: "",
    mobile: "",
    package: "",
    amount: 0,
    orderId: "",
    paymentId: "",
  });

  const packLabel = `${pack.label} — ${pack.subLabel}`;
  const payableAmount = pack.price;

  function handleDetailsSubmit(data: LeadData, meta?: { orderId?: string }) {
    setShowDetailsModal(false);

    const mobileClean = data.mobile.replace(/\D/g, "").slice(-10);
    setConfirmedOrderDetails({
      name: data.name,
      mobile: mobileClean,
      package: packLabel,
      amount: payableAmount,
      orderId: meta?.orderId ?? "",
      paymentId: "",
    });
    setShowOrderConfirmed(true);
  }

  return (
    <>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "#6B6B6B",
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        Select pack
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {PACKS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPackIndex(i)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              borderRadius: 14,
              border: `2px solid ${packIndex === i ? "#2D6A2D" : "#E8E8E8"}`,
              background: packIndex === i ? "#F4FBF4" : "#fff",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${packIndex === i ? "#2D6A2D" : "#D0D0D0"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {packIndex === i && (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2D6A2D" }} />
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1A3A1A" }}>{p.label}</div>
                <div style={{ fontSize: 12, color: "#6B6B6B" }}>
                  {p.subLabel} · {p.days} days · {p.bags} bags
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1A3A1A" }}>₹{p.price}</div>
              <div style={{ fontSize: 12, color: "#999", textDecoration: "line-through" }}>₹{p.original}</div>
              {p.tag && (
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#2D6A2D",
                    background: "#E8F5E9",
                    borderRadius: 4,
                    padding: "2px 6px",
                    display: "inline-block",
                  }}
                >
                  {p.tag}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          padding: "12px 16px",
          background: "#F8FCF8",
          borderRadius: 12,
        }}
      >
        <span style={{ fontSize: 14, color: "#6B6B6B" }}>Total</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#1A3A1A" }}>₹{payableAmount}</span>
      </div>

      <div style={{ marginBottom: 10, width: "100%", display: "flex", justifyContent: "center" }}>
        <AnimatedOrderButton price={payableAmount} onOrder={() => setCheckout(true)} />
      </div>

      <button
        type="button"
        onClick={() => setShowDetailsModal(true)}
        style={{
          width: "100%",
          padding: "14px",
          background: "#fff",
          color: "#1A3A1A",
          border: "2px solid #1A3A1A",
          borderRadius: 12,
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        📦 Cash on Delivery
      </button>

      <LeadGuardExternalLink
        href={`https://wa.me/${APP_SITE.whatsapp}?text=${pack.whatsappText}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "13px 16px",
          background: "rgba(37,211,102,0.08)",
          border: "1px solid rgba(37,211,102,0.25)",
          borderRadius: 12,
          color: "#1A7A3A",
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        Order via WhatsApp
      </LeadGuardExternalLink>

      <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 12 }}>
        Secure Razorpay · Free delivery · Ships in 24h
      </p>

      {checkout && <CheckoutModal packId={pack.id} onClose={() => setCheckout(false)} />}

      <LeadCaptureModal
        isOpen={showDetailsModal}
        packageLabel={packLabel}
        packageAmount={payableAmount}
        mode="cod"
        onClose={() => setShowDetailsModal(false)}
        onSuccess={handleDetailsSubmit}
      />

      <OrderConfirmationModal
        isOpen={showOrderConfirmed}
        orderDetails={confirmedOrderDetails}
        onClose={() => setShowOrderConfirmed(false)}
      />
    </>
  );
}
