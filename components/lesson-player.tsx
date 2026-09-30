"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lesson } from "@/lib/course-data";

type Feedback = {
  correct: boolean;
  feedback: string;
};

function isFeedback(value: unknown): value is Feedback {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    "correct" in value &&
    "feedback" in value &&
    typeof value.correct === "boolean" &&
    typeof value.feedback === "string"
  );
}

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [checking, setChecking] = useState(false);
  const [finished, setFinished] = useState(false);
  const [energy, setEnergy] = useState(5);
  const [mistakes, setMistakes] = useState(0);

  const exercise = lesson.exercises[index];
  const progress = useMemo(
    () => Math.round(((finished ? lesson.exercises.length : index) / lesson.exercises.length) * 100),
    [finished, index, lesson.exercises.length],
  );
  const accuracy = Math.round(
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

  function next() {
    if (!feedback?.correct) return;

    if (index === lesson.exercises.length - 1) {
      setFinished(true);
      return;
    }

    setIndex((value) => value + 1);
    setAnswer("");
    setFeedback(null);
  }

  if (finished) {
    return (
      <main className="lesson-shell lesson-finish">
        <div className="celebration-burst" aria-hidden="true">✦</div>
        <div className="lesson-finish-icon" aria-hidden="true">🏆</div>
        <p className="eyebrow">Trail cleared</p>
        <h1>{lesson.title} complete!</h1>
        <p>You finished every challenge in this lesson.</p>

        <div className="reward-grid">
          <div><span>Lesson XP</span><strong>+{lesson.xp}</strong></div>
          <div><span>Accuracy</span><strong>{accuracy}%</strong></div>
          <div><span>Trail progress</span><strong>Ready to save</strong></div>
        </div>

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

        {exercise.code && (
          <pre className="code-panel"><code>{exercise.code}</code></pre>
        )}

        {exercise.type === "choice" && exercise.options && (
          <div className="answer-options" role="radiogroup" aria-label="Answer choices">
            {exercise.options.map((option, optionIndex) => (
              <button
                className={`answer-option ${answer === option ? "is-selected" : ""}`}
                key={option}
                type="button"
                role="radio"
                aria-checked={answer === option}
                disabled={checking || Boolean(feedback?.correct)}
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
            disabled={checking || Boolean(feedback?.correct)}
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
              disabled={checking || Boolean(feedback?.correct)}
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
          <button className="primary-button" type="button" onClick={next}>
            {index === lesson.exercises.length - 1 ? "Finish lesson" : "Continue"}
          </button>
        ) : (
          <button
            className="primary-button"
            type="button"
            onClick={check}
            disabled={!answer.trim() || checking}
          >
            {checking ? "Checking…" : "Check answer"}
          </button>
        )}
      </div>
    </main>
  );
}
