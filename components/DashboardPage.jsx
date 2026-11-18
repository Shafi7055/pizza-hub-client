export default function DashboardPage({ eyebrow, title, description, stats = [], children }) {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page-heading">
        <div className="eyebrow"><span className="eyebrow-dot" /> {eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {stats.length > 0 && (
        <div className="stat-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.note}</small>
            </article>
          ))}
        </div>
      )}
      {children}
    </section>
  );
}
