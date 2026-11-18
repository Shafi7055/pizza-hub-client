import DashboardPage from "./DashboardPage";

export default function ProfileSettingsPage({ audience }) {
  return (
    <DashboardPage
      eyebrow="YOUR ACCOUNT"
      title="Profile settings"
      description={`Manage the ${audience} profile details for this demo workspace.`}
    >
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div><h2>Personal information</h2><p>Profile editing will be connected when authentication and the API are implemented.</p></div>
        </div>
        <fieldset className="demo-fieldset" disabled>
          <div className="form-grid">
            <label>Full name<input defaultValue={audience === "vendor" ? "Demo Restaurant" : "Demo User"} /></label>
            <label>Email address<input defaultValue="hello@example.com" type="email" /></label>
            {audience === "vendor" && <label>Restaurant name<input defaultValue="Little Oven Pizzeria" /></label>}
            <label>Profile image<input type="file" /></label>
          </div>
          <button className="button button-orange" type="button">Save changes</button>
        </fieldset>
        <p className="demo-note">This is a non-persistent UI placeholder; profile updates are not active yet.</p>
      </section>
    </DashboardPage>
  );
}
