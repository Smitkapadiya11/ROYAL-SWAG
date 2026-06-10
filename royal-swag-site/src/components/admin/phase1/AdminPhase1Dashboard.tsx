"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import AdminDashboardShell from "./AdminDashboardShell";
import AdminOverviewMetrics from "./AdminOverviewMetrics";
import LungTestLeadsSection from "./LungTestLeadsSection";
import OrdersSection from "./OrdersSection";

type AdminPhase1DashboardProps = {
  mode?: "overview" | "orders";
};

export default function AdminPhase1Dashboard({
  mode = "overview",
}: AdminPhase1DashboardProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  };

  const isOverview = mode === "overview";

  return (
    <AdminDashboardShell
      onSignOut={handleSignOut}
      title={isOverview ? "Overview" : "Orders"}
    >
      {isOverview && <AdminOverviewMetrics />}
      {isOverview && <LungTestLeadsSection />}
      {!isOverview && (
        <div id="orders">
          <OrdersSection />
        </div>
      )}
    </AdminDashboardShell>
  );
}
