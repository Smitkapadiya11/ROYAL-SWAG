"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ROYAL_SWAG_LOGO_HEIGHT,
  ROYAL_SWAG_LOGO_SRC,
  ROYAL_SWAG_LOGO_WIDTH,
} from "@/lib/brand-logo";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOTP = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) {
      setError(error.message);
    } else {
      setStep("otp");
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/profile";
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="m-0 flex justify-center">
            <Image
              src={ROYAL_SWAG_LOGO_SRC}
              alt="Royal Swag Logo"
              width={ROYAL_SWAG_LOGO_WIDTH}
              height={ROYAL_SWAG_LOGO_HEIGHT}
              className="h-14 w-auto"
              priority
            />
          </h1>
          <p className="text-xs text-[#c9a84c] tracking-widest mt-2">ESTD. 2016</p>
        </div>

        {step === "email" ? (
          <>
            <h2 className="text-xl font-semibold text-[#1a3a2a] mb-2">Sign In</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your email to receive a one-time login code.</p>
            <input
              type="email"
              placeholder="Eximburg@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-[#1a3a2a]"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              onClick={sendOTP}
              disabled={loading || !email}
              className="w-full bg-[#1a3a2a] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#2d5a3d] disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending..." : "Send Login Code →"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-[#1a3a2a] mb-2">Enter Code</h2>
            <p className="text-sm text-gray-500 mb-6">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-[#1a3a2a] text-center text-2xl tracking-widest"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              onClick={verifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#1a3a2a] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#2d5a3d] disabled:opacity-50 transition-colors"
            >
              {loading ? "Verifying..." : "Verify & Sign In →"}
            </button>
            <button
              onClick={() => setStep("email")}
              className="w-full text-center text-sm text-gray-400 mt-3 hover:text-gray-600"
            >
              ← Use different email
            </button>
          </>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">🔒 Secure login. No password needed.</p>
      </div>
    </main>
  );
}
