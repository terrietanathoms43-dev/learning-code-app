import { NextResponse } from "next/server";
import { checkAnswer } from "@/lib/answer-key";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isUuidV4 } from "@/lib/validation";

async function recordAttempt(exerciseKey: string, answer: string, isCorrect: boolean, sessionId: string) {
  if (!isAdminSupabaseConfigured) return;

  try {
    const authClient = await createClient();
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims();
    const userId =
      !claimsError && claimsData?.claims && typeof claimsData.claims.sub === "string"
        ? claimsData.claims.sub
        : null;

    if (!userId) return;

    const admin = createAdminClient();
    const { data: exercise, error: exerciseError } = await admin
      .from("exercises")
      .select("id")
      .eq("exercise_key", exerciseKey)
      .eq("is_published", true)
      .maybeSingle();

    if (exerciseError || !exercise) return;

    await admin.from("exercise_attempts").insert({
      user_id: userId,
      exercise_id: exercise.id,
      submitted_answer: { value: answer },
      is_correct: isCorrect,
      session_id: sessionId,
    });
  } catch {
    // Answer checking remains available for guests and during persistence outages.
  }
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("exerciseId" in payload) ||
    !("answer" in payload) ||
    !("sessionId" in payload) ||
    typeof payload.exerciseId !== "string" ||
    typeof payload.answer !== "string" ||
    typeof payload.sessionId !== "string"
  ) {
    return NextResponse.json({ error: "Exercise and answer are required." }, { status: 400 });
  }

  if (
    payload.answer.length > 500 ||
    payload.exerciseId.length > 100 ||
    !isUuidV4(payload.sessionId)
  ) {
    return NextResponse.json({ error: "Invalid exercise, answer or lesson session." }, { status: 400 });
  }

  const result = checkAnswer(payload.exerciseId, payload.answer);

  if (!result) {
    return NextResponse.json({ error: "Exercise not found." }, { status: 404 });
  }

  await recordAttempt(payload.exerciseId, payload.answer, result.correct, payload.sessionId);
  return NextResponse.json(result);
}
