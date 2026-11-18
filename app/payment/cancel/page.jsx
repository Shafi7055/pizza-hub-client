import Link from "next/link";
import PublicPageFrame from "../../../components/PublicPageFrame";

export const metadata = { title: "Payment cancelled | PizzaHub" };

export default function PaymentCancelPage() {
  return (
    <PublicPageFrame>
      <section className="result-page">
        <span className="result-icon cancelled">×</span>
        <div className="eyebrow"><span className="eyebrow-dot" /> PAYMENT STATUS</div>
        <h1>No worries.<br /><span>Your plan stays the same.</span></h1>
        <p>The demo checkout was cancelled. No payment or subscription changes have been made.</p>
        <Link className="button button-dark" href="/dashboard/vendor/subscription">Return to subscription <span>→</span></Link>
      </section>
    </PublicPageFrame>
  );
}
