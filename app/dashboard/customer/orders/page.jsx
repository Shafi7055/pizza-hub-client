"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";
import { api } from "../../../../lib/api";

function formatDeliveryDate(value) {
  if (typeof value !== "string" || !/\b\d{4}\b/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { orders: customerOrders } = await api("/api/orders");
      setOrders(customerOrders.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
    }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function cancelOrder(id) {
    try {
      await api(`/api/orders/${id}`, { method: "DELETE" });
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  return (
    <DashboardPage eyebrow="ORDER HISTORY" title="My orders" description="See the restaurants, delivery details, and latest status for your orders.">
      {loading && <p className="demo-note">Loading orders…</p>}
      {error && <p className="demo-note" role="alert">{error}</p>}
      {!loading && !error && orders.length > 0 && (
        <DashboardTable
          title="Your recent orders"
          description="Pending orders can be cancelled before the restaurant accepts them."
          columns={["Item", "Restaurant", "Delivery date", "Address", "Status", "Action"]}
          rows={orders.map((order) => [
            `${order.itemName}${order.quantity > 1 ? ` × ${order.quantity}` : ""}`,
            order.restaurant,
            formatDeliveryDate(order.deliveryDate),
            order.address,
            <span className={`status-pill ${order.status}`} key={order.id}>{order.status}</span>,
            order.status === "pending"
              ? <button className="table-action" type="button" onClick={() => cancelOrder(order.id)}>Cancel order</button>
              : "—"
          ])}
        />
      )}
      {!loading && !error && !orders.length && (
        <div className="empty-state">
          <span>🍕</span>
          <h2>No orders yet.</h2>
          <p>Find a fresh favorite and your order history will show up here.</p>
          <Link className="button button-orange" href="/browse-menu">Browse the menu</Link>
        </div>
      )}
      {!!orders.length && (
        <section className="dashboard-panel" style={{ padding: "16px" }}>
          <div className="panel-heading"><div><h2>Latest order timeline</h2><p>Status history for your latest order</p></div></div>
          {(orders[0].timeline || [{ status: orders[0].status, at: orders[0].createdAt }]).map((entry, index) => (
            <div className="review-row" key={`${entry.status}-${index}`}><strong>{entry.status}</strong><span>{entry.at ? new Date(entry.at).toLocaleString() : ""}</span></div>
          ))}
        </section>
      )}
    </DashboardPage>
  );
}
