"use client";

import { useMemo, useRef, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import ShippingLabel, {
  downloadLabelPng,
  type ShippingLabelOrder,
} from "@/components/ShippingLabel";
import { printLabel, printLabelsBulk } from "@/lib/admin/shipping-label";
import { cn } from "@/lib/utils";

type Order = {
  id: string;
  order_id: string;
  full_name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  pack: string;
  amount: number;
  status: string;
  created_at: string;
};

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  const json = (await r.json()) as { orders?: Order[] };
  if (!r.ok) throw new Error("Failed to load orders");
  return { orders: json.orders ?? [] };
};

async function markPrinted(ids: string[]) {
  await Promise.all(
    ids.map((id) =>
      fetch("/api/admin/phase1/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, label_printed: true }),
      })
    )
  );
}

export default function StickerPrintCenter() {
  const { data, isLoading, mutate } = useSWR("/api/admin/phase1/orders", fetcher, {
    refreshInterval: 30_000,
  });
  const [preview, setPreview] = useState<ShippingLabelOrder | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const captureRef = useRef<HTMLDivElement>(null);

  const orders = data?.orders ?? [];

  const toLabel = (o: Order): ShippingLabelOrder => ({
    order_id: o.order_id,
    customer_name: o.full_name,
    mobile: o.mobile,
    address: o.address,
    city: o.city,
    state: o.state,
    pincode: o.pincode,
    pack: o.pack,
    amount: o.amount,
    created_at: o.created_at,
  });

  const recent = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 50),
    [orders]
  );

  const newOrders = useMemo(() => {
    const dayAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return recent.filter((o) => new Date(o.created_at).getTime() > dayAgo);
  }, [recent]);

  const handlePrint = async (order: Order) => {
    printLabel(toLabel(order));
    await markPrinted([order.id]);
    void mutate();
    toast.success("Sticker sent to printer");
  };

  const handleBulkPrint = async () => {
    const list = orders.filter((o) => selected.has(o.id)).map(toLabel);
    if (!list.length) {
      toast.error("Select at least one order");
      return;
    }
    printLabelsBulk(list);
    await markPrinted([...selected]);
    setSelected(new Set());
    void mutate();
    toast.success(`Printed ${list.length} sticker(s)`);
  };

  const printAllNew = async () => {
    if (!newOrders.length) {
      toast.error("No new orders in the last 7 days");
      return;
    }
    printLabelsBulk(newOrders.map(toLabel));
    await markPrinted(newOrders.map((o) => o.id));
    void mutate();
    toast.success(`Printed ${newOrders.length} new order sticker(s)`);
  };

  return (
    <div className="admin-pro-panel">
      <div className="admin-pro-header">
        <div>
          <h2 className="font-display text-xl font-bold text-[#324023]">Shipping Stickers</h2>
          <p className="mt-1 text-sm text-[#75786e]">
            100×150mm labels with customer details, CODE128 order barcode & CODE39 pincode
            barcode.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="admin-btn admin-btn--gold" onClick={() => void printAllNew()}>
            Print all new ({newOrders.length})
          </button>
          {selected.size > 0 ? (
            <button type="button" className="admin-btn" onClick={() => void handleBulkPrint()}>
              Print selected ({selected.size})
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="admin-pro-card overflow-hidden">
          <div className="border-b border-[rgba(50,64,35,0.1)] bg-[#e9f1dc]/50 px-4 py-3">
            <p className="font-sans text-sm font-semibold text-[#324023]">
              {orders.length} paid orders · auto-refreshes every 30s
            </p>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            {isLoading ? (
              <div className="admin-skeleton m-4 h-32" />
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#f5fce7]">
                  <tr>
                    <th className="p-3">
                      <input
                        type="checkbox"
                        className="accent-[#324023]"
                        checked={recent.length > 0 && recent.every((o) => selected.has(o.id))}
                        onChange={(e) =>
                          setSelected(
                            e.target.checked ? new Set(recent.map((o) => o.id)) : new Set()
                          )
                        }
                        aria-label="Select all"
                      />
                    </th>
                    <th className="p-3 font-semibold text-[#45483f]">Order</th>
                    <th className="p-3 font-semibold text-[#45483f]">Customer</th>
                    <th className="p-3 font-semibold text-[#45483f]">Address</th>
                    <th className="p-3 text-right font-semibold text-[#45483f]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t border-[rgba(50,64,35,0.08)] hover:bg-[#9A6F1A]/5"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="accent-[#324023]"
                          checked={selected.has(o.id)}
                          onChange={(e) => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (e.target.checked) next.add(o.id);
                              else next.delete(o.id);
                              return next;
                            });
                          }}
                          aria-label={`Select ${o.order_id}`}
                        />
                      </td>
                      <td className="p-3 font-mono text-xs font-bold text-[#324023]">
                        {o.order_id}
                        <p className="mt-0.5 font-sans font-normal text-[#75786e]">{o.pack}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-[#324023]">{o.full_name}</p>
                        <p className="text-xs text-[#25D366]">{o.mobile}</p>
                      </td>
                      <td className="p-3 text-xs text-[#45483f]">
                        {o.address}
                        <br />
                        {o.city}, {o.state} — {o.pincode}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm admin-btn--ghost"
                            onClick={() => setPreview(toLabel(o))}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm"
                            onClick={() => void handlePrint(o)}
                          >
                            Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="admin-pro-card p-4">
          <p className="mb-3 text-center font-sans text-xs font-semibold uppercase tracking-wider text-[#9A6F1A]">
            Sticker preview
          </p>
          {preview ? (
            <div className="flex justify-center">
              <div className="scale-[0.85] origin-top shadow-lg">
                <ShippingLabel order={preview} />
              </div>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-[#75786e]">
              Select Preview on an order to see the sticker layout.
            </p>
          )}
          {preview ? (
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                className="admin-btn w-full"
                onClick={() => {
                  const o = orders.find((x) => x.order_id === preview.order_id);
                  if (o) void handlePrint(o);
                }}
              >
                Print sticker
              </button>
              <button
                type="button"
                className={cn("admin-btn admin-btn--ghost w-full")}
                onClick={async () => {
                  setPreview(preview);
                  requestAnimationFrame(async () => {
                    if (!captureRef.current) return;
                    await downloadLabelPng(captureRef.current, preview.order_id);
                    toast.success("PNG downloaded");
                  });
                }}
              >
                Download PNG
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {preview ? (
        <div className="pointer-events-none fixed -left-[9999px] top-0">
          <ShippingLabel order={preview} captureRef={captureRef} />
        </div>
      ) : null}
    </div>
  );
}
