import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function AdminRootPage() {
  const session = await getAdminSession();
  if (!session) {
    notFound();
  }
  redirect("/admin/dashboard");
}
