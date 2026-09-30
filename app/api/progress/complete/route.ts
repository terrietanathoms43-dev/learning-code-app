import { NextResponse } from "next/server";
import { implementedLessonSlugs } from "@/lib/course-data";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isAdminSupabaseConfigured) {
    return NextResponse.json(
      { error: "Cloud progress saving is not configured yet." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("lessonSlug" in payload) ||
    typeof payload.lessonSlug !== "string" ||
    !implementedLessonSlugs.includes(payload.lessonSlug)
  ) {
    return NextResponse.json({ error: "Unknown lesson." }, { status: 400 });
  }

  const authClient = await createClient();
  const { data: claimsData, error: claimsError } = await authClient.auth.getClaims();
  const userId =
    !claimsError && claimsData?.claims && typeof claimsData.claims.sub === "string"
      ? claimsData.claims.sub
      : null;

  if (!userId) {
    return NextResponse.json({ error: "Sign in to save progress." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: lesson, error: lessonError } = await admin
    .from("lessons")
    .select("id, slug, xp_reward")
    .eq("slug", payload.lessonSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (lessonError || !lesson) {
    return NextResponse.json({ error: "Lesson is not available." }, { status: 404 });
  }

  const { data: exerciseRows, error: exerciseError } = await admin
    .from("exercises")
    .select("id")
    .eq("lesson_id", lesson.id)
    .eq("is_published", true);

  if (exerciseError || !exerciseRows?.length) {
    return NextResponse.json({ error: "Lesson exercises are not ready." }, { status: 409 });
  }

  const exerciseIds = exerciseRows.map((exercise) => exercise.id);
  const { data: attempts, error: attemptError } = await admin
    .from("exercise_attempts")
    .select("exercise_id, is_correct, attempted_at")
    .eq("user_id", userId)
    .in("exercise_id", exerciseIds)
    .order("attempted_at", { ascending: true });

  if (attemptError) {
    return NextResponse.json({ error: "Could not verify lesson attempts." }, { status: 500 });
  }

  const attemptRows = attempts ?? [];
  const correctExerciseIds = new Set(
    attemptRows.filter((attempt) => attempt.is_correct).map((attempt) => attempt.exercise_id),
  );

  if (correctExerciseIds.size < exerciseIds.length) {
    return NextResponse.json(
      {
        error: "Complete every challenge correctly before finishing the lesson.",
        missingChallenges: exerciseIds.length - correctExerciseIds.size,
      },
      { status: 409 },
    );
  }

  const accuracy = Math.round(
    (exerciseIds.length / Math.max(attemptRows.length, exerciseIds.length)) * 100,
  );
  const completedAt = new Date().toISOString();

  const { data: existingProgress } = await admin
    .from("user_lesson_progress")
    .select("status, best_score")
    .eq("user_id", userId)
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  const alreadyCompleted = existingProgress?.status === "completed";
  const bestScore = Math.max(Number(existingProgress?.best_score || 0), accuracy);

  const { error: progressError } = await admin.from("user_lesson_progress").upsert(
    {
      user_id: userId,
      lesson_id: lesson.id,
      status: "completed",
      attempts: attemptRows.length,
      best_score: bestScore,
      started_at: attemptRows[0]?.attempted_at ?? completedAt,
      completed_at: completedAt,
      updated_at: completedAt,
    },
    { onConflict: "user_id,lesson_id" },
  );

  if (progressError) {
    return NextResponse.json({ error: "Could not save lesson progress." }, { status: 500 });
  }

  let xpAwarded = 0;

  if (!alreadyCompleted) {
    const { error: xpError } = await admin.from("xp_events").insert({
      user_id: userId,
      amount: lesson.xp_reward,
      event_type: "lesson_completed",
      lesson_id: lesson.id,
    });

    if (!xpError) {
      xpAwarded = Number(lesson.xp_reward || 0);
    } else if (xpError.code !== "23505") {
      return NextResponse.json(
        { error: "Progress was saved, but XP could not be awarded." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    saved: true,
    alreadyCompleted,
    xpAwarded,
    accuracy: bestScore,
  });
}
