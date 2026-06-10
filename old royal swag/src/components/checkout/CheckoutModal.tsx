"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ClientPortal from "@/components/ui/ClientPortal";
import { ROYAL_SWAG_LOGO_SRC } from "@/lib/brand-logo";
import { PRODUCT_SKU } from "@/lib/product-price";
import { ANALYTICS_EVENTS, track, trackPurchaseOnce } from "@/lib/analytics";
import { getStoredReferralCode, getStoredUtm } from "@/lib/customer-analytics";
import { MAIN_PRODUCT_IMAGE } from "@/lib/product-images";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address"),
  addressLine1: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a 6-digit pincode"),
});

type CheckoutForm = z.infer<typeof schema>;

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  price: number;
  mrp: number;
  packId: string;
  packLabel: string;
  quantity?: number;
  /** Start on summary step when item was added to cart */
  initialPhase?: 1 | 2;
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const fieldClass =
  "w-full rounded-xl border border-primary/15 bg-white/90 px-4 py-3 text-sm text-primary outline-none transition focus:border-[#0D3B1F] focus:ring-2 focus:ring-[#0D3B1F]/10";

export default function CheckoutModal({
  open,
  onClose,
  price,
  mrp,
  packId,
  packLabel,
  quantity = 1,
  initialPhase = 1,
}: CheckoutModalProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<1 | 2>(initialPhase);
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) return;
    setPhase(initialPhase);
    loadRazorpayScript().then(setScriptReady);
  }, [open, initialPhase]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const goToSummary = async () => {
    const valid = await trigger();
    if (valid) setPhase(2);
  };

  const startPayment = async (form: CheckoutForm) => {
    setLoading(true);
    track(ANALYTICS_EVENTS.INITIATE_CHECKOUT, {
      value: price,
      currency: "INR",
      num_items: quantity,
      pack_name: packLabel,
      page: "/product",
    });

    try {
      if (!scriptReady) {
        const ok = await loadRazorpayScript();
        if (!ok) throw new Error("Payment system failed to load. Check your connection.");
      }

      const createRes = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          amount: price,
          currency: "INR",
          receipt: `rs_${Date.now()}`,
          packId,
          customerData: {
            fullName: form.fullName,
            phone: form.phone,
            email: form.email,
            addressLine1: form.addressLine1,
            city: form.city,
            state: "India",
            pincode: form.pincode,
          },
        }),
      });

      const created = (await createRes.json()) as {
        orderId?: string;
        amount?: number;
        currency?: string;
        key?: string;
        keyId?: string;
        error?: string;
      };

      const checkoutKey = created.keyId || created.key;
      if (!createRes.ok || !created.orderId || !checkoutKey) {
        throw new Error(created.error || "Could not start checkout");
      }

      const RazorpayCtor = (
        window as unknown as {
          Razorpay?: new (options: Record<string, unknown>) => {
            open: () => void;
            on: (event: string, cb: () => void) => void;
          };
        }
      ).Razorpay;

      if (!RazorpayCtor) {
        throw new Error("Razorpay is not available");
      }

      await new Promise<void>((resolve, reject) => {
        const rzp = new RazorpayCtor({
          key: checkoutKey,
          amount: created.amount ?? price * 100,
          currency: created.currency || "INR",
          name: "Royal Swag",
          description: "Lung Detox Tea - 30 bags",
          image: ROYAL_SWAG_LOGO_SRC,
          order_id: created.orderId,
          prefill: {
            name: form.fullName,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#0D3B1F" },
          handler: async (response: RazorpayResponse) => {
            try {
              const utm = getStoredUtm();
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  ref: getStoredReferralCode() || undefined,
                  utm_source: utm.utm_source,
                  customerData: {
                    name: form.fullName,
                    phone: form.phone,
                    email: form.email,
                    address: form.addressLine1,
                    city: form.city,
                    state: "India",
                    pincode: form.pincode,
                  },
                  packData: {
                    packId,
                    pack_name: packLabel,
                    amount: price,
                  },
                }),
              });

              const verified = (await verifyRes.json()) as {
                success?: boolean;
                orderId?: string;
                orderNumber?: string;
                error?: string;
              };

              if (!verifyRes.ok || !verified.success) {
                throw new Error(verified.error || "Payment verification failed");
              }

              const orderId =
                verified.orderNumber || verified.orderId || created.orderId || "";

              trackPurchaseOnce(String(orderId), {
                value: price,
                amount: price,
                currency: "INR",
                order_id: orderId,
                pack: packId,
                pack_name: packLabel,
                content_name: packLabel,
              });

              toast.success("Payment successful!");
              onClose();
              router.push(
                `/checkout/success?orderId=${encodeURIComponent(orderId)}`
              );
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              reject(new Error("Payment cancelled"));
            },
          },
        });

        rzp.on("payment.failed", () => {
          reject(new Error("Payment failed. Please try again."));
        });

        rzp.open();
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      if (msg !== "Payment cancelled") {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const onConfirmPay = () => {
    const form = getValues();
    void startPayment(form);
  };

  return (
    <ClientPortal>
      <div className="fixed inset-0 z-[80] flex flex-col justify-end md:items-center md:justify-center md:p-6">
        <button
          type="button"
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-label="Close checkout"
          onClick={onClose}
        />
        <div
          className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-[#F4EDD6] md:max-w-lg md:rounded-3xl md:shadow-2xl"
          style={{
            animation: "slideUp 0.3s cubic-bezier(0.34, 1, 0.64, 1) forwards",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
        >
          <div className="flex justify-center pb-1 pt-3 md:hidden">
            <div className="h-1 w-10 rounded-full bg-[#c5c8bc]" />
          </div>

          <div className="flex items-center justify-between border-b border-[rgba(200,210,190,0.4)] px-5 py-3">
            <div>
              <h2
                id="checkout-modal-title"
                className="font-display text-xl font-bold text-[#324023]"
              >
                {phase === 1 ? "Your Details" : "Order Summary"}
              </h2>
              <p className="font-sans text-xs text-[#45483f]">
                Step {phase} of 2 · {packLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dee5d1] text-sm font-bold text-[#324023]"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {phase === 1 ? (
            <form
              onSubmit={handleSubmit(goToSummary)}
              className="flex flex-col gap-4 px-5 pb-8 pt-4"
            >
              <div>
                <input
                  {...register("fullName")}
                  className={fieldClass}
                  placeholder="Full name *"
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-700">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("phone")}
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className={fieldClass}
                  placeholder="Phone (+91) *"
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-700">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("email")}
                  type="email"
                  className={fieldClass}
                  placeholder="Email *"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("addressLine1")}
                  className={fieldClass}
                  placeholder="Delivery address *"
                  autoComplete="street-address"
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-xs text-red-700">
                    {errors.addressLine1.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    {...register("city")}
                    className={fieldClass}
                    placeholder="City *"
                    autoComplete="address-level2"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-700">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register("pincode")}
                    inputMode="numeric"
                    maxLength={6}
                    className={fieldClass}
                    placeholder="Pincode *"
                    autoComplete="postal-code"
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-700">{errors.pincode.message}</p>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-buy-now mt-2">
                Continue to Summary
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-4 px-5 pb-8 pt-4">
              <div className="flex gap-4 rounded-2xl border border-primary/10 bg-white/50 p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={MAIN_PRODUCT_IMAGE}
                    alt="Royal Swag Lung Detox Tea"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-bold text-primary">
                    {packLabel}
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant">
                    SKU {PRODUCT_SKU} · Qty {quantity}
                  </p>
                  <p className="mt-2 font-number text-xl font-bold tabular-nums text-primary">
                    ₹{price}
                    <span className="ml-2 text-sm font-normal text-on-surface-variant line-through">
                      ₹{mrp}
                    </span>
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-[#0D3B1F]/10 px-2.5 py-0.5 font-sans text-[10px] font-semibold text-[#0D3B1F]">
                    🚚 Free Delivery
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-[#324023] px-4 py-3 text-center">
                <p className="font-sans text-sm font-bold text-white">
                  30-Day Money Back Guarantee
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPhase(1)}
                  className="btn-add-cart flex-1"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={onConfirmPay}
                  className={cn("btn-buy-now flex-[1.4]", loading && "opacity-70")}
                >
                  {loading ? "Processing…" : `Confirm & Pay ₹${price}`}
                </button>
              </div>

              <p className="text-center text-xs text-primary/60">
                Secure checkout · UPI · Cards · Net Banking · Razorpay
              </p>
            </div>
          )}
        </div>
      </div>
    </ClientPortal>
  );
}
