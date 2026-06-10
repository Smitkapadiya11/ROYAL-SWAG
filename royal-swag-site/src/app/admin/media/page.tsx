import AdminStorePage from "@/components/admin/phase1/AdminStorePage";
import MediaPage from "@/components/dashboard/MediaPage";

export default function AdminMediaPage() {
  return (
    <AdminStorePage title="Media Library">
      <p className="mb-4 font-sans text-sm text-[#45483f]">
        Upload product photos, herb images, and doctor videos. Copy the URL into Content
        fields after upload.
      </p>
      <MediaPage />
    </AdminStorePage>
  );
}
