"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const links = dashboardLinks[role];

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
          <Link className="dashboard-user" href={role === "vendor" ? "/dashboard/vendor/profile-settings" : role === "customer" ? "/dashboard/customer/profile-settings" : "/dashboard"}>
            <span className="dashboard-avatar">{role === "admin" ? "A" : role === "vendor" ? "V" : "C"}</span>
            <span><strong>{role === "admin" ? "Admin" : role === "vendor" ? "Demo Restaurant" : "Demo Customer"}</strong><small>Demo profile</small></span>
          </Link>
        </header>
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
