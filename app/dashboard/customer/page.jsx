"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardPage from "../../../components/DashboardPage";
import DashboardTable from "../../../components/DashboardTable";
import { api } from "../../../lib/api";

function formatDeliveryDate(value) {
  if (typeof value !== "string" || !/\b\d{4}\b/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function CustomerOverviewPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api("/api/orders")
      .then(({ orders: customerOrders }) => {
        if (active) setOrders(customerOrders);
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
  const count = (status) => orders.filter((order) => order.status === status).length;

  return (
    <DashboardPage
      eyebrow="YOUR PIZZAHUB"
      title="Order overview"
      description="Keep an eye on your orders and find something delicious for next time."
      stats={[
        { label: "Total orders", value: loading || error ? "—" : orders.length, note: "Since joining PizzaHub" },
        { label: "Pending", value: loading || error ? "—" : count("pending"), note: "Waiting for the restaurant" },
        { label: "Accepted", value: loading || error ? "—" : count("accepted"), note: "Being prepared or delivered" },
        { label: "Delivered", value: loading || error ? "—" : count("delivered"), note: "Enjoyed from your order history" },
      ]}
    >
      <div className="dashboard-quick-links"><Link className="button button-orange" href="/browse-menu">Find your next slice <span>→</span></Link></div>
      {error && <p className="demo-note" role="alert">{error}</p>}
      {loading ? (
        <p className="demo-note" role="status">Loading your orders…</p>
      ) : error ? null : recentOrders.length ? (
        <DashboardTable
          title="Recent orders"
          description="Your latest orders and their current status."
          columns={["Item", "Restaurant", "Delivery", "Status"]}
          rows={recentOrders.map((order) => [
            `${order.itemName}${order.quantity > 1 ? ` × ${order.quantity}` : ""}`,
            order.restaurant,
            formatDeliveryDate(order.deliveryDate),
            <span className={`status-pill ${order.status}`} key={order.id}>{order.status}</span>,
          ])}
        />
      ) : (
        <div className="empty-state">
          <span>🍕</span>
          <h2>Your next favorite is waiting.</h2>
          <p>Browse the menu and place your first order to see it here.</p>
          <Link className="button button-orange" href="/browse-menu">Browse the menu</Link>
        </div>
      )}
    </DashboardPage>
  );
}
