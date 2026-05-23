"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import AdminSidebar, { type AdminSection } from "./AdminSidebar";
import LungTestLeadsSection from "./LungTestLeadsSection";
import OrdersSection from "./OrdersSection";
import LiveClock from "./LiveClock";

export default function AdminPhase1Dashboard() {
  const router = useRouter();
  const [section, setSection] = useState<AdminSection>("leads");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-parchment">
      <AdminSidebar
        active={section}
        onSelect={setSection}
        onLogout={handleLogout}
      />
      <div className="flex min-h-screen flex-1 flex-col overflow-y-auto">
        <header className="border-b border-primary/10 bg-parchment/80 px-6 py-5 backdrop-blur-sm">
          <h1 className="font-display text-2xl font-bold text-primary">
            Royal Swag Admin
          </h1>
          <LiveClock />
        </header>
        <main className="flex-1 p-6">
          {section === "leads" ? <LungTestLeadsSection /> : <OrdersSection />}
        </main>
      </div>
    </div>
  );
}
