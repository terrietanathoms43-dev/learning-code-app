export type CodeEditorEdit = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

type CodeEditorKeyInput = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
  key: string;
  shiftKey?: boolean;
};

const INDENT = "  ";
const pairs: Record<string, string> = {
  "{": "}",
  "[": "]",
  "(": ")",
  '"': '"',
  "'": "'",
  "`": "`",
};

function replaceRange(
  value: string,
  start: number,
  end: number,
  replacement: string,
  cursorOffset = replacement.length,
): CodeEditorEdit {
  return {
    value: value.slice(0, start) + replacement + value.slice(end),
    selectionStart: start + cursorOffset,
    selectionEnd: start + cursorOffset,
  };
}

function outdentWidth(line: string) {
  if (line.startsWith(INDENT)) return INDENT.length;
  if (line.startsWith("\t") || line.startsWith(" ")) return 1;
  return 0;
}

function editSelectedLines(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  outdent: boolean,
): CodeEditorEdit {
  const blockStart = value.lastIndexOf("\n", Math.max(0, selectionStart - 1)) + 1;
  const nextLineBreak = value.indexOf("\n", selectionEnd);
  const blockEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
  const block = value.slice(blockStart, blockEnd);
  const lines = block.split("\n");

  if (!outdent) {
    const replacement = lines.map((line) => INDENT + line).join("\n");
    const lineCount = lines.length;
    return {
      value: value.slice(0, blockStart) + replacement + value.slice(blockEnd),
      selectionStart: selectionStart + INDENT.length,
      selectionEnd: selectionEnd + INDENT.length * lineCount,
    };
  }

  const removals = lines.map(outdentWidth);
  const replacement = lines
    .map((line, index) => line.slice(removals[index]))
    .join("\n");
  const firstRemoval = removals[0] ?? 0;
  const totalRemoval = removals.reduce((sum, amount) => sum + amount, 0);

  return {
    value: value.slice(0, blockStart) + replacement + value.slice(blockEnd),
    selectionStart: Math.max(blockStart, selectionStart - firstRemoval),
    selectionEnd: Math.max(blockStart, selectionEnd - totalRemoval),
  };
}

function editSingleCaretTab(
  value: string,
  selectionStart: number,
  shiftKey: boolean,
): CodeEditorEdit | null {
  if (!shiftKey) {
    return replaceRange(value, selectionStart, selectionStart, INDENT);
  }

  const lineStart = value.lastIndexOf("\n", Math.max(0, selectionStart - 1)) + 1;
  const line = value.slice(lineStart);
  const removal = outdentWidth(line);
  if (!removal) return null;

  return {
    value: value.slice(0, lineStart) + value.slice(lineStart + removal),
    selectionStart: Math.max(lineStart, selectionStart - removal),
    selectionEnd: Math.max(lineStart, selectionStart - removal),
  };
}

function editEnter(
  value: string,
  selectionStart: number,
  selectionEnd: number,
): CodeEditorEdit {
  const lineStart = value.lastIndexOf("\n", Math.max(0, selectionStart - 1)) + 1;
  const beforeCursor = value.slice(lineStart, selectionStart);
  const indentation = beforeCursor.match(/^\s*/)?.[0] ?? "";
  const trimmedBefore = beforeCursor.trimEnd();
  const opener = trimmedBefore.at(-1);
  const closer = opener ? pairs[opener] : undefined;
  const shouldIndent = Boolean(closer || opener === ":");
  const afterSelection = value.slice(selectionEnd);
  const nextCharacter = afterSelection[0];

  if (closer && nextCharacter === closer) {
    const replacement = "\n" + indentation + INDENT + "\n" + indentation;
    return replaceRange(
      value,
      selectionStart,
      selectionEnd,
      replacement,
      1 + indentation.length + INDENT.length,
    );
  }

  const replacement =
    "\n" + indentation + (shouldIndent ? INDENT : "");
  return replaceRange(value, selectionStart, selectionEnd, replacement);
}

export function applyCodeEditorKey({
  value,
  selectionStart,
  selectionEnd,
  key,
  shiftKey = false,
}: CodeEditorKeyInput): CodeEditorEdit | null {
  if (key === "Tab") {
    if (selectionStart !== selectionEnd || value.slice(selectionStart, selectionEnd).includes("\n")) {
      return editSelectedLines(value, selectionStart, selectionEnd, shiftKey);
    }

    return editSingleCaretTab(value, selectionStart, shiftKey);
  }

  if (key === "Enter") {
    return editEnter(value, selectionStart, selectionEnd);
  }

  if (key === "Backspace" && selectionStart === selectionEnd && selectionStart > 0) {
    const previous = value[selectionStart - 1];
    const next = value[selectionStart];
    if (pairs[previous] === next) {
      return {
        value: value.slice(0, selectionStart - 1) + value.slice(selectionStart + 1),
        selectionStart: selectionStart - 1,
        selectionEnd: selectionStart - 1,
      };
    }
  }

  const pair = pairs[key];
  if (pair) {
    const selected = value.slice(selectionStart, selectionEnd);
    if (selected) {
      return {
        value:
          value.slice(0, selectionStart) +
          key +
          selected +
          pair +
          value.slice(selectionEnd),
        selectionStart: selectionStart + 1,
        selectionEnd: selectionEnd + 1,
      };
    }

    if (value[selectionStart] === pair && key === pair) {
      return {
        value,
        selectionStart: selectionStart + 1,
        selectionEnd: selectionStart + 1,
      };
    }

    return {
      value:
        value.slice(0, selectionStart) +
        key +
        pair +
        value.slice(selectionStart),
      selectionStart: selectionStart + 1,
      selectionEnd: selectionStart + 1,
    };
  }

  if (
    (key === "}" || key === "]" || key === ")") &&
    selectionStart === selectionEnd &&
    value[selectionStart] === key
  ) {
    return {
      value,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionStart + 1,
    };
  }

  return null;
}

export function getLineAndColumn(value: string, cursor: number) {
  const safeCursor = Math.max(0, Math.min(cursor, value.length));
  const before = value.slice(0, safeCursor);
  const lines = before.split("\n");

  return {
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1,
  };
}


export function getLineSelection(
  value: string,
  line: number,
  column = 1,
) {
  const safeLine = Math.max(1, Math.floor(line));
  const safeColumn = Math.max(1, Math.floor(column));
  const lines = value.split("\n");
  const lineIndex = Math.min(safeLine - 1, Math.max(0, lines.length - 1));

  let start = 0;
  for (let index = 0; index < lineIndex; index += 1) {
    start += lines[index].length + 1;
  }

  const currentLine = lines[lineIndex] ?? "";
  const caret = start + Math.min(safeColumn - 1, currentLine.length);

  return {
    start,
    end: start + currentLine.length,
    caret,
  };
}
