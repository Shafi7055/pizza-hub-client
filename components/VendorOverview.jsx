"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardPage from "./DashboardPage";
import DashboardTable from "./DashboardTable";
import { useDemoAuth } from "./DemoAuthProvider";
import { api } from "../lib/api";

function formatDeliveryDate(value) {
  if (typeof value !== "string" || !/\b\d{4}\b/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function VendorOverview() {
  const { user } = useDemoAuth();
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([api("/api/vendor/menu"), api("/api/orders")])
      .then(([menu, orderResult]) => {
        if (!active) return;
        setItems(menu.items);
        setOrders(orderResult.orders);
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

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5),
    [orders]
  );
  const activeItems = items.filter((item) => item.status === "approved" && item.availability === "available").length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const plan = user?.subscriptionPlan || "free";

  return (
    <DashboardPage
      eyebrow="YOUR RESTAURANT"
      title="Kitchen overview"
      description="A quick look at your menu and the orders coming into your kitchen."
      stats={[
        { label: "Menu items", value: loading || error ? "—" : items.length, note: "Across all statuses" },
        { label: "Active items", value: loading || error ? "—" : activeItems, note: "Visible to customers" },
        { label: "Pending orders", value: loading || error ? "—" : pendingOrders, note: "Ready for your review" },
        { label: "Current plan", value: plan[0].toUpperCase() + plan.slice(1), note: plan === "free" ? "Up to 3 active items" : "Plan benefits active" },
      ]}
    >
      <div className="dashboard-quick-links">
        <Link className="button button-orange" href="/dashboard/vendor/menu/new">+ Add menu item</Link>
        <Link className="button button-dark" href="/dashboard/vendor/subscription">Explore Premium <span>→</span></Link>
      </div>
      {error && <p className="demo-note" role="alert">{error}</p>}
      {loading ? (
        <p className="demo-note" role="status">Loading your kitchen overview…</p>
      ) : error ? null : recentOrders.length ? (
        <DashboardTable
          title="Recent customer orders"
          description="The latest requests for your restaurant."
          columns={["Item", "Customer", "Delivery", "Status"]}
          rows={recentOrders.map((order) => [
            order.itemName,
            order.customerName,
            formatDeliveryDate(order.deliveryDate),
            <span className={`status-pill ${order.status}`} key={order.id}>{order.status}</span>,
          ])}
        />
      ) : (
        <div className="empty-state">
          <span>✳</span>
          <h2>Your next order will show up here.</h2>
          <p>Keep your menu fresh so customers can discover your kitchen.</p>
          <Link className="button button-orange" href="/dashboard/vendor/menu">Manage your menu</Link>
        </div>
      )}
    </DashboardPage>
  );
}
