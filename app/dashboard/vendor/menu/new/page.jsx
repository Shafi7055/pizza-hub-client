 "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardPage from "../../../../../components/DashboardPage";
import { api } from "../../../../../lib/api";

export default function NewVendorMenuItemPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", category: "", description: "", price: "", location: "", image: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api("/api/vendor/menu", { method: "POST", body: JSON.stringify({ ...form, price: Number(form.price) }) });
      router.push("/dashboard/vendor/menu");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardPage eyebrow="YOUR MENU" title="Add a menu item" description="Give your next crowd-pleaser a place on the menu.">
      <section className="dashboard-panel">
        <div className="panel-heading"><div><h2>Item details</h2><p>New items are submitted for review before they can be published.</p></div></div>
        <form onSubmit={submit}>
        {error && <p className="demo-note" role="alert">{error}</p>}
        <fieldset className="demo-fieldset">
          <div className="form-grid">
            <label>Item name<input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. The Sunday Special" required /></label>
            <label>Category<select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required><option value="" disabled>Choose a category</option><option>Classic</option><option>Veggie</option><option>Meat</option><option>Specialty</option><option>Sides</option><option>Beverages</option></select></label>
            <label>Price<input value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder="0.00" type="number" min="0" step="0.01" required /></label>
            <label>Location<input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} placeholder="Area or city" required /></label>
            <label className="form-span">Description<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="What makes this one special?" rows="4" required /></label>
            <label className="form-span">Image URL<input value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} placeholder="https://..." /></label>
          </div>
          <div className="form-actions"><Link className="button button-outline" href="/dashboard/vendor/menu">Cancel</Link><button className="button button-orange" type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit for review"}</button></div>
        </fieldset>
        </form>
      </section>
    </DashboardPage>
  );
}
