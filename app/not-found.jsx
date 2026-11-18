import Link from "next/link";
import PublicPageFrame from "../components/PublicPageFrame";

export default function NotFoundPage() {
  return (
    <PublicPageFrame>
      <section className="result-page not-found-page">
        <span className="result-icon cancelled">404</span>
        <div className="eyebrow"><span className="eyebrow-dot" /> WRONG TURN</div>
        <h1>This page is<br /><span>off the menu.</span></h1>
        <p>The page or menu item you’re looking for doesn’t exist.</p>
        <Link className="button button-orange" href="/browse-menu">Back to the menu <span>→</span></Link>
      </section>
    </PublicPageFrame>
  );
}
