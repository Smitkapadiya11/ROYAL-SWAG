"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

/** Marketing pages that show the fixed bottom tab bar on mobile. */
const BOTTOM_NAV_PATHS = new Set(["/", "/about", "/reviews"]);

export default function BottomNavHost() {
  const pathname = usePathname() ?? "/";
  const show = BOTTOM_NAV_PATHS.has(pathname);

  useEffect(() => {
    document.body.classList.toggle("has-bottom-nav", show);
    return () => {
      document.body.classList.remove("has-bottom-nav");
    };
  }, [show]);

  if (!show) return null;
  return <MobileBottomNav />;
}
