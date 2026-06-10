"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Analytics", icon: "📊", exact: true },
  { href: "/dashboard/orders", label: "Orders", icon: "📦" },
  { href: "/dashboard/leads", label: "Leads", icon: "🫁" },
  { href: "/dashboard/content", label: "Content", icon: "🎨" },
  { href: "/dashboard/media", label: "Media", icon: "🎥" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
] as const;

type DashboardSidebarProps = {
  onLogout: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

export default function DashboardSidebar({
  onLogout,
  mobileOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname() ?? "/";

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Close menu"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={cn(
          "dashboard-sidebar fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-white/10 bg-[#1A1D27] transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#10B981]">
            Royal Swag
          </p>
          <p className="mt-1 text-lg font-semibold text-[#F0F0F0]">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active =
              "exact" in item && item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#10B981]/15 text-[#10B981]"
                    : "text-[#9CA3AF] hover:bg-white/5 hover:text-[#F0F0F0]"
                )}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#EF4444] hover:bg-[#EF4444]/10"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
