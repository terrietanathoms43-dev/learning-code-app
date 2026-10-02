import test from "node:test";
import assert from "node:assert/strict";
import { checkAnswer } from "../lib/answer-key.ts";
import { isUuidV4 } from "../lib/validation.ts";
import { isSameOriginRequest } from "../lib/request-security.ts";

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
