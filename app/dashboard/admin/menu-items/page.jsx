"use client";

import { useEffect, useState } from "react";
import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";
import { api } from "../../../../lib/api";

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  async function load() {
    try { setItems((await api("/api/admin/menu")).items); }
    catch (requestError) { setError(requestError.message); }
  }
  useEffect(() => { load(); }, []);
  async function review(id, status) {
    try { await api(`/api/admin/menu/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); await load(); }
    catch (requestError) { setError(requestError.message); }
  }
  async function removeItem(id) {
    try { await api(`/api/vendor/menu/${id}`, { method: "DELETE" }); await load(); }
    catch (requestError) { setError(requestError.message); }
  }

  return (
    <DashboardPage eyebrow="MENU REVIEW" title="Manage menu items" description="Review new submissions and keep published items up to date.">
      {error && <p className="demo-note" role="alert">{error}</p>}
      <DashboardTable
        title="Submitted menu items"
        description="Approve or reject pending items before publication."
        columns={["Item", "Restaurant", "Category", "Price", "Status", "Review"]}
        rows={items.map((item) => [
          item.name,
          item.vendor,
          item.category,
          `$${Number(item.price).toFixed(2)}`,
          <span className={`status-pill ${item.status}`} key={item.id}>{item.status}</span>,
          <span className="row-actions" key={`actions-${item.id}`}>
            {item.status !== "approved" && <button type="button" onClick={() => review(item.id, "approved")}>Approve</button>}
            {item.status !== "rejected" && <button type="button" onClick={() => review(item.id, "rejected")}>Reject</button>}
            <button type="button" onClick={() => removeItem(item.id)}>Delete</button>
          </span>
        ])}
      />
      <p className="demo-note">Approval and item management controls are inactive until server-side authorization is implemented.</p>
    </DashboardPage>
  );
}
