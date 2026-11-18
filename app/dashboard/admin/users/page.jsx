import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";

export const metadata = { title: "Manage users | PizzaHub" };

export default function AdminUsersPage() {
  return (
    <DashboardPage eyebrow="PLATFORM USERS" title="Manage users" description="Find customer and vendor accounts and review their access status.">
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div><h2>All users</h2><p>Search and role filters will work when user data is connected.</p></div>
          <input className="panel-search" placeholder="Search by name or email" aria-label="Search users" disabled />
        </div>
        <DashboardTable
          title=""
          description=""
          columns={["Name", "Email", "Role", "Status", "Action"]}
          rows={[
            ["Jamie Rivera", "jamie@example.com", "Customer", <span className="status-pill accepted" key="active">Active</span>, <button className="table-action" type="button" disabled>Block</button>],
            ["Little Oven Pizzeria", "hello@littleoven.example", "Vendor", <span className="status-pill accepted" key="active">Active</span>, <button className="table-action" type="button" disabled>Block</button>],
            ["Morgan Lee", "morgan@example.com", "Customer", <span className="status-pill pending" key="blocked">Blocked</span>, <button className="table-action" type="button" disabled>Unblock</button>],
          ]}
        />
      </section>
      <p className="demo-note">User search, filtering, and access controls are not active in this placeholder.</p>
    </DashboardPage>
  );
}
