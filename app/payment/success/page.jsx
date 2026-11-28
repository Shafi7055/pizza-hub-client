import PublicPageFrame from "../../../components/PublicPageFrame";
import PaymentSuccessStatus from "../../../components/PaymentSuccessStatus";

export const metadata = { title: "Payment success | PizzaHub" };

export default async function PaymentSuccessPage({ searchParams }) {
  const params = await searchParams;
  return (
    <PublicPageFrame>
      <PaymentSuccessStatus
        isOrderPayment={params?.type === "order"}
        sessionId={params?.session_id}
      />
    </PublicPageFrame>
  );
}
