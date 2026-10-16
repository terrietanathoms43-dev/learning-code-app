import Link from "next/link";
import { LearningPath } from "@/components/learning-path";
import { TopNav } from "@/components/top-nav";
import { WorldSwitcher } from "@/components/world-switcher";
import { getFundamentalsLearningDashboard } from "@/lib/learning-dashboard";

export default async function FundamentalsLearnPage() {
  const dashboard = await getFundamentalsLearningDashboard();
  const dailyPercent = Math.min(100, Math.round((dashboard.todayXp / Math.max(dashboard.dailyGoalXp, 1)) * 100));
  const courseComplete = dashboard.signedIn && dashboard.totalLessons > 0 && dashboard.completedLessons >= dashboard.totalLessons;
  return (
    <div className="site-shell learn-page fundamentals-world-page">
      <TopNav signInHref="/login?next=/learn/fundamentals"
        stats={{ streak: dashboard.streak, totalXp: dashboard.totalXp, signedIn: dashboard.signedIn, timeZone: dashboard.timeZone, username: dashboard.username }} />
      <WorldSwitcher active="fundamentals" />
      <main className="learn-layout">
        <section className="trail-column">
          <div className="world-banner world-banner--fundamentals">
            <div>
              <p className="eyebrow">Programming Fundamentals · Unit 1</p>
              <h1>Thinking Trail</h1>
              <p>Think like a programmer before choosing a programming language. Practice clear steps, pseudocode, decisions, loops and functions.</p>
            </div>
            <div className="world-progress" aria-label="Unit progress">
              <span>{dashboard.completedLessons} / {dashboard.totalLessons}</span>
              <div><i style={{ width: `${dashboard.progressPercent}%` }} /></div>
            </div>
          </div>
          <div className="trail-intro">
            <span className="trail-flag" aria-hidden="true">🧭</span>
            <div>
              <strong>{dashboard.signedIn ? `Keep thinking, ${dashboard.displayName}` : "Start with the logic, not the syntax."}</strong>
              <p>{dashboard.signedIn ? "Complete one lesson to unlock the next. Your progress and XP are saved." : "Try Algorithmic Thinking for free. Sign in to save XP, streaks and progress."}</p>
            </div>
            {!dashboard.signedIn && <Link className="trail-signin" href="/login?next=/learn/fundamentals">Sign in</Link>}
          </div>
          {courseComplete && (
            <section className="course-complete-banner">
              <div className="course-complete-icon" aria-hidden="true">🎓</div>
              <div><p className="eyebrow">Programming Fundamentals complete</p><h2>You cleared Thinking Trail!</h2>
                <p>Take your transferable coding logic into Python, JavaScript or web development.</p></div>
              <Link className="secondary-button" href="/learn">Explore Python</Link>
            </section>
          )}
          <LearningPath nodes={dashboard.nodes} />
        </section>
        <aside className="learn-sidebar">
          <section className="sidebar-card" id="progress">
            <div className="sidebar-card-title"><span>Today</span><strong>{dashboard.todayXp} / {dashboard.dailyGoalXp} XP</strong></div>
            <div className="daily-ring" aria-label={`Daily goal ${dailyPercent}% complete`}
              style={{ background: `conic-gradient(var(--yellow) 0 ${dailyPercent}%, #eef0f5 ${dailyPercent}% 100%)` }}>
              <div><strong>🔥 {dashboard.streak}</strong><span>day streak</span></div>
            </div>
            <p>{dashboard.signedIn ? "Complete a lesson to earn XP and strengthen your streak." : "Sign in to save your learning streak."}</p>
            <Link className="text-link" href="/progress">View full progress →</Link>
          </section>
          <section className="sidebar-card">
            <p className="eyebrow">Platform-independent</p><h2>No language required.</h2>
            <p>Explore fundamental concepts using plain English and pseudocode before learning language-specific syntax.</p>
            <Link className="secondary-button secondary-button--full" href="/learn">Explore other courses</Link>
          </section>
          <section className="coach-card">
            <div className="coach-icon" aria-hidden="true">🤖</div>
            <div><p className="eyebrow">AI Code Coach</p><h2>Understand the why.</h2>
              <p>Ask for a hint or a new explanation inside a lesson.</p></div>
          </section>
        </aside>
      </main>
    </div>
  );
}
