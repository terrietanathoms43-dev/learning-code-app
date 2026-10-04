export type HighlightLanguage = "python" | "html" | "css" | "javascript";
export type HighlightTokenType =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "tag"
  | "property"
  | "color";

export type HighlightToken = {
  text: string;
  type: HighlightTokenType;
};

const pythonPattern =
  /(#.*$|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b|\b\d+(?:\.\d+)?\b)/gm;

const javascriptPattern =
  /(\/\*[\s\S]*?\*\/|\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|static|super|switch|this|throw|true|try|typeof|undefined|var|void|while|with|yield)\b|\b\d+(?:\.\d+)?\b)/gm;

const cssPattern =
  /(\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw|%|s|ms|deg)?\b|--?[a-zA-Z_][\w-]*(?=\s*:)|[a-zA-Z_][\w-]*(?=\s*:))/gm;

const htmlPattern = /(<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>)/gm;

function classifyToken(token: string, language: HighlightLanguage): HighlightTokenType {
  if (language === "html") {
    return token.startsWith("<!--") ? "comment" : "tag";
  }

  if (language === "css") {
    if (token.startsWith("/*")) return "comment";
    if (token.startsWith('"') || token.startsWith("'")) return "string";
    if (/^#[0-9a-fA-F]{3,8}$/.test(token)) return "color";
    if (/^\d/.test(token)) return "number";
    return "property";
  }

  if (
    token.startsWith("#") ||
    token.startsWith("//") ||
    token.startsWith("/*")
  ) {
    return "comment";
  }

  if (
    token.startsWith('"') ||
    token.startsWith("'") ||
    token.startsWith("`")
  ) {
    return "string";
  }

  if (/^\d/.test(token)) return "number";
  return "keyword";
}

export function tokenizeCode(
  value: string,
  language: HighlightLanguage,
): HighlightToken[] {
  const pattern =
    language === "python"
      ? pythonPattern
      : language === "javascript"
        ? javascriptPattern
        : language === "css"
          ? cssPattern
          : htmlPattern;

  pattern.lastIndex = 0;
  const tokens: HighlightToken[] = [];
  let cursor = 0;

  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      tokens.push({
        text: value.slice(cursor, index),
        type: "plain",
      });
    }

    const text = match[0];
    tokens.push({
      text,
      type: classifyToken(text, language),
    });
    cursor = index + text.length;
  }

  if (cursor < value.length) {
    tokens.push({
      text: value.slice(cursor),
      type: "plain",
    });
  }

  return tokens.length ? tokens : [{ text: value, type: "plain" }];
}
