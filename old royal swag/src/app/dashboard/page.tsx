import DashboardShell from "@/components/dashboard/DashboardShell";
import OverviewPage from "@/components/dashboard/OverviewPage";

export default function DashboardHomePage() {
  return (
    <DashboardShell title="Analytics">
      <OverviewPage />
    </DashboardShell>
  );
}
