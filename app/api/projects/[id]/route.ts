import { NextResponse } from "next/server";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getProjectCodeError,
  getProjectTitleError,
  isProjectLanguage,
  normalizeProjectTitle,
} from "@/lib/project-validation";
import { isSameOriginRequest } from "@/lib/request-security";
import { isUuidV4 } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  }

  const { id } = await params;
  if (!isUuidV4(id)) {
    return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid project update." }, { status: 400 });
  }

  const updates: Record<string, string> = {};

  if ("title" in payload) {
    if (typeof payload.title !== "string") {
      return NextResponse.json({ error: "Invalid title." }, { status: 400 });
    }
    const title = normalizeProjectTitle(payload.title);
    const titleError = getProjectTitleError(title);
    if (titleError) {
      return NextResponse.json({ error: titleError }, { status: 400 });
    }
    updates.title = title;
  }

  if ("language" in payload) {
    if (typeof payload.language !== "string" || !isProjectLanguage(payload.language)) {
      return NextResponse.json({ error: "Unsupported project language." }, { status: 400 });
    }
    updates.language = payload.language;
  }

  if ("code" in payload) {
    if (typeof payload.code !== "string") {
      return NextResponse.json({ error: "Invalid project code." }, { status: 400 });
    }
    const codeError = getProjectCodeError(payload.code);
    if (codeError) {
      return NextResponse.json({ error: codeError }, { status: 400 });
    }
    updates.code = payload.code;
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  if (!isAdminSupabaseConfigured) {
    return NextResponse.json(
      { error: "Project saving is temporarily unavailable." },
      { status: 503 },
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

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("saved_projects")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select("id, title, language, code, created_at, updated_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Project could not be saved." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ project: data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  }

  const { id } = await params;
  if (!isUuidV4(id)) {
    return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  }

  if (!isAdminSupabaseConfigured) {
    return NextResponse.json(
      { error: "Project deletion is temporarily unavailable." },
      { status: 503 },
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

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("saved_projects")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Project could not be deleted." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
