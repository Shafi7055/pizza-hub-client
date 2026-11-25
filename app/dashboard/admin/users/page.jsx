"use client";

import { useEffect, useState } from "react";
import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";
import { api } from "../../../../lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (role) params.set("role", role);
      setUsers((await api(`/api/admin/users${params.size ? `?${params}` : ""}`)).users);
    } catch (requestError) { setError(requestError.message); }
  }
  useEffect(() => { load(); }, [query, role]);

  async function setStatus(id, status) {
    try {
      await api(`/api/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  return (
    <DashboardPage eyebrow="PLATFORM USERS" title="Manage users" description="Find customer and vendor accounts and review their access status.">
      {error && <p className="demo-note" role="alert">{error}</p>}
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div><h2>All users</h2><p>Search and role filters will work when user data is connected.</p></div>
          <input className="panel-search" placeholder="Search by name or email" aria-label="Search users" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className="panel-search" value={role} onChange={(event) => setRole(event.target.value)} aria-label="Filter by role"><option value="">All roles</option><option value="customer">Customer</option><option value="vendor">Vendor</option><option value="admin">Admin</option></select>
        </div>
        <DashboardTable
          title=""
          description=""
          columns={["Name", "Email", "Role", "Status", "Action"]}
          rows={users.map((entry) => [
            entry.name,
            entry.email,
            entry.role,
            <span className={`status-pill ${entry.status}`} key={entry.id}>{entry.status}</span>,
            <button className="table-action" type="button" onClick={() => setStatus(entry.id, entry.status === "active" ? "blocked" : "active")}>{entry.status === "active" ? "Block" : "Unblock"}</button>
          ])}
        />
      </section>
      <p className="demo-note">User search, filtering, and access controls are not active in this placeholder.</p>
    </DashboardPage>
  );
}
