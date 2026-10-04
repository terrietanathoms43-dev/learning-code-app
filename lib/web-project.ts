export const WEB_PROJECT_FORMAT = "codetrail-web-v1" as const;

export type WebProjectFile = "html" | "css" | "javascript";

export type WebProjectFiles = {
  html: string;
  css: string;
  javascript: string;
};

export const webProjectStarter: WebProjectFiles = {
  html: `<main class="card">
  <p class="eyebrow">My first web app</p>
  <h1>Hello, CodeTrail!</h1>
  <p id="message">Edit all three files and watch the preview update.</p>
  <button id="hello-button" type="button">Click me</button>
</main>`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: #f5f3ff;
  color: #18203b;
}

.card {
  width: min(420px, calc(100% - 48px));
  padding: 28px;
  border-radius: 22px;
  background: white;
  box-shadow: 0 18px 50px rgba(47, 43, 101, 0.14);
}

.eyebrow {
  font-weight: 800;
  color: #6558d3;
}

button {
  border: 0;
  border-radius: 12px;
  padding: 10px 16px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}`,
  javascript: `const button = document.querySelector("#hello-button");
const message = document.querySelector("#message");

button?.addEventListener("click", () => {
  if (message) message.textContent = "Your JavaScript is working!";
});`,
};

export function encodeWebProject(files: WebProjectFiles) {
  return JSON.stringify({
    format: WEB_PROJECT_FORMAT,
    files,
  });
}

export function decodeWebProject(value: string): WebProjectFiles {
  try {
    const parsed = JSON.parse(value) as {
      format?: unknown;
      files?: {
        html?: unknown;
        css?: unknown;
        javascript?: unknown;
      };
    };

    if (
      parsed?.format === WEB_PROJECT_FORMAT &&
      typeof parsed.files?.html === "string" &&
      typeof parsed.files.css === "string" &&
      typeof parsed.files.javascript === "string"
    ) {
      return {
        html: parsed.files.html,
        css: parsed.files.css,
        javascript: parsed.files.javascript,
      };
    }
  } catch {
    // Existing or malformed values fall back to a safe starter workspace.
  }

  return { ...webProjectStarter };
}

function escapeClosingTag(value: string, tag: "style" | "script") {
  return value.replace(new RegExp(`</${tag}`, "gi"), `<\\/${tag}`);
}

export function createWebPreviewDocument(
  files: WebProjectFiles,
  options: { restrictNetwork?: boolean } = {},
) {
  const safeCss = escapeClosingTag(files.css, "style");
  const safeJavaScript = escapeClosingTag(files.javascript, "script");
  const csp = options.restrictNetwork
    ? `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; font-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none';">`
    : "";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${csp}
  <style>${safeCss}</style>
</head>
<body>
${files.html}
<script>${safeJavaScript}</script>
</body>
</html>`;
}
