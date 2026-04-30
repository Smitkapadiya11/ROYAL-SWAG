"use client";

import { LeadGuardLink } from "@/components/LeadGuardLink";
import { useLeadCapture } from "@/hooks/useLeadCapture";

const DEFAULT_HEADLINE = "Royal Swag Lung Detox Tea";
const DEFAULT_SUB = "Free delivery · Ships tomorrow";

export default function MobileStickyBar(props: {
  onBuyNow?: () => void;
  href?: string;
  headline?: string;
  subline?: string;
}) {
  const { onBuyNow, href = "/product", headline = DEFAULT_HEADLINE, subline = DEFAULT_SUB } = props;
  const { openLeadModal } = useLeadCapture();

  return (
    <div
      id="mobile-sticky-cta"
      role="region"
      aria-label="Buy Royal Swag"
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--rs-deep)",
        height: 60,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 10,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div
          style={{
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {headline}
        </div>
        <div style={{ color: "#a8d5a2", fontSize: 11 }}>{subline}</div>
      </div>
      {onBuyNow ? (
        <button
          type="button"
          id="mobile-sticky-buy-btn"
          onClick={() => openLeadModal(onBuyNow)}
          style={{
            background: "var(--rs-olive)",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Buy Now
        </button>
      ) : (
        <LeadGuardLink
          id="mobile-sticky-buy-btn"
          href={href}
          style={{
            background: "var(--rs-olive)",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Buy Now
        </LeadGuardLink>
      )}
    </div>
  );
}
