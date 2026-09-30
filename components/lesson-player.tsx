"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lesson } from "@/lib/course-data";

type Feedback = {
  correct: boolean;
  feedback: string;
};

type CompletionState = {
  saved: boolean;
  xpAwarded: number;
  accuracy: number;
  notice: string;
};

function isFeedback(value: unknown): value is Feedback {
  return (
    value !== null &&
    typeof value === "object" &&
    "correct" in value &&
    "feedback" in value &&
    typeof value.correct === "boolean" &&
    typeof value.feedback === "string"
  );
}

function isSavedCompletion(
  value: unknown,
): value is { saved: true; xpAwarded: number; accuracy: number } {
  return (
    value !== null &&
    typeof value === "object" &&
    "saved" in value &&
    value.saved === true &&
    "xpAwarded" in value &&
    typeof value.xpAwarded === "number" &&
    "accuracy" in value &&
    typeof value.accuracy === "number"
  );
}

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [finished, setFinished] = useState(false);
  const [energy, setEnergy] = useState(5);
  const [mistakes, setMistakes] = useState(0);
  const [completion, setCompletion] = useState<CompletionState | null>(null);

  const exercise = lesson.exercises[index];
  const progress = useMemo(
    () => Math.round(((finished ? lesson.exercises.length : index) / lesson.exercises.length) * 100),
    [finished, index, lesson.exercises.length],
  );
  const localAccuracy = Math.round(
    (lesson.exercises.length / Math.max(lesson.exercises.length + mistakes, 1)) * 100,
  );

  async function check() {
    if (!exercise || !answer.trim() || checking) return;
    setChecking(true);

    try {
      const response = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ exerciseId: exercise.id, answer }),
      });
      const data: unknown = await response.json();

      if (!response.ok || !isFeedback(data)) {
        setFeedback({
          correct: false,
          feedback: "The answer checker could not respond correctly. Please try again.",
        });
        return;
      }

      setFeedback(data);
      if (!data.correct) {
        setMistakes((value) => value + 1);
        setEnergy((value) => Math.max(0, value - 1));
      }
    } catch {
      setFeedback({
        correct: false,
        feedback: "We could not reach the answer checker. Check your connection and try again.",
      });
    } finally {
      setChecking(false);
    }
  }

  async function finishLesson() {
    setSaving(true);
    let result: CompletionState = {
      saved: false,
      xpAwarded: 0,
      accuracy: localAccuracy,
      notice: "Lesson complete locally. Sign in to save your progress, XP and streak.",
    };

    try {
      const response = await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lessonSlug: lesson.slug }),
      });
      const data: unknown = await response.json();

      if (response.ok && isSavedCompletion(data)) {
        result = {
          saved: true,
          xpAwarded: data.xpAwarded,
          accuracy: data.accuracy,
          notice:
            data.xpAwarded > 0
              ? "Progress saved. Your next available trail node is ready."
              : "Progress saved. You already earned XP for this lesson.",
        };
      } else if (response.status === 401) {
        result.notice = "Lesson complete. Sign in to save your progress, XP and streak.";
      } else {
        result.notice = "Lesson complete, but cloud progress could not be saved yet.";
      }
    } catch {
      result.notice = "Lesson complete, but cloud progress could not be saved yet.";
    } finally {
      setCompletion(result);
      setFinished(true);
      setSaving(false);
    }
  }

  async function next() {
    if (!feedback?.correct || saving) return;

    if (index === lesson.exercises.length - 1) {
      await finishLesson();
      return;
    }

    setIndex((value) => value + 1);
    setAnswer("");
    setFeedback(null);
  }

  if (finished) {
    const finalAccuracy = completion?.accuracy ?? localAccuracy;

    return (
      <main className="lesson-shell lesson-finish">
        <div className="celebration-burst" aria-hidden="true">✦</div>
        <div className="lesson-finish-icon" aria-hidden="true">🏆</div>
        <p className="eyebrow">Trail cleared</p>
        <h1>{lesson.title} complete!</h1>
        <p>You finished every challenge in this lesson.</p>

        <div className="reward-grid">
          <div>
            <span>XP</span>
            <strong>
              {completion?.saved
                ? completion.xpAwarded > 0
                  ? `+${completion.xpAwarded}`
                  : "Already earned"
                : "Not saved"}
            </strong>
          </div>
          <div><span>Accuracy</span><strong>{finalAccuracy}%</strong></div>
          <div>
            <span>Trail progress</span>
            <strong>{completion?.saved ? "Saved" : "Local only"}</strong>
          </div>
        </div>

        {completion?.notice && <p className="completion-notice">{completion.notice}</p>}
        <Link className="primary-button" href="/learn">Back to the trail</Link>
      </main>
    );
  }

  return (
    <main className="lesson-shell">
      <div className="lesson-topline">
        <Link className="icon-button" href="/learn" aria-label="Leave lesson">×</Link>
        <div className="lesson-progress" aria-label={`Lesson progress ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="energy-meter" title="Practice energy">⚡ {energy}/5</div>
      </div>

      <section className="lesson-card">
        <div className="lesson-card-heading">
          <span className="lesson-mini-icon" aria-hidden="true">{lesson.icon}</span>
          <div>
            <p className="eyebrow">{exercise.eyebrow}</p>
            <h1>{exercise.prompt}</h1>
          </div>
        </div>

        {exercise.code && <pre className="code-panel"><code>{exercise.code}</code></pre>}

        {exercise.type === "choice" && exercise.options && (
          <div className="answer-options" role="radiogroup" aria-label="Answer choices">
            {exercise.options.map((option, optionIndex) => (
              <button
                className={`answer-option ${answer === option ? "is-selected" : ""}`}
                key={option}
                type="button"
                role="radio"
                aria-checked={answer === option}
                disabled={checking || saving || Boolean(feedback?.correct)}
                onClick={() => {
                  setAnswer(option);
                  setFeedback(null);
                }}
              >
                <span className="answer-key">{String.fromCharCode(65 + optionIndex)}</span>
                <code>{option}</code>
              </button>
            ))}
          </div>
        )}

        {exercise.type === "text" && (
          <input
            className="answer-input"
            value={answer}
            placeholder={exercise.placeholder}
            onChange={(event) => {
              setAnswer(event.target.value);
              setFeedback(null);
            }}
            disabled={checking || saving || Boolean(feedback?.correct)}
            autoCapitalize="none"
            autoCorrect="off"
          />
        )}

        {exercise.type === "code" && (
          <div className="mini-editor">
            <div className="editor-bar">
              <span /><span /><span />
              <strong>main.py</strong>
            </div>
            <textarea
              aria-label="Code answer"
              value={answer}
              placeholder={exercise.placeholder}
              onChange={(event) => {
                setAnswer(event.target.value);
                setFeedback(null);
              }}
              disabled={checking || saving || Boolean(feedback?.correct)}
              spellCheck={false}
            />
          </div>
        )}
      </section>

      <div className={`lesson-action-bar ${feedback ? (feedback.correct ? "is-correct" : "is-wrong") : ""}`}>
        <div className="feedback-copy" aria-live="polite">
          {feedback ? (
            <>
              <strong>{feedback.correct ? "Nice work!" : "Try once more"}</strong>
              <span>{feedback.feedback}</span>
            </>
          ) : (
            <>
              <strong>Challenge {index + 1} of {lesson.exercises.length}</strong>
              <span>Take your time — coding is learned one small win at a time.</span>
            </>
          )}
        </div>

        {feedback?.correct ? (
          <button className="primary-button" type="button" onClick={next} disabled={saving}>
            {saving ? "Saving…" : index === lesson.exercises.length - 1 ? "Finish lesson" : "Continue"}
          </button>
        ) : (
          <button
            className="primary-button"
            type="button"
            onClick={check}
            disabled={!answer.trim() || checking || saving}
          >
            {checking ? "Checking…" : "Check answer"}
          </button>
        )}
      </div>
    </main>
  );
}
