import PublicPageFrame from "../../../components/PublicPageFrame";
import PaymentSuccessStatus from "../../../components/PaymentSuccessStatus";

export const metadata = { title: "Payment success | PizzaHub" };

export default function PaymentSuccessPage() {
  return (
    <PublicPageFrame>
      <PaymentSuccessStatus />
    </PublicPageFrame>
  );
}
