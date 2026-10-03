"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsernameError } from "@/lib/profile-validation";

const goalOptions = [20, 30, 50, 75, 100];

export function ProfileSettingsForm({
  initialDisplayName,
  initialUsername,
  initialDailyGoalXp,
}: {
  initialDisplayName: string;
  initialUsername: string | null;
  initialDailyGoalXp: number;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [username, setUsername] = useState(initialUsername ?? "");
  const [dailyGoalXp, setDailyGoalXp] = useState(initialDailyGoalXp);
  const [message, setMessage] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "current" | "checking" | "available" | "taken" | "invalid" | "error"
  >("idle");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const normalizedInitialUsername = (initialUsername ?? "").toLowerCase();
  const usernameError = useMemo(() => getUsernameError(username), [username]);
  const usernameChanged = username !== normalizedInitialUsername;
  const usernameSaveReady =
    !username ||
    !usernameChanged ||
    (usernameStatus === "available" && !usernameError);

  useEffect(() => {
    if (!username) {
      setUsernameStatus("idle");
      return;
    }

    if (usernameError) {
      setUsernameStatus("invalid");
      return;
    }

    if (!usernameChanged) {
      setUsernameStatus("current");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setUsernameStatus("checking");

      try {
        const response = await fetch("/api/profile/username-availability", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username }),
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          available?: boolean;
          error?: string;
        };

        if (!response.ok) {
          setUsernameStatus(response.status === 400 ? "invalid" : "error");
          return;
        }

        setUsernameStatus(data.available ? "available" : "taken");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setUsernameStatus("error");
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [username, usernameChanged, usernameError]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ displayName, username, dailyGoalXp }),
      });
      const data = (await response.json()) as {
        saved?: boolean;
        username?: string | null;
        error?: string;
      };

      if (!response.ok || !data.saved) {
        setMessage(data.error || "Your settings could not be saved.");
        return;
      }

      if (data.username !== undefined) {
        setUsername(data.username ?? "");
      }
      setMessage("Profile updated.");
      router.refresh();
    } catch {
      setMessage("Your settings could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    setSigningOut(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (!response.ok) {
        setMessage("Could not sign out.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setMessage("Could not sign out.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="profile-settings-card">
      <div>
        <p className="eyebrow">Learner settings</p>
        <h2>Make CodeTrail yours</h2>
        <p className="profile-help">
          Your display name is the friendly name people see. Your username is your unique CodeTrail handle.
        </p>
      </div>

      <form className="profile-form" onSubmit={save}>
        <label>
          Display name
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            minLength={2}
            maxLength={40}
            autoComplete="nickname"
            required
          />
        </label>
        <label>
          Username
          <div className="username-input-wrap">
            <span aria-hidden="true">@</span>
            <input
              value={username}
              onChange={(event) => {
                const next = event.target.value
                  .replace(/^@+/, "")
                  .toLowerCase()
                  .replace(/[^a-z0-9_]/g, "")
                  .slice(0, 20);
                setUsername(next);
              }}
              minLength={3}
              maxLength={20}
              pattern="[a-z0-9][a-z0-9_]{2,19}"
              autoComplete="username"
              placeholder="your_username"
              aria-describedby="username-help"
            />
          </div>
          <small id="username-help" className="profile-field-help">
            3–20 characters. Lowercase letters, numbers, and underscores. Leave blank until you&apos;re ready to claim one.
          </small>
          {username && (
            <small
              className={"username-status username-status--" + usernameStatus}
              aria-live="polite"
            >
              {usernameStatus === "checking" && "Checking availability…"}
              {usernameStatus === "available" && "@" + username + " is available."}
              {usernameStatus === "taken" && "@" + username + " is already taken."}
              {usernameStatus === "current" && "This is your current username."}
              {usernameStatus === "invalid" && (usernameError || "Choose another username.")}
              {usernameStatus === "error" && "Availability check is temporarily unavailable."}
            </small>
          )}
        </label>

        <fieldset>
          <legend>Daily XP goal</legend>
          <div className="goal-options">
            {goalOptions.map((goal) => (
              <button
                key={goal}
                className={dailyGoalXp === goal ? "is-selected" : ""}
                type="button"
                aria-pressed={dailyGoalXp === goal}
                onClick={() => setDailyGoalXp(goal)}
              >
                <strong>{goal} XP</strong>
                <span>
                  {goal <= 30
                    ? "Light"
                    : goal <= 50
                      ? "Steady"
                      : goal <= 75
                        ? "Focused"
                        : "Ambitious"}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {message && <p className="form-message" aria-live="polite">{message}</p>}

        <div className="profile-actions">
          <button
            className="primary-button"
            type="submit"
            disabled={saving || !usernameSaveReady || usernameStatus === "checking"}
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={signOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </form>
    </div>
  );
}
