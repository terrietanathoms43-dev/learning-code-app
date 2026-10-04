export type RuntimeErrorLocation = {
  line: number;
  column: number | null;
  summary: string;
};

function lastUsefulLine(stderr: string) {
  const lines = stderr
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const namedError = [...lines]
    .reverse()
    .find((line) => /(?:Error|Exception|Traceback):?/i.test(line));

  return namedError ?? lines.at(-1) ?? "Runtime error";
}

export function parseRuntimeError(
  language: "python" | "javascript",
  stderr: string,
): RuntimeErrorLocation | null {
  if (!stderr.trim()) return null;

  if (language === "python") {
    const matches = [...stderr.matchAll(/File\s+"[^"]+",\s+line\s+(\d+)/g)];
    const match = matches.at(-1);
    if (!match) return null;

    return {
      line: Number(match[1]),
      column: null,
      summary: lastUsefulLine(stderr),
    };
  }

  const patterns = [
    /\[eval\]:(\d+)(?::(\d+))?/g,
    /<anonymous>:(\d+)(?::(\d+))?/g,
    /(?:^|\()([^\s()]+\.js):(\d+):(\d+)/gm,
  ];

  for (const pattern of patterns) {
    const matches = [...stderr.matchAll(pattern)];
    const match = matches.at(-1);
    if (!match) continue;

    const hasFilenameGroup = match.length >= 4 && typeof match[3] === "string";
    const line = Number(hasFilenameGroup ? match[2] : match[1]);
    const columnValue = hasFilenameGroup ? match[3] : match[2];

    if (!Number.isFinite(line) || line < 1) continue;

    return {
      line,
      column:
        columnValue && Number.isFinite(Number(columnValue))
          ? Math.max(1, Number(columnValue))
          : null,
      summary: lastUsefulLine(stderr),
    };
  }

  return null;
}
