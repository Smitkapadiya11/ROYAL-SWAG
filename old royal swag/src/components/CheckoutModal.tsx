"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { PACKS, APP_SITE } from "@/lib/config";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ROYAL_SWAG_LOGO_SRC } from "@/lib/brand-logo";

const schema = z.object({
  full_name: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile"),
  email: z.string().email().optional().or(z.literal("")),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().length(6, "6-digit pincode"),
});

type CheckoutForm = z.infer<typeof schema>;

interface Props {
  packId: string;
  onClose: () => void;
}

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayHandlerResponse) => void | Promise<void>;
  prefill?: { name?: string; contact?: string; email?: string };
  theme?: { color: string };
}

export default function CheckoutModal({ packId, onClose }: Props) {
  const pack = PACKS.find((p) => p.id === packId);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current, { opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.out" });

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  if (!pack) {
    return null;
  }

  const close = () => {
    if (!ref.current) {
      onClose();
      return;
    }
    gsap.to(ref.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  const onSubmit = async (formData: CheckoutForm) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: pack.price,
          packId: pack.id,
          customerData: formData,
        }),
      });

      const payload = (await res.json()) as {
        orderId?: string;
        key?: string;
        amount?: number;
        currency?: string;
        error?: string;
      };
      if (!res.ok || !payload.orderId || !payload.key) {
        throw new Error(payload.error ?? "Could not create payment order");
      }

      const key = payload.key;
      const amountPaise = payload.amount ?? pack.price * 100;

      const RazorpayCtor = (window as Window & { Razorpay?: new (o: RazorpayOptions) => { open: () => void } })
        .Razorpay;
      if (!RazorpayCtor) {
        throw new Error("Razorpay checkout failed to load. Please refresh and try again.");
      }

      const options: RazorpayOptions = {
        key,
        amount: amountPaise,
        currency: payload.currency || "INR",
        name: "Royal Swag",
        description: pack.label + " — Lung Detox Tea",
        image: ROYAL_SWAG_LOGO_SRC,
        order_id: payload.orderId,
        handler: async (response) => {
          const verify = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerData: {
                name: formData.full_name,
                phone: formData.phone,
                email: formData.email || user?.email || "",
                address: formData.line1,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                userId: user?.id || null,
              },
              packData: {
                pack_name: pack.id,
                packId: pack.id,
                amount: pack.price,
                days: pack.days,
              },
            }),
          });
          const result = (await verify.json()) as {
            success?: boolean;
            orderId?: string;
            orderNumber?: string;
            order?: { order_number: string };
            error?: string;
          };
          if (result.success) {
            toast.success("Order placed! Confirmation sent to WhatsApp.");
            const num =
              result.orderNumber ||
              result.order?.order_number ||
              result.orderId ||
              "";
            router.push("/order-success?id=" + encodeURIComponent(num));
          } else {
            toast.error(result.error ?? "Payment verification failed");
          }
        },
        prefill: {
          name: formData.full_name,
          contact: "91" + formData.phone,
          email: formData.email || undefined,
        },
        theme: { color: "#2D6A2D" },
      };

      new RazorpayCtor(options).open();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid #E0E8E0",
    background: "#FAFCFA",
    fontSize: 14,
    fontFamily: "var(--font-sans)",
    color: "#1C1C1C",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        overflowY: "auto",
      }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={ref}
        style={{
          background: "#FFFFFF",
          borderRadius: 24,
          width: "100%",
          maxWidth: 520,
          padding: "clamp(24px,4vw,40px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontFamily: "var(--font-playfair-display)", fontSize: 24, color: "#1A3A1A" }}>
            Complete Your Order
          </h2>
          <button
            type="button"
            onClick={close}
            style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999" }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#1A3A1A,#2D6A2D)",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div>
            <div style={{ color: "rgba(250,246,238,0.7)", fontSize: 12 }}>Ordering</div>
            <div style={{ color: "#FAF6EE", fontWeight: 700, fontSize: 16 }}>{pack.label}</div>
            <div style={{ color: "rgba(250,246,238,0.6)", fontSize: 12 }}>
              {pack.bags} tea bags · {pack.days}-day supply
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#E8C84A", fontSize: 24, fontWeight: 800 }}>Rs {pack.price}</div>
            <div style={{ color: "rgba(250,246,238,0.5)", fontSize: 11, textDecoration: "line-through" }}>
              Rs {pack.original}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="checkout-form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 4 }}>
                  Full Name *
                </label>
                <input {...register("full_name")} placeholder="Your name" style={inp} />
                {errors.full_name && (
                  <span style={{ color: "#C0392B", fontSize: 11 }}>{errors.full_name.message}</span>
                )}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 4 }}>
                  Mobile *
                </label>
                <input {...register("phone")} placeholder="10-digit mobile" style={inp} type="tel" />
                {errors.phone && (
                  <span style={{ color: "#C0392B", fontSize: 11 }}>{errors.phone.message}</span>
                )}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 4 }}>
                Email (optional)
              </label>
              <input {...register("email")} placeholder={APP_SITE.email} style={inp} type="email" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 4 }}>
                Address Line 1 *
              </label>
              <input {...register("line1")} placeholder="House/Flat no, Street" style={inp} />
              {errors.line1 && <span style={{ color: "#C0392B", fontSize: 11 }}>{errors.line1.message}</span>}
            </div>
            <input {...register("line2")} placeholder="Area, Landmark (optional)" style={inp} />
            <div className="checkout-form-row-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <input {...register("city")} placeholder="City *" style={inp} />
                {errors.city && <span style={{ color: "#C0392B", fontSize: 11 }}>{errors.city.message}</span>}
              </div>
              <div>
                <input {...register("state")} placeholder="State *" style={inp} />
                {errors.state && <span style={{ color: "#C0392B", fontSize: 11 }}>{errors.state.message}</span>}
              </div>
              <div>
                <input {...register("pincode")} placeholder="Pincode *" style={inp} maxLength={6} />
                {errors.pincode && (
                  <span style={{ color: "#C0392B", fontSize: 11 }}>{errors.pincode.message}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "18px",
                fontSize: 16,
                opacity: loading ? 0.7 : 1,
                marginTop: 8,
                border: "none",
                borderRadius: 12,
                cursor: loading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {loading ? "Processing..." : "Pay Rs " + pack.price + " Securely"}
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: "#999" }}>
              Secure payment via Razorpay · UPI · Cards · Net Banking · COD
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
