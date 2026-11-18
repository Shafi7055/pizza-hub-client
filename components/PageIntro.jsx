export default function PageIntro({ eyebrow, title, description }) {
  return (
    <div className="page-intro">
      <div className="eyebrow"><span className="eyebrow-dot" /> {eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
