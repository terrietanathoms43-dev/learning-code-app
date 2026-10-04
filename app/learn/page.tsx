import Link from "next/link";
import { LearningPath } from "@/components/learning-path";
import { TopNav } from "@/components/top-nav";
import { getLearningDashboards } from "@/lib/learning-dashboard";

export default async function LearnPage() {
  const { python: dashboard, web: webDashboard } =
    await getLearningDashboards();
  const completedAcrossWorlds =
    dashboard.completedLessons + webDashboard.completedLessons;
  const dailyPercent = Math.min(
    100,
    Math.round((dashboard.todayXp / Math.max(dashboard.dailyGoalXp, 1)) * 100),
  );
  const courseComplete =
    dashboard.signedIn &&
    dashboard.totalLessons > 0 &&
    dashboard.completedLessons >= dashboard.totalLessons;

  return (
    <div className="site-shell learn-page">
      <TopNav
        stats={{
          streak: dashboard.streak,
          totalXp: dashboard.totalXp,
          signedIn: dashboard.signedIn,
          timeZone: dashboard.timeZone,
          username: dashboard.username,
        }}
      />

      <nav className="world-switcher" aria-label="Learning worlds">
        <Link className="world-switcher-link is-active" href="/learn">
          <span aria-hidden="true">🐍</span>
          <span><strong>Python Foundations</strong><small>Beginner Meadow</small></span>
        </Link>
        <Link className="world-switcher-link" href="/learn/web">
          <span aria-hidden="true">🌐</span>
          <span><strong>Web Foundations</strong><small>Pixel Garden</small></span>
        </Link>
      </nav>

      <main className="learn-layout">
        <section className="trail-column">
          <div className="world-banner">
            <div>
              <p className="eyebrow">Python Foundations · Unit 1</p>
              <h1>Beginner Meadow</h1>
              <p>Learn the building blocks that every Python program starts with.</p>
            </div>
            <div className="world-progress" aria-label="Unit progress">
              <span>{dashboard.completedLessons} / {dashboard.totalLessons}</span>
              <div><i style={{ width: `${dashboard.progressPercent}%` }} /></div>
            </div>
          </div>

          <div className="trail-intro">
            <span className="trail-flag" aria-hidden="true">🚩</span>
            <div>
              <strong>{dashboard.signedIn ? `Keep going, ${dashboard.displayName}` : "Your coding trail"}</strong>
              <p>
                {dashboard.signedIn
                  ? "Completed lessons unlock the next available node automatically."
                  : "Try the first lesson now. Sign in to save XP, streaks and progress."}
              </p>
            </div>
            {!dashboard.signedIn && <Link className="trail-signin" href="/login">Sign in</Link>}
          </div>

          {courseComplete && (
            <section className="course-complete-banner">
              <div className="course-complete-icon" aria-hidden="true">🎓</div>
              <div>
                <p className="eyebrow">Python Foundations complete</p>
                <h2>You cleared Beginner Meadow.</h2>
                <p>
                  You finished every available lesson, checkpoint and project in your first Python world.
                </p>
              </div>
              <Link className="secondary-button" href="/progress">
                See achievements
              </Link>
            </section>
          )}

          <LearningPath nodes={dashboard.nodes} />
        </section>

        <aside className="learn-sidebar">
          <section className="sidebar-card" id="progress">
            <div className="sidebar-card-title">
              <span>Today</span>
              <strong>{dashboard.todayXp} / {dashboard.dailyGoalXp} XP</strong>
            </div>
            <div
              className="daily-ring"
              aria-label={`Daily goal ${dailyPercent}% complete`}
              style={{ background: `conic-gradient(var(--yellow) 0 ${dailyPercent}%, #eef0f5 ${dailyPercent}% 100%)` }}
            >
              <div>
                <strong>🔥 {dashboard.streak}</strong>
                <span>day streak</span>
              </div>
            </div>
            <p>
              {dashboard.signedIn
                ? dashboard.todayXp >= dashboard.dailyGoalXp
                  ? "Daily goal complete. Anything else today is bonus progress."
                  : "Finish another lesson to move closer to today's XP goal."
                : "Sign in to start building a saved daily streak."}
            </p>
            <Link className="text-link" href="/progress">View full progress →</Link>
          </section>

          <section className="sidebar-card" id="practice">
            <p className="eyebrow">Practice deck</p>
            <h2>Warm up your skills</h2>
            <p>Review completed lessons without earning duplicate completion XP.</p>
            {completedAcrossWorlds >= 3 ? (
              <Link className="secondary-button secondary-button--full" href="/practice">
                Open practice deck
              </Link>
            ) : (
              <button className="secondary-button secondary-button--full" disabled>
                Unlock after 3 lessons
              </button>
            )}
          </section>

          <section className="coach-card">
            <div className="coach-icon" aria-hidden="true">🤖</div>
            <div>
              <p className="eyebrow">AI Code Coach</p>
              <h2>Help without spoiling the answer.</h2>
              <p>Open any lesson and ask for a hint, concept explanation or similar example.</p>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
