"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SESSION_KEY = "rs_exit_intent_seen";

export default function ExitIntentModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname !== "/" && pathname !== "/product") return;
    if (window.matchMedia("(max-width: 1023px)").matches) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const onMouseOut = (e: MouseEvent) => {
      const rel = (e as MouseEvent & { relatedTarget: EventTarget | null }).relatedTarget;
      if (rel != null) return;
      if (e.clientY > 32) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
    };

    document.documentElement.addEventListener("mouseout", onMouseOut);
    return () => document.documentElement.removeEventListener("mouseout", onMouseOut);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      onClick={() => setOpen(false)}
    >
      <div
        className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0D3B1F] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="exit-intent-title" className="text-xl font-bold text-white sm:text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Heading out already?
        </h2>
        <p className="mt-3 text-sm text-white/75 leading-[1.65]">
          The lung quiz is free and takes a couple of minutes.
          You get a simple score plus herb notes — handy before you order tea.
        </p>
        <Link
          href="/lung-test"
          onClick={() => setOpen(false)}
          className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#16a34a] px-4 py-3 text-base font-bold text-white"
        >
          See My Lung Score →
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 w-full text-center text-xs text-white/40 underline underline-offset-2 hover:text-white/60"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
