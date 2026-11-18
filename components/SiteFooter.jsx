import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main section-wrap">
        <div className="footer-brand">
          <Link className="brand" href="/"><span className="brand-mark">P</span><span>pizza<span className="brand-accent">hub</span></span></Link>
          <p>Good food tastes even better<br />when it brings us together.</p>
        </div>
        <div className="footer-links">
          <span>COME HUNGRY</span>
          <Link href="/browse-menu">Browse the menu</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/">Our story</Link>
        </div>
        <div className="footer-links">
          <span>THE GOOD STUFF</span>
          <Link href="/sign-up">For restaurants</Link>
          <Link href="/sign-up">Join our team</Link>
          <Link href="/sign-in">Get in touch</Link>
        </div>
        <div className="footer-social">
          <span>FOLLOW THE CRUST</span>
          <div>
            <a href="https://instagram.com" aria-label="Instagram">ig</a>
            <a href="https://tiktok.com" aria-label="TikTok">tk</a>
            <a href="https://x.com" aria-label="X">x</a>
          </div>
          <p>Good things are happening<br />@pizzahub</p>
        </div>
      </div>
      <div className="footer-bottom section-wrap">
        <span>© 2025 PizzaHub. Made with extra cheese.</span>
        <div><Link href="/">Privacy</Link><Link href="/">Terms</Link><span>Made for pizza people <b>♥</b></span></div>
      </div>
    </footer>
  );
}
