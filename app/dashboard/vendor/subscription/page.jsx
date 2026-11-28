"use client";

import { useEffect, useState } from "react";
import DashboardPage from "../../../../components/DashboardPage";
import { api } from "../../../../lib/api";

export default function VendorSubscriptionPage() {
  const [message, setMessage] = useState("");
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    let active = true;
    api("/api/auth/me")
      .then(({ user }) => {
        if (active) setCurrentPlan(user.subscriptionPlan || "free");
      })
      .catch((error) => {
        if (active) setMessage(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function checkout() {
    setCheckoutLoading(true);
    setMessage("");
    try {
      const { url } = await api("/api/vendor/subscription/checkout", { method: "POST" });
      window.location.assign(url);
    } catch (error) {
      setMessage(error.message);
      setCheckoutLoading(false);
    }
  }
  return (
    <DashboardPage eyebrow="GROW YOUR RESTAURANT" title="A plan for every kitchen" description="Start free, then go Premium when you're ready to put your restaurant in the spotlight.">
      <div className="plan-grid">
        <article className="plan-card">
          <span className="plan-label">{currentPlan === "free" ? "YOUR CURRENT PLAN" : "STARTER PLAN"}</span><h2>Free</h2><p className="plan-price">$0 <span>/ forever</span></p>
          <ul><li>Up to 3 active menu items</li><li>Basic vendor dashboard</li><li>Order management</li></ul>
          {currentPlan === "free" && <span className="plan-current">Current plan</span>}
        </article>
        <article className="plan-card premium-plan">
          <span className="plan-label">{currentPlan === "premium" ? "YOUR CURRENT PLAN" : "MORE ROOM TO GROW"}</span><h2>Premium <span className="premium-badge">✦ PREMIUM</span></h2><p className="plan-price">$19 <span>/ month</span></p>
          <ul><li>Unlimited active menu items</li><li>Featured homepage placement</li><li>Premium restaurant badge</li><li>Everything in Free</li></ul>
          {currentPlan === "premium"
            ? <span className="plan-current">Current plan</span>
            : <button className="button button-orange" type="button" onClick={checkout} disabled={loading || checkoutLoading}>{checkoutLoading ? "Opening secure checkout…" : "Upgrade to Premium"}</button>}
        </article>
      </div>
      <p className="demo-note">Your plan updates only after Stripe confirms payment through a verified webhook.</p>
      {message && <p className="demo-note" role="alert">{message}</p>}
    </DashboardPage>
  );
}
