import { LearningPath } from "@/components/learning-path";
import { TopNav } from "@/components/top-nav";
import { pythonPath } from "@/lib/course-data";

export default function LearnPage() {
  return (
    <div className="site-shell learn-page">
      <TopNav />

      <main className="learn-layout">
        <section className="trail-column">
          <div className="world-banner">
            <div>
              <p className="eyebrow">Python Foundations · Unit 1</p>
              <h1>Beginner Meadow</h1>
              <p>Learn the building blocks that every Python program starts with.</p>
            </div>
            <div className="world-progress" aria-label="Unit progress">
              <span>1 / 9</span>
              <div><i style={{ width: "14%" }} /></div>
            </div>
          </div>

          <div className="trail-intro">
            <span className="trail-flag" aria-hidden="true">🚩</span>
            <div>
              <strong>Your coding trail</strong>
              <p>Complete the glowing node to open the next part of the path.</p>
            </div>
          </div>

          <LearningPath nodes={pythonPath} />
        </section>

        <aside className="learn-sidebar">
          <section className="sidebar-card" id="progress">
            <div className="sidebar-card-title">
              <span>Today</span>
              <strong>20 / 50 XP</strong>
            </div>
            <div className="daily-ring">
              <div>
                <strong>🔥 1</strong>
                <span>day streak</span>
              </div>
            </div>
            <p>Finish one more lesson today to keep building your coding habit.</p>
          </section>

          <section className="sidebar-card" id="practice">
            <p className="eyebrow">Practice deck</p>
            <h2>Warm up your skills</h2>
            <p>Quick reviews will appear here as you complete more lessons.</p>
            <button className="secondary-button secondary-button--full" disabled>
              Unlock after 3 lessons
            </button>
          </section>

          <section className="coach-card">
            <div className="coach-icon" aria-hidden="true">🤖</div>
            <div>
              <p className="eyebrow">AI Code Coach</p>
              <h2>Help without spoiling the answer.</h2>
              <p>The OpenAI tutor slot is ready for the next build phase.</p>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
