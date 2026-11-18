import Link from "next/link";
import DashboardPage from "../../../components/DashboardPage";
import DashboardTable from "../../../components/DashboardTable";

export const metadata = { title: "Vendor dashboard | PizzaHub" };

export default function VendorOverviewPage() {
  return (
    <DashboardPage
      eyebrow="YOUR RESTAURANT"
      title="Kitchen overview"
      description="A quick look at your menu and the orders coming into your kitchen."
      stats={[
        { label: "Menu items", value: "3", note: "Across all statuses" },
        { label: "Active items", value: "2", note: "Visible to customers" },
        { label: "Pending orders", value: "4", note: "Ready for your review" },
        { label: "Current plan", value: "Free", note: "Up to 3 active items" },
      ]}
    >
      <div className="dashboard-quick-links">
        <Link className="button button-orange" href="/dashboard/vendor/menu/new">+ Add menu item</Link>
        <Link className="button button-dark" href="/dashboard/vendor/subscription">Explore Premium <span>→</span></Link>
      </div>
      <DashboardTable
        title="Recent customer orders"
        description="A sample view of recent activity."
        columns={["Item", "Customer", "Delivery", "Status"]}
        rows={[
          ["Smoky Pepperoni", "Jamie R.", "Today, 7:00 PM", <span className="status-pill pending" key="pending">Pending</span>],
          ["Garden Party", "Morgan L.", "Tomorrow, 6:30 PM", <span className="status-pill accepted" key="accepted">Accepted</span>],
          ["The Classic Margherita", "Alex T.", "Nov 22, 8:00 PM", <span className="status-pill pending" key="pending">Pending</span>],
        ]}
      />
      <p className="demo-note">Sample dashboard data only. Orders and counts are not connected to a backend.</p>
    </DashboardPage>
  );
}
