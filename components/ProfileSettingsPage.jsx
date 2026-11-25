"use client";

import { useEffect, useState } from "react";
import DashboardPage from "./DashboardPage";
import { useDemoAuth } from "./DemoAuthProvider";
import { api } from "../lib/api";

export default function ProfileSettingsPage({ audience }) {
  const { user } = useDemoAuth();
  const profileAudience = user?.role || audience;
  const [form, setForm] = useState({ name: "", image: "", businessName: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || "", image: user.image || "", businessName: user.businessName || "" });
  }, [user]);

  async function save(event) {
    event.preventDefault();
    setStatus("");
    try {
      await api("/api/auth/profile", { method: "PATCH", body: JSON.stringify(form) });
      setStatus("Profile updated.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <DashboardPage
      eyebrow="YOUR ACCOUNT"
      title="Profile settings"
      description={`Manage the ${profileAudience} profile details for this demo workspace.`}
    >
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div><h2>Personal information</h2><p>Profile editing will be connected when authentication and the API are implemented.</p></div>
        </div>
        <form onSubmit={save}>
        <fieldset className="demo-fieldset">
          <div className="form-grid">
            <label>Full name<input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
            <label>Email address<input defaultValue={user?.email || ""} type="email" disabled /></label>
            {profileAudience === "vendor" && <label>Restaurant name<input value={form.businessName} onChange={(event) => setForm((current) => ({ ...current, businessName: event.target.value }))} /></label>}
            <label>Profile image URL<input value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} /></label>
          </div>
          <button className="button button-orange" type="submit">Save changes</button>
        </fieldset>
        {status && <p className="demo-note" role="status">{status}</p>}
        </form>
      </section>
    </DashboardPage>
  );
}
