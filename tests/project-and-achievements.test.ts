import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_PROJECT_CODE_LENGTH,
  MAX_SAVED_PROJECTS,
  getProjectCodeError,
} from "../lib/project-validation.ts";
import { getAchievements } from "../lib/achievements.ts";

test("project validation matches the shared workspace limits", () => {
  assert.equal(MAX_SAVED_PROJECTS, 25);
  assert.equal(getProjectCodeError("x".repeat(MAX_PROJECT_CODE_LENGTH)), null);
  assert.match(
    getProjectCodeError("x".repeat(MAX_PROJECT_CODE_LENGTH + 1)) ?? "",
    /20,000/,
  );
});

test("generic first-step achievement counts another learning world", () => {
  const achievements = getAchievements(
    {
      completedLessons: 0,
      completedLessonSlugs: [],
      streak: 0,
      totalXp: 0,
    },
    { completedLessons: 1 },
  );

  const firstStep = achievements.find((achievement) => achievement.id === "first-step");
  assert.equal(firstStep?.unlocked, true);
  assert.equal(firstStep?.progress, 1);
});
