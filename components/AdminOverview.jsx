"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardPage from "./DashboardPage";
import DashboardTable from "./DashboardTable";
import { api } from "../lib/api";

export default function AdminOverview() {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([api("/api/admin/users"), api("/api/admin/menu")])
      .then(([userResult, menuResult]) => {
        if (!active) return;
        setUsers(userResult.users);
        setItems(menuResult.items);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const pendingItems = useMemo(() => items.filter((item) => item.status === "pending"), [items]);
  const vendors = users.filter((user) => user.role === "vendor").length;
  const customers = users.filter((user) => user.role === "customer").length;

  return (
    <DashboardPage
      eyebrow="PLATFORM OVERVIEW"
      title="The big picture"
      description="Monitor the PizzaHub community and keep the marketplace running smoothly."
      stats={[
        { label: "Registered users", value: loading || error ? "—" : users.length, note: "Across all account types" },
        { label: "Vendors", value: loading || error ? "—" : vendors, note: "Local restaurants" },
        { label: "Customers", value: loading || error ? "—" : customers, note: "Hungry neighbors" },
        { label: "Pending items", value: loading || error ? "—" : pendingItems.length, note: "Need a review" },
      ]}
    >
      <div className="admin-shortcuts">
        <Link href="/dashboard/admin/users">Manage users <span>→</span></Link>
        <Link href="/dashboard/admin/menu-items">Review menu items <span>→</span></Link>
        <Link href="/dashboard/admin/transactions">View transactions <span>→</span></Link>
      </div>
      {error && <p className="demo-note" role="alert">{error}</p>}
      {loading ? (
        <p className="demo-note" role="status">Loading marketplace activity…</p>
      ) : error ? null : pendingItems.length ? (
        <DashboardTable
          title="Menu items to review"
          description="New submissions waiting for your decision."
          columns={["Item", "Restaurant", "Category", "Price", "Status"]}
          rows={pendingItems.slice(0, 5).map((item) => [
            item.name,
            item.vendor,
            item.category,
            `$${Number(item.price).toFixed(2)}`,
            <span className="status-pill pending" key={item.id}>Pending review</span>,
          ])}
        />
      ) : (
        <div className="empty-state">
          <span>✦</span>
          <h2>You're all caught up.</h2>
          <p>New menu submissions will appear here when they need a review.</p>
        </div>
      )}
    </DashboardPage>
  );
}
