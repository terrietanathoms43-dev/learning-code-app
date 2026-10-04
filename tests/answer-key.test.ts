import test from "node:test";
import assert from "node:assert/strict";
import { checkAnswer } from "../lib/answer-key.ts";
import {
  getLessonWorldHome,
  isCourseFinalProject,
} from "../lib/course-data.ts";
import { isUuidV4 } from "../lib/validation.ts";
import { isSameOriginRequest } from "../lib/request-security.ts";
import { getUsernameError, normalizeUsername } from "../lib/profile-validation.ts";

test("accepts normal spacing variants without merging Python tokens", () => {
  assert.equal(checkAnswer("variable-create", "score=10")?.correct, true);
  assert.equal(checkAnswer("condition-code", 'if score>=10:\n    print("Ready")')?.correct, true);
  assert.equal(checkAnswer("function-code", "def square(number):\n    return number*number")?.correct, true);
});

test("rejects malformed code whose tokens were previously merged", () => {
  assert.equal(checkAnswer("variable-create", "score = 1 0")?.correct, false);
  assert.equal(checkAnswer("condition-code", 'ifscore >= 10:\n    print("Ready")')?.correct, false);
  assert.equal(checkAnswer("function-code", "defsquare(number):\n    return number * number")?.correct, false);
});

test("preserves whitespace inside string literals", () => {
  assert.equal(checkAnswer("hello-print-choice", 'print("Hello, coder!")')?.correct, true);
  assert.equal(checkAnswer("hello-print-choice", 'print("Hello,coder!")')?.correct, false);
});

test("validates nested indentation", () => {
  const correct = [
    "def check_answer(answer):",
    '    if answer == "Python":',
    "        return True",
    "    return False",
  ].join("\n");

  const flat = [
    "def check_answer(answer):",
    '    if answer == "Python":',
    "    return True",
    "    return False",
  ].join("\n");

  assert.equal(checkAnswer("project-check-function", correct)?.correct, true);
  assert.equal(checkAnswer("project-check-function", flat)?.correct, false);
});

test("only accepts RFC-style version 4 lesson session UUIDs", () => {
  assert.equal(isUuidV4("550e8400-e29b-41d4-a716-446655440000"), true);
  assert.equal(isUuidV4("550e8400-e29b-11d4-a716-446655440000"), false);
  assert.equal(isUuidV4("not-a-session-id"), false);
});


test("same-origin mutation guard rejects cross-site browser requests", () => {
  const sameOrigin = new Request("https://codetrail.example/api/profile/settings", {
    method: "POST",
    headers: { origin: "https://codetrail.example" },
  });
  const crossSite = new Request("https://codetrail.example/api/profile/settings", {
    method: "POST",
    headers: { origin: "https://evil.example" },
  });
  const serverToServer = new Request("https://codetrail.example/api/profile/settings", {
    method: "POST",
  });

  assert.equal(isSameOriginRequest(sameOrigin), true);
  assert.equal(isSameOriginRequest(crossSite), false);
  assert.equal(isSameOriginRequest(serverToServer), true);
});


test("normalizes usernames consistently", () => {
  assert.equal(normalizeUsername("  @Terri_Etana  "), "terri_etana");
});

test("validates username format and reserved handles", () => {
  assert.equal(getUsernameError("terri_etana"), null);
  assert.equal(getUsernameError("ab"), "Username must be 3–20 characters and use only lowercase letters, numbers, or underscores.");
  assert.equal(getUsernameError("terri-etana"), "Username must be 3–20 characters and use only lowercase letters, numbers, or underscores.");
  assert.equal(getUsernameError("Admin"), "That username is reserved. Choose another one.");
  assert.equal(getUsernameError(""), null);
});


test("validates ordered code challenges including indentation", () => {
  const correct = [
    "if score >= 10:",
    '    print("Ready")',
    "else:",
    '    print("Keep trying")',
  ].join("\n");

  const wrongOrder = [
    "else:",
    '    print("Keep trying")',
    "if score >= 10:",
    '    print("Ready")',
  ].join("\n");

  assert.equal(checkAnswer("condition-order", correct)?.correct, true);
  assert.equal(checkAnswer("condition-order", wrongOrder)?.correct, false);
});

test("validates bug-fix challenges", () => {
  const fixed = [
    "for number in range(1, 4):",
    "    print(number)",
  ].join("\n");

  const missingIndent = [
    "for number in range(1, 4):",
    "print(number)",
  ].join("\n");

  assert.equal(checkAnswer("loop-debug", fixed)?.correct, true);
  assert.equal(checkAnswer("loop-debug", missingIndent)?.correct, false);
});


test("validates Web Foundations answers", () => {
  assert.equal(checkAnswer("web-html-heading", "<h1>Hello</h1>")?.correct, true);
  assert.equal(checkAnswer("web-html-heading", "<p>Hello</p>")?.correct, false);

  const fixedCss = [
    "h1 {",
    "  color: blue;",
    "}",
  ].join("\n");
  assert.equal(checkAnswer("web-css-debug", fixedCss)?.correct, true);
  assert.equal(checkAnswer("web-css-debug", "h1 {\n  color blue\n}")?.correct, false);

  const javascript = [
    'const name = "Ada";',
    "console.log(name);",
  ].join("\n");
  assert.equal(checkAnswer("web-js-code", javascript)?.correct, true);
});


test("validates JavaScript Foundations answers", () => {
  assert.equal(checkAnswer("js-variable-console", "log")?.correct, true);
  assert.equal(checkAnswer("js-strict-equality", "false")?.correct, true);

  const condition = [
    "if (score >= 10) {",
    '  console.log("Level up");',
    "}",
  ].join("\n");
  assert.equal(checkAnswer("js-condition-code", condition)?.correct, true);
  assert.equal(
    checkAnswer("js-condition-code", 'if (score >= 10) {\nconsole.log("Level up");\n}')?.correct,
    false,
  );

  const project = [
    "let total = 0;",
    "for (const score of scores) {",
    "  total = total + score;",
    "}",
  ].join("\n");
  assert.equal(checkAnswer("js-project-total", project)?.correct, true);
});


test("routes each learning world and recognizes final projects", () => {
  assert.equal(getLessonWorldHome("hello-world"), "/learn");
  assert.equal(getLessonWorldHome("web-html-basics"), "/learn/web");
  assert.equal(getLessonWorldHome("js-variables"), "/learn/javascript");

  assert.equal(isCourseFinalProject("mini-project"), true);
  assert.equal(isCourseFinalProject("web-mini-project"), true);
  assert.equal(isCourseFinalProject("js-mini-project"), true);
  assert.equal(isCourseFinalProject("js-functions"), false);
});
