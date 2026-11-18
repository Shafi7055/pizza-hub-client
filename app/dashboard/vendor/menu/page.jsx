import Link from "next/link";
import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";

export const metadata = { title: "My menu items | PizzaHub" };

export default function VendorMenuPage() {
  return (
    <DashboardPage
      eyebrow="YOUR MENU"
      title="My menu items"
      description="Keep your menu fresh and see which items are available to customers."
      stats={[
        { label: "All items", value: "3", note: "Your full menu" },
        { label: "Active", value: "2", note: "Visible on PizzaHub" },
        { label: "In review", value: "1", note: "Awaiting admin approval" },
      ]}
    >
      <div className="dashboard-quick-links"><Link className="button button-orange" href="/dashboard/vendor/menu/new">+ Add menu item</Link></div>
      <DashboardTable
        title="Your menu"
        description="Only approved and active items appear in Browse Menu."
        columns={["Item", "Category", "Price", "Status", "Availability"]}
        rows={[
          ["The Classic Margherita", "Classic", "$14.50", <span className="status-pill accepted" key="approved">Approved</span>, "Available"],
          ["Garden Party", "Veggie", "$16.00", <span className="status-pill accepted" key="approved">Approved</span>, "Available"],
          ["Smoky Pepperoni", "Meat", "$18.50", <span className="status-pill pending" key="pending">Pending</span>, "Not listed"],
        ]}
      />
      <p className="demo-note">This list is illustrative and does not create, update, or delete menu data.</p>
    </DashboardPage>
  );
}
