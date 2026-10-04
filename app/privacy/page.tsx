import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy & Data",
  description: "How CodeTrail handles learner account, progress, and AI Coach data.",
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">&lt;/&gt;</span>
        <span>CodeTrail</span>
      </Link>

      <section className="privacy-card">
        <p className="eyebrow">Privacy &amp; data</p>
        <h1>What CodeTrail uses to help you learn.</h1>
        <p className="privacy-lead">
          CodeTrail is designed to keep learner data focused on the features that need it.
          This page describes the app&apos;s current data behavior.
        </p>

        <div className="privacy-sections">
          <section>
            <h2>Account information</h2>
            <p>
              Email sign-up, sign-in, confirmation, sessions, and password recovery are
              handled through Supabase Auth. CodeTrail stores a learner profile linked to
              the account with your display name, optional unique username, daily XP goal, and timezone.
            </p>
          </section>

          <section>
            <h2>Learning progress</h2>
            <p>
              CodeTrail stores lesson completion, XP events, streak-related activity,
              challenge correctness, and lesson session identifiers so it can unlock the
              trail and show your progress across devices.
            </p>
          </section>

          <section>
            <h2>Exercise answers</h2>
            <p>
              CodeTrail does not retain the raw text or code you type as part of saved
              attempt history. Attempt records keep only the information needed to verify
              lesson completion, such as the exercise, session, time, and whether the
              answer was correct.
            </p>
          </section>

          <section>
            <h2>Saved projects</h2>
            <p>
              When you intentionally create a project in the Projects workspace, CodeTrail
              stores the project title, selected language and code so you can continue
              working across devices. Saved projects are private to your signed-in account
              and can be deleted from the workspace.
            </p>
          </section>

          <section>
            <h2>AI Code Coach</h2>
            <p>
              When you choose an AI Coach action, CodeTrail sends the current lesson,
              exercise, requested help mode, and your current exercise answer to OpenAI
              to generate coding guidance. The same text is checked by OpenAI&apos;s
              moderation service for safety. CodeTrail requests non-stored Responses API
              output and does not save the generated coach reply in the learner database.
            </p>
            <p>
              Keep personal information out of exercise answers and AI-assisted coding
              requests. The AI Coach is for coding help and may make mistakes.
            </p>
          </section>

          <section>
            <h2>Usage limits and safety</h2>
            <p>
              CodeTrail records limited AI Coach usage metadata—such as lesson, exercise,
              help mode, and time—to enforce the rolling daily request limit. It does not
              store the full AI prompt or response in that usage table.
            </p>
          </section>
        </div>

        <div className="privacy-actions">
          <Link className="primary-button" href="/learn">Back to learning</Link>
          <Link className="secondary-button" href="/login">Account access</Link>
        </div>

        <small className="privacy-updated">Current app behavior · Updated October 4, 2026</small>
      </section>
    </main>
  );
}
