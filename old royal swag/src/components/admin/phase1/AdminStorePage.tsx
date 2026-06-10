"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import AdminDashboardShell from "./AdminDashboardShell";

type AdminStorePageProps = {
  title: string;
  children: ReactNode;
};

export default function AdminStorePage({ title, children }: AdminStorePageProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <AdminDashboardShell onSignOut={handleSignOut} title={title}>
      <div className="admin-cms-panel">{children}</div>
    </AdminDashboardShell>
  );
}
