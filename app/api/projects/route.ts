import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getProjectCodeError,
  getProjectTitleError,
  isProjectLanguage,
  normalizeProjectTitle,
} from "@/lib/project-validation";
import { isSameOriginRequest } from "@/lib/request-security";

export async function GET() {
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
    .from("coding_projects")
    .select("id, title, language, code, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: "Projects could not be loaded." }, { status: 500 });
  }

  return NextResponse.json(
    { projects: data ?? [] },
    { headers: { "cache-control": "private, no-store, max-age=0" } },
  );
}

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
    !("title" in payload) ||
    typeof payload.title !== "string" ||
    !("language" in payload) ||
    typeof payload.language !== "string"
  ) {
    return NextResponse.json({ error: "Project title and language are required." }, { status: 400 });
  }

  const code =
    "code" in payload && typeof payload.code === "string"
      ? payload.code
      : "";
  const title = normalizeProjectTitle(payload.title);
  const titleError = getProjectTitleError(title);
  const codeError = getProjectCodeError(code);

  if (titleError || codeError || !isProjectLanguage(payload.language)) {
    return NextResponse.json(
      { error: titleError || codeError || "Unsupported project language." },
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

  const { data, error } = await supabase
    .from("coding_projects")
    .insert({
      user_id: userId,
      title,
      language: payload.language,
      code,
    })
    .select("id, title, language, code, created_at, updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Project could not be created." }, { status: 500 });
  }

  return NextResponse.json({ project: data }, { status: 201 });
}
