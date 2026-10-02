import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const openAIConfigured = Boolean(process.env.OPENAI_API_KEY);

  if (!url || !publishableKey) {
    return NextResponse.json(
      {
        status: "not_ready",
        database: "not_configured",
        aiCoach: openAIConfigured ? "configured" : "not_configured",
      },
      { status: 503 },
    );
  }

  try {
    const supabase = createSupabaseClient(url, publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { count, error } = await supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true);

    if (error || (count ?? 0) < 1) {
      return NextResponse.json(
        {
          status: "not_ready",
          database: "unavailable",
          aiCoach: openAIConfigured ? "configured" : "not_configured",
        },
        { status: 503 },
      );
    }

    const status = openAIConfigured ? "ok" : "degraded";

    return NextResponse.json(
      {
        status,
        database: "ok",
        publishedLessons: count,
        aiCoach: openAIConfigured ? "configured" : "not_configured",
      },
      { status: openAIConfigured ? 200 : 503 },
    );
  } catch {
    return NextResponse.json(
      {
        status: "not_ready",
        database: "unavailable",
        aiCoach: openAIConfigured ? "configured" : "not_configured",
      },
      { status: 503 },
    );
  }
}
