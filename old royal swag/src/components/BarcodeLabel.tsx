"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import JsBarcode from "jsbarcode";
import { format } from "date-fns";

export type LabelOrder = {
  id: string;
  order_number: string;
  full_name: string;
  phone: string;
  email?: string | null;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  pack_type: string;
  amount: number;
  created_at: string;
};

interface Props {
  order: LabelOrder;
  onClose: () => void;
}

export default function BarcodeLabel({ order, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (overlayRef.current) {
      gsap.from(overlayRef.current, { opacity: 0, duration: 0.3 });
    }
    if (labelRef.current) {
      gsap.from(labelRef.current, { scale: 0.9, opacity: 0, duration: 0.35, ease: "back.out(1.4)" });
    }
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, order.order_number, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 14,
        margin: 10,
        background: "#FFFFFF",
        lineColor: "#000000",
      });
    }
  }, [order.order_number]);

  const handlePrint = () => {
    const printContent = document.getElementById("print-label-content")?.innerHTML;
    const win = window.open("", "_blank", "width=400,height=300");
    if (!win || !printContent) return;
    win.document.write(`
      <html><head>
        <title>Shipping Label — ${order.order_number}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; }
          .label { width: 100mm; min-height: 60mm; border: 2px solid #000;
            padding: 12px; page-break-inside: avoid; }
          .company { font-size: 10px; color: #666; margin-bottom: 6px; }
          .order-num { font-size: 13px; font-weight: bold; margin-bottom: 4px; }
          .name { font-size: 15px; font-weight: bold; margin-bottom: 4px; }
          .address { font-size: 11px; line-height: 1.5; margin-bottom: 8px; }
          .phone { font-size: 12px; font-weight: bold; margin-bottom: 8px; }
          .pack { font-size: 11px; background:#000; color:#fff; padding:3px 8px;
            display:inline-block; border-radius:4px; margin-bottom:8px; }
          svg { display:block; margin:0 auto; }
          @media print { @page { size: 100mm 60mm; margin: 0; } }
        </style>
      </head><body onload="window.print();window.close()">
        ${printContent}
      </body></html>
    `);
    win.document.close();
  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20000,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={labelRef}
        style={{
          background: "white",
          borderRadius: 20,
          padding: 32,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700, color: "#1A3A1A" }}>
            Shipping Label — {order.order_number}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#999" }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            border: "2px solid #000",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
            background: "white",
          }}
        >
          <div id="print-label-content">
            <div className="label" style={{ fontFamily: "Arial,sans-serif" }}>
              <div style={{ fontSize: 10, color: "#666", marginBottom: 6 }}>
                FROM: Royal Swag · Eximburg International · Surat, Gujarat
              </div>
              <div style={{ fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>Order: {order.order_number}</div>
              <div
                style={{
                  background: "#000",
                  color: "#fff",
                  padding: "2px 8px",
                  display: "inline-block",
                  borderRadius: 4,
                  fontSize: 11,
                  marginBottom: 8,
                }}
              >
                {order.pack_type?.toUpperCase()}
              </div>
              <div style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}>TO: {order.full_name}</div>
              <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 6 }}>📞 {order.phone}</div>
              <div style={{ fontSize: 11, lineHeight: "1.6", marginBottom: 8 }}>
                {order.address_line1}
                {order.address_line2 && ", " + order.address_line2}
                <br />
                {order.city}, {order.state} — {order.pincode}
              </div>
              <svg ref={barcodeRef} />
              <div style={{ fontSize: 10, color: "#999", marginTop: 6, textAlign: "center" }}>
                {format(new Date(order.created_at), "dd/MM/yyyy")} · Rs {order.amount}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-gold"
            style={{
              flex: 1,
              justifyContent: "center",
              padding: "14px",
              fontSize: 14,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            🖨 Print Label
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "14px",
              border: "1.5px solid #E0E0E0",
              borderRadius: 50,
              background: "none",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "var(--font-sans)",
              color: "#444",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
