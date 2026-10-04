import test from "node:test";
import assert from "node:assert/strict";
import { highlightCode } from "../lib/syntax-highlight.ts";

test("Python highlighting marks keywords strings comments and numbers", () => {
  const html = highlightCode('def hello():\n  # note\n  return "hi" + str(2)', "python");

  assert.match(html, /syntax-keyword">def<\/span>/);
  assert.match(html, /syntax-comment"># note<\/span>/);
  assert.match(html, /syntax-string">&quot;hi&quot;<\/span>|syntax-string">"hi"<\/span>/);
  assert.match(html, /syntax-number">2<\/span>/);
});

test("JavaScript highlighting marks keywords and comments", () => {
  const html = highlightCode("const score = 10; // points", "javascript");

  assert.match(html, /syntax-keyword">const<\/span>/);
  assert.match(html, /syntax-number">10<\/span>/);
  assert.match(html, /syntax-comment">\/\/ points<\/span>/);
});

test("HTML highlighting escapes source markup instead of creating elements", () => {
  const html = highlightCode('<script>alert("x")</script>', "html");

  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test("CSS highlighting marks properties colors and values", () => {
  const html = highlightCode("color: #fff; margin: 12px;", "css");

  assert.match(html, /syntax-property">color<\/span>/);
  assert.match(html, /syntax-color">#fff<\/span>/);
  assert.match(html, /syntax-number">12px<\/span>/);
});
