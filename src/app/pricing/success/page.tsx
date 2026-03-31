"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<"confirming" | "success" | "error">(
    "confirming"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = params.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setErrorMessage("Missing payment information.");
      return;
    }

    fetch("/api/payments/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Payment confirmation failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Failed to confirm payment.");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-sm w-full text-center">
        {status === "confirming" && (
          <>
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-slate-900">
              Confirming payment...
            </h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Payment successful!
            </h1>
            <p className="text-slate-600 mb-6">
              Your subscription is now active. Enjoy unlimited repurposing.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-4xl mb-4">✕</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Payment failed
            </h1>
            <p className="text-slate-600 mb-6">{errorMessage}</p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
