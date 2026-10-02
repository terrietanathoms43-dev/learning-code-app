import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function healthResponse(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "cache-control": "private, no-store, max-age=0",
    },
  });
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const openAIConfigured = Boolean(process.env.OPENAI_API_KEY);

  if (!url || !publishableKey) {
    return healthResponse(
      {
        status: "not_ready",
        database: "not_configured",
        persistence: isAdminSupabaseConfigured ? "configured" : "not_configured",
        aiCoach: openAIConfigured ? "configured" : "not_configured",
      },
      503,
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
      return healthResponse(
        {
          status: "not_ready",
          database: "unavailable",
          persistence: isAdminSupabaseConfigured ? "configured" : "not_configured",
          aiCoach: openAIConfigured ? "configured" : "not_configured",
        },
        503,
      );
    }

    let persistenceReady = false;

    if (isAdminSupabaseConfigured) {
      const admin = createAdminClient();
      const { error: persistenceError } = await admin
        .from("user_lesson_progress")
        .select("user_id")
        .limit(1);

      persistenceReady = !persistenceError;
    }

    const fullyConfigured = openAIConfigured && persistenceReady;

    return healthResponse(
      {
        status: fullyConfigured ? "ok" : "degraded",
        database: "ok",
        publishedLessons: count,
        persistence: persistenceReady
          ? "configured"
          : isAdminSupabaseConfigured
            ? "unavailable"
            : "not_configured",
        aiCoach: openAIConfigured ? "configured" : "not_configured",
      },
      fullyConfigured ? 200 : 503,
    );
  } catch {
    return healthResponse(
      {
        status: "not_ready",
        database: "unavailable",
        persistence: isAdminSupabaseConfigured ? "unavailable" : "not_configured",
        aiCoach: openAIConfigured ? "configured" : "not_configured",
      },
      503,
    );
  }
}
