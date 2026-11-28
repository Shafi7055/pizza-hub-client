"use client";

import Link from "next/link";

export default function PaymentCancelStatus({ isOrderCheckout }) {
  return (
    <section className="result-page">
      <span className="result-icon cancelled">×</span>
      <div className="eyebrow"><span className="eyebrow-dot" /> PAYMENT STATUS</div>
      <h1>No worries.<br /><span>{isOrderCheckout ? "Your bag is saved." : "Your plan stays the same."}</span></h1>
      <p>{isOrderCheckout
        ? "Checkout was cancelled. No order was placed, and your items are still in your bag."
        : "Checkout was cancelled. No payment was made, and your current subscription remains unchanged."}</p>
      <Link className="button button-dark" href={isOrderCheckout ? "/cart" : "/dashboard/vendor/subscription"}>
        {isOrderCheckout ? "Return to my bag" : "Return to subscription"} <span>→</span>
      </Link>
    </section>
  );
}
