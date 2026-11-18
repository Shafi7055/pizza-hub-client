import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";

export const metadata = { title: "My orders | PizzaHub" };

export default function CustomerOrdersPage() {
  return (
    <DashboardPage eyebrow="ORDER HISTORY" title="My orders" description="See the restaurants, delivery details, and latest status for your orders.">
      <DashboardTable
        title="Your recent orders"
        description="Pending orders can be cancelled before the restaurant accepts them."
        columns={["Item", "Restaurant", "Delivery date", "Address", "Status", "Action"]}
        rows={[
          ["Garden Party", "Greenhouse Pizza Co.", "Nov 21, 6:30 PM", "Riverside", <span className="status-pill accepted" key="accepted">Accepted</span>, "—"],
          ["Smoky Pepperoni", "Brick & Basil", "Nov 20, 7:00 PM", "Northside", <span className="status-pill pending" key="pending">Pending</span>, <button className="table-action" type="button" disabled>Cancel order</button>],
          ["The Classic Margherita", "Little Oven Pizzeria", "Nov 18, 8:00 PM", "Downtown", <span className="status-pill cancelled" key="delivered">Delivered</span>, "—"],
        ]}
      />
      <p className="demo-note">Order details and cancellation are placeholders until the API is implemented.</p>
    </DashboardPage>
  );
}
