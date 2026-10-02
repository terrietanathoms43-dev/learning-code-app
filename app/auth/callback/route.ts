import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getSafeNext(origin: string, value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/learn";
  }

  try {
    const candidate = new URL(value, origin);
    if (candidate.origin !== origin) return "/learn";
    return `${candidate.pathname}${candidate.search}${candidate.hash}`;
  } catch {
    return "/learn";
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const redirectOrigin = url.origin;
  const code = url.searchParams.get("code");
  const safeNext = getSafeNext(redirectOrigin, url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/login?auth=missing-code", redirectOrigin));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(new URL("/login?auth=callback-error", redirectOrigin));
    }
  } catch {
    return NextResponse.redirect(new URL("/login?auth=callback-error", redirectOrigin));
  }

  return NextResponse.redirect(new URL(safeNext, redirectOrigin));
}
