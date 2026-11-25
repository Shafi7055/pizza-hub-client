"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardPage from "../../../../components/DashboardPage";
import { api } from "../../../../lib/api";

export default function CustomerFavoritesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try { setItems((await api("/api/favorites")).items); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function remove(itemId) {
    try {
      await api(`/api/favorites/${itemId}`, { method: "DELETE" });
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  return (
    <DashboardPage eyebrow="YOUR SAVES" title="Favorite pizzas" description="Your saved menu items, ready for the next order.">
      {error && <p className="demo-note" role="alert">{error}</p>}
      {loading && <p className="demo-note" role="status">Loading your favorites…</p>}
      <div className="menu-grid">
        {items.map((item) => (
          <article className="menu-card" key={item.id}>
            <div className="card-image-wrap"><img className="card-image" src={item.image} alt={item.name} /></div>
            <div className="card-content">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <div className="form-actions"><Link className="button button-dark" href={`/menu/${item.id}`}>View details</Link><button className="button button-outline" type="button" onClick={() => remove(item.id)}>Remove</button></div>
            </div>
          </article>
        ))}
      </div>
      {!loading && !error && !items.length && (
        <div className="empty-state">
          <span>♡</span>
          <h2>Save a slice for later.</h2>
          <p>Tap the heart on a menu item and it will be waiting here.</p>
          <Link className="button button-orange" href="/browse-menu">Browse the menu</Link>
        </div>
      )}
    </DashboardPage>
  );
}
