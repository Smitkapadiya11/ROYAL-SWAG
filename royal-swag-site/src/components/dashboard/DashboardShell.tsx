"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";

type DashboardShellProps = {
  children: ReactNode;
  title: string;
};

export default function DashboardShell({ children, title }: DashboardShellProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/dashboard/auth", { method: "DELETE" });
    router.push("/dashboard/login");
    router.refresh();
  };

  return (
    <div className="dashboard-root min-h-screen bg-[#0F1117] text-[#F0F0F0]">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={() => void logout()}
      />

      <div className="md:pl-[240px]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#0F1117]/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-white/10 px-2 py-1 text-sm md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </header>

        <main className="overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
