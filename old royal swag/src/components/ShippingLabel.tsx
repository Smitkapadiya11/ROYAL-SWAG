"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import BrandLogo from "@/components/ui/BrandLogo";
import { siteConfig } from "@/lib/siteConfig";

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

const FSSAI = siteConfig.fssaiLicense;

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
  const orderBarcodeRef = useRef<SVGSVGElement>(null);
  const pinBarcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (orderBarcodeRef.current) {
      try {
        JsBarcode(orderBarcodeRef.current, order.order_id, {
          format: "CODE128",
          width: 1.2,
          height: 40,
          displayValue: false,
          margin: 0,
        });
      } catch {
        /* invalid id */
      }
    }
    if (pinBarcodeRef.current) {
      try {
        const pin = order.pincode.replace(/\D/g, "") || order.mobile.replace(/\D/g, "").slice(-10);
        JsBarcode(pinBarcodeRef.current, pin, {
          format: "CODE39",
          width: 1.1,
          height: 36,
          displayValue: false,
          margin: 0,
        });
      } catch {
        /* invalid pin */
      }
    }
  }, [order.order_id, order.pincode, order.mobile]);

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

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center text-center">
          <p className="mb-1 font-sans text-[7px] font-bold uppercase tracking-wider text-[#9A6F1A]">
            Order (CODE128)
          </p>
          <svg ref={orderBarcodeRef} className="max-w-full" />
          <p className="mt-0.5 font-mono text-[8px] text-[#324023]">{order.order_id}</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="mb-1 font-sans text-[7px] font-bold uppercase tracking-wider text-[#9A6F1A]">
            Pincode (CODE39)
          </p>
          <svg ref={pinBarcodeRef} className="max-w-full" />
          <p className="mt-0.5 font-mono text-[8px] text-[#324023]">{order.pincode}</p>
        </div>
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
