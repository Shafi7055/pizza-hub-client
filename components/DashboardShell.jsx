"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDashboardPath } from "../lib/demo-users";
import { useDemoAuth } from "./DemoAuthProvider";

const dashboardLinks = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: "⌂" },
    { href: "/dashboard/vendor/menu", label: "My menu items", icon: "▤" },
    { href: "/dashboard/vendor/menu/new", label: "Add menu item", icon: "+" },
    { href: "/dashboard/vendor/orders", label: "Customer orders", icon: "↗" },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: "✦" },
    { href: "/dashboard/vendor/profile-settings", label: "Profile settings", icon: "◎" },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: "⌂" },
    { href: "/dashboard/customer/orders", label: "My orders", icon: "▤" },
    { href: "/dashboard/customer/favorites", label: "Favorites", icon: "♡" },
    { href: "/dashboard/customer/profile-settings", label: "Profile settings", icon: "◎" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: "⌂" },
    { href: "/dashboard/admin/users", label: "Manage users", icon: "◎" },
    { href: "/dashboard/admin/menu-items", label: "Manage menu items", icon: "▤" },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: "$" },
  ],
};

const roleLabels = {
  vendor: "Restaurant workspace",
  customer: "Customer account",
  admin: "Platform admin",
};

export default function DashboardShell({ role, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, signOut } = useDemoAuth();
  const [signingOut, setSigningOut] = useState(false);
  const links = dashboardLinks[role];

  useEffect(() => {
    if (!ready || signingOut) return;
    if (!user) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role !== role) {
      router.replace(getDashboardPath(user.role));
    }
  }, [pathname, ready, role, router, signingOut, user]);

  if (!ready || !user || user.role !== role) {
    return (
      <main className="role-check" aria-live="polite">
        <span className="role-check-spinner" />
        <strong>{!ready ? "Loading demo session…" : !user ? "Redirecting to sign in…" : `Taking you to your ${user.role} dashboard…`}</strong>
      </main>
    );
  }

  function handleSignOut() {
    setSigningOut(true);
    signOut();
    router.replace("/sign-in");
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="brand dashboard-brand" href="/">
          <span className="brand-mark">P</span>
          <span>pizza<span className="brand-accent">hub</span></span>
        </Link>
        <div className="workspace-label">{roleLabels[role]}</div>
        <nav className="dashboard-nav" aria-label={`${role} dashboard`}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link className={`dashboard-nav-link${active ? " active" : ""}`} href={link.href} key={link.href} aria-current={active ? "page" : undefined}>
                <span className="dashboard-nav-icon" aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link className="back-home-link" href="/">← Back to PizzaHub</Link>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-kicker">DEMO WORKSPACE</span>
            <strong>{roleLabels[role]}</strong>
          </div>
          <div className="dashboard-user">
            <Link className="dashboard-user-profile" href={role === "vendor" ? "/dashboard/vendor/profile-settings" : role === "customer" ? "/dashboard/customer/profile-settings" : "/dashboard"}>
              <span className="dashboard-avatar">{user.initials}</span>
              <span><strong>{user.name}</strong><small>{user.email}</small></span>
            </Link>
            <button className="dashboard-signout" onClick={handleSignOut} type="button">Sign out</button>
          </div>
        </header>
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
