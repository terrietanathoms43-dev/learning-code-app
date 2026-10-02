"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const goalOptions = [20, 30, 50, 75, 100];

export function ProfileSettingsForm({
  initialDisplayName,
  initialDailyGoalXp,
}: {
  initialDisplayName: string;
  initialDailyGoalXp: number;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [dailyGoalXp, setDailyGoalXp] = useState(initialDailyGoalXp);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ displayName, dailyGoalXp }),
      });
      const data = (await response.json()) as { saved?: boolean; error?: string };

      if (!response.ok || !data.saved) {
        setMessage(data.error || "Your settings could not be saved.");
        return;
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
          Your display name appears in the learning trail. Your XP target controls the daily goal ring.
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
          <button className="primary-button" type="submit" disabled={saving}>
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
