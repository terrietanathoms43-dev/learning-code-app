"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getRecoveryAuthMessage } from "@/lib/auth-redirect";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const authMessage = getRecoveryAuthMessage(
      new URLSearchParams(window.location.search).get("auth"),
    );
    if (authMessage) setMessage(authMessage);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!isSupabaseConfigured) {
      setMessage("Password recovery is temporarily unavailable.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();

    if (!email) {
      setMessage("Enter the email address for your account.");
      return;
    }

    setBusy(true);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

      if (error) throw error;

      setSent(true);
      setMessage(
        "If an account exists for that email, a password reset link has been sent.",
      );
    } catch {
      setMessage("We could not start password recovery right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <Link className="brand auth-brand" href="/">
        <span className="brand-mark">&lt;/&gt;</span>
        <span>CodeTrail</span>
      </Link>

      <section className="auth-card">
        <p className="eyebrow">Account recovery</p>
        <h1>Reset your password</h1>
        <p className="auth-subcopy">
          Enter the email you used for CodeTrail and we&apos;ll send a recovery link.
        </p>

        <form onSubmit={submit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={busy || sent}
            />
          </label>

          {message && <p className="form-message" aria-live="polite">{message}</p>}

          {!sent && (
            <button
              className="primary-button primary-button--full"
              type="submit"
              disabled={busy}
            >
              {busy ? "Sending…" : "Send reset link"}
            </button>
          )}
        </form>

        <Link className="text-link" href="/login">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
