import Image from "next/image";
import Link from "next/link";
import { TopNav } from "@/components/top-nav";

export default function Home() {
  return (
    <div className="site-shell">
      <TopNav />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-pill">A coding adventure, one lesson at a time</span>
            <h1>
              Learn to code by
              <span> moving forward.</span>
            </h1>
            <p>
              Short lessons, real coding practice, bright rewards, and learning worlds
              for Python, web development and JavaScript that grow with every skill you master.
            </p>
            <div className="hero-actions">
              <Link className="primary-button primary-button--large" href="/learn">
                Start Python
              </Link>
              <Link className="secondary-button" href="/learn/web">
                Start Web
              </Link>
              <Link className="secondary-button" href="/learn/javascript">
                Start JavaScript
              </Link>
              <Link className="text-link" href="/login">
                Sign in
              </Link>
            </div>
            <div className="hero-proof" aria-label="Product highlights">
              <span>✓ Bite-sized lessons</span>
              <span>✓ Real code challenges</span>
              <span>✓ AI coach ready</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="CodeTrail mascot on a coding path">
            <div className="hero-cloud cloud-a" aria-hidden="true" />
            <div className="hero-cloud cloud-b" aria-hidden="true" />
            <div className="hero-hill hill-back" aria-hidden="true" />
            <div className="hero-hill hill-front" aria-hidden="true" />

            <div className="mascot-card">
              <div className="mascot-speech">
                <strong>Ready?</strong>
                <span>Your next skill is just one node away.</span>
              </div>
              <Image
                src="/mascot.svg"
                alt="A friendly robot coding mascot"
                width={420}
                height={420}
                priority
              />
            </div>

            <div className="floating-code-card code-card-a">
              <span>Python</span>
              <code>score = 10</code>
            </div>
            <div className="floating-code-card code-card-b">
              <span>+25 XP</span>
              <strong>Lesson cleared!</strong>
            </div>
          </div>
        </section>

        <section className="feature-strip">
          <article>
            <span className="feature-icon">🧭</span>
            <div>
              <h2>Follow the trail</h2>
              <p>Each skill unlocks the next step in a visual coding journey.</p>
            </div>
          </article>
          <article>
            <span className="feature-icon">⌨️</span>
            <div>
              <h2>Write real code</h2>
              <p>Move from quick questions into mini editors and projects.</p>
            </div>
          </article>
          <article>
            <span className="feature-icon">✨</span>
            <div>
              <h2>Learn from mistakes</h2>
              <p>Helpful feedback explains why, not just whether, an answer is wrong.</p>
            </div>
          </article>
        </section>

        <footer className="site-footer">
          <span>CodeTrail</span>
          <Link href="/privacy">Privacy &amp; Data</Link>
        </footer>
      </main>
    </div>
  );
}
