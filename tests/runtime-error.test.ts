import test from "node:test";
import assert from "node:assert/strict";
import { parseRuntimeError } from "../lib/runtime-error.ts";

test("parses Python traceback line numbers", () => {
  const result = parseRuntimeError(
    "python",
    'Traceback (most recent call last):\n  File "<string>", line 3, in <module>\nNameError: name \'score\' is not defined\n',
  );

  assert.deepEqual(result, {
    line: 3,
    column: null,
    summary: "NameError: name 'score' is not defined",
  });
});

test("parses Node eval line and column", () => {
  const result = parseRuntimeError(
    "javascript",
    "ReferenceError: score is not defined\n    at [eval]:4:7\n",
  );

  assert.deepEqual(result, {
    line: 4,
    column: 7,
    summary: "at [eval]:4:7",
  });
});

test("returns null when no code location is available", () => {
  assert.equal(parseRuntimeError("javascript", "Something went wrong"), null);
});
