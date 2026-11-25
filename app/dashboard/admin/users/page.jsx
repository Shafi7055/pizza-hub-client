"use client";

import { useEffect, useState } from "react";
import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";
import { api } from "../../../../lib/api";
import { useDemoAuth } from "../../../../components/DemoAuthProvider";

export default function AdminUsersPage() {
  const { user: currentUser } = useDemoAuth();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (role) params.set("role", role);
      setUsers((await api(`/api/admin/users${params.size ? `?${params}` : ""}`)).users);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [query, role]);

  async function setStatus(id, status) {
    setBusyId(id);
    setError("");
    try {
      await api(`/api/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <DashboardPage eyebrow="PLATFORM USERS" title="Manage users" description="Find customer and vendor accounts and review their access status.">
      {error && <p className="demo-note" role="alert">{error}</p>}
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div><h2>All users</h2><p>Search by name or email, or narrow the list by account role.</p></div>
          <input className="panel-search" placeholder="Search by name or email" aria-label="Search users" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className="panel-search" value={role} onChange={(event) => setRole(event.target.value)} aria-label="Filter by role"><option value="">All roles</option><option value="customer">Customer</option><option value="vendor">Vendor</option><option value="admin">Admin</option></select>
        </div>
        {loading ? (
          <p className="demo-note" role="status">Loading accounts…</p>
        ) : error ? null : users.length ? (
          <DashboardTable
            title=""
            description=""
            columns={["Name", "Email", "Role", "Status", "Action"]}
            rows={users.map((entry) => [
              entry.name,
              entry.email,
              entry.role,
              <span className={`status-pill ${entry.status}`} key={entry.id}>{entry.status}</span>,
              <button className="table-action" type="button" disabled={busyId === entry.id || (entry.id === currentUser?.id && entry.status === "active")} onClick={() => setStatus(entry.id, entry.status === "active" ? "blocked" : "active")}>{busyId === entry.id ? "Updating…" : entry.status === "active" ? "Block" : "Unblock"}</button>
            ])}
          />
        ) : (
          <div className="empty-state">
            <span>⌕</span>
            <h2>No accounts match.</h2>
            <p>Try a different search or role filter.</p>
          </div>
        )}
      </section>
    </DashboardPage>
  );
}
