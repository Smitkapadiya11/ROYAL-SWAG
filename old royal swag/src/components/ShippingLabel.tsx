"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

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
  "—";

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
      className="shipping-label-root bg-white text-[#171e11]"
      style={{ width: "100mm", minHeight: "150mm", padding: "8mm", fontSize: "11px" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/royal-swag-logo.png"
        alt="Royal Swag"
        className="mx-auto mb-4 block h-12 w-auto object-contain"
      />
      <div className="my-3 border-t border-dashed border-primary/40" />
      <p className="font-body text-[9px] font-bold uppercase tracking-widest text-primary-container">
        Ship to:
      </p>
      <p className="mt-1 font-body text-sm font-bold">{order.customer_name}</p>
      <p className="font-body text-[11px]">{order.address}</p>
      <p className="font-body text-[11px]">
        {order.city} — {order.state} — {order.pincode}
      </p>
      <p className="font-body text-[11px]">Mobile: {order.mobile}</p>
      <div className="my-3 border-t border-dashed border-primary/40" />
      <div className="flex justify-between gap-2 font-body text-[10px]">
        <span>
          <strong>ORDER:</strong> {order.order_id}
        </span>
        <span>
          <strong>PACK:</strong> {order.pack}
        </span>
      </div>
      <div className="mt-1 flex justify-between gap-2 font-body text-[10px]">
        <span>
          <strong>AMOUNT:</strong> ₹{order.amount}
        </span>
        <span>
          <strong>DATE:</strong> {formatDate(order.created_at)}
        </span>
      </div>
      <div className="my-3 border-t border-dashed border-primary/40" />
      <div className="text-center">
        <svg ref={barcodeRef} />
        <p className="mt-1 font-body text-[10px]">{order.order_id}</p>
      </div>
      <div className="my-3 border-t border-dashed border-primary/40" />
      <p className="text-center font-body text-[9px] leading-relaxed">
        Royal Swag · Lung Detox Tea
        <br />
        Breathe Clean. Live Free.
        <br />
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
