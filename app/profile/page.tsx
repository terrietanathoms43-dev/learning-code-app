import { redirect } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { getLearningDashboards } from "@/lib/learning-dashboard";

export default async function ProfilePage() {
  const { python: dashboard, web: webDashboard } =
    await getLearningDashboards();
  const completedLessons =
    dashboard.completedLessons + webDashboard.completedLessons;
  const totalLessons = dashboard.totalLessons + webDashboard.totalLessons;

  if (!dashboard.signedIn) {
    redirect("/login?next=/profile");
  }

  return (
    <div className="site-shell">
      <TopNav
        stats={{
          streak: dashboard.streak,
          totalXp: dashboard.totalXp,
          signedIn: dashboard.signedIn,
          timeZone: dashboard.timeZone,
          username: dashboard.username,
        }}
      />

      <main className="profile-page">
        <section className="profile-hero">
          <div className="profile-avatar" aria-hidden="true">
            {dashboard.displayName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="eyebrow">Learner profile</p>
            <h1>{dashboard.displayName}</h1>
            <p className="profile-username">
              {dashboard.username ? `@${dashboard.username}` : "Choose a unique username in your settings"}
            </p>
            <p>
              Keep your goal realistic enough to return tomorrow, then raise it when the habit feels easy.
            </p>
          </div>
        </section>

        <section className="profile-stat-grid">
          <article>
            <span>⭐</span>
            <strong>{dashboard.totalXp}</strong>
            <small>Total XP</small>
          </article>
          <article>
            <span>🔥</span>
            <strong>{dashboard.streak}</strong>
            <small>Day streak</small>
          </article>
          <article>
            <span>✓</span>
            <strong>{completedLessons}/{totalLessons}</strong>
            <small>Lessons cleared</small>
          </article>
          <article>
            <span>🎯</span>
            <strong>{dashboard.dailyGoalXp} XP</strong>
            <small>Daily target</small>
          </article>
        </section>

        <section className="profile-layout">
          <ProfileSettingsForm
            initialDisplayName={dashboard.displayName}
            initialUsername={dashboard.username}
            initialDailyGoalXp={dashboard.dailyGoalXp}
          />

          <aside className="profile-info-card">
            <p className="eyebrow">Learning environment</p>
            <h2>Your progress follows your local day.</h2>
            <p>
              Streaks and today&apos;s XP use your detected timezone so late-night learning is counted on the correct day.
            </p>
            <div className="profile-timezone">
              <span>Current timezone</span>
              <strong>{dashboard.timeZone}</strong>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
