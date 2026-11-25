"use client";

import { useEffect, useState } from "react";
import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";
import { api } from "../../../../lib/api";

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try { setItems((await api("/api/admin/menu")).items); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function review(id, status) {
    setBusyId(id);
    try {
      await api(`/api/admin/menu/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId("");
    }
  }

  async function removeItem(item) {
    if (!window.confirm(`Permanently delete "${item.name}" from the menu?`)) return;
    setBusyId(item.id);
    try {
      await api(`/api/vendor/menu/${item.id}`, { method: "DELETE" });
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <DashboardPage eyebrow="MENU REVIEW" title="Manage menu items" description="Review new submissions and keep published items up to date.">
      {error && <p className="demo-note" role="alert">{error}</p>}
      {loading ? (
        <p className="demo-note" role="status">Loading menu submissions…</p>
      ) : error ? null : items.length ? (
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
              {item.status !== "approved" && <button disabled={busyId === item.id} type="button" onClick={() => review(item.id, "approved")}>Approve</button>}
              {item.status !== "rejected" && <button disabled={busyId === item.id} type="button" onClick={() => review(item.id, "rejected")}>Reject</button>}
              <button disabled={busyId === item.id} type="button" onClick={() => removeItem(item)}>Delete</button>
            </span>
          ])}
        />
      ) : (
        <div className="empty-state">
          <span>✦</span>
          <h2>No menu items to review.</h2>
          <p>New vendor submissions will appear here.</p>
        </div>
      )}
    </DashboardPage>
  );
}
