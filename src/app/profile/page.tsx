import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const { data: addresses } = await supabase.from("addresses").select("*").eq("user_id", user.id);

  return <ProfileClient profile={profile} orders={orders ?? []} addresses={addresses ?? []} />;
}
