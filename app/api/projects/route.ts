import { NextResponse } from "next/server";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getProjectCodeError,
  getProjectTitleError,
  isProjectLanguage,
  MAX_SAVED_PROJECTS,
  normalizeProjectTitle,
} from "@/lib/project-validation";
import { isSameOriginRequest } from "@/lib/request-security";


type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function getUserId(supabase: ServerSupabaseClient) {
  const { data, error } = await supabase.auth.getClaims();

  return !error && data?.claims && typeof data.claims.sub === "string"
    ? data.claims.sub
    : null;
}

export async function GET() {
  const supabase = await createClient();
  const userId = await getUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("saved_projects")
    .select("id, title, language, code, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(MAX_SAVED_PROJECTS);

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

  if (!isAdminSupabaseConfigured) {
    return NextResponse.json(
      { error: "Project saving is temporarily unavailable." },
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
    !("title" in payload) ||
    typeof payload.title !== "string" ||
    !("language" in payload) ||
    typeof payload.language !== "string"
  ) {
    return NextResponse.json(
      { error: "Project title and language are required." },
      { status: 400 },
    );
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
  const userId = await getUserId(supabase);
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { count, error: countError } = await admin
    .from("saved_projects")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    return NextResponse.json({ error: "Project limit could not be checked." }, { status: 503 });
  }

  if ((count ?? 0) >= MAX_SAVED_PROJECTS) {
    return NextResponse.json(
      { error: `You can keep up to ${MAX_SAVED_PROJECTS} saved projects right now.` },
      { status: 409 },
    );
  }

  const { data, error } = await admin
    .from("saved_projects")
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
