import Link from "next/link";
import { TopNav } from "@/components/top-nav";
import { getLesson } from "@/lib/course-data";
import { getLearningDashboard } from "@/lib/learning-dashboard";

export default async function PracticePage() {
  const dashboard = await getLearningDashboard();
  const completedLessons = dashboard.completedLessonSlugs.map((slug) => getLesson(slug)).filter(Boolean);

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
      <main className="practice-page">
        <section className="progress-hero">
          <div>
            <p className="eyebrow">Practice deck</p>
            <h1>Strengthen skills you already unlocked.</h1>
            <p>Replay completed lessons to review concepts without duplicate completion XP.</p>
          </div>
          <Link className="secondary-button" href="/learn">Back to trail</Link>
        </section>

        {dashboard.completedLessons < 3 ? (
          <section className="practice-locked">
            <div className="practice-lock-icon">🔒</div>
            <h2>Complete 3 lessons to unlock your practice deck.</h2>
            <p>You have cleared {dashboard.completedLessons} so far. Keep moving down the trail.</p>
            <Link className="primary-button" href="/learn">Continue learning</Link>
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
