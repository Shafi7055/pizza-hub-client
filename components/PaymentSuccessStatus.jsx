"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";

export default function PaymentSuccessStatus() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;
    let timeout;
    let attempts = 0;

    async function checkSubscription() {
      try {
        const { user } = await api("/api/auth/me");
        if (!active) return;
        if (user.subscriptionPlan === "premium") {
          setStatus("confirmed");
        } else if (attempts < 5) {
          attempts += 1;
          timeout = window.setTimeout(checkSubscription, 1500);
        } else {
          setStatus("pending");
        }
      } catch {
        if (active) setStatus("unavailable");
      }
    }

    checkSubscription();
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="result-page">
      <span className={`result-icon ${status === "confirmed" ? "success" : ""}`}>{status === "confirmed" ? "✓" : "…"}</span>
      <div className="eyebrow"><span className="eyebrow-dot" /> PAYMENT STATUS</div>
      <h1>{status === "confirmed" ? <>Premium is<br /><span>active.</span></> : <>Payment<br /><span>{status === "pending" ? "processing." : status === "unavailable" ? "received." : "confirmation."}</span></>}</h1>
      <p>{status === "confirmed"
        ? "Your Premium subscription is active. Thanks for supporting local pizza."
        : status === "pending"
          ? "Stripe has not confirmed your subscription yet. This page will not activate your plan until the verified webhook arrives; check back shortly."
          : status === "unavailable"
            ? "We couldn't check your plan right now. Stripe must confirm payment through a verified webhook before Premium is activated."
            : "Checking for Stripe's verified payment confirmation…"}
      </p>
      <Link className="button button-orange" href="/dashboard/vendor/subscription">Back to subscription <span>→</span></Link>
    </section>
  );
}
