export type HighlightLanguage = "python" | "javascript" | "html" | "css";

type TokenKind = "comment" | "string" | "keyword" | "number" | "property" | "tag" | "color";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function token(kind: TokenKind, value: string) {
  return `<span class="syntax-${kind}">${escapeHtml(value)}</span>`;
}

function highlightWithPattern(
  value: string,
  pattern: RegExp,
  classify: (value: string) => TokenKind,
) {
  let output = "";
  let cursor = 0;

  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    output += escapeHtml(value.slice(cursor, index));
    output += token(classify(match[0]), match[0]);
    cursor = index + match[0].length;
  }

  output += escapeHtml(value.slice(cursor));
  return output;
}

const pythonPattern =
  /#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b|\b\d+(?:\.\d+)?\b/gm;

const javascriptPattern =
  /\/\*[\s\S]*?\*\/|\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|static|super|switch|this|throw|true|try|typeof|undefined|var|void|while|yield)\b|\b\d+(?:\.\d+)?\b/gm;

const cssPattern =
  /\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw|%|s|ms|deg)?\b|(?:--)?[a-zA-Z][\w-]*(?=\s*:)/gm;

function classifyCommon(value: string): TokenKind {
  if (value.startsWith("#")) return "comment";
  if (value.startsWith('"') || value.startsWith("'")) return "string";
  if (/^\d/.test(value)) return "number";
  return "keyword";
}

export function highlightCode(value: string, language: HighlightLanguage) {
  let highlighted: string;

  if (language === "python") {
    highlighted = highlightWithPattern(value, pythonPattern, classifyCommon);
  } else if (language === "javascript") {
    highlighted = highlightWithPattern(value, javascriptPattern, (part) => {
      if (part.startsWith("//") || part.startsWith("/*")) return "comment";
      if (part.startsWith('"') || part.startsWith("'")) return "string";
      if (/^\d/.test(part)) return "number";
      return "keyword";
    });
  } else if (language === "css") {
    highlighted = highlightWithPattern(value, cssPattern, (part) => {
      if (part.startsWith("/*")) return "comment";
      if (part.startsWith('"') || part.startsWith("'")) return "string";
      if (/^#[0-9a-f]/i.test(part)) return "color";
      if (/^\d/.test(part)) return "number";
      return "property";
    });
  } else {
    highlighted = highlightWithPattern(
      value,
      /<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g,
      (part) => (part.startsWith("<!--") ? "comment" : "tag"),
    );
  }

  return highlighted + (value.endsWith("\n") ? " " : "");
}
