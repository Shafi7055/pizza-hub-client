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
  const [uploadingImage, setUploadingImage] = useState(false);

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

  async function uploadProfileImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("");
    setUploadingImage(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const { image } = await api("/api/vendor/profile/image", { method: "POST", body });
      setForm((current) => ({ ...current, image }));
      setStatus("Profile image uploaded.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setUploadingImage(false);
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
          <div><h2>Personal information</h2><p>Update your details and profile image.</p></div>
        </div>
        <form onSubmit={save}>
        <fieldset className="demo-fieldset">
          <div className="form-grid">
            <label>Full name<input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
            <label>Email address<input defaultValue={user?.email || ""} type="email" disabled /></label>
            {profileAudience === "vendor" && <label>Restaurant name<input value={form.businessName} onChange={(event) => setForm((current) => ({ ...current, businessName: event.target.value }))} /></label>}
            <label>Profile image (PNG, JPG or WebP; max 5 MB)
              <input accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploadingImage} onChange={uploadProfileImage} type="file" />
              {form.image && <img className="profile-image-preview" src={form.image} alt="Current profile" />}
            </label>
          </div>
          {uploadingImage && <p className="demo-note" role="status">Uploading image…</p>}
          <button className="button button-orange" type="submit">Save changes</button>
        </fieldset>
        {status && <p className="demo-note" role="status">{status}</p>}
        </form>
      </section>
    </DashboardPage>
  );
}
