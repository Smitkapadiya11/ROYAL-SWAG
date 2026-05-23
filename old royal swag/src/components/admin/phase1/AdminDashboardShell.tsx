"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import LiveClock from "./LiveClock";
import BrandLogo from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

type AdminDashboardShellProps = {
  children: ReactNode;
  onSignOut: () => void;
};

export default function AdminDashboardShell({
  children,
  onSignOut,
}: AdminDashboardShellProps) {
  const pathname = usePathname();
  const onDashboard =
    pathname === "/admin/dashboard" || pathname === "/admin";
  const onOrders = pathname === "/admin/orders";

  return (
    <div className="admin-dashboard-root flex h-screen flex-col overflow-hidden bg-[#F4EDD6] text-[#171e11] antialiased selection:bg-[#9A6F1A]/30 selection:text-[#495738] md:flex-row">
      <AdminSidebar onSignOut={onSignOut} />

      <main className="relative flex h-screen flex-1 flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute right-[-5%] top-[-10%] z-0 h-96 w-96 rounded-full bg-[#9A6F1A]/10 blur-[100px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[-10%] left-[20%] z-0 h-[500px] w-[500px] rounded-full bg-[#495738]/5 blur-[120px]"
          aria-hidden
        />

        <header className="relative z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.6)] bg-[rgba(255,255,255,0.4)] px-6 shadow-sm backdrop-blur-md md:px-16">
          <div className="flex items-center gap-4 md:hidden">
            <BrandLogo variant="on-light" className="h-8 w-auto" />
          </div>
          <div className="hidden md:block" aria-hidden />
          <div className="flex items-center gap-3">
            <LiveClock />
            <button
              type="button"
              onClick={onSignOut}
              className="font-sans text-xs text-[#45483f] transition-colors hover:text-[#9A6F1A] md:hidden"
            >
              Sign out
            </button>
          </div>
        </header>

        <nav
          className="relative z-40 flex shrink-0 gap-2 border-b border-[rgba(255,255,255,0.6)] bg-white/30 px-4 py-2 md:hidden"
          aria-label="Admin mobile"
        >
          <Link
            href="/admin/dashboard"
            className={cn(
              "flex-1 rounded-lg py-2 text-center font-sans text-xs font-semibold",
              onDashboard
                ? "bg-[#495738] text-white"
                : "bg-white/50 text-[#45483f]"
            )}
          >
            Leads
          </Link>
          <Link
            href="/admin/orders"
            className={cn(
              "flex-1 rounded-lg py-2 text-center font-sans text-xs font-semibold",
              onOrders ? "bg-[#495738] text-white" : "bg-white/50 text-[#45483f]"
            )}
          >
            Orders
          </Link>
        </nav>

        <div className="relative z-10 flex-1 overflow-y-auto p-5 pb-32 md:p-16 md:pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
