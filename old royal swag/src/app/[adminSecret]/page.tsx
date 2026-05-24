import { notFound, redirect } from "next/navigation";
import { isAdminSecretPath } from "@/lib/admin/secret-path";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ adminSecret: string }>;
};

export default async function AdminSecretGatePage({ params }: PageProps) {
  const { adminSecret } = await params;

  if (!isAdminSecretPath(adminSecret)) {
    notFound();
  }

  // Entry cookie is set in proxy; login page redirects to dashboard if already signed in.
  redirect("/admin/login");
}
