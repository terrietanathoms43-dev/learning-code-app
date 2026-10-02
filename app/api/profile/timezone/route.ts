import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";

function isValidTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
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
    !("timeZone" in payload) ||
    typeof payload.timeZone !== "string" ||
    payload.timeZone.length > 80 ||
    !isValidTimeZone(payload.timeZone)
  ) {
    return NextResponse.json({ error: "Invalid timezone." }, { status: 400 });
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

  const { data, error } = await supabase
    .from("profiles")
    .update({ time_zone: payload.timeZone })
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Could not save timezone." }, { status: 500 });
  }

  if (data) {
    return NextResponse.json({ saved: true });
  }

  if (!isAdminSupabaseConfigured) {
    return NextResponse.json(
      { error: "Your learner profile is not ready yet." },
      { status: 409 },
    );
  }

  const admin = createAdminClient();
  const { error: createError } = await admin.from("profiles").upsert(
    {
      id: userId,
      time_zone: payload.timeZone,
    },
    { onConflict: "id" },
  );

  if (createError) {
    return NextResponse.json({ error: "Could not create learner profile." }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}
