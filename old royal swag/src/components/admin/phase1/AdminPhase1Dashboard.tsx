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
    router.replace("/");
    router.refresh();
  };

  const isOverview = mode === "overview";

  return (
    <AdminDashboardShell onSignOut={handleSignOut}>
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-[#324023] md:text-[48px] md:leading-[56px]">
          {isOverview ? "Overview" : "Orders"}
        </h2>
        <p className="mt-2 font-sans text-base text-[#45483f]">
          {isOverview
            ? "Monitor lung test leads, orders, and customer data."
            : "Manage order fulfillment, shipping labels, and exports."}
        </p>
      </div>

      {isOverview && <AdminOverviewMetrics />}
      {isOverview && <LungTestLeadsSection />}
      <div id="orders">
        <OrdersSection />
      </div>
    </AdminDashboardShell>
  );
}
