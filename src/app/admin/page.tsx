import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth?next=/admin");
  if (user.email !== "admin@eximburginternational.in") redirect("/");

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (ordersError) console.error("[admin] orders:", ordersError.message);
  if (profilesError) console.error("[admin] profiles:", profilesError.message);

  return <AdminDashboard orders={orders ?? []} profiles={profiles ?? []} />;
}
