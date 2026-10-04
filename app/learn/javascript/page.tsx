import Link from "next/link";
import { LearningPath } from "@/components/learning-path";
import { TopNav } from "@/components/top-nav";
import { WorldSwitcher } from "@/components/world-switcher";
import { getJavaScriptLearningDashboard } from "@/lib/learning-dashboard";

export default async function JavaScriptLearnPage() {
  const dashboard = await getJavaScriptLearningDashboard();
  const dailyPercent = Math.min(
    100,
    Math.round((dashboard.todayXp / Math.max(dashboard.dailyGoalXp, 1)) * 100),
  );
  const courseComplete =
    dashboard.signedIn &&
    dashboard.totalLessons > 0 &&
    dashboard.completedLessons >= dashboard.totalLessons;

  return (
    <div className="site-shell learn-page javascript-world-page">
      <TopNav
        signInHref="/login?next=/learn/javascript"
        stats={{
          streak: dashboard.streak,
          totalXp: dashboard.totalXp,
          signedIn: dashboard.signedIn,
          timeZone: dashboard.timeZone,
          username: dashboard.username,
        }}
      />

      <WorldSwitcher active="javascript" />

      <main className="learn-layout">
        <section className="trail-column">
          <div className="world-banner world-banner--javascript">
            <div>
              <p className="eyebrow">JavaScript Foundations · Unit 1</p>
              <h1>Logic Lab</h1>
              <p>Learn the language behind interactive apps with values, decisions, loops and functions.</p>
            </div>
            <div className="world-progress" aria-label="Unit progress">
              <span>{dashboard.completedLessons} / {dashboard.totalLessons}</span>
              <div><i style={{ width: `${dashboard.progressPercent}%` }} /></div>
            </div>
          </div>

          <div className="trail-intro">
            <span className="trail-flag" aria-hidden="true">⚡</span>
            <div>
              <strong>
                {dashboard.signedIn
                  ? `Power up the logic, ${dashboard.displayName}`
                  : "Your JavaScript trail"}
              </strong>
              <p>
                {dashboard.signedIn
                  ? "Complete each challenge to unlock the next station in Logic Lab."
                  : "Try Values & Variables now. Sign in to save XP, streaks and progress."}
              </p>
            </div>
            {!dashboard.signedIn && (
              <Link className="trail-signin" href="/login?next=/learn/javascript">Sign in</Link>
            )}
          </div>

          {courseComplete && (
            <section className="course-complete-banner">
              <div className="course-complete-icon" aria-hidden="true">⚡</div>
              <div>
                <p className="eyebrow">JavaScript Foundations complete</p>
                <h2>You powered through Logic Lab.</h2>
                <p>You finished variables, types, decisions, arrays, loops, functions and the score-tracker project.</p>
              </div>
              <Link className="secondary-button" href="/projects">
                Build a JavaScript project
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
              style={{
                background: `conic-gradient(var(--yellow) 0 ${dailyPercent}%, #eef0f5 ${dailyPercent}% 100%)`,
              }}
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
                  : "Finish a JavaScript lesson to move closer to today's XP goal."
                : "Sign in to start building a saved daily streak."}
            </p>
            <Link className="text-link" href="/progress">View full progress →</Link>
          </section>

          <section className="sidebar-card">
            <p className="eyebrow">Projects workspace</p>
            <h2>Run JavaScript for real.</h2>
            <p>Use the project editor to save JavaScript, run it in an isolated sandbox and jump straight to runtime errors.</p>
            {dashboard.signedIn ? (
              <Link className="secondary-button secondary-button--full" href="/projects">
                Open Projects
              </Link>
            ) : (
              <Link className="secondary-button secondary-button--full" href="/login?next=/projects">
                Sign in for Projects
              </Link>
            )}
          </section>

          <section className="coach-card">
            <div className="coach-icon" aria-hidden="true">🤖</div>
            <div>
              <p className="eyebrow">AI Code Coach</p>
              <h2>JavaScript help without answer-dumping.</h2>
              <p>Ask for a hint, concept explanation or similar example inside any JavaScript lesson.</p>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
