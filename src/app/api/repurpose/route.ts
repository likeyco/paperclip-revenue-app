import { NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { repurposeContent, OutputFormat } from "@/lib/claude";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const DAILY_FREE_LIMIT = 5;

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, formats } = await request.json();

  if (!content || !formats?.length) {
    return Response.json(
      { error: "Content and at least one format are required" },
      { status: 400 }
    );
  }

  if (content.length > 50000) {
    return Response.json(
      { error: "Content too long. Maximum 50,000 characters." },
      { status: 400 }
    );
  }

  const validFormats: OutputFormat[] = [
    "twitter_thread",
    "linkedin_post",
    "email_newsletter",
    "instagram_caption",
  ];
  const selectedFormats = formats.filter((f: string) =>
    validFormats.includes(f as OutputFormat)
  ) as OutputFormat[];

  if (!selectedFormats.length) {
    return Response.json({ error: "No valid formats selected" }, { status: 400 });
  }

  // Check usage limits
  const today = new Date().toISOString().split("T")[0];
  const { data: usage } = await getSupabaseAdmin()
    .from("usage")
    .select("count")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  const currentCount = usage?.count ?? 0;

  // Check if user has active subscription
  const { data: subscription } = await getSupabaseAdmin()
    .from("subscriptions")
    .select("status, plan")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  const isPaid = !!subscription;

  if (!isPaid && currentCount >= DAILY_FREE_LIMIT) {
    return Response.json(
      {
        error: "Daily free limit reached",
        limit: DAILY_FREE_LIMIT,
        used: currentCount,
        upgrade: true,
      },
      { status: 429 }
    );
  }

  try {
    const results = await repurposeContent(content, selectedFormats);

    // Update usage count
    if (usage) {
      await getSupabaseAdmin()
        .from("usage")
        .update({ count: currentCount + 1 })
        .eq("user_id", user.id)
        .eq("date", today);
    } else {
      await getSupabaseAdmin()
        .from("usage")
        .insert({ user_id: user.id, date: today, count: 1 });
    }

    return Response.json({
      results,
      usage: {
        used: currentCount + 1,
        limit: isPaid ? null : DAILY_FREE_LIMIT,
        isPaid,
      },
    });
  } catch (error) {
    console.error("Repurpose error:", error);
    return Response.json(
      { error: "Failed to repurpose content. Please try again." },
      { status: 500 }
    );
  }
}
