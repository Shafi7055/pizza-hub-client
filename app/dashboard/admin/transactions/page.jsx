import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";

export const metadata = { title: "Transactions | PizzaHub" };

export default function AdminTransactionsPage() {
  return (
    <DashboardPage
      eyebrow="PAYMENTS"
      title="Transactions"
      description="Review subscription payment records. Payment records are read-only."
      stats={[
        { label: "Total transactions", value: "248", note: "All recorded subscriptions" },
        { label: "Successful", value: "231", note: "Verified payments" },
        { label: "Pending", value: "9", note: "Awaiting confirmation" },
        { label: "Failed", value: "8", note: "No plan activation" },
      ]}
    >
      <DashboardTable
        title="Recent transactions"
        description="Sample transaction records for the admin workspace."
        columns={["Restaurant", "Plan", "Amount", "Date", "Status"]}
        rows={[
          ["Brick & Basil", "Premium", "$19.00", "Nov 18, 2025", <span className="status-pill accepted" key="success">Succeeded</span>],
          ["Greenhouse Pizza Co.", "Premium", "$19.00", "Nov 17, 2025", <span className="status-pill pending" key="pending">Pending</span>],
          ["Little Oven Pizzeria", "Premium", "$19.00", "Nov 16, 2025", <span className="status-pill cancelled" key="failed">Failed</span>],
        ]}
      />
      <p className="demo-note">These records cannot be edited or used to activate a subscription.</p>
    </DashboardPage>
  );
}
