import Link from "next/link";
import DashboardPage from "../../../components/DashboardPage";
import DashboardTable from "../../../components/DashboardTable";

export const metadata = { title: "Admin dashboard | PizzaHub" };

export default function AdminOverviewPage() {
  return (
    <DashboardPage
      eyebrow="PLATFORM OVERVIEW"
      title="The big picture"
      description="Monitor the PizzaHub community and keep the marketplace running smoothly."
      stats={[
        { label: "Registered users", value: "1,284", note: "Across all account types" },
        { label: "Vendors", value: "96", note: "Local restaurants" },
        { label: "Customers", value: "1,188", note: "Hungry neighbors" },
        { label: "Pending items", value: "12", note: "Need a review" },
      ]}
    >
      <div className="admin-shortcuts">
        <Link href="/dashboard/admin/users">Manage users <span>→</span></Link>
        <Link href="/dashboard/admin/menu-items">Review menu items <span>→</span></Link>
        <Link href="/dashboard/admin/transactions">View transactions <span>→</span></Link>
      </div>
      <DashboardTable
        title="Menu items to review"
        description="Sample queue of new submissions."
        columns={["Item", "Restaurant", "Submitted", "Status"]}
        rows={[
          ["Sunday Special", "Little Oven Pizzeria", "Today", <span className="status-pill pending" key="pending">Pending review</span>],
          ["Roasted Garden Pie", "Greenhouse Pizza Co.", "Yesterday", <span className="status-pill pending" key="pending">Pending review</span>],
        ]}
      />
      <p className="demo-note">Admin metrics and review queue are sample UI data only.</p>
    </DashboardPage>
  );
}
