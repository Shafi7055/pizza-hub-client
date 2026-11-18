import Link from "next/link";
import DashboardPage from "../../../../components/DashboardPage";

export const metadata = { title: "Subscription | PizzaHub" };

export default function VendorSubscriptionPage() {
  return (
    <DashboardPage eyebrow="GROW YOUR RESTAURANT" title="A plan for every kitchen" description="Start free, then go Premium when you're ready to put your restaurant in the spotlight.">
      <div className="plan-grid">
        <article className="plan-card">
          <span className="plan-label">YOUR CURRENT PLAN</span><h2>Free</h2><p className="plan-price">$0 <span>/ forever</span></p>
          <ul><li>Up to 3 active menu items</li><li>Basic vendor dashboard</li><li>Order management</li></ul>
          <span className="plan-current">Current plan</span>
        </article>
        <article className="plan-card premium-plan">
          <span className="plan-label">MORE ROOM TO GROW</span><h2>Premium <span className="premium-badge">✦ PREMIUM</span></h2><p className="plan-price">$19 <span>/ month</span></p>
          <ul><li>Unlimited active menu items</li><li>Featured homepage placement</li><li>Premium restaurant badge</li><li>Everything in Free</li></ul>
          <button className="button button-orange" type="button" disabled>Upgrade to Premium</button>
        </article>
      </div>
      <p className="demo-note">Stripe Checkout and verified webhook confirmation are not configured. No upgrade can be purchased or activated in this demo.</p>
      <Link className="text-link" href="/payment/cancel">Preview payment cancel page ↗</Link>
    </DashboardPage>
  );
}
