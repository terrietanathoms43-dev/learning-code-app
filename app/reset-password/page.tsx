"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifyRecoverySession() {
      if (!isSupabaseConfigured) {
        if (active) {
          setMessage("Password recovery is temporarily unavailable.");
          setReady(true);
        }
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      setValidSession(!error && Boolean(data.user));
      if (error || !data.user) {
        setMessage("This recovery link is invalid or has expired. Request a new one.");
      }
      setReady(true);
    }

    void verifyRecoverySession();

    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setMessage("Use a password with at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The two passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      await supabase.auth.signOut();
      setDone(true);
      setValidSession(false);
      setMessage("Password updated. Sign in again with your new password.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Your password could not be updated. Request a new recovery link.",
      );
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
        <p className="eyebrow">Secure your account</p>
        <h1>Choose a new password</h1>
        <p className="auth-subcopy">
          Use at least 8 characters and choose something you do not reuse elsewhere.
        </p>

        {!ready ? (
          <p className="form-message" aria-live="polite">Checking recovery link…</p>
        ) : validSession && !done ? (
          <form onSubmit={submit}>
            <label>
              New password
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
            <label>
              Confirm new password
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            {message && <p className="form-message" aria-live="polite">{message}</p>}

            <button
              className="primary-button primary-button--full"
              type="submit"
              disabled={busy}
            >
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        ) : (
          <>
            {message && <p className="form-message" aria-live="polite">{message}</p>}
            <Link
              className="primary-button primary-button--full"
              href={done ? "/login" : "/forgot-password"}
            >
              {done ? "Sign in" : "Request a new reset link"}
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
