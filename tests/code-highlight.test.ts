import test from "node:test";
import assert from "node:assert/strict";
import { tokenizeCode } from "../lib/code-highlight.ts";

test("Python highlighting finds keywords, strings, comments and numbers", () => {
  const tokens = tokenizeCode('if score > 10:\n  print("win") # result', "python");

  assert.ok(tokens.some((token) => token.type === "keyword" && token.text === "if"));
  assert.ok(tokens.some((token) => token.type === "number" && token.text === "10"));
  assert.ok(tokens.some((token) => token.type === "string" && token.text === '"win"'));
  assert.ok(tokens.some((token) => token.type === "comment" && token.text === "# result"));
});

test("JavaScript highlighting finds const and template strings", () => {
  const tokens = tokenizeCode('const name = `CodeTrail`;', "javascript");

  assert.ok(tokens.some((token) => token.type === "keyword" && token.text === "const"));
  assert.ok(tokens.some((token) => token.type === "string" && token.text === "`CodeTrail`"));
});

test("HTML highlighting keeps tags separate from text", () => {
  const tokens = tokenizeCode("<main>Hello</main>", "html");

  assert.deepEqual(
    tokens.filter((token) => token.type === "tag").map((token) => token.text),
    ["<main>", "</main>"],
  );
  assert.ok(tokens.some((token) => token.type === "plain" && token.text === "Hello"));
});

test("CSS highlighting identifies properties, colors and values", () => {
  const tokens = tokenizeCode("color: #fff; margin: 12px;", "css");

  assert.ok(tokens.some((token) => token.type === "property" && token.text === "color"));
  assert.ok(tokens.some((token) => token.type === "color" && token.text === "#fff"));
  assert.ok(tokens.some((token) => token.type === "number" && token.text === "12px"));
});
