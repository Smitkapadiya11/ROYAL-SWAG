"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type AdminSection = "leads" | "orders";

const COMING_SOON = [
  "Live Visitors",
  "Revenue Analytics",
  "Customer Profiles",
  "Meta Pixel Data",
  "Referral Program",
  "Hindi Translations",
] as const;

type AdminSidebarProps = {
  active: AdminSection;
  onSelect: (s: AdminSection) => void;
  onLogout: () => void;
};

export default function AdminSidebar({
  active,
  onSelect,
  onLogout,
}: AdminSidebarProps) {
  const navItem = (id: AdminSection, label: string) => (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "w-full border-l-4 py-3 pl-4 pr-3 text-left font-body text-sm font-medium transition-colors",
        active === id
          ? "border-gold bg-white/10 text-parchment"
          : "border-transparent text-parchment/75 hover:bg-white/5 hover:text-parchment"
      )}
    >
      {label}
    </button>
  );

  return (
    <aside
      className="flex w-[220px] shrink-0 flex-col bg-primary text-parchment"
      style={{ width: 220 }}
    >
      <div className="border-b border-white/10 px-4 py-5">
        <Image
          src="/images/royal-swag-logo.png"
          alt="Royal Swag"
          width={160}
          height={64}
          className="h-10 w-auto object-contain"
          priority
        />
      </div>

      <nav className="flex-1 py-2" aria-label="Admin">
        {navItem("leads", "Lung Test Leads")}
        {navItem("orders", "Orders")}

        <div className="mt-6 px-4">
          <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Coming Soon
          </p>
          <ul className="mt-2 space-y-1">
            {COMING_SOON.map((item) => (
              <li key={item}>
                <span
                  title="Coming in Phase 2"
                  className="flex cursor-not-allowed items-center gap-2 rounded px-2 py-2 font-body text-xs text-parchment/40 opacity-40"
                >
                  <LockIcon />
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="space-y-3 border-t border-white/10 p-4">
        <p className="font-body text-[11px] leading-snug text-parchment/45">
          More features coming soon
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-lg border border-white/20 py-2 font-body text-xs font-medium text-parchment/80 hover:bg-white/10"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V12a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm0 2a3 3 0 013 3v3H9V7a3 3 0 013-3z" />
    </svg>
  );
}
