"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import LiveClock from "./LiveClock";
import { cn } from "@/lib/utils";

type AdminDashboardShellProps = {
  children: ReactNode;
  onSignOut: () => void;
  title?: string;
};

export default function AdminDashboardShell({
  children,
  onSignOut,
  title = "Overview",
}: AdminDashboardShellProps) {
  const pathname = usePathname();
  const onDashboard =
    pathname === "/admin/dashboard" || pathname === "/admin";
  const onOrders = pathname === "/admin/orders";

  const dateLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="admin-dashboard-root flex min-h-screen bg-[#F4EDD6]">
      <AdminSidebar onSignOut={onSignOut} />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[rgba(200,210,190,0.5)] bg-[rgba(244,237,214,0.9)] px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl font-bold text-[#324023]">{title}</h1>
            <span className="rounded-full bg-[#e9f1dc] px-2 py-0.5 font-sans text-xs text-[#45483f]">
              {dateLabel}
            </span>
          </div>
          <LiveClock />
        </header>

        <nav
          className="sticky top-14 z-20 flex shrink-0 gap-2 border-b border-[rgba(200,210,190,0.5)] bg-[rgba(244,237,214,0.95)] px-4 py-2 md:hidden"
          aria-label="Admin mobile"
        >
          <Link
            href="/admin/dashboard"
            className={cn(
              "flex-1 rounded-lg py-2 text-center font-sans text-xs font-semibold",
              onDashboard
                ? "bg-[#324023] text-white"
                : "bg-white/50 text-[#45483f]"
            )}
          >
            Leads
          </Link>
          <Link
            href="/admin/orders"
            className={cn(
              "flex-1 rounded-lg py-2 text-center font-sans text-xs font-semibold",
              onOrders ? "bg-[#324023] text-white" : "bg-white/50 text-[#45483f]"
            )}
          >
            Orders
          </Link>
        </nav>

        <div className="flex-1 overflow-y-auto p-5 pb-24 md:p-8 md:pb-8">{children}</div>
      </div>
    </div>
  );
}
