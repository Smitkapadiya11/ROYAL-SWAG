"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  price?: number; // in ₹
}

interface ShippingForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh",
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutModal({
  isOpen,
  onClose,
  productName = "Royal Swag Lung Detox Tea",
  price = 359,
}: CheckoutModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<"form" | "paying">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ShippingForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Trap body scroll when open; reset step after paint (avoids sync setState in effect)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const t = window.setTimeout(() => {
        setStep("form");
        setError(null);
      }, 0);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const updateForm = (field: keyof ShippingForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): string | null => {
    if (!form.name.trim()) return "Full name is required.";
    const phone = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(phone)) return "Enter a valid 10-digit mobile number.";
    if (!form.address.trim()) return "Delivery address is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.state) return "Please select your state.";
    if (!/^\d{6}$/.test(form.pincode)) return "Enter a valid 6-digit pincode.";
    return null;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);
    setStep("paying");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Payment gateway failed to load. Please check your internet connection.");
        setStep("form");
        setLoading(false);
        return;
      }

      // Create Razorpay order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price * 100 }),
      });

      if (!orderRes.ok) {
        setError("Could not initiate payment. Please try again.");
        setStep("form");
        setLoading(false);
        return;
      }

      const { orderId, amount, currency, keyId } = await orderRes.json();

      // Open Razorpay checkout
      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount,
        currency,
        name: "Royal Swag",
        description: productName,
        order_id: orderId,
        prefill: {
          name: form.name,
          email: form.email || undefined,
          contact: `+91${form.phone.replace(/\D/g, "").slice(-10)}`,
        },
        notes: {
          address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
        },
        theme: { color: "#1a3a2a" },
        handler: async (response: any) => {
          // Verify payment server-side
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerName: form.name,
              customerPhone: form.phone,
              customerEmail: form.email,
              address: form.address,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
            }),
          });

          if (verifyRes.ok) {
            onClose();
            router.push(
              `/order-success?orderId=${encodeURIComponent(response.razorpay_order_id)}&paymentId=${encodeURIComponent(response.razorpay_payment_id)}&amountPaise=${price * 100}`
            );
          } else {
            setError("Payment verification failed. Please contact support with your payment ID: " + response.razorpay_payment_id);
            setStep("form");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => {
            setStep("form");
            setLoading(false);
          },
        },
      });

      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      setError("Something went wrong. Please try again.");
      setStep("form");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div
        ref={panelRef}
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--brand-sage)] shrink-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gold)]">Secure Checkout</p>
            <h2 className="text-lg font-bold text-[var(--brand-dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
              {productName}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="w-8 h-8 rounded-full bg-[var(--brand-sage)] flex items-center justify-center text-[var(--brand-dark)]/60 hover:bg-[var(--brand-sage)]/70 transition-colors shrink-0"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Order Summary */}
        <div className="px-6 py-3 bg-[var(--brand-sage)]/40 border-b border-[var(--brand-sage)] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand-green)] flex items-center justify-center text-lg">🍃</div>
              <div>
                <p className="text-sm font-semibold text-[var(--brand-dark)]">{productName}</p>
                <p className="text-xs text-[var(--brand-dark)]/50">30 bags · 30-day supply · Free delivery</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[var(--brand-dark)]">₹{price}</p>
              <p className="text-xs text-green-600 font-semibold">30% OFF</p>
            </div>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto">
          <form id="checkout-form" onSubmit={handlePay} className="px-6 py-5 space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                {error}
              </div>
            )}

            <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-dark)]/40">Delivery Details</p>

            {/* Name */}
            <div>
              <label htmlFor="co-name" className="block text-sm font-medium text-[var(--brand-dark)] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="co-name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 text-sm"
                placeholder="Rahul Sharma"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="co-phone" className="block text-sm font-medium text-[var(--brand-dark)] mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-dark)]/40 text-sm font-medium">+91</span>
                <input
                  id="co-phone"
                  type="tel"
                  required
                  maxLength={10}
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 text-sm"
                  placeholder="9876543210"
                />
              </div>
              <p className="mt-1 text-xs text-[var(--brand-dark)]/50">
                We never share your number. Only used for order updates.
              </p>
            </div>

            {/* Email (optional) */}
            <div>
              <label htmlFor="co-email" className="block text-sm font-medium text-[var(--brand-dark)] mb-1">
                Email <span className="text-[var(--brand-dark)]/30 font-normal">(optional — for order confirmation)</span>
              </label>
              <input
                id="co-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 text-sm"
                placeholder="rahul@example.com"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="co-address" className="block text-sm font-medium text-[var(--brand-dark)] mb-1">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <input
                id="co-address"
                type="text"
                required
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => updateForm("address", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 text-sm"
                placeholder="House No., Street, Area"
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="co-city" className="block text-sm font-medium text-[var(--brand-dark)] mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="co-city"
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 text-sm"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label htmlFor="co-pincode" className="block text-sm font-medium text-[var(--brand-dark)] mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  id="co-pincode"
                  type="text"
                  required
                  maxLength={6}
                  autoComplete="postal-code"
                  value={form.pincode}
                  onChange={(e) => updateForm("pincode", e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 text-sm"
                  placeholder="400001"
                />
              </div>
            </div>

            <div>
              <label htmlFor="co-state" className="block text-sm font-medium text-[var(--brand-dark)] mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="co-state"
                required
                autoComplete="address-level1"
                value={form.state}
                onChange={(e) => updateForm("state", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 text-sm"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Trust markers */}
            <div className="flex flex-wrap gap-3 pt-1 text-xs text-[var(--brand-dark)]/50">
              <span>🔒 256-bit SSL</span>
              <span>💳 UPI · Cards · Net Banking</span>
              <span>🚚 Free Delivery</span>
              <span>🔄 30-Day Guarantee</span>
            </div>
          </form>
        </div>

        {/* Sticky Pay Button */}
        <div className="px-6 py-4 border-t border-[var(--brand-sage)] bg-white shrink-0">
          <button
            type="submit"
            form="checkout-form"
            id="pay-now-btn"
            disabled={loading || step === "paying"}
            className="w-full py-4 rounded-full bg-[var(--brand-green)] text-white font-bold text-base shadow-md hover:bg-[#163d29] transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading || step === "paying" ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4" strokeDashoffset="10" />
                </svg>
                Opening Payment...
              </>
            ) : (
              <>🔒 Pay ₹{price} Securely</>
            )}
          </button>
          <p className="text-center text-xs text-[var(--brand-dark)]/30 mt-2">
            Powered by Razorpay. Your data is encrypted and never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
