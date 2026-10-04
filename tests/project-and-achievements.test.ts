import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_PROJECT_CODE_LENGTH,
  MAX_SAVED_PROJECTS,
  getProjectCodeError,
} from "../lib/project-validation.ts";
import { getAchievements } from "../lib/achievements.ts";
import {
  getAuthCallbackErrorRedirect,
  getLoginAuthMessage,
  getRecoveryAuthMessage,
  getSafeNextPath,
} from "../lib/auth-redirect.ts";

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


test("auth return paths only allow same-origin relative destinations", () => {
  const origin = "https://learning-code-app.vercel.app";

  assert.equal(getSafeNextPath(origin, "/projects"), "/projects");
  assert.equal(
    getSafeNextPath(origin, "/projects?tab=recent#editor"),
    "/projects?tab=recent#editor",
  );
  assert.equal(getSafeNextPath(origin, "https://example.com"), "/learn");
  assert.equal(getSafeNextPath(origin, "//example.com"), "/learn");
  assert.equal(getSafeNextPath(origin, "/\\example.com"), "/learn");
});

test("auth callback errors preserve normal destinations and reroute recovery failures", () => {
  const origin = "https://learning-code-app.vercel.app";
  const loginRedirect = getAuthCallbackErrorRedirect(
    origin,
    "/projects",
    "callback-error",
  );
  assert.equal(loginRedirect.pathname, "/login");
  assert.equal(loginRedirect.searchParams.get("auth"), "callback-error");
  assert.equal(loginRedirect.searchParams.get("next"), "/projects");

  const recoveryRedirect = getAuthCallbackErrorRedirect(
    origin,
    "/reset-password",
    "callback-error",
  );
  assert.equal(recoveryRedirect.pathname, "/forgot-password");
  assert.equal(recoveryRedirect.searchParams.get("auth"), "recovery-error");
});

test("auth error messages are explicit", () => {
  assert.match(getLoginAuthMessage("callback-error"), /invalid or expired/i);
  assert.match(getLoginAuthMessage("missing-code"), /incomplete/i);
  assert.match(getRecoveryAuthMessage("recovery-error"), /invalid or expired/i);
});


test("generic achievements count multiple additional learning worlds", () => {
  const achievements = getAchievements(
    {
      completedLessons: 0,
      completedLessonSlugs: [],
      streak: 0,
      totalXp: 0,
    },
    [{ completedLessons: 0 }, { completedLessons: 1 }],
  );

  const firstStep = achievements.find((achievement) => achievement.id === "first-step");
  assert.equal(firstStep?.unlocked, true);
  assert.equal(firstStep?.progress, 1);
});
