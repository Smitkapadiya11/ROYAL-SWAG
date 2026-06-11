"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const COMING_SOON = [
  "Live Visitors",
  "Revenue Analytics",
  "Customer Profiles",
  "Meta Pixel Data",
  "Referral Program",
] as const;

const MAIN_NAV = [
  { href: "/admin/dashboard", label: "Lung Test Leads", icon: "🫁", match: "/admin/dashboard" },
  { href: "/admin/orders", label: "Orders", icon: "🛍", match: "/admin/orders" },
  { href: "/admin/stickers", label: "Shipping Stickers", icon: "🏷", match: "/admin/stickers" },
] as const;

const STORE_NAV = [
  { href: "/admin/content", label: "Content", icon: "✏️", match: "/admin/content" },
  { href: "/admin/media", label: "Media", icon: "🎥", match: "/admin/media" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️", match: "/admin/settings" },
] as const;

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm transition-all duration-200",
        active
          ? "border-l-2 border-[#9A6F1A] bg-white/10 font-semibold text-[#9A6F1A]"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      )}
    >
      <span aria-hidden>{icon}</span>
      {label}
    </Link>
  );
}

function NavSection({ title }: { title: string }) {
  return (
    <div className="px-3 pb-2 pt-5">
      <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/25">
        {title}
      </p>
    </div>
  );
}

type AdminSidebarProps = {
  onSignOut: () => void;
};

export default function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (match: string) =>
    pathname === match || (match === "/admin/dashboard" && pathname === "/admin");

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col bg-[#324023] shadow-xl">
      <div className="border-b border-white/10 px-6 pb-5 pt-7">
        <img
          src="/logo/Royalswag_LOGO01.png"
          alt="Royal Swag"
          className="h-8 w-auto object-contain"
        />
        <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
          Admin Portal
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Admin">
        <NavSection title="Operations" />
        {MAIN_NAV.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={isActive(item.match)}
          />
        ))}

        <NavSection title="Store" />
        {STORE_NAV.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={isActive(item.match)}
          />
        ))}

        <NavSection title="Coming Soon" />
        {COMING_SOON.map((item) => (
          <div
            key={item}
            className="flex cursor-not-allowed select-none items-center gap-3 rounded-xl px-3 py-2.5 opacity-25"
          >
            <span className="text-sm" aria-hidden>
              🔒
            </span>
            <span className="font-sans text-sm text-white line-through">{item}</span>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9A6F1A] font-sans text-sm font-bold text-white">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-sm font-semibold text-white">
              Admin User
            </p>
            <p className="truncate font-sans text-[10px] text-white/40">
              System Operator
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-3 w-full text-left font-sans text-xs text-white/30 transition-colors hover:text-white/60"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
