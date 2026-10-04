import Link from "next/link";
import { WorldSwitcher } from "@/components/world-switcher";
import { LearningPath } from "@/components/learning-path";
import { TopNav } from "@/components/top-nav";
import { getWebLearningDashboard } from "@/lib/learning-dashboard";

export default async function WebLearnPage() {
  const dashboard = await getWebLearningDashboard();
  const dailyPercent = Math.min(
    100,
    Math.round((dashboard.todayXp / Math.max(dashboard.dailyGoalXp, 1)) * 100),
  );
  const courseComplete =
    dashboard.signedIn &&
    dashboard.totalLessons > 0 &&
    dashboard.completedLessons >= dashboard.totalLessons;

  return (
    <div className="site-shell learn-page web-world-page">
      <TopNav
        signInHref="/login?next=/learn/web"
        stats={{
          streak: dashboard.streak,
          totalXp: dashboard.totalXp,
          signedIn: dashboard.signedIn,
          timeZone: dashboard.timeZone,
          username: dashboard.username,
        }}
      />

      <WorldSwitcher active="web" />

      <main className="learn-layout">
        <section className="trail-column">
          <div className="world-banner world-banner--web">
            <div>
              <p className="eyebrow">Web Foundations · Unit 1</p>
              <h1>Pixel Garden</h1>
              <p>Build pages with HTML, style them with CSS and add behavior with JavaScript.</p>
            </div>
            <div className="world-progress" aria-label="Unit progress">
              <span>{dashboard.completedLessons} / {dashboard.totalLessons}</span>
              <div><i style={{ width: `${dashboard.progressPercent}%` }} /></div>
            </div>
          </div>

          <div className="trail-intro">
            <span className="trail-flag" aria-hidden="true">🌱</span>
            <div>
              <strong>
                {dashboard.signedIn
                  ? `Grow the web, ${dashboard.displayName}`
                  : "Your web-building trail"}
              </strong>
              <p>
                {dashboard.signedIn
                  ? "Each completed web lesson unlocks the next node in Pixel Garden."
                  : "Try HTML Basics now. Sign in to save XP, streaks and progress."}
              </p>
            </div>
            {!dashboard.signedIn && (
              <Link className="trail-signin" href="/login?next=/learn/web">Sign in</Link>
            )}
          </div>

          {courseComplete && (
            <section className="course-complete-banner">
              <div className="course-complete-icon" aria-hidden="true">🌐</div>
              <div>
                <p className="eyebrow">Web Foundations complete</p>
                <h2>Pixel Garden is in bloom.</h2>
                <p>You completed the HTML, CSS, JavaScript and mini-project trail.</p>
              </div>
              <Link className="secondary-button" href="/projects">
                Build a project
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
                  : "Finish a web lesson to move closer to today's XP goal."
                : "Sign in to start building a saved daily streak."}
            </p>
            <Link className="text-link" href="/progress">View full progress →</Link>
          </section>

          <section className="sidebar-card">
            <p className="eyebrow">Projects workspace</p>
            <h2>Build outside the lesson.</h2>
            <p>Save HTML, CSS and JavaScript experiments and preview them from your account.</p>
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
              <h2>Web help without answer-dumping.</h2>
              <p>Ask for a hint, concept explanation or a similar web example inside any lesson.</p>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
