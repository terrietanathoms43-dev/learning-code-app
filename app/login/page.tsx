"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function getSafeNextPath(origin: string, value: string | null) {
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

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!isSupabaseConfigured) {
      setMessage("Supabase is ready in the codebase, but the project keys still need to be added.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || password.length < 8) {
      setMessage("Enter your email and a password with at least 8 characters.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const nextPath = getSafeNextPath(
      window.location.origin,
      new URLSearchParams(window.location.search).get("next"),
    );

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          },
        });
        if (error) throw error;

        if (data.session) {
          router.push(nextPath);
          router.refresh();
          return;
        }

        setMessage("Account created. Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(nextPath);
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
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
        <div className="auth-mascot">
          <Image src="/mascot.svg" alt="" width={88} height={88} aria-hidden="true" />
        </div>
        <p className="eyebrow">{mode === "signup" ? "Start your trail" : "Welcome back"}</p>
        <h1>{mode === "signup" ? "Create your learner account" : "Continue learning"}</h1>
        <p className="auth-subcopy">
          Your progress, XP and streak will follow you across devices.
        </p>

        <form onSubmit={submit}>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </label>

          {message && <p className="form-message" aria-live="polite">{message}</p>}

          <button className="primary-button primary-button--full" type="submit" disabled={busy}>
            {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>

          {mode === "signin" && (
            <Link className="text-link" href="/forgot-password">
              Forgot password?
            </Link>
          )}
        </form>

        <button
          className="text-button"
          type="button"
          onClick={() => {
            setMode((value) => (value === "signup" ? "signin" : "signup"));
            setMessage("");
          }}
        >
          {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>

        <Link className="auth-privacy-link" href="/privacy">
          Privacy &amp; Data
        </Link>
      </section>
    </main>
  );
}
