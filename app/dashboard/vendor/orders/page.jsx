"use client";

import { useEffect, useState } from "react";
import DashboardPage from "../../../../components/DashboardPage";
import DashboardTable from "../../../../components/DashboardTable";
import { api } from "../../../../lib/api";

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try { setOrders((await api("/api/orders")).orders); }
    catch (requestError) { setError(requestError.message); }
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    try {
      await api(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  return (
    <DashboardPage eyebrow="ORDER MANAGEMENT" title="Customer orders" description="Review delivery requests and manage orders placed with your restaurant.">
      {error && <p className="demo-note" role="alert">{error}</p>}
      <DashboardTable
        title="Incoming orders"
        description="Only pending orders can be accepted or rejected."
        columns={["Customer", "Item", "Delivery date", "Address", "Status", "Action"]}
        rows={orders.map((order) => [
          order.customerName,
          order.itemName,
          order.deliveryDate,
          order.address,
          <span className={`status-pill ${order.status}`} key={order.id}>{order.status}</span>,
          order.status === "pending"
            ? <span className="row-actions" key={`actions-${order.id}`}><button onClick={() => updateStatus(order.id, "accepted")} type="button">Accept</button><button onClick={() => updateStatus(order.id, "rejected")} type="button">Reject</button></span>
            : "—"
        ])}
      />
      <p className="demo-note">Order actions are disabled in this route scaffold.</p>
    </DashboardPage>
  );
}
