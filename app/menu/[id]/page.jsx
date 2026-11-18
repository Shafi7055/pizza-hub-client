import Link from "next/link";
import { notFound } from "next/navigation";
import PublicPageFrame from "../../../components/PublicPageFrame";
import { menuItems } from "../../../lib/menu-data";

export default async function MenuItemPage({ params }) {
  const { id } = await params;
  const item = menuItems.find((menuItem) => menuItem.id === id);

  if (!item) notFound();

  return (
    <PublicPageFrame>
      <div className="breadcrumb"><Link href="/browse-menu">Browse menu</Link><span>/</span><span>{item.name}</span></div>
      <section className="item-detail">
        <div className="detail-image-wrap"><img src={item.image} alt={item.name} /></div>
        <div className="detail-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> {item.category.toUpperCase()} · {item.location.toUpperCase()}</div>
          <h1>{item.name}</h1>
          <div className="detail-rating"><span>★ {item.rating}</span><span>·</span><span>{item.time}</span><span>·</span><span>{item.vendor}</span></div>
          <p>{item.description} Prepared to order by {item.vendor}, one of the local kitchens on PizzaHub.</p>
          <div className="detail-price-row"><span>Price</span><strong>${item.price.toFixed(2)}</strong></div>
          <div className="detail-note"><span>✳</span><p>Every order is prepared fresh. Delivery options and scheduling will be available when ordering is connected.</p></div>
          <Link className="button button-orange detail-order" href={`/sign-in?next=/menu/${item.id}`}>Sign in to order <span>→</span></Link>
          <p className="placeholder-caption">Ordering is a UI placeholder in this demo.</p>
        </div>
      </section>
    </PublicPageFrame>
  );
}
