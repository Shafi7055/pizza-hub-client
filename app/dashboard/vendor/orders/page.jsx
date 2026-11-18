import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";

export const metadata = { title: "Customer orders | PizzaHub" };

export default function VendorOrdersPage() {
  return (
    <DashboardPage eyebrow="ORDER MANAGEMENT" title="Customer orders" description="Review delivery requests and manage orders placed with your restaurant.">
      <DashboardTable
        title="Incoming orders"
        description="Only pending orders can be accepted or rejected."
        columns={["Customer", "Item", "Delivery date", "Address", "Status", "Action"]}
        rows={[
          ["Jamie R.", "Smoky Pepperoni", "Nov 20, 7:00 PM", "Northside", <span className="status-pill pending" key="pending">Pending</span>, <span className="row-actions" key="actions"><button disabled>Accept</button><button disabled>Reject</button></span>],
          ["Morgan L.", "Garden Party", "Nov 21, 6:30 PM", "Riverside", <span className="status-pill accepted" key="accepted">Accepted</span>, "—"],
          ["Alex T.", "The Classic Margherita", "Nov 22, 8:00 PM", "Downtown", <span className="status-pill pending" key="pending">Pending</span>, <span className="row-actions" key="actions"><button disabled>Accept</button><button disabled>Reject</button></span>],
        ]}
      />
      <p className="demo-note">Order actions are disabled in this route scaffold.</p>
    </DashboardPage>
  );
}
