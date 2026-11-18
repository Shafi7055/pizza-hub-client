"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { menuCategories, menuItems } from "../lib/menu-data";

const locations = ["All locations", ...new Set(menuItems.map((item) => item.location))];

export default function MenuExplorer() {
  const [category, setCategory] = useState("All slices");
  const [location, setLocation] = useState("All locations");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recommended");

  const items = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = menuItems.filter((item) => {
      const matchesCategory = category === "All slices" || item.category === category;
      const matchesLocation = location === "All locations" || item.location === location;
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.vendor.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesLocation && matchesQuery;
    });

    if (sortOrder === "price-asc") return filtered.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") return filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [category, location, query, sortOrder]);

  return (
    <>
      <div className="browse-toolbar">
        <label className="search-field browse-search">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.7" cy="8.7" r="5.6" /><path d="m13 13 4 4" /></svg>
          <input aria-label="Search menu items" onChange={(event) => setQuery(event.target.value)} placeholder="Search pizzas or restaurants" value={query} />
        </label>
        <label className="select-field">
          <span>Category</span>
          <select aria-label="Filter by category" onChange={(event) => setCategory(event.target.value)} value={category}>
            {menuCategories.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="select-field">
          <span>Location</span>
          <select aria-label="Filter by location" onChange={(event) => setLocation(event.target.value)} value={location}>
            {locations.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="select-field sort-field">
          <span>Sort by</span>
          <select aria-label="Sort menu items" onChange={(event) => setSortOrder(event.target.value)} value={sortOrder}>
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>
      <p className="results-count">{items.length} {items.length === 1 ? "slice" : "slices"} to explore</p>
      {items.length ? (
        <div className="menu-grid">
          {items.map((item) => (
            <article className="menu-card" key={item.id}>
              <Link className="card-image-wrap" href={`/menu/${item.id}`} aria-label={`View ${item.name}`}>
                <img className="card-image" src={item.image} alt={item.name} />
                <span className="item-tag">{item.tag}</span>
              </Link>
              <div className="card-content">
                <div className="card-meta"><span>★ {item.rating}</span><i />{item.location}<i />{item.category}</div>
                <div className="card-title-row">
                  <h2><Link href={`/menu/${item.id}`}>{item.name}</Link></h2>
                  <span className="price">${item.price.toFixed(2)}</span>
                </div>
                <p>{item.description}</p>
                <div className="browse-card-footer">
                  <span>{item.vendor}</span>
                  <Link className="details-link" href={`/menu/${item.id}`}>View details <span>↗</span></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>🍕</span>
          <h2>No slices found just yet.</h2>
          <p>Try changing your search or filters to find another favorite.</p>
          <button type="button" onClick={() => { setCategory("All slices"); setLocation("All locations"); setQuery(""); }}>Reset filters</button>
        </div>
      )}
    </>
  );
}
