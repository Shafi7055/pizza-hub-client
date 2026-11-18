import Link from "next/link";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

const workspaces = [
  { role: "Customer", href: "/dashboard/customer", description: "See your orders and manage your customer profile.", icon: "♡" },
  { role: "Vendor", href: "/dashboard/vendor", description: "Manage your restaurant menu, orders, and subscription.", icon: "✳" },
  { role: "Admin", href: "/dashboard/admin", description: "Review users, menu items, and platform transactions.", icon: "⌘" },
];

export const metadata = { title: "Demo dashboards | PizzaHub" };

export default function DashboardIndexPage() {
  return (
    <>
      <SiteHeader />
      <main className="content-page section-wrap">
        <div className="page-intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> DEMO WORKSPACES</div>
          <h1>Choose a <span>dashboard.</span></h1>
          <p>These role-based screens are UI scaffolds. Sign-in, authorization, and live account data are not connected yet.</p>
        </div>
        <div className="workspace-grid">
          {workspaces.map((workspace) => (
            <Link className="workspace-card" href={workspace.href} key={workspace.role}>
              <span className="workspace-icon">{workspace.icon}</span>
              <h2>{workspace.role} dashboard</h2>
              <p>{workspace.description}</p>
              <span className="workspace-open">Open workspace <b>→</b></span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
