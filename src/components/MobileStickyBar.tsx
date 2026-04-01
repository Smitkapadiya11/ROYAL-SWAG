"use client";

import { useState } from "react";
import CheckoutModal from "@/components/CheckoutModal";

export default function MobileStickyBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        id="mobile-sticky-cta"
        role="region"
        aria-label="Buy Royal Swag"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9998,
          background: "#0D3B1F",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
        }}
        className="mobile-only-sticky"
      >
        <div>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              lineHeight: 1,
              marginBottom: "2px",
            }}
          >
            Royal Swag Lung Detox Tea
          </p>
          <p
            style={{
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            ₹699{" "}
            <span style={{ color: "#c9a84c", fontSize: "11px", fontWeight: 600 }}>
              30% OFF
            </span>
          </p>
        </div>
        <button
          id="mobile-sticky-buy-btn"
          onClick={() => setIsOpen(true)}
          style={{
            background: "#25a244",
            color: "#ffffff",
            border: "none",
            borderRadius: "9999px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(37,162,68,0.4)",
          }}
        >
          Buy Now
        </button>
      </div>

      {/* Hide on desktop via global CSS injected inline */}
      <style>{`
        .mobile-only-sticky {
          display: none !important;
        }
        @media (max-width: 768px) {
          .mobile-only-sticky {
            display: flex !important;
          }
          /* Push page content up so footer isn't hidden behind bar */
          body { padding-bottom: 60px; }
        }
      `}</style>

      <CheckoutModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
