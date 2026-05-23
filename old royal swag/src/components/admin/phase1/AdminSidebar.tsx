"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

const COMING_SOON = [
  "Live Visitors",
  "Revenue Analytics",
  "Customer Profiles",
  "Meta Pixel Data",
  "Referral Program",
  "Hindi Translations",
] as const;

const activeStyle =
  "flex items-center gap-3 rounded-xl border-l-2 border-[#9A6F1A] bg-[rgba(255,255,255,0.1)] px-4 py-3 font-semibold text-[#9A6F1A] shadow-inner transition-colors";

const inactiveStyle =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-white/80 transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-white";

type AdminSidebarProps = {
  onSignOut: () => void;
};

export default function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  const pathname = usePathname();
  const onDashboard =
    pathname === "/admin/dashboard" || pathname === "/admin";
  const onOrders = pathname === "/admin/orders";

  return (
    <aside className="relative z-40 hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#495738] shadow-lg md:flex">
      <div className="p-8">
        <BrandLogo variant="on-dark" className="mb-3 h-8 w-auto" />
        <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white/60">
          Admin Portal
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4" aria-label="Admin">
        <Link
          href="/admin/dashboard"
          className={cn(onDashboard ? activeStyle : inactiveStyle)}
        >
          <span aria-hidden>🧪</span>
          <span className="font-sans text-sm font-semibold">Lung Test Leads</span>
        </Link>
        <Link
          href="/admin/orders"
          className={cn(onOrders ? activeStyle : inactiveStyle)}
        >
          <span aria-hidden>🛍</span>
          <span className={cn("font-sans text-sm", onOrders && "font-semibold")}>
            Orders
          </span>
        </Link>

        <div className="mt-6 px-4">
          <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
            Coming Soon
          </p>
        </div>
        {COMING_SOON.map((item) => (
          <div
            key={item}
            title="Coming in Phase 2"
            className="flex cursor-not-allowed select-none items-center gap-3 rounded-xl px-4 py-3 text-white/25"
          >
            <span className="text-sm" aria-hidden>
              🔒
            </span>
            <span className="font-sans text-sm line-through">{item}</span>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9A6F1A] font-sans font-bold text-white">
            A
          </div>
          <div>
            <p className="font-sans text-sm font-semibold text-white">Admin User</p>
            <p className="font-sans text-xs text-white/60">System Operator</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-4 w-full text-left font-sans text-xs text-white/40 transition-colors hover:text-white/70"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
