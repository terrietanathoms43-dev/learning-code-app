export type AuthCallbackError = "missing-code" | "callback-error";

export function getSafeNextPath(origin: string, value: string | null) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
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

export function getAuthCallbackErrorRedirect(
  origin: string,
  nextPath: string,
  error: AuthCallbackError,
) {
  if (nextPath === "/reset-password") {
    const recoveryUrl = new URL("/forgot-password", origin);
    recoveryUrl.searchParams.set("auth", "recovery-error");
    return recoveryUrl;
  }

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("auth", error);
  loginUrl.searchParams.set("next", nextPath);
  return loginUrl;
}

export function getLoginAuthMessage(value: string | null) {
  if (value === "missing-code") {
    return "That confirmation link is incomplete. Request a new link or sign in again.";
  }

  if (value === "callback-error") {
    return "That confirmation link is invalid or expired. Request a new link or sign in again.";
  }

  return "";
}

export function getRecoveryAuthMessage(value: string | null) {
  return value === "recovery-error"
    ? "That password recovery link is invalid or expired. Request a new reset link."
    : "";
}
