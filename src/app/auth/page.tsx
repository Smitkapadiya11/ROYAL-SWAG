"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { supabase } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  ROYAL_SWAG_LOGO_HEIGHT,
  ROYAL_SWAG_LOGO_SRC,
  ROYAL_SWAG_LOGO_WIDTH,
} from "@/lib/brand-logo";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Min 6 characters"),
});

const signupSchema = loginSchema.extend({
  full_name: z.string().min(2, "Name required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile"),
  password: z.string().min(8, "Min 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;
type Tab = "login" | "signup";

const signupFields = [
  { name: "full_name" as const, placeholder: "Full Name", type: "text" },
  { name: "phone" as const, placeholder: "Mobile Number (10 digits)", type: "tel" },
  { name: "email" as const, placeholder: "Email Address", type: "email" },
  { name: "password" as const, placeholder: "Password (min 8 chars)", type: "password" },
];

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        left: `${((i * 37 + 11) % 97) + 1}%`,
        top: `${((i * 53 + 7) % 93) + 2}%`,
        size: 2 + (i % 4),
        duration: 3 + (i % 4),
        delay: (i % 5) * 0.6,
      })),
    []
  );

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.from(cardRef.current, { y: 60, opacity: 0, duration: 0.9, ease: "power3.out" });
  }, []);

  const switchTab = (t: Tab) => {
    if (!cardRef.current) {
      setTab(t);
      return;
    }
    gsap.to(cardRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        setTab(t);
        gsap.to(cardRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
      },
    });
  };

  const onLogin = async (data: LoginForm) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    router.push("/profile");
    router.refresh();
  };

  const onSignup = async (data: SignupForm) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name, phone: data.phone } },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    await supabase
      .from("profiles")
      .update({ phone: data.phone, full_name: data.full_name })
      .eq("email", data.email);
    setLoading(false);
    toast.success("Account created! Check email to verify.");
    switchTab("login");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1.5px solid #E0E8E0",
    background: "#F8FCF8",
    fontFamily: "var(--font-sans)",
    fontSize: 15,
    color: "#1C1C1C",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0D2010 0%, #1A3A1A 50%, #2D4A1A 100%)",
        padding: "20px",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              background: "rgba(196,154,42,0.4)",
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div
        ref={cardRef}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.97)",
          borderRadius: 24,
          padding: "clamp(32px,5vw,48px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Image
            src={ROYAL_SWAG_LOGO_SRC}
            alt="Royal Swag"
            width={ROYAL_SWAG_LOGO_WIDTH}
            height={ROYAL_SWAG_LOGO_HEIGHT}
            style={{ objectFit: "contain", margin: "0 auto 12px", width: 120, height: "auto" }}
            priority
          />
          <p style={{ color: "#6B6B6B", fontSize: 14 }}>
            {tab === "login" ? "Sign in to your account" : "Create your Royal Swag account"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            background: "#F0F4F0",
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
          }}
        >
          {(["login", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: tab === t ? "#1A3A1A" : "transparent",
                color: tab === t ? "#FAF6EE" : "#6B6B6B",
                fontWeight: tab === t ? 600 : 400,
                fontSize: 14,
                fontFamily: "var(--font-sans)",
                transition: "all 0.2s",
              }}
            >
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {tab === "login" ? (
          <form onSubmit={loginForm.handleSubmit(onLogin)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <input {...loginForm.register("email")} placeholder="Email address" style={inputStyle} type="email" />
                {loginForm.formState.errors.email && (
                  <span style={{ color: "#C0392B", fontSize: 12 }}>{loginForm.formState.errors.email.message}</span>
                )}
              </div>
              <div>
                <input {...loginForm.register("password")} placeholder="Password" style={inputStyle} type="password" />
                {loginForm.formState.errors.password && (
                  <span style={{ color: "#C0392B", fontSize: 12 }}>{loginForm.formState.errors.password.message}</span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "16px",
                  fontSize: 16,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={signupForm.handleSubmit(onSignup)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {signupFields.map((f) => (
                <div key={f.name}>
                  <input {...signupForm.register(f.name)} placeholder={f.placeholder} style={inputStyle} type={f.type} />
                  {signupForm.formState.errors[f.name] && (
                    <span style={{ color: "#C0392B", fontSize: 12 }}>
                      {signupForm.formState.errors[f.name]?.message}
                    </span>
                  )}
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "16px",
                  fontSize: 16,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#999" }}>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        input:focus { border-color: #2D6A2D !important; box-shadow: 0 0 0 3px rgba(45,106,45,0.1); }
      `}</style>
    </div>
  );
}
