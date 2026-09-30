import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getRedirectOrigin(request: NextRequest) {
  const requestUrl = new URL(request.url);

  if (process.env.NODE_ENV === "development") {
    return requestUrl.origin;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  return forwardedHost ? `https://${forwardedHost}` : requestUrl.origin;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/learn";
  const redirectOrigin = getRedirectOrigin(request);

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
