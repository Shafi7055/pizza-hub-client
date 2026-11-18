import Link from "next/link";
import DashboardPage from "../../../../../components/DashboardPage";

export const metadata = { title: "Add menu item | PizzaHub" };

export default function NewVendorMenuItemPage() {
  return (
    <DashboardPage eyebrow="YOUR MENU" title="Add a menu item" description="Give your next crowd-pleaser a place on the menu.">
      <section className="dashboard-panel">
        <div className="panel-heading"><div><h2>Item details</h2><p>New items are submitted for review before they can be published.</p></div></div>
        <fieldset className="demo-fieldset" disabled>
          <div className="form-grid">
            <label>Item name<input placeholder="e.g. The Sunday Special" /></label>
            <label>Category<select defaultValue=""><option value="" disabled>Choose a category</option><option>Classic</option><option>Veggie</option><option>Meat</option></select></label>
            <label>Price<input placeholder="0.00" type="number" /></label>
            <label>Location<input placeholder="Area or city" /></label>
            <label className="form-span">Description<textarea placeholder="What makes this one special?" rows="4" /></label>
            <label className="form-span">Item image<input accept="image/*" type="file" /></label>
          </div>
          <div className="form-actions"><Link className="button button-outline" href="/dashboard/vendor/menu">Cancel</Link><button className="button button-orange" type="button">Submit for review</button></div>
        </fieldset>
        <p className="demo-note">Form submission and image uploads will be enabled when the API is connected.</p>
      </section>
    </DashboardPage>
  );
}
