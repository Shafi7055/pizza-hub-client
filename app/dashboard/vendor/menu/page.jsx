"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";
import { api } from "../../../../lib/api";

export default function VendorMenuPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  async function load() {
    try { setItems((await api("/api/vendor/menu")).items); }
    catch (requestError) { setError(requestError.message); }
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
        { label: "All items", value: String(items.length), note: "Your full menu" },
        { label: "Active", value: String(items.filter((item) => item.status === "approved" && item.availability === "available").length), note: "Visible on PizzaHub" },
        { label: "In review", value: String(items.filter((item) => item.status === "pending").length), note: "Awaiting admin approval" },
      ]}
    >
      {error && <p className="demo-note" role="alert">{error}</p>}
      <div className="dashboard-quick-links"><Link className="button button-orange" href="/dashboard/vendor/menu/new">+ Add menu item</Link></div>
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
      <p className="demo-note">This list is illustrative and does not create, update, or delete menu data.</p>
    </DashboardPage>
  );
}
