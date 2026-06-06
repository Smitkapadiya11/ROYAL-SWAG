"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import BrandLogo from "@/components/ui/BrandLogo";

export type ShippingLabelOrder = {
  order_id: string;
  customer_name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  pack: string;
  amount: number;
  created_at: string;
};

const FSSAI =
  process.env.NEXT_PUBLIC_FSSAI_NUMBER ||
  process.env.NEXT_PUBLIC_FSSAI_LICENSE ||
  "Licensed";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

type ShippingLabelProps = {
  order: ShippingLabelOrder;
  /** Hidden off-screen for html2canvas capture */
  captureRef?: React.RefObject<HTMLDivElement | null>;
};

export default function ShippingLabel({ order, captureRef }: ShippingLabelProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!barcodeRef.current) return;
    try {
      JsBarcode(barcodeRef.current, order.order_id, {
        format: "CODE128",
        width: 1.4,
        height: 48,
        displayValue: false,
        margin: 0,
      });
    } catch {
      /* invalid id */
    }
  }, [order.order_id]);

  return (
    <div
      ref={captureRef}
      className="shipping-label bg-white text-[#171e11]"
      style={{
        width: "100mm",
        height: "150mm",
        minHeight: "150mm",
        maxHeight: "150mm",
        padding: "6mm 8mm",
        fontSize: "11px",
        lineHeight: 1.4,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div className="flex justify-center bg-[#324023] py-2">
        <BrandLogo variant="on-dark" className="h-8 w-auto" />
      </div>

      <p className="mt-3 font-sans text-[8px] font-bold uppercase tracking-[0.2em] text-[#9A6F1A]">
        Ship to:
      </p>
      <p className="mt-1 font-sans text-sm font-bold text-[#171e11]">
        {order.customer_name}
      </p>
      <p className="font-sans text-[11px] text-[#171e11]">{order.address}</p>
      <p className="font-sans text-[11px] text-[#171e11]">
        {order.city}, {order.state} — {order.pincode}
      </p>
      <p className="font-sans text-[11px] text-[#171e11]">{order.mobile}</p>

      <div className="my-2 border-t border-[#324023]/30" />

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-sans text-[10px]">
        <span>
          <strong>Order:</strong> {order.order_id}
        </span>
        <span>
          <strong>Pack:</strong> {order.pack}
        </span>
        <span>
          <strong>Amount:</strong> ₹{order.amount}
        </span>
        <span>
          <strong>Date:</strong> {formatDate(order.created_at)}
        </span>
      </div>

      <div className="my-2 border-t border-[#324023]/30" />

      <div className="flex flex-col items-center text-center">
        <svg ref={barcodeRef} className="max-w-full" />
        <p className="mt-1 font-mono text-[10px] text-[#324023]">{order.order_id}</p>
      </div>

      <div className="my-2 border-t border-[#324023]/30" />

      <p className="text-center font-sans text-[8px] leading-snug text-[#45483f]">
        Royal Swag · Lung Detox Tea · Breathe Clean. Live Free.
      </p>
      <p className="mt-1 text-center font-sans text-[8px] text-[#75786e]">
        FSSAI: {FSSAI}
      </p>
    </div>
  );
}

export async function downloadLabelPng(
  element: HTMLElement,
  orderId: string
) {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });
  return new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `label_${orderId}.png`;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}
