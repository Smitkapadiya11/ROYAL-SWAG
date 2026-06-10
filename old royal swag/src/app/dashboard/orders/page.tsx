import DashboardShell from "@/components/dashboard/DashboardShell";
import OrdersPage from "@/components/dashboard/OrdersPage";

export default function DashboardOrdersPage() {
  return (
    <DashboardShell title="Orders">
      <OrdersPage />
    </DashboardShell>
  );
}
