"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardPage from "../../../../components/DashboardPage";
import { api } from "../../../../lib/api";

export default function CustomerFavoritesPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try { setItems((await api("/api/favorites")).items); }
    catch (requestError) { setError(requestError.message); }
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
      {!items.length && <p className="demo-note">No favorites saved yet.</p>}
    </DashboardPage>
  );
}
