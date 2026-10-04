import Link from "next/link";
import { TopNav } from "@/components/top-nav";
import { getLesson } from "@/lib/course-data";
import { getLearningDashboards } from "@/lib/learning-dashboard";

export default async function PracticePage() {
  const { python: dashboard, web: webDashboard } =
    await getLearningDashboards();
  const completedCount =
    dashboard.completedLessons + webDashboard.completedLessons;
  const completedLessons = [
    ...dashboard.completedLessonSlugs,
    ...webDashboard.completedLessonSlugs,
  ]
    .map((slug) => getLesson(slug))
    .filter(Boolean);
  const preferredTrail =
    webDashboard.completedLessons > dashboard.completedLessons
      ? "/learn/web"
      : "/learn";

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
      <main className="practice-page">
        <section className="progress-hero">
          <div>
            <p className="eyebrow">Practice deck</p>
            <h1>Strengthen skills you already unlocked.</h1>
            <p>Replay completed lessons to review concepts without duplicate completion XP.</p>
          </div>
          <Link className="secondary-button" href={preferredTrail}>Back to trail</Link>
        </section>

        {completedCount < 3 ? (
          <section className="practice-locked">
            <div className="practice-lock-icon">🔒</div>
            <h2>Complete 3 lessons across your learning worlds to unlock your practice deck.</h2>
            <p>You have cleared {completedCount} so far. Keep moving down the trail.</p>
            <Link className="primary-button" href={preferredTrail}>Continue learning</Link>
          </section>
        ) : (
          <section className="practice-grid">
            {completedLessons.map((lesson) => lesson ? (
              <article className="practice-card" key={lesson.slug}>
                <span className="practice-card-icon">{lesson.icon}</span>
                <div><p className="eyebrow">Review lesson</p><h2>{lesson.title}</h2><p>{lesson.subtitle}</p></div>
                <Link className="secondary-button" href={`/lesson/${lesson.slug}`}>Practice again</Link>
              </article>
            ) : null)}
          </section>
        )}
      </main>
    </div>
  );
}
