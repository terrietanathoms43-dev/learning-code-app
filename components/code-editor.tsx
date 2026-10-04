"use client";

import {
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type SyntheticEvent,
} from "react";
import { applyCodeEditorKey, getLineAndColumn } from "@/lib/code-editor";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  fileName: string;
  maxLength: number;
  disabled?: boolean;
  onBlur?: () => void;
  onSave?: () => void;
};

export function CodeEditor({
  value,
  onChange,
  ariaLabel,
  fileName,
  maxLength,
  disabled = false,
  onBlur,
  onSave,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const lineCount = useMemo(() => Math.max(1, value.split("\n").length), [value]);
  const position = getLineAndColumn(value, cursor);

  function restoreSelection(start: number, end: number) {
    window.requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(start, end);
      setCursor(end);
    });
  }

  function applyKeyboardEdit(key: string, shiftKey = false) {
    const textarea = textareaRef.current;
    if (!textarea || disabled) return;

    const edit = applyCodeEditorKey({
      value,
      selectionStart: textarea.selectionStart,
      selectionEnd: textarea.selectionEnd,
      key,
      shiftKey,
    });

    if (!edit || edit.value.length > maxLength) return;

    onChange(edit.value);
    restoreSelection(edit.selectionStart, edit.selectionEnd);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      onSave?.();
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const edit = applyCodeEditorKey({
      value,
      selectionStart: event.currentTarget.selectionStart,
      selectionEnd: event.currentTarget.selectionEnd,
      key: event.key,
      shiftKey: event.shiftKey,
    });

    if (!edit || edit.value.length > maxLength) return;

    event.preventDefault();
    onChange(edit.value);
    restoreSelection(edit.selectionStart, edit.selectionEnd);
  }

  function syncLineNumbers(event: SyntheticEvent<HTMLTextAreaElement>) {
    const lineNumbers = lineNumbersRef.current;
    if (lineNumbers) {
      lineNumbers.scrollTop = event.currentTarget.scrollTop;
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      textareaRef.current?.select();
    }
  }

  function syncCursor() {
    setCursor(textareaRef.current?.selectionStart ?? 0);
  }

  return (
    <div className="code-editor-shell">
      <div className="code-editor-mobile-tools" aria-label="Editor tools">
        <button type="button" onClick={() => applyKeyboardEdit("Tab")} disabled={disabled}>
          Tab
        </button>
        <button
          type="button"
          onClick={() => applyKeyboardEdit("Tab", true)}
          disabled={disabled}
          aria-label="Outdent selected lines"
        >
          Outdent
        </button>
        <button type="button" onClick={() => void copyCode()} disabled={!value}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="code-editor-body">
        <div className="code-line-numbers" ref={lineNumbersRef} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, index) => (
            <span key={index + 1}>{index + 1}</span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          aria-label={ariaLabel}
          aria-describedby="project-editor-position"
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          wrap="off"
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={syncCursor}
          onClick={syncCursor}
          onSelect={syncCursor}
          onScroll={syncLineNumbers}
          disabled={disabled}
        />
      </div>

      <div className="code-editor-status" id="project-editor-position">
        <span>{fileName}</span>
        <span>Ln {position.line}, Col {position.column}</span>
      </div>
    </div>
  );
}
