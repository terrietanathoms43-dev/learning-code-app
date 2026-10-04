"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type SyntheticEvent,
} from "react";
import {
  applyCodeEditorKey,
  getLineAndColumn,
  getLineSelection,
} from "@/lib/code-editor";
import {
  tokenizeCode,
  type HighlightLanguage,
} from "@/lib/code-highlight";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  fileName: string;
  language: HighlightLanguage;
  maxLength: number;
  disabled?: boolean;
  onBlur?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  canReset?: boolean;
  onRun?: () => void;
  canRun?: boolean;
  jumpTo?: {
    line: number;
    column: number | null;
    requestId: number;
  } | null;
};

export function CodeEditor({
  value,
  onChange,
  ariaLabel,
  fileName,
  language,
  maxLength,
  disabled = false,
  onBlur,
  onSave,
  onReset,
  canReset = false,
  onRun,
  canRun = false,
  jumpTo = null,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  const highlightRef = useRef<HTMLPreElement>(null);
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const lineCount = useMemo(() => Math.max(1, value.split("\n").length), [value]);
  const highlightedTokens = useMemo(
    () => tokenizeCode(value, language),
    [language, value],
  );
  const position = getLineAndColumn(value, cursor);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!jumpTo) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const target = getLineSelection(
      valueRef.current,
      jumpTo.line,
      jumpTo.column ?? 1,
    );

    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(target.caret, target.caret);
      const lineHeight = Number.parseFloat(
        window.getComputedStyle(textarea).lineHeight,
      );
      if (Number.isFinite(lineHeight)) {
        textarea.scrollTop = Math.max(0, (jumpTo.line - 2) * lineHeight);
        if (lineNumbersRef.current) {
          lineNumbersRef.current.scrollTop = textarea.scrollTop;
        }
        if (highlightRef.current) {
          highlightRef.current.scrollTop = textarea.scrollTop;
          highlightRef.current.scrollLeft = textarea.scrollLeft;
        }
      }
      setCursor(target.caret);
    });
  }, [jumpTo]);

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
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter" &&
      onRun &&
      canRun
    ) {
      event.preventDefault();
      onRun();
      return;
    }

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
    const textarea = event.currentTarget;
    const lineNumbers = lineNumbersRef.current;
    const highlight = highlightRef.current;

    if (lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }

    if (highlight) {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
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
      <div className="code-editor-actions" aria-label="Editor actions">
        <button type="button" onClick={() => void copyCode()} disabled={!value}>
          {copied ? "Copied" : "Copy code"}
        </button>
        {onReset && (
          <button type="button" onClick={onReset} disabled={disabled}>
            Reset file
          </button>
        )}
        {onRun && (
          <button
            type="button"
            className="code-editor-action-run"
            onClick={onRun}
            disabled={disabled || !canRun}
          >
            ▶ Run
          </button>
        )}
      </div>

      <div className="code-editor-mobile-tools" aria-label="Mobile editor tools">
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

      </div>

      <div className="code-editor-body">
        <div className="code-line-numbers" ref={lineNumbersRef} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, index) => (
            <span key={index + 1}>{index + 1}</span>
          ))}
        </div>
        <div className="code-editor-pane">
          <pre className="code-highlight-layer" ref={highlightRef} aria-hidden="true">
            <code>
              {highlightedTokens.map((token, index) => (
                <span className={`syntax-token syntax-token--${token.type}`} key={index}>
                  {token.text}
                </span>
              ))}
            </code>
          </pre>
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
      </div>

      <div className="code-editor-status" id="project-editor-position">
        <span>{fileName}</span>
        <div className="code-editor-status-actions">
          <span>Ln {position.line}, Col {position.column}</span>
          <button type="button" onClick={() => void copyCode()} disabled={!value}>
            {copied ? "Copied" : "Copy"}
          </button>
          {onReset && (
            <button type="button" onClick={onReset} disabled={disabled || !canReset}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
