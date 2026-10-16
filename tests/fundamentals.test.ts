import test from "node:test";
import assert from "node:assert/strict";
import { checkAnswer } from "../lib/answer-key.ts";
import { fundamentalsLessonSlugs, fundamentalsPath, getLesson, getLessonWorldHome, isCourseFinalProject, guestAccessibleLessonSlugs } from "../lib/course-data.ts";

test("language-neutral trail is complete", () => {
  assert.equal(fundamentalsLessonSlugs.length, 10);
  assert.equal(fundamentalsPath.length, 10);
  assert.ok(guestAccessibleLessonSlugs.includes("fund-algorithms"));
  for (const slug of fundamentalsLessonSlugs) {
    const lesson = getLesson(slug);
    assert.ok(lesson?.overview && lesson.example && lesson.takeaway);
    assert.ok(lesson.exercises.length >= 3);
    assert.equal(getLessonWorldHome(slug), "/learn/fundamentals");
  }
  assert.equal(isCourseFinalProject("fund-mini-project"), true);
});

test("answers validate and provide feedback", () => {
  assert.equal(checkAnswer("fund-algorithms-q1", "A recipe with numbered instructions")?.correct, true);
  assert.equal(checkAnswer("fund-algorithms-q1", "A laptop brand")?.correct, false);
  assert.equal(checkAnswer("fund-types-q2", "Boolean")?.correct, true);
  assert.equal(checkAnswer("fund-mini-project-q4", "3")?.correct, true);
  assert.equal(checkAnswer("fund-mini-project-q4", "4")?.correct, false);
});

test("pseudocode ordering rejects swapped steps", () => {
  const correct = "INPUT two numbers\nADD the numbers\nDISPLAY the total";
  assert.equal(checkAnswer("fund-algorithms-q3", correct)?.correct, true);
  assert.equal(checkAnswer("fund-algorithms-q3", "DISPLAY the total\nINPUT two numbers\nADD the numbers")?.correct, false);
});
