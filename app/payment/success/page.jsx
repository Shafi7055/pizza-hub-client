import Link from "next/link";
import PublicPageFrame from "../../../components/PublicPageFrame";

export const metadata = { title: "Payment success | PizzaHub" };

export default function PaymentSuccessPage() {
  return (
    <PublicPageFrame>
      <section className="result-page">
        <span className="result-icon success">✓</span>
        <div className="eyebrow"><span className="eyebrow-dot" /> PAYMENT STATUS</div>
        <h1>Thanks for supporting<br /><span>local pizza.</span></h1>
        <p>This is the demo payment success route. A verified Stripe webhook must confirm a payment before a subscription can be activated.</p>
        <Link className="button button-orange" href="/dashboard/vendor/subscription">Back to subscription <span>→</span></Link>
      </section>
    </PublicPageFrame>
  );
}
