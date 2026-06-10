import DashboardShell from "@/components/dashboard/DashboardShell";
import LeadsPage from "@/components/dashboard/LeadsPage";

export default function DashboardLeadsPage() {
  return (
    <DashboardShell title="Leads">
      <LeadsPage />
    </DashboardShell>
  );
}
