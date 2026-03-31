import { NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await request.json();
  const amount = plan === "pro" ? 39000 : 19000; // KRW
  const planName = plan === "pro" ? "Pro" : "Starter";
  const orderId = `order_${user.id}_${Date.now()}`;

  // Return data for Toss Payments client-side widget
  return Response.json({
    orderId,
    orderName: `ContentShift ${planName} - Monthly`,
    amount,
    customerEmail: user.email,
    customerName: user.user_metadata?.name || user.email?.split("@")[0],
    plan,
  });
}
