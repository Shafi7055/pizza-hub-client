"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.2 10h11.6M10.5 4.7l5.3 5.3-5.3 5.3" />
    </svg>
  );
}

export default function SiteHeader({ cartCount = 0 }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isBrowse = pathname === "/browse-menu" || pathname.startsWith("/menu/");

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="PizzaHub home">
        <span className="brand-mark">P</span>
        <span>pizza<span className="brand-accent">hub</span></span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link className={isHome ? "nav-active" : ""} href="/">Home</Link>
        <Link className={isBrowse ? "nav-active" : ""} href="/browse-menu">Browse menu</Link>
        <Link href="/#how-it-works">How it works</Link>
      </nav>
      <div className="header-actions">
        <Link className="bag-button" href="/browse-menu" aria-label={`Shopping bag, ${cartCount} items`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 8h14l1 12H4L5 8Z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          <span className="bag-count">{cartCount}</span>
        </Link>
        <Link className="header-login" href="/sign-in">Sign in</Link>
        <Link className="button button-dark header-cta" href="/sign-up">Sign up <ArrowIcon /></Link>
      </div>
    </header>
  );
}
