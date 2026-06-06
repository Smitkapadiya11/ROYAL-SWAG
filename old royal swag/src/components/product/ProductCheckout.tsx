"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ProductSocialProof from "@/components/ui/ProductSocialProof";
import { ANALYTICS_EVENTS, track, trackPurchaseOnce } from "@/lib/analytics";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  addressLine1: z.string().min(5, "Enter your address"),
  city: z.string().min(2, "Enter city"),
  state: z.string().min(2, "Enter state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a 6-digit pincode"),
});

type CheckoutForm = z.infer<typeof schema>;

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type ProductCheckoutProps = {
  price: number;
  packId: string;
  packLabel?: string;
  className?: string;
  showSocialProof?: boolean;
  /** When true, omits outer section wrapper (for bottom-sheet modal). */
  embedded?: boolean;
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

export default function ProductCheckout({
  price,
  packId,
  packLabel = "Lung Detox Tea",
  className,
  showSocialProof = false,
  embedded = false,
}: ProductCheckoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    loadRazorpayScript().then(setScriptReady);
  }, []);

  const onSubmit = async (form: CheckoutForm) => {
    setLoading(true);
    track(ANALYTICS_EVENTS.ADD_TO_CART, {
      value: price,
      currency: "INR",
      content_name: packLabel,
      pack_name: packLabel,
      packId,
      num_items: 1,
      page: "/product",
    });
    try {
      if (!scriptReady) {
        const ok = await loadRazorpayScript();
        if (!ok) throw new Error("Payment system failed to load. Check your connection.");
      }

      const createRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          packId,
          customerData: {
            fullName: form.fullName,
            phone: form.phone,
            email: form.email || "",
            addressLine1: form.addressLine1,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        }),
      });

      const created = (await createRes.json()) as {
        orderId?: string;
        amount?: number;
        currency?: string;
        key?: string;
        error?: string;
      };

      if (!createRes.ok || !created.orderId || !created.key) {
        throw new Error(created.error || "Could not start checkout");
      }

      const checkoutKey = created.key;
      const razorpayOrderId = created.orderId;
      const amountPaise = created.amount ?? price * 100;

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
          amount: amountPaise,
          currency: created.currency || "INR",
          name: "Royal Swag",
          description: packLabel,
          order_id: razorpayOrderId,
          prefill: {
            name: form.fullName,
            email: form.email || undefined,
            contact: form.phone,
          },
          theme: { color: "#324023" },
          handler: async (response: RazorpayResponse) => {
            try {
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  customerData: {
                    name: form.fullName,
                    phone: form.phone,
                    email: form.email || "",
                    address: form.addressLine1,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode,
                  },
                  packData: {
                    pack_name: packId,
                    packId,
                    amount: price,
                  },
                }),
              });

              const verified = (await verifyRes.json()) as {
                success?: boolean;
                orderId?: string;
                orderNumber?: string;
                order?: { order_number: string };
                error?: string;
              };

              if (!verifyRes.ok || !verified.success) {
                throw new Error(verified.error || "Payment verification failed");
              }

              const id =
                verified.orderNumber ||
                verified.orderId ||
                verified.order?.order_number ||
                "";

              trackPurchaseOnce(String(id), {
                value: price,
                amount: price,
                currency: "INR",
                order_id: id,
                pack: packId,
                pack_name: packLabel,
                content_name: packLabel,
              });
              toast.success("Payment successful!");
              router.push(`/order-success?id=${encodeURIComponent(id || "")}`);
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

        track(ANALYTICS_EVENTS.INITIATE_CHECKOUT, {
          value: price,
          currency: "INR",
          num_items: 1,
          pack_name: packLabel,
          page: "/product",
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

  const fieldClass =
    "w-full rounded-xl border border-primary/20 bg-white/80 px-4 py-3 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

  const form = (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">
              Full Name *
            </label>
            <input {...register("fullName")} className={fieldClass} placeholder="Full name" />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-700">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">
              Phone *
            </label>
            <input
              {...register("phone")}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className={fieldClass}
              placeholder="10-digit mobile"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-700">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className={fieldClass}
              placeholder="you@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">
              Address Line 1 *
            </label>
            <input
              {...register("addressLine1")}
              className={fieldClass}
              placeholder="House no., street, area"
            />
            {errors.addressLine1 && (
              <p className="mt-1 text-xs text-red-700">{errors.addressLine1.message}</p>
            )}
          </div>
          <div>
            <input {...register("city")} className={fieldClass} placeholder="City *" />
            {errors.city && (
              <p className="mt-1 text-xs text-red-700">{errors.city.message}</p>
            )}
          </div>
          <div>
            <input {...register("state")} className={fieldClass} placeholder="State *" />
            {errors.state && (
              <p className="mt-1 text-xs text-red-700">{errors.state.message}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <input
              {...register("pincode")}
              className={fieldClass}
              placeholder="Pincode *"
              maxLength={6}
              inputMode="numeric"
            />
            {errors.pincode && (
              <p className="mt-1 text-xs text-red-700">{errors.pincode.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          data-track-button="product-buy-now"
          data-track-label={`Buy Now — ₹${price}`}
          className={cn(
            "mx-auto flex w-full max-w-full items-center justify-center gap-2 rounded-xl bg-primary py-4",
            "font-body text-base font-semibold tracking-[0.05em] text-white",
            "transition-[transform,box-shadow] duration-200",
            "hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(154,111,26,0.3)]",
            "active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70",
            "md:max-w-[320px]"
          )}
        >
          <span className="material-symbols-outlined text-[22px]" aria-hidden>
            shopping_bag
          </span>
          {loading ? "Processing…" : `Buy Now — ₹${price}`}
        </button>

        {showSocialProof && <ProductSocialProof className="mx-auto max-w-[320px] md:max-w-full" />}

        <p className="text-center text-xs text-primary/60">
          Secure checkout · UPI · Cards · Net Banking · Razorpay
        </p>
      </form>
  );

  if (embedded) {
    return <div className={cn("w-full", className)}>{form}</div>;
  }

  return (
    <section id="product-checkout" className={cn("w-full scroll-mt-24", className)}>
      {form}
    </section>
  );
}
