import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";
import { isSameOriginRequest } from "@/lib/request-security";
import { getUsernameError, normalizeUsername } from "@/lib/profile-validation";

const allowedGoals = new Set([20, 30, 50, 75, 100]);

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
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
    !("displayName" in payload) ||
    !("username" in payload) ||
    !("dailyGoalXp" in payload) ||
    typeof payload.displayName !== "string" ||
    typeof payload.username !== "string" ||
    typeof payload.dailyGoalXp !== "number"
  ) {
    return NextResponse.json({ error: "Profile settings are incomplete." }, { status: 400 });
  }

  const displayName = payload.displayName.trim();
  const username = normalizeUsername(payload.username);
  const dailyGoalXp = payload.dailyGoalXp;

  if (displayName.length < 2 || displayName.length > 40) {
    return NextResponse.json(
      { error: "Display name must be between 2 and 40 characters." },
      { status: 400 },
    );
  }

  const usernameError = getUsernameError(username);
  if (usernameError) {
    return NextResponse.json({ error: usernameError }, { status: 400 });
  }

  if (!allowedGoals.has(dailyGoalXp)) {
    return NextResponse.json({ error: "Choose one of the available XP goals." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId =
    !claimsError && claimsData?.claims && typeof claimsData.claims.sub === "string"
      ? claimsData.claims.sub
      : null;

  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  if (!isAdminSupabaseConfigured) {
    return NextResponse.json(
      { error: "Profile saving is temporarily unavailable." },
      { status: 503 },
    );
  }

  const admin = createAdminClient();
  const { error: saveError } = await admin.from("profiles").upsert(
    {
      id: userId,
      display_name: displayName,
      username: username || null,
      daily_goal_xp: dailyGoalXp,
    },
    { onConflict: "id" },
  );

  if (saveError) {
    if (saveError.code === "23505") {
      return NextResponse.json(
        { error: "That username is already taken. Try another one." },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Could not save profile settings." }, { status: 500 });
  }

  return NextResponse.json({ saved: true, username: username || null });
}
