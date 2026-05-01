"use client";

import { useEffect, useState }  from "react";
import Script        from "next/script";
import { useRouter } from "next/navigation";

// ── Global Razorpay SDK types ──────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key:         string;
  amount:      number;
  currency:    string;
  name:        string;
  description: string;
  order_id:    string;
  image?:      string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?:  Record<string, string>;
  theme?:  { color: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?:  { ondismiss?: () => void; escape?: boolean };
}

interface RazorpayInstance {
  open: () => void;
  on:   (event: string, handler: (response: RazorpayFailedResponse) => void) => void;
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

interface RazorpayFailedResponse {
  error: {
    code:        string;
    description: string;
    source:      string;
    step:        string;
    reason:      string;
    metadata?: { order_id?: string; payment_id?: string };
  };
}

export interface RazorpayButtonProps {
  amount:     number;
  packLabel:  string;
  label?:     string;
  fullWidth?: boolean;
  disabled?:  boolean;
  autoTrigger?: boolean;
  onSuccess?: (paymentId: string, orderId: string) => void;
  style?:     React.CSSProperties;
}

type PaymentState =
  | "idle"
  | "creating"
  | "processing"
  | "verifying"
  | "success"
  | "failed"
  | "dismissed";

export default function RazorpayButton({
  amount,
  packLabel,
  label     = "Order Now",
  fullWidth = false,
  disabled  = false,
  autoTrigger = false,
  onSuccess,
  style,
}: RazorpayButtonProps) {
  const router                              = useRouter();
  const [state, setState]                   = useState<PaymentState>("idle");
  const [errorMsg, setErrorMsg]             = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded]     = useState(false);

  const isLoading = ["creating", "processing", "verifying"].includes(state);

  useEffect(() => {
    if (autoTrigger && scriptLoaded && state === "idle") {
      const t = setTimeout(() => {
        void handlePayment();
      }, 300);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTrigger, scriptLoaded, state]);

  const handlePayment = async () => {
    if (!scriptLoaded || !window.Razorpay) {
      setErrorMsg("Payment system is loading. Please try again in a moment.");
      return;
    }

    setErrorMsg(null);
    setState("creating");

    try {
      // ── Step 1: Create order on backend ─────────────────
      const orderRes = await fetch("/api/razorpay/order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ amount, packLabel }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || "Could not create order. Please try again.");
      }

      // ── Step 2: Public key (browser-safe only) ───────────
      const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!publicKey) {
        throw new Error("Payment configuration error. Please contact support.");
      }

      setState("processing");

      // ── Step 3: Configure modal ──────────────────────────
      const options: RazorpayOptions = {
        key:         publicKey,
        amount:      orderData.amount,
        currency:    orderData.currency,
        name:        "Royal Swag",
        description: `Lung Detox Tea — ${packLabel}`,
        order_id:    orderData.orderId,
        image:       "/images/new_logo.png",
        theme:       { color: "#4A6422" },
        prefill:     { name: "", email: "", contact: "" },
        notes:       { pack: packLabel },

        // ── Step 4a: Success ──────────────────────────────
        handler: async (response: RazorpaySuccessResponse) => {
          setState("verifying");

          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                amount,
                packLabel,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.ok) {
              throw new Error(
                verifyData.message ||
                "Payment verification failed. Please contact support."
              );
            }

            setState("success");
            onSuccess?.(verifyData.paymentId, verifyData.orderId);

            // Clear any stale cart state
            try {
              localStorage.removeItem("rs_selected_pack");
              localStorage.removeItem("rs_cart");
            } catch { /* ignore */ }

            router.push(
              `/order-confirmed?id=${verifyData.paymentId}&order=${verifyData.orderId}`
            );

          } catch (verifyErr: unknown) {
            const msg =
              verifyErr instanceof Error
                ? verifyErr.message
                : "Verification failed. If money was deducted, contact Eximburg@gmail.com";
            setState("failed");
            setErrorMsg(msg);
          }
        },

        // ── Step 4b: Modal dismissed ──────────────────────
        modal: {
          ondismiss: () => {
            setState("dismissed");
            setErrorMsg("Payment cancelled. Your order was not placed.");
          },
          escape: true,
        },
      };

      // ── Step 4: Open modal ───────────────────────────────
      const rzpInstance = new window.Razorpay(options);

      // ── Step 4c: Payment failed ───────────────────────
      rzpInstance.on("payment.failed", (response: RazorpayFailedResponse) => {
        setState("failed");
        setErrorMsg(
          `Payment failed: ${response.error.description || "Unknown error"}. ` +
          "Please try a different payment method."
        );
      });

      rzpInstance.open();

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setState("failed");
      setErrorMsg(message);
    }
  };

  // ── Label ──────────────────────────────────────────────────
  const buttonLabel =
    state === "creating"   ? "Creating order…"    :
    state === "processing" ? "Opening checkout…"  :
    state === "verifying"  ? "Verifying payment…" :
    state === "success"    ? "Payment confirmed ✓" :
    label;

  const buttonDisabled = disabled || isLoading || state === "success";

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
        onError={() =>
          setErrorMsg("Could not load payment system. Check your internet connection.")
        }
      />

      <button
        onClick={handlePayment}
        disabled={buttonDisabled}
        aria-label={`Pay ₹${amount} via Razorpay`}
        aria-busy={isLoading}
        style={{
          width:          fullWidth ? "100%" : "auto",
          background:
            state === "success" ? "#2D7A4A" :
            buttonDisabled      ? "#8AA870" :
            "#4A6422",
          color:          "#F2E6CE",
          border:         "none",
          borderRadius:   8,
          padding:        "16px 32px",
          fontFamily:     "var(--ff-body)",
          fontWeight:     600,
          fontSize:       15,
          cursor:         buttonDisabled ? "not-allowed" : "pointer",
          opacity:        isLoading ? 0.8 : 1,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            8,
          transition:     "background 0.2s, opacity 0.2s",
          ...style,
        }}
        onMouseEnter={e => {
          if (!buttonDisabled)
            (e.currentTarget as HTMLButtonElement).style.background = "#2D3D15";
        }}
        onMouseLeave={e => {
          if (!buttonDisabled)
            (e.currentTarget as HTMLButtonElement).style.background = "#4A6422";
        }}
      >
        {isLoading && (
          <span style={{
            display:      "inline-block",
            width:        14, height: 14,
            borderRadius: "50%",
            border:       "2px solid rgba(242,230,206,0.3)",
            borderTop:    "2px solid #F2E6CE",
            animation:    "rzp-spin 0.7s linear infinite",
            flexShrink:   0,
          }} />
        )}
        {buttonLabel}
      </button>

      {errorMsg && (
        <div role="alert" style={{
          marginTop:    10,
          padding:      "10px 14px",
          borderRadius: 6,
          background:
            state === "dismissed"
              ? "rgba(212,200,168,0.3)"
              : "rgba(160,32,32,0.08)",
          border: `1px solid ${
            state === "dismissed"
              ? "rgba(212,200,168,0.6)"
              : "rgba(160,32,32,0.25)"
          }`,
          fontSize:   13,
          lineHeight: 1.5,
          color: state === "dismissed" ? "#5C5647" : "#8B0000",
        }}>
          {errorMsg}
          {state === "failed" && (
            <button
              onClick={() => { setState("idle"); setErrorMsg(null); }}
              style={{
                marginLeft:     10,
                background:     "none",
                border:         "none",
                color:          "#4A6422",
                fontSize:       12,
                fontWeight:     600,
                cursor:         "pointer",
                padding:        0,
                textDecoration: "underline",
              }}
            >Try again</button>
          )}
        </div>
      )}

      <style>{`
        @keyframes rzp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
