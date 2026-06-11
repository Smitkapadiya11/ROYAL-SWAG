"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import LiveClock from "./LiveClock";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { href: "/admin/dashboard", label: "Leads" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/stickers", label: "Stickers" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
] as const;

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

  const dateLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="admin-dashboard-root flex min-h-screen bg-[#F4EDD6]">
      <AdminSidebar onSignOut={onSignOut} />

      <div className="ml-0 flex min-h-screen flex-1 flex-col md:ml-[220px]">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[rgba(200,210,190,0.5)] bg-[rgba(244,237,214,0.9)] px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-lg font-bold text-[#324023] md:text-xl">
              {title}
            </h1>
            <span className="hidden rounded-full bg-[#e9f1dc] px-2 py-0.5 font-sans text-xs text-[#45483f] sm:inline">
              {dateLabel}
            </span>
          </div>
          <LiveClock />
        </header>

        <nav
          className="sticky top-14 z-20 flex shrink-0 gap-1 overflow-x-auto border-b border-[rgba(200,210,190,0.5)] bg-[rgba(244,237,214,0.95)] px-2 py-2 md:hidden"
          aria-label="Admin mobile"
        >
          {MOBILE_NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === "/admin/dashboard" && pathname === "/admin");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-center font-sans text-xs font-semibold",
                  active
                    ? "bg-[#324023] text-white"
                    : "bg-white/50 text-[#45483f]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-8">{children}</div>
      </div>
    </div>
  );
}
