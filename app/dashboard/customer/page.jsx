import Link from "next/link";
import DashboardPage from "../../../components/DashboardPage";
import DashboardTable from "../../../components/DashboardTable";

export const metadata = { title: "Customer dashboard | PizzaHub" };

export default function CustomerOverviewPage() {
  return (
    <DashboardPage
      eyebrow="YOUR PIZZAHUB"
      title="Order overview"
      description="Keep an eye on your orders and find something delicious for next time."
      stats={[
        { label: "Total orders", value: "8", note: "Since joining PizzaHub" },
        { label: "Pending", value: "2", note: "Waiting for the restaurant" },
        { label: "Accepted", value: "5", note: "Being prepared or delivered" },
        { label: "Rejected", value: "1", note: "Review your order history" },
      ]}
    >
      <div className="dashboard-quick-links"><Link className="button button-orange" href="/browse-menu">Find your next slice <span>→</span></Link></div>
      <DashboardTable
        title="Recent orders"
        description="A sample snapshot of your order history."
        columns={["Item", "Restaurant", "Delivery", "Status"]}
        rows={[
          ["Garden Party", "Greenhouse Pizza Co.", "Nov 21, 6:30 PM", <span className="status-pill accepted" key="accepted">Accepted</span>],
          ["Smoky Pepperoni", "Brick & Basil", "Nov 20, 7:00 PM", <span className="status-pill pending" key="pending">Pending</span>],
          ["The Classic Margherita", "Little Oven Pizzeria", "Nov 18, 8:00 PM", <span className="status-pill cancelled" key="delivered">Delivered</span>],
        ]}
      />
      <p className="demo-note">Sample order data only. This dashboard is not connected to a customer account.</p>
    </DashboardPage>
  );
}
