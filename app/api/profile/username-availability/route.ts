import { NextResponse } from "next/server";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getUsernameError, normalizeUsername } from "@/lib/profile-validation";
import { isSameOriginRequest } from "@/lib/request-security";

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
    !("username" in payload) ||
    typeof payload.username !== "string"
  ) {
    return NextResponse.json({ error: "Username is required." }, { status: 400 });
  }

  const username = normalizeUsername(payload.username);
  const usernameError = getUsernameError(username);

  if (!username || usernameError) {
    return NextResponse.json(
      { available: false, error: usernameError || "Enter a username." },
      { status: 400 },
    );
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
      { error: "Username checking is temporarily unavailable." },
      { status: 503 },
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", userId)
    .limit(1);

  if (error) {
    return NextResponse.json(
      { error: "Username checking is temporarily unavailable." },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { available: (data?.length ?? 0) === 0, username },
    { headers: { "cache-control": "private, no-store, max-age=0" } },
  );
}
