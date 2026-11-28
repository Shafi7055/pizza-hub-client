"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { useCart } from "./CartProvider";
import { useDemoAuth } from "./DemoAuthProvider";

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function getMinimumDeliveryTime() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default function ShoppingCart() {
  const router = useRouter();
  const { user, ready: authReady } = useDemoAuth();
  const { items, ready: cartReady, itemCount, setQuantity, removeItem } = useCart();
  const [deliveryDate, setDeliveryDate] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  async function submitOrder(event) {
    event.preventDefault();
    if (!user) {
      router.push("/sign-in?next=%2Fcart");
      return;
    }
    if (user.role !== "customer") {
      setNotice("Please sign in with a customer account to place an order.");
      return;
    }
    setSubmitting(true);
    setNotice("");
    try {
      const { url } = await api("/api/orders/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((item) => ({ itemId: item.id, quantity: item.quantity })),
          deliveryDate: new Date(deliveryDate).toISOString(),
          address,
          message,
        }),
      });
      window.location.assign(url);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!cartReady || !authReady) {
    return <p className="cart-loading" role="status">Loading your bag…</p>;
  }

  return (
    <section className="cart-page">
      <div className="cart-intro">
        <p className="eyebrow"><span className="eyebrow-dot" /> YOUR BAG</p>
        <h1>A little something <span>delicious.</span></h1>
        <p>Review your picks and get them on their way.</p>
      </div>

      {notice && <p className="cart-notice" role="alert">{notice}</p>}

      {items.length === 0 ? (
        <div className="cart-empty">
          <span aria-hidden="true">♨</span>
          <h2>Your bag is taking a break</h2>
          <p>Find a favorite slice and it will show up here.</p>
          <Link className="button button-dark" href="/browse-menu">Browse the menu <span>→</span></Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines" aria-label="Items in your bag">
            <div className="cart-lines-heading">
              <h2>Your picks</h2>
              <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
            </div>
            {items.map((item) => (
              <article className="cart-line" key={item.id}>
                <div className="cart-line-image">
                  {item.image ? <img src={item.image} alt="" /> : <span aria-hidden="true">🍕</span>}
                </div>
                <div className="cart-line-info">
                  <p className="cart-line-vendor">{item.vendor || "PizzaHub menu"}</p>
                  <h3>{item.name}</h3>
                  <strong>{formatPrice(item.price)}</strong>
                </div>
                <div className="cart-line-actions">
                  <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                    <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => setQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" aria-label={`Increase ${item.name} quantity`} disabled={item.quantity >= 99} onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <strong className="cart-line-total">{formatPrice(item.price * item.quantity)}</strong>
                  <button className="cart-remove" type="button" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </article>
            ))}
            <Link className="cart-continue" href="/browse-menu">← Continue shopping</Link>
          </div>

          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div className="cart-summary-row"><span>Items ({itemCount})</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="cart-summary-total"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            <p className="cart-summary-note">Pay securely with Stripe. Your order is sent to the restaurant after payment confirmation.</p>

            {user?.role === "customer" ? (
              <form className="cart-checkout-form" onSubmit={submitOrder}>
                <label>
                  Delivery date &amp; time
                  <input
                    type="datetime-local"
                    min={getMinimumDeliveryTime()}
                    required
                    value={deliveryDate}
                    onChange={(event) => setDeliveryDate(event.target.value)}
                  />
                </label>
                <label>
                  Delivery address
                  <textarea required rows="3" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street, city, apartment or suite" />
                </label>
                <label>
                  Notes for the restaurant <span className="optional-label">Optional</span>
                  <textarea rows="2" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Anything they should know?" />
                </label>
                <button className="button button-orange cart-submit" type="submit" disabled={submitting}>
                  {submitting ? "Opening secure checkout…" : "Continue to payment"} <span>→</span>
                </button>
              </form>
            ) : user ? (
              <p className="cart-auth-note">Ordering is available to customer accounts. Sign out and sign in as a customer to continue.</p>
            ) : (
              <Link className="button button-orange cart-submit" href="/sign-in?next=%2Fcart">Sign in to checkout <span>→</span></Link>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
