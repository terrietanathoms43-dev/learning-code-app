import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthCallbackErrorRedirect, getSafeNextPath } from "@/lib/auth-redirect";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const redirectOrigin = url.origin;
  const code = url.searchParams.get("code");
  const safeNext = getSafeNextPath(redirectOrigin, url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      getAuthCallbackErrorRedirect(redirectOrigin, safeNext, "missing-code"),
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getAuthCallbackErrorRedirect(redirectOrigin, safeNext, "callback-error"),
      );
    }
  } catch {
    return NextResponse.redirect(
      getAuthCallbackErrorRedirect(redirectOrigin, safeNext, "callback-error"),
    );
  }

  return NextResponse.redirect(new URL(safeNext, redirectOrigin));
}
