"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { trackUnified } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const SHOWN_KEY = "popup_shown";
const CONVERTED_KEY = "popup_converted";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SKIP_PATH_PREFIXES = [
  "/lung-test/result",
  "/dashboard",
  "/admin",
  "/checkout",
  "/refer",
];

function shouldSkipPath(path: string): boolean {
  return SKIP_PATH_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
}

function cameFromLungResult(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const ref = document.referrer;
    if (ref && /\/lung-test\/result/i.test(ref)) return true;
    return sessionStorage.getItem("lung_test_lead_captured") === "1";
  } catch {
    return false;
  }
}

export default function LeadCapturePopup() {
  const pathname = usePathname() ?? "/";
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const triggeredRef = useRef(false);
  const mountTimeRef = useRef(Date.now());
  const lastMouseYRef = useRef(0);

  const markShown = useCallback(() => {
    try {
      sessionStorage.setItem(SHOWN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    markShown();
    trackUnified.customEvent("lead_popup_dismiss", { page: pathname });
  }, [markShown, pathname]);

  const showPopup = useCallback(() => {
    if (triggeredRef.current) return;
    try {
      if (sessionStorage.getItem(SHOWN_KEY)) return;
      if (sessionStorage.getItem(CONVERTED_KEY)) return;
    } catch {
      /* ignore */
    }
    if (shouldSkipPath(pathname) || cameFromLungResult()) return;

    triggeredRef.current = true;
    setOpen(true);
    markShown();
    trackUnified.leadCapture("popup");
    trackUnified.customEvent("lead_popup_shown", { page: pathname });
  }, [markShown, pathname]);

  useEffect(() => {
    if (shouldSkipPath(pathname) || cameFromLungResult()) return;
    try {
      if (sessionStorage.getItem(SHOWN_KEY) || sessionStorage.getItem(CONVERTED_KEY)) {
        return;
      }
    } catch {
      /* ignore */
    }

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    mountTimeRef.current = Date.now();

    if (isMobile) {
      let scrolledEnough = false;
      let timerDone = false;

      const tryShow = () => {
        if (scrolledEnough && timerDone) showPopup();
      };

      const onScroll = () => {
        const doc = document.documentElement;
        const scrollPct =
          doc.scrollHeight > window.innerHeight
            ? window.scrollY / (doc.scrollHeight - window.innerHeight)
            : 0;
        if (scrollPct >= 0.4) {
          scrolledEnough = true;
          tryShow();
        }
      };

      const timer = window.setTimeout(() => {
        timerDone = true;
        tryShow();
      }, 15_000);

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.clearTimeout(timer);
      };
    }

    const onMouseMove = (e: MouseEvent) => {
      const elapsed = Date.now() - mountTimeRef.current;
      if (elapsed < 5_000) {
        lastMouseYRef.current = e.clientY;
        return;
      }
      const movingUp = e.clientY < lastMouseYRef.current;
      lastMouseYRef.current = e.clientY;
      if (e.clientY < 50 && movingUp) {
        showPopup();
        document.removeEventListener("mousemove", onMouseMove);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [pathname, showPopup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads/popup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalized,
          source: "popup",
          page: pathname,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Could not submit");
      }
      setSuccess(true);
      try {
        sessionStorage.setItem(CONVERTED_KEY, "1");
        sessionStorage.setItem(SHOWN_KEY, "1");
      } catch {
        /* ignore */
      }
      trackUnified.leadCapture("popup_submit", normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (shouldSkipPath(pathname)) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) dismiss();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-popup-title"
        >
          <motion.div
            className={cn(
              "relative w-full max-w-[480px] rounded-t-[20px] bg-white p-6 shadow-2xl sm:rounded-[20px] sm:p-8",
              "max-h-[90vh] overflow-y-auto"
            )}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.9, y: 40 }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 20 }
            }
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : { type: "spring", stiffness: 380, damping: 28 }
            }
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-primary/60 transition-colors hover:bg-primary/5 hover:text-primary"
              aria-label="Close"
            >
              ×
            </button>

            <div className="mb-4 flex justify-center sm:justify-start">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-surface">
                <Image
                  src="/images/lungtest.webp"
                  alt="Ayurvedic herbs for lung health"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </div>

            <h2
              id="lead-popup-title"
              className="font-display text-2xl font-bold text-primary"
            >
              Free Ayurvedic Lung Health Guide
            </h2>
            <p className="mt-2 font-body text-sm text-on-surface-variant">
              7 Daily Habits for Cleaner, Stronger Lungs
            </p>

            {success ? (
              <p className="mt-8 text-center font-body text-lg font-semibold text-primary">
                Check your inbox! 📬
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6">
                <label htmlFor="lead-popup-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="lead-popup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3 w-full rounded-xl border border-primary/20 bg-white px-4 py-3.5 font-body text-base text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
                {error ? (
                  <p className="mb-2 font-body text-sm text-red-600">{error}</p>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send Me the Free Guide →"}
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="mt-4 w-full font-body text-sm text-on-surface-variant underline-offset-2 hover:underline"
                >
                  No thanks
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
