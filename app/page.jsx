"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { menuCategories, menuItems } from "../lib/menu-data";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.2 10h11.6M10.5 4.7l5.3 5.3-5.3 5.3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8.7" cy="8.7" r="5.6" />
      <path d="m13 13 4 4" />
    </svg>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All slices");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [notice, setNotice] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All slices" || item.category === activeCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  function addToCart(itemName) {
    setCartCount((count) => count + 1);
    setNotice(`${itemName} added to your bag`);
    window.setTimeout(() => setNotice(""), 2400);
  }

  return (
    <main>
      <SiteHeader cartCount={cartCount} />

      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> GOOD FOOD, GOOD MOOD</div>
          <h1>Your next<br />favorite <span>slice.</span></h1>
          <p className="hero-description">
            Hand-stretched dough, small-batch sauce, and all the good stuff.
            Find your new local favorite, delivered fresh to your door.
          </p>
          <div className="hero-buttons">
            <a className="button button-orange" href="#menu">Explore the menu <ArrowIcon /></a>
            <a className="text-link" href="#how-it-works">How it works <span>↗</span></a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>J</span><span>M</span><span>A</span><span>+</span>
            </div>
            <div><strong>4.9/5</strong><span>Loved by pizza people</span></div>
            <span className="proof-divider" />
            <div className="delivery-proof"><span>⌁</span><div><strong>Fresh, always</strong><span>At your door in ~25 min</span></div></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image" role="img" aria-label="Freshly baked pepperoni pizza on a wooden board" />
          <div className="image-note"><span className="note-star">✳</span><span>MADE FRESH<br />JUST FOR YOU</span></div>
          <div className="floating-label"><span className="floating-icon">✦</span><span><strong>Locally loved</strong><small>From kitchens near you</small></span></div>
          <div className="hero-shape" aria-hidden="true">✳</div>
        </div>
      </section>

      <section className="ticker" aria-label="PizzaHub promise">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, index) => (
            <span className="ticker-group" key={index}>
              <span>GOOD DOUGH</span><i>✳</i><span>LOCAL PIZZERIAS</span><i>✳</i><span>BIG PIZZA ENERGY</span><i>✳</i><span>DELIVERED FRESH</span><i>✳</i>
            </span>
          ))}
        </div>
      </section>

      <section className="menu-section section-wrap" id="menu">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> THE CROWD PLEASERS</div>
            <h2>Good things<br className="mobile-break" /> are <span>rolling.</span></h2>
          </div>
          <p>Meet the slices everyone’s talking about. Made fresh by the best local kitchens in town.</p>
        </div>
        <div className="menu-toolbar">
          <div className="category-list" role="group" aria-label="Filter menu by category">
            {menuCategories.map((category) => (
              <button
                className={`category-button${activeCategory === category ? " selected" : ""}`}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
          <label className="search-field">
            <SearchIcon />
            <input
              aria-label="Search menu items"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find pizza or burger"
              value={search}
            />
            <span>⌘ K</span>
          </label>
        </div>
        {filteredItems.length ? (
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article className="menu-card" key={item.name}>
                <div className="card-image-wrap">
                  <img className="card-image" src={item.image} alt={item.name} />
                  <span className="item-tag">{item.tag}</span>
                  <button className="favorite-button" type="button" aria-label={`Save ${item.name} to favorites`}>♡</button>
                </div>
                <div className="card-content">
                  <div className="card-meta"><span>★ {item.rating}</span><i />{item.time}<i />{item.category}</div>
                  <div className="card-title-row"><h3><Link href={`/menu/${item.id}`}>{item.name}</Link></h3><span className="price">${item.price.toFixed(2)}</span></div>
                  <p>{item.description}</p>
                  <button className="add-button" onClick={() => addToCart(item.name)} type="button">
                    Add to bag <span>+</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>🍕</span>
            <h3>No slices found just yet.</h3>
            <p>Try another search or choose a different category.</p>
            <button type="button" onClick={() => { setSearch(""); setActiveCategory("All slices"); }}>Show all slices</button>
          </div>
        )}
        <div className="menu-footer">
          <span>GOOD PIZZA IS CLOSER THAN YOU THINK.</span>
          <a href="#menu">See the full menu <ArrowIcon /></a>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-inner section-wrap">
          <div className="how-intro">
            <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> LESS WAITING, MORE EATING</div>
            <h2>From oven<br />to <span>your door.</span></h2>
            <p>We bring your neighborhood’s best pizza together in one happy place.</p>
            <a className="button button-light" href="#menu">Find your pizza <ArrowIcon /></a>
          </div>
          <div className="steps">
            <article className="step-card"><span className="step-number">01</span><div className="step-symbol">⌕</div><h3>Pick your place</h3><p>Browse great local pizzerias and find your kind of pie.</p></article>
            <article className="step-card"><span className="step-number">02</span><div className="step-symbol">✳</div><h3>Make it yours</h3><p>Choose your favorites. Extra cheese? We get it.</p></article>
            <article className="step-card"><span className="step-number">03</span><div className="step-symbol">⌁</div><h3>Pizza is coming</h3><p>We’ll bring it over while it’s hot and happy.</p></article>
          </div>
          <span className="how-spark" aria-hidden="true">✳</span>
        </div>
      </section>

      <SiteFooter />
      <div className="toast" aria-live="polite" data-visible={Boolean(notice)}>{notice}</div>
    </main>
  );
}
