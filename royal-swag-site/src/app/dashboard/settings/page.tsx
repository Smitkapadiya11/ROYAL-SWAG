import DashboardShell from "@/components/dashboard/DashboardShell";
import SettingsPage from "@/components/dashboard/SettingsPage";

export default function DashboardSettingsPage() {
  return (
    <DashboardShell title="Settings">
      <SettingsPage />
    </DashboardShell>
  );
}
