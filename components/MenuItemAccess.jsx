"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoAuth } from "./DemoAuthProvider";
import { api } from "../lib/api";
import PublicPageFrame from "./PublicPageFrame";
import { useCart } from "./CartProvider";

export default function MenuItemAccess({ itemId }) {
  const router = useRouter();
  const { user, ready } = useDemoAuth();
  const { addItem } = useCart();
  const [item, setItem] = useState(null);
  const [itemLoading, setItemLoading] = useState(true);
  const [itemError, setItemError] = useState("");
  const [notice, setNotice] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [itemAverage, setItemAverage] = useState(null);
  const [restaurantAverage, setRestaurantAverage] = useState(null);
  const [restaurantReviewCount, setRestaurantReviewCount] = useState(0);
  const [reviewError, setReviewError] = useState("");
  const [review, setReview] = useState({ rating: "5", comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setItemLoading(true);
    setItem(null);
    setItemError("");
    api(`/api/menu/${encodeURIComponent(itemId)}`)
      .then(({ item: menuItem }) => {
        if (active) setItem(menuItem);
      })
      .catch((requestError) => {
        if (active) setItemError(requestError.message);
      })
      .finally(() => {
        if (active) setItemLoading(false);
      });
    return () => {
      active = false;
    };
  }, [itemId]);

  useEffect(() => {
    if (ready && !user) router.replace(`/sign-in?next=/menu/${itemId}`);
  }, [itemId, ready, router, user]);

  useEffect(() => {
    if (!item) return;
    let active = true;
    api(`/api/reviews/${item.id}`)
      .then(({ reviews: itemReviews, average, restaurantAverage: vendorAverage, restaurantReviewCount: vendorReviewCount }) => {
        if (active) {
          setReviews(itemReviews);
          setItemAverage(average);
          setRestaurantAverage(vendorAverage);
          setRestaurantReviewCount(vendorReviewCount);
        }
      })
      .catch((requestError) => {
        if (active) setReviewError(requestError.message);
      });
    if (user?.role === "customer") {
      setFavoriteLoading(true);
      api("/api/favorites")
        .then(({ items }) => {
          if (active) setFavorite(items.some((entry) => entry.id === item.id));
        })
        .catch((requestError) => {
          if (active) setNotice(requestError.message);
        })
        .finally(() => {
          if (active) setFavoriteLoading(false);
        });
    } else {
      setFavoriteLoading(false);
    }
    return () => {
      active = false;
    };
  }, [item, user]);

  if (!ready || !user) {
    return (
      <main className="role-check" aria-live="polite">
        <span className="role-check-spinner" />
        <strong>{ready ? "Please sign in to view item details…" : "Loading demo session…"}</strong>
      </main>
    );
  }

  if (itemLoading) {
    return (
      <main className="role-check" aria-live="polite">
        <span className="role-check-spinner" />
        <strong>Loading menu item…</strong>
      </main>
    );
  }

  if (itemError || !item) {
    return (
      <PublicPageFrame>
        <div className="empty-state">
          <span>🍕</span>
          <h1>We couldn't find that slice.</h1>
          <p>{itemError || "This item may no longer be available."}</p>
          <Link className="button button-orange" href="/browse-menu">Back to the menu</Link>
        </div>
      </PublicPageFrame>
    );
  }

  async function toggleFavorite() {
    setFavoriteLoading(true);
    try {
      if (favorite) await api(`/api/favorites/${item.id}`, { method: "DELETE" });
      else await api(`/api/favorites/${item.id}`, { method: "POST" });
      setFavorite((current) => !current);
    } catch (requestError) {
      setNotice(requestError.message);
    } finally {
      setFavoriteLoading(false);
    }
  }

  async function submitReview(event) {
    event.preventDefault();
    if (reviewSubmitting) return;
    setNotice("");
    setReviewSubmitting(true);
    try {
      await api(`/api/reviews/${item.id}`, {
        method: "POST",
        body: JSON.stringify({ rating: Number(review.rating), comment: review.comment })
      });
      setNotice("Review submitted.");
      const result = await api(`/api/reviews/${item.id}`);
      setReviews(result.reviews);
      setItemAverage(result.average);
      setRestaurantAverage(result.restaurantAverage);
      setRestaurantReviewCount(result.restaurantReviewCount);
    } catch (requestError) {
      setNotice(requestError.message);
    } finally {
      setReviewSubmitting(false);
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
          <div className="detail-rating">
            <span>★ {itemAverage ? itemAverage.toFixed(1) : item.rating}</span>
            <span>·</span>
            <span>{item.time}</span>
            <span>·</span>
            <span>{item.vendor} {restaurantAverage ? `★ ${restaurantAverage.toFixed(1)} (${restaurantReviewCount})` : "★ New"}</span>
          </div>
          <p>{item.description} Prepared to order by {item.vendor}, one of the local kitchens on PizzaHub.</p>
          <div className="detail-price-row"><span>Price</span><strong>${Number(item.price).toFixed(2)}</strong></div>
          <div className="detail-note"><span>✳</span><p>Add this item to your bag, then choose a delivery time and pay securely with Stripe.</p></div>
          {user.role === "customer" ? (
            <div className="detail-actions">
              <button
                className="button button-orange detail-order"
                onClick={() => {
                  addItem(item);
                  setNotice(`${item.name} added to your bag.`);
                }}
                type="button"
              >
                Add to bag <span>→</span>
              </button>
              <button className="favorite-button detail-favorite" onClick={toggleFavorite} type="button" disabled={favoriteLoading} aria-label={favorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={favorite}>
                {favorite ? "♥" : "♡"}
              </button>
            </div>
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
            {reviewError && <p className="demo-note" role="alert">{reviewError}</p>}
            {reviews.map((entry) => (
              <article className="review-row" key={entry.id}><strong>{entry.customerName}</strong><span>{"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}</span><p>{entry.comment || "No comment"}</p></article>
            ))}
            {user.role === "customer" && (
              <form className="demo-fieldset" onSubmit={submitReview} aria-busy={reviewSubmitting}>
                <label>Rating<select value={review.rating} onChange={(event) => setReview((current) => ({ ...current, rating: event.target.value }))}><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option><option value="2">2 - Poor</option><option value="1">1 - Very poor</option></select></label>
                <label>Comment<textarea maxLength={1000} value={review.comment} onChange={(event) => setReview((current) => ({ ...current, comment: event.target.value }))} rows="3" /></label>
                <button className="button button-dark" type="submit" disabled={reviewSubmitting}>{reviewSubmitting ? "Submitting…" : "Submit review"}</button>
              </form>
            )}
          </section>
        </div>
      </section>
    </PublicPageFrame>
  );
}
