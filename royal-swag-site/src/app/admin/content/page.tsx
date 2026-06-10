import AdminStorePage from "@/components/admin/phase1/AdminStorePage";
import ContentPage from "@/components/dashboard/ContentPage";

export default function AdminContentPage() {
  return (
    <AdminStorePage title="Content">
      <p className="mb-4 font-sans text-sm text-[#45483f]">
        Edit homepage hero text, product copy, and herb descriptions. Changes go live within
        about a minute after you save.
      </p>
      <ContentPage />
    </AdminStorePage>
  );
}
