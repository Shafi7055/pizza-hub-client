import PublicPageFrame from "../../../components/PublicPageFrame";
import PaymentCancelStatus from "../../../components/PaymentCancelStatus";

export const metadata = { title: "Payment cancelled | PizzaHub" };

export default async function PaymentCancelPage({ searchParams }) {
  const params = await searchParams;
  return (
    <PublicPageFrame>
      <PaymentCancelStatus isOrderCheckout={params?.type === "order"} />
    </PublicPageFrame>
  );
}
