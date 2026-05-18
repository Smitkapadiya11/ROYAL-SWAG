import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { APP_SITE } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== APP_SITE.adminEmail) redirect("/");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminDashboard orders={orders ?? []} profiles={profiles ?? []} />;
}
