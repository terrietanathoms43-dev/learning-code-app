import Link from "next/link";
import { LearningPath } from "@/components/learning-path";
import { TopNav } from "@/components/top-nav";
import { getLearningDashboard } from "@/lib/learning-dashboard";

export default async function LearnPage() {
  const dashboard = await getLearningDashboard();
  const dailyPercent = Math.min(
    100,
    Math.round((dashboard.todayXp / Math.max(dashboard.dailyGoalXp, 1)) * 100),
  );

  return (
    <div className="site-shell learn-page">
      <TopNav stats={{ streak: dashboard.streak, totalXp: dashboard.totalXp }} />

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
            {dashboard.completedLessons >= 3 ? (
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
              <p>The OpenAI tutor remains the next major integration after persistence.</p>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
