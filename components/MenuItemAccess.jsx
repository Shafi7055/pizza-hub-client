"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoAuth } from "./DemoAuthProvider";
import { api } from "../lib/api";
import PublicPageFrame from "./PublicPageFrame";

export default function MenuItemAccess({ item }) {
  const router = useRouter();
  const { user, ready } = useDemoAuth();
  const [notice, setNotice] = useState("");
  const [orderOpen, setOrderOpen] = useState(false);
  const [order, setOrder] = useState({ deliveryDate: "", address: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: "5", comment: "" });

  useEffect(() => {
    api(`/api/reviews/${item.id}`)
      .then(({ reviews: itemReviews }) => setReviews(itemReviews))
      .catch(() => setReviews([]));
  }, [item.id]);

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/sign-in?next=/menu/${item.id}`);
    }
  }, [item.id, ready, router, user]);

  if (!ready || !user) {
    return (
      <main className="role-check" aria-live="polite">
        <span className="role-check-spinner" />
        <strong>{ready ? "Please sign in to view item details…" : "Loading demo session…"}</strong>
      </main>
    );
  }

  async function submitOrder(event) {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");
    try {
      await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({ itemId: item.id, ...order })
      });
      setNotice("Order submitted. The restaurant has been notified.");
      setOrderOpen(false);
      setOrder({ deliveryDate: "", address: "", message: "" });
    } catch (requestError) {
      setNotice(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleFavorite() {
    try {
      if (favorite) await api(`/api/favorites/${item.id}`, { method: "DELETE" });
      else await api(`/api/favorites/${item.id}`, { method: "POST" });
      setFavorite((current) => !current);
    } catch (requestError) {
      setNotice(requestError.message);
    }
  }

  async function submitReview(event) {
    event.preventDefault();
    try {
      await api(`/api/reviews/${item.id}`, {
        method: "POST",
        body: JSON.stringify({ rating: Number(review.rating), comment: review.comment })
      });
      setNotice("Review submitted.");
      const result = await api(`/api/reviews/${item.id}`);
      setReviews(result.reviews);
    } catch (requestError) {
      setNotice(requestError.message);
    }
  }

  return (
    <PublicPageFrame>
      <div className="breadcrumb"><Link href="/browse-menu">Browse menu</Link><span>/</span><span>{item.name}</span></div>
      <section className="item-detail">
        <div className="detail-image-wrap"><img src={item.image} alt={item.name} /></div>
        <div className="detail-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> {item.category.toUpperCase()} · {item.location.toUpperCase()}</div>
          <h1>{item.name}</h1>
          <div className="detail-rating"><span>★ {item.rating}</span><span>·</span><span>{item.time}</span><span>·</span><span>{item.vendor}</span></div>
          <p>{item.description} Prepared to order by {item.vendor}, one of the local kitchens on PizzaHub.</p>
          <div className="detail-price-row"><span>Price</span><strong>${item.price.toFixed(2)}</strong></div>
          <div className="detail-note"><span>✳</span><p>Every order is prepared fresh. Delivery options and scheduling will be available when ordering is connected.</p></div>
          {user.role === "customer" ? (
            <>
              <div className="detail-actions">
                <button className="button button-orange detail-order" onClick={() => setOrderOpen((current) => !current)} type="button">
                  {orderOpen ? "Close order form" : "Place order"} <span>→</span>
                </button>
                <button className="favorite-button detail-favorite" onClick={toggleFavorite} type="button" aria-label={favorite ? "Remove from favorites" : "Add to favorites"}>
                  {favorite ? "♥" : "♡"}
                </button>
              </div>
              {orderOpen && (
                <form className="demo-fieldset order-form" onSubmit={submitOrder}>
                  <label>Delivery date and time<input type="datetime-local" value={order.deliveryDate} onChange={(event) => setOrder((current) => ({ ...current, deliveryDate: event.target.value }))} required /></label>
                  <label>Delivery address<textarea value={order.address} onChange={(event) => setOrder((current) => ({ ...current, address: event.target.value }))} rows="3" required /></label>
                  <label>Special instructions<textarea value={order.message} onChange={(event) => setOrder((current) => ({ ...current, message: event.target.value }))} rows="3" /></label>
                  <button className="button button-orange" type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit order"}</button>
                </form>
              )}
            </>
          ) : (
            <div className="role-order-note">
              <p>Ordering is available to customer accounts only.</p>
              <Link href={`/dashboard/${user.role}`}>Go to your {user.role} dashboard <span>→</span></Link>
            </div>
          )}
          {notice && <p className="demo-note" role="status">{notice}</p>}
          <p className="placeholder-caption">Signed in as {user.name}</p>
          <section className="dashboard-panel reviews-panel">
            <div className="panel-heading"><div><h2>Reviews</h2><p>{reviews.length ? `${reviews.length} customer review${reviews.length === 1 ? "" : "s"}` : "No reviews yet"}</p></div></div>
            {reviews.map((entry) => (
              <article className="review-row" key={entry.id}><strong>{entry.customerName}</strong><span>{"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}</span><p>{entry.comment || "No comment"}</p></article>
            ))}
            {user.role === "customer" && (
              <form className="demo-fieldset" onSubmit={submitReview}>
                <label>Rating<select value={review.rating} onChange={(event) => setReview((current) => ({ ...current, rating: event.target.value }))}><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option><option value="2">2 - Poor</option><option value="1">1 - Very poor</option></select></label>
                <label>Comment<textarea value={review.comment} onChange={(event) => setReview((current) => ({ ...current, comment: event.target.value }))} rows="3" /></label>
                <button className="button button-dark" type="submit">Submit review</button>
              </form>
            )}
          </section>
        </div>
      </section>
    </PublicPageFrame>
  );
}
