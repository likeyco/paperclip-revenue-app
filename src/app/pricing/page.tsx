"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { SupabaseClient } from "@supabase/supabase-js";

const PLANS = [
  {
    name: "Free",
    price: "0",
    currency: "",
    period: "",
    description: "Try it out",
    features: [
      "5 repurposes per day",
      "All 4 output formats",
      "Basic content length",
    ],
    cta: "Get Started",
    href: "/login",
    highlighted: false,
    plan: null,
  },
  {
    name: "Starter",
    price: "19,000",
    currency: "₩",
    period: "/month",
    description: "For active creators",
    features: [
      "Unlimited repurposes",
      "All 4 output formats",
      "Priority generation",
      "Longer content support",
    ],
    cta: "Subscribe",
    href: null,
    highlighted: false,
    plan: "starter",
  },
  {
    name: "Pro",
    price: "39,000",
    currency: "₩",
    period: "/month",
    description: "For power users",
    features: [
      "Everything in Starter",
      "Bulk repurposing (coming soon)",
      "Custom tone/brand voice (coming soon)",
      "API access (coming soon)",
    ],
    cta: "Subscribe",
    href: null,
    highlighted: true,
    plan: "pro",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const supabaseRef = useRef<SupabaseClient | null>(null);

  function getSupabase(): SupabaseClient {
    if (!supabaseRef.current) {
      supabaseRef.current = createSupabaseBrowser();
    }
    return supabaseRef.current!;
  }

  async function handleSubscribe(plan: string) {
    setLoading(plan);

    const {
      data: { user },
    } = await getSupabase().auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      // Load Toss Payments SDK and open payment widget
      const tossPayments = await loadTossPayments();
      if (tossPayments) {
        await tossPayments.requestPayment("카드", {
          amount: data.amount,
          orderId: data.orderId,
          orderName: data.orderName,
          customerEmail: data.customerEmail,
          customerName: data.customerName,
          successUrl: `${window.location.origin}/pricing/success?plan=${plan}`,
          failUrl: `${window.location.origin}/pricing?error=payment_failed`,
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">
            ContentShift
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Simple pricing
          </h1>
          <p className="text-lg text-slate-600">
            Start free. Upgrade when you need unlimited repurposing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-blue-500 bg-white shadow-lg ring-1 ring-blue-500"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.highlighted && (
                <div className="text-xs font-medium text-blue-600 mb-2">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-slate-900">
                {plan.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-slate-900">
                  {plan.currency}
                  {plan.price}
                </span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="text-green-500 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.href ? (
                <Link
                  href={plan.href}
                  className="w-full py-2.5 text-sm font-medium text-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.plan!)}
                  disabled={loading === plan.plan}
                  className={`w-full py-2.5 text-sm font-medium rounded-lg disabled:opacity-50 ${
                    plan.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {loading === plan.plan ? "Loading..." : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Toss Payments SDK loader
function loadTossPayments(): Promise<TossPaymentsInstance | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }

    const win = window as unknown as Record<string, unknown>;

    if (win.TossPayments) {
      const factory = win.TossPayments as (key: string) => TossPaymentsInstance;
      resolve(factory(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ""));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1/payment";
    script.onload = () => {
      const factory = (window as unknown as Record<string, unknown>)
        .TossPayments as (key: string) => TossPaymentsInstance;
      resolve(factory(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ""));
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

interface TossPaymentsInstance {
  requestPayment(
    method: string,
    params: {
      amount: number;
      orderId: string;
      orderName: string;
      customerEmail?: string;
      customerName?: string;
      successUrl: string;
      failUrl: string;
    }
  ): Promise<void>;
}
