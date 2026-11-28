"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import { useCart } from "./CartProvider";

export default function PaymentSuccessStatus({ isOrderPayment, sessionId }) {
  const [status, setStatus] = useState("checking");
  const { items, ready: cartReady, setQuantity } = useCart();
  const cartRef = useRef({ items, ready: cartReady });

  useEffect(() => {
    cartRef.current = { items, ready: cartReady };
  }, [cartReady, items]);

  useEffect(() => {
    let active = true;
    let timeout;
    let attempts = 0;
    async function checkPayment() {
      try {
        if (isOrderPayment) {
          if (!sessionId) {
            setStatus("unavailable");
            return;
          }
          const checkout = await api(`/api/orders/checkout/${encodeURIComponent(sessionId)}/status`);
          if (!active) return;
          if (checkout.status === "paid") {
            if (!cartRef.current.ready) {
              timeout = window.setTimeout(checkPayment, 100);
              return;
            }
            for (const paidItem of checkout.items) {
              const cartItem = cartRef.current.items.find((entry) => entry.id === paidItem.itemId);
              if (cartItem) setQuantity(paidItem.itemId, cartItem.quantity - paidItem.quantity);
            }
            setStatus("confirmed");
          } else if (checkout.status === "failed" || checkout.status === "expired") {
            setStatus("failed");
          } else if (attempts < 10) {
            attempts += 1;
            timeout = window.setTimeout(checkPayment, 1500);
          } else {
            setStatus("pending");
          }
          return;
        }

        const { user } = await api("/api/auth/me");
        if (!active) return;
        if (user.subscriptionPlan === "premium") {
          setStatus("confirmed");
        } else if (attempts < 10) {
          attempts += 1;
          timeout = window.setTimeout(checkPayment, 1500);
        } else {
          setStatus("pending");
        }
      } catch {
        if (active) setStatus("unavailable");
      }
    }

    checkPayment();
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [isOrderPayment, sessionId, setQuantity]);

  const canRecheckOrderPayment = Boolean(sessionId) && ["pending", "unavailable"].includes(status);
  const orderResultHref = status === "confirmed"
    ? "/dashboard/customer/orders"
    : canRecheckOrderPayment
      ? `/payment/success?type=order&session_id=${encodeURIComponent(sessionId)}`
      : "/cart";
  const orderResultLabel = status === "confirmed"
    ? "View my orders"
    : canRecheckOrderPayment
      ? "Check payment status"
      : "Back to my bag";

  return (
    <section className="result-page">
      <span className={`result-icon ${status === "confirmed" ? "success" : ""}`}>{status === "confirmed" ? "✓" : "…"}</span>
      <div className="eyebrow"><span className="eyebrow-dot" /> PAYMENT STATUS</div>
      <h1>{isOrderPayment
        ? status === "confirmed"
          ? <>Payment is<br /><span>confirmed.</span></>
          : <>Order payment<br /><span>{status === "pending" ? "processing." : status === "failed" ? "not completed." : "confirmation."}</span></>
        : status === "confirmed"
          ? <>Premium is<br /><span>active.</span></>
          : <>Payment<br /><span>{status === "pending" ? "processing." : status === "unavailable" ? "received." : "confirmation."}</span></>}
      </h1>
      <p>{isOrderPayment
        ? status === "confirmed"
          ? "Stripe confirmed your payment and your order has been sent to the restaurant. Your bag has been updated."
          : status === "failed"
            ? "Checkout expired or the payment failed. Your bag is still saved so you can try again."
            : status === "pending"
              ? "Stripe has not confirmed the payment yet. We are still checking; your order will be created only after the verified webhook arrives."
              : "We couldn't verify this payment. It may still be processing; check your order history or contact support before trying again."
        : status === "confirmed"
          ? "Your Premium subscription is active. Thanks for supporting local pizza."
          : status === "pending"
            ? "Stripe has not confirmed your subscription yet. This page will not activate your plan until the verified webhook arrives; check back shortly."
            : status === "unavailable"
              ? "We couldn't check your plan right now. Stripe must confirm payment through a verified webhook before Premium is activated."
              : "Checking for Stripe's verified payment confirmation…"}
      </p>
      <Link className="button button-orange" href={isOrderPayment
        ? orderResultHref
        : "/dashboard/vendor/subscription"}>
        {isOrderPayment ? orderResultLabel : "Back to subscription"} <span>→</span>
      </Link>
    </section>
  );
}
