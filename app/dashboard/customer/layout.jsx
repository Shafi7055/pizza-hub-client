import DashboardShell from "../../../components/DashboardShell";

export default function CustomerDashboardLayout({ children }) {
  return <DashboardShell role="customer">{children}</DashboardShell>;
}
