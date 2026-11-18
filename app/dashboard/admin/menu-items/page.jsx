import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";

export const metadata = { title: "Manage menu items | PizzaHub" };

export default function AdminMenuItemsPage() {
  return (
    <DashboardPage eyebrow="MENU REVIEW" title="Manage menu items" description="Review new submissions and keep published items up to date.">
      <DashboardTable
        title="Submitted menu items"
        description="Approve or reject pending items before publication."
        columns={["Item", "Restaurant", "Category", "Price", "Status", "Review"]}
        rows={[
          ["Sunday Special", "Little Oven Pizzeria", "Specialty", "$19.00", <span className="status-pill pending" key="pending">Pending</span>, <span className="row-actions" key="actions"><button disabled>Approve</button><button disabled>Reject</button></span>],
          ["Roasted Garden Pie", "Greenhouse Pizza Co.", "Veggie", "$16.00", <span className="status-pill pending" key="pending">Pending</span>, <span className="row-actions" key="actions"><button disabled>Approve</button><button disabled>Reject</button></span>],
          ["The Classic Margherita", "Little Oven Pizzeria", "Classic", "$14.50", <span className="status-pill accepted" key="approved">Approved</span>, <button className="table-action" disabled key="edit">Manage</button>],
        ]}
      />
      <p className="demo-note">Approval and item management controls are inactive until server-side authorization is implemented.</p>
    </DashboardPage>
  );
}
