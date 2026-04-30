"use client";
import { LeadGuardLink } from "@/components/LeadGuardLink";
import { S } from "@/lib/config";

export default function StickyCTA() {
  return (
    <>
      <div className="sticky-cta" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        zIndex: 90,
        background: "var(--deep)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "none",
        alignItems: "center",
        padding: "10px 16px",
        gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: "var(--cream)", fontWeight: 600, fontSize: 13,
            overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
          }}>
            Royal Swag Lung Detox Tea
          </div>
          <div style={{ color: "var(--gold)", fontSize: 12 }}>
            {S.price.now} · Free delivery
          </div>
        </div>
        <LeadGuardLink href="/product" className="btn btn-gold"
          style={{ flexShrink: 0, padding: "10px 20px", fontSize: 13 }}>
          Buy Now
        </LeadGuardLink>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .sticky-cta { display: flex !important; }
          main { padding-bottom: 68px !important; }
        }
      `}</style>
    </>
  );
}
