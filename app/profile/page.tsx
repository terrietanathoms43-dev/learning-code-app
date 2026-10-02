import { redirect } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { getLearningDashboard } from "@/lib/learning-dashboard";

export default async function ProfilePage() {
  const dashboard = await getLearningDashboard();

  if (!dashboard.signedIn) {
    redirect("/login");
  }

  return (
    <div className="site-shell">
      <TopNav
        stats={{
          streak: dashboard.streak,
          totalXp: dashboard.totalXp,
          signedIn: dashboard.signedIn,
          timeZone: dashboard.timeZone,
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
            <strong>{dashboard.completedLessons}/{dashboard.totalLessons}</strong>
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
