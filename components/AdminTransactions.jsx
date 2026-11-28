"use client";

import { useEffect, useState } from "react";
import DashboardPage from "./DashboardPage";
import DashboardTable from "./DashboardTable";
import { api } from "../lib/api";

function statusClass(status) {
  if (status === "succeeded") return "accepted";
  if (status === "failed") return "cancelled";
  return status;
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api("/api/admin/transactions")
      .then(({ transactions: records }) => {
        if (active) setTransactions(records);
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

  const count = (status) => transactions.filter((entry) => entry.status === status).length;

  return (
    <DashboardPage
      eyebrow="PAYMENTS"
      title="Transactions"
      description="Review subscription payment records. Payment records are read-only."
      stats={[
        { label: "Total transactions", value: loading || error ? "—" : transactions.length, note: "All recorded subscriptions" },
        { label: "Successful", value: loading || error ? "—" : count("succeeded"), note: "Recorded as succeeded" },
        { label: "Pending", value: loading || error ? "—" : count("pending"), note: "Awaiting confirmation" },
        { label: "Failed", value: loading || error ? "—" : count("failed"), note: "No plan activation" },
      ]}
    >
      {error && <p className="demo-note" role="alert">{error}</p>}
      {loading ? (
        <p className="demo-note" role="status">Loading transaction records…</p>
      ) : error ? null : transactions.length ? (
        <DashboardTable
          title="Recent transactions"
          description="Subscription records from the payment ledger."
          columns={["Restaurant", "Plan", "Amount", "Date", "Status"]}
          rows={transactions.map((entry) => [
            entry.restaurant,
            entry.plan,
            `$${Number(entry.amount).toFixed(2)}`,
            entry.date,
            <span className={`status-pill ${statusClass(entry.status)}`} key={entry.id}>{entry.status}</span>,
          ])}
        />
      ) : (
        <div className="empty-state">
          <span>↗</span>
          <h2>No transactions recorded.</h2>
          <p>Subscription payment records will appear here when available.</p>
        </div>
      )}
      <p className="demo-note">Payment records are added after Stripe webhook signatures are verified.</p>
    </DashboardPage>
  );
}
