import { NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paymentKey, orderId, amount } = await request.json();

  // Confirm payment with Toss Payments API
  const tossResponse = await fetch(
    "https://api.tosspayments.com/v1/payments/confirm",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.TOSS_SECRET_KEY + ":"
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    }
  );

  const paymentResult = await tossResponse.json();

  if (!tossResponse.ok) {
    return Response.json(
      { error: paymentResult.message || "Payment confirmation failed" },
      { status: 400 }
    );
  }

  // Determine plan from amount
  const plan = amount >= 39000 ? "pro" : "starter";

  // Create or update subscription
  await getSupabaseAdmin().from("subscriptions").upsert(
    {
      user_id: user.id,
      plan,
      status: "active",
      payment_key: paymentKey,
      order_id: orderId,
      amount,
      started_at: new Date().toISOString(),
      current_period_end: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    { onConflict: "user_id" }
  );

  return Response.json({ success: true, plan });
}
