import Link from "next/link";
import { TopNav } from "@/components/top-nav";
import { getLearningDashboard } from "@/lib/learning-dashboard";
import { getAchievements } from "@/lib/achievements";

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

export default async function ProgressPage() {
  const dashboard = await getLearningDashboard();
  const dailyPercent = Math.min(100, Math.round((dashboard.todayXp / Math.max(dashboard.dailyGoalXp, 1)) * 100));
  const achievements = getAchievements(dashboard);
  const unlockedAchievements = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <div className="site-shell">
      <TopNav stats={{ streak: dashboard.streak, totalXp: dashboard.totalXp, signedIn: dashboard.signedIn }} />
      <main className="progress-page">
        <section className="progress-hero">
          <div>
            <p className="eyebrow">Your coding journey</p>
            <h1>Progress that feels like progress.</h1>
            <p>Track completed lessons, XP, daily goals and the coding habit you are building.</p>
          </div>
          {!dashboard.signedIn && <Link className="primary-button" href="/login">Sign in to save progress</Link>}
        </section>

        <section className="progress-stat-grid">
          <article><span>⭐</span><strong>{dashboard.totalXp}</strong><small>Total XP</small></article>
          <article><span>🔥</span><strong>{dashboard.streak}</strong><small>Day streak</small></article>
          <article><span>✓</span><strong>{dashboard.completedLessons}</strong><small>Lessons cleared</small></article>
          <article><span>🎯</span><strong>{dashboard.todayXp}/{dashboard.dailyGoalXp}</strong><small>Today&apos;s XP</small></article>
        </section>

        <section className="progress-grid">
          <article className="progress-panel">
            <div className="progress-panel-heading">
              <div><p className="eyebrow">Python Foundations</p><h2>Beginner Meadow</h2></div>
              <strong>{dashboard.progressPercent}%</strong>
            </div>
            <div className="big-progress-track"><span style={{ width: `${dashboard.progressPercent}%` }} /></div>
            <p>{dashboard.completedLessons} of {dashboard.totalLessons} currently available lessons completed.</p>
            <Link className="secondary-button" href="/learn">Continue on the trail</Link>
          </article>

          <article className="progress-panel">
            <div className="progress-panel-heading">
              <div><p className="eyebrow">Daily goal</p><h2>{dailyPercent}% complete</h2></div>
              <strong>{dashboard.todayXp} XP</strong>
            </div>
            <div className="big-progress-track daily"><span style={{ width: `${dailyPercent}%` }} /></div>
            <p>Your current daily target is {dashboard.dailyGoalXp} XP.</p>
          </article>
        </section>


        <section className="achievement-panel">
          <div className="progress-panel-heading">
            <div>
              <p className="eyebrow">Achievements</p>
              <h2>{unlockedAchievements} of {achievements.length} badges unlocked</h2>
            </div>
            <span className="achievement-count">🏅</span>
          </div>

          <div className="achievement-grid">
            {achievements.map((achievement) => {
              const percent = Math.round(
                (achievement.progress / Math.max(achievement.target, 1)) * 100,
              );

              return (
                <article
                  className={`achievement-card ${achievement.unlocked ? "is-unlocked" : ""}`}
                  key={achievement.id}
                >
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div>
                    <strong>{achievement.title}</strong>
                    <p>{achievement.description}</p>
                  </div>
                  <div className="achievement-progress" aria-label={`${achievement.title} ${percent}%`}>
                    <span style={{ width: `${Math.min(percent, 100)}%` }} />
                  </div>
                  <small>
                    {achievement.unlocked
                      ? "Unlocked"
                      : `${achievement.progress} / ${achievement.target}`}
                  </small>
                </article>
              );
            })}
          </div>
        </section>

        <section className="activity-panel">
          <div className="progress-panel-heading">
            <div><p className="eyebrow">Recent activity</p><h2>Your latest wins</h2></div>
          </div>
          {dashboard.recentEvents.length ? (
            <div className="activity-list">
              {dashboard.recentEvents.map((event, index) => (
                <div className="activity-row" key={`${event.createdAt}-${index}`}>
                  <span className="activity-icon">✨</span>
                  <div><strong>{event.lessonTitle}</strong><small>{formatActivityDate(event.createdAt)}</small></div>
                  <b>+{event.amount} XP</b>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-progress">
              <span>🧭</span>
              <p>{dashboard.signedIn ? "Complete your first lesson and your activity will appear here." : "Sign in and complete lessons to build your activity history."}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
