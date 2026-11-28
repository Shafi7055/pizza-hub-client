import PublicPageFrame from "../../components/PublicPageFrame";
import ShoppingCart from "../../components/ShoppingCart";

export const metadata = { title: "Your bag | PizzaHub" };

export default function CartPage() {
  return (
    <PublicPageFrame>
      <ShoppingCart />
    </PublicPageFrame>
  );
}
