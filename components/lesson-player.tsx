"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lesson } from "@/lib/course-data";

type Feedback = {
  correct: boolean;
  feedback: string;
};

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [checking, setChecking] = useState(false);
  const [finished, setFinished] = useState(false);
  const [energy, setEnergy] = useState(5);

  const exercise = lesson.exercises[index];
  const progress = useMemo(
    () => Math.round(((finished ? lesson.exercises.length : index) / lesson.exercises.length) * 100),
    [finished, index, lesson.exercises.length],
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
      const data = (await response.json()) as Feedback | { error: string };

      if (!response.ok || !("correct" in data)) {
        setFeedback({ correct: false, feedback: "Something went wrong. Try that answer again." });
        return;
      }

      setFeedback(data);
      if (!data.correct) {
        setEnergy((value) => Math.max(1, value - 1));
      }
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
          <div><span>XP earned</span><strong>+{lesson.xp}</strong></div>
          <div><span>Accuracy goal</span><strong>100%</strong></div>
          <div><span>Next step</span><strong>Unlocked</strong></div>
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
                onClick={() => {
                  if (!feedback?.correct) {
                    setAnswer(option);
                    setFeedback(null);
                  }
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
            disabled={feedback?.correct}
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
              disabled={feedback?.correct}
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
