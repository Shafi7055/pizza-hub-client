"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";
import { api } from "../../../../lib/api";

export default function VendorMenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try { setItems((await api("/api/vendor/menu")).items); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function toggleAvailability(item) {
    try {
      await api(`/api/vendor/menu/${item.id}`, { method: "PATCH", body: JSON.stringify({ availability: item.availability === "available" ? "unavailable" : "available" }) });
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  return (
    <DashboardPage
      eyebrow="YOUR MENU"
      title="My menu items"
      description="Keep your menu fresh and see which items are available to customers."
      stats={[
        { label: "All items", value: loading || error ? "—" : String(items.length), note: "Your full menu" },
        { label: "Active", value: loading || error ? "—" : String(items.filter((item) => item.status === "approved" && item.availability === "available").length), note: "Visible on PizzaHub" },
        { label: "In review", value: loading || error ? "—" : String(items.filter((item) => item.status === "pending").length), note: "Awaiting admin approval" },
      ]}
    >
      {error && <p className="demo-note" role="alert">{error}</p>}
      <div className="dashboard-quick-links"><Link className="button button-orange" href="/dashboard/vendor/menu/new">+ Add menu item</Link></div>
      {loading ? (
        <p className="demo-note" role="status">Loading your menu…</p>
      ) : error ? null : items.length ? (
        <DashboardTable
          title="Your menu"
          description="Only approved and active items appear in Browse Menu."
          columns={["Item", "Category", "Price", "Status", "Availability"]}
          rows={items.map((item) => [
            item.name,
            item.category,
            `$${Number(item.price).toFixed(2)}`,
            <span className={`status-pill ${item.status}`} key={item.id}>{item.status}</span>,
            <button className="table-action" type="button" disabled={item.status !== "approved"} onClick={() => toggleAvailability(item)}>{item.availability === "available" ? "Available" : "Unavailable"}</button>
          ])}
        />
      ) : (
        <div className="empty-state">
          <span>🍕</span>
          <h2>Your menu is ready for its first item.</h2>
          <p>Add a crowd-pleaser and submit it for review.</p>
          <Link className="button button-orange" href="/dashboard/vendor/menu/new">Add menu item</Link>
        </div>
      )}
    </DashboardPage>
  );
}
