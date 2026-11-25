"use client";

import { useEffect, useState } from "react";
import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";
import { api } from "../../../../lib/api";

function formatDeliveryDate(value) {
  if (typeof value !== "string" || !/\b\d{4}\b/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { orders: vendorOrders } = await api("/api/orders");
      setOrders(vendorOrders.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    setUpdatingId(id);
    setError("");
    try {
      await api(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <DashboardPage eyebrow="ORDER MANAGEMENT" title="Customer orders" description="Review delivery requests and manage orders placed with your restaurant.">
      {error && <p className="demo-note" role="alert">{error}</p>}
      {loading ? (
        <p className="demo-note" role="status">Loading incoming orders…</p>
      ) : error ? null : orders.length ? (
        <DashboardTable
          title="Incoming orders"
          description="Accept or reject new requests, then mark accepted orders as delivered."
          columns={["Customer", "Item", "Delivery date", "Address", "Status", "Action"]}
          rows={orders.map((order) => [
            order.customerName,
            order.itemName,
            formatDeliveryDate(order.deliveryDate),
            order.address,
            <span className={`status-pill ${order.status}`} key={order.id}>{order.status}</span>,
            order.status === "pending"
              ? <span className="row-actions" key={`actions-${order.id}`}><button disabled={updatingId === order.id} onClick={() => updateStatus(order.id, "accepted")} type="button">Accept</button><button disabled={updatingId === order.id} onClick={() => updateStatus(order.id, "rejected")} type="button">Reject</button></span>
              : order.status === "accepted"
                ? <button className="table-action" disabled={updatingId === order.id} onClick={() => updateStatus(order.id, "delivered")} type="button">{updatingId === order.id ? "Updating…" : "Mark delivered"}</button>
                : "—"
          ])}
        />
      ) : (
        <div className="empty-state">
          <span>✳</span>
          <h2>No incoming orders yet.</h2>
          <p>New customer requests for your restaurant will appear here.</p>
        </div>
      )}
    </DashboardPage>
  );
}
