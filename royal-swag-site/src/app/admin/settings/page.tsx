import AdminStorePage from "@/components/admin/phase1/AdminStorePage";
import SettingsPage from "@/components/dashboard/SettingsPage";

export default function AdminSettingsPage() {
  return (
    <AdminStorePage title="Store Settings">
      <p className="mb-4 font-sans text-sm text-[#45483f]">
        WhatsApp number, social links, FSSAI licence, and announcement bar text.
      </p>
      <SettingsPage />
    </AdminStorePage>
  );
}
