import test from "node:test";
import assert from "node:assert/strict";
import { applyCodeEditorKey, getLineAndColumn, getLineSelection } from "../lib/code-editor.ts";

test("Tab inserts two spaces at the caret", () => {
  assert.deepEqual(
    applyCodeEditorKey({
      value: "print('hi')",
      selectionStart: 0,
      selectionEnd: 0,
      key: "Tab",
    }),
    {
      value: "  print('hi')",
      selectionStart: 2,
      selectionEnd: 2,
    },
  );
});

test("Tab and Shift+Tab indent and outdent multiple lines", () => {
  const indented = applyCodeEditorKey({
    value: "one\ntwo",
    selectionStart: 0,
    selectionEnd: 7,
    key: "Tab",
  });

  assert.equal(indented?.value, "  one\n  two");

  const outdented = applyCodeEditorKey({
    value: indented!.value,
    selectionStart: 2,
    selectionEnd: indented!.value.length,
    key: "Tab",
    shiftKey: true,
  });

  assert.equal(outdented?.value, "one\ntwo");
});

test("Enter keeps indentation and indents after a Python colon", () => {
  const edit = applyCodeEditorKey({
    value: "if ready:",
    selectionStart: 9,
    selectionEnd: 9,
    key: "Enter",
  });

  assert.equal(edit?.value, "if ready:\n  ");
  assert.equal(edit?.selectionStart, 12);
});

test("paired brackets place the cursor between the pair", () => {
  assert.deepEqual(
    applyCodeEditorKey({
      value: "call",
      selectionStart: 4,
      selectionEnd: 4,
      key: "(",
    }),
    {
      value: "call()",
      selectionStart: 5,
      selectionEnd: 5,
    },
  );
});

test("Backspace removes an empty paired bracket", () => {
  assert.deepEqual(
    applyCodeEditorKey({
      value: "call()",
      selectionStart: 5,
      selectionEnd: 5,
      key: "Backspace",
    }),
    {
      value: "call",
      selectionStart: 4,
      selectionEnd: 4,
    },
  );
});

test("line and column are one-based", () => {
  assert.deepEqual(getLineAndColumn("one\ntwo", 6), {
    line: 2,
    column: 3,
  });
});


test("line selection resolves a one-based line and column", () => {
  assert.deepEqual(getLineSelection("one\ntwo\nthree", 2, 2), {
    start: 4,
    end: 7,
    caret: 5,
  });
});

test("line selection clamps beyond the final line", () => {
  assert.deepEqual(getLineSelection("one\ntwo", 99, 99), {
    start: 4,
    end: 7,
    caret: 7,
  });
});
