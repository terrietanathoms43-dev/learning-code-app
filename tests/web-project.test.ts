import test from "node:test";
import assert from "node:assert/strict";
import {
  createWebPreviewDocument,
  decodeWebProject,
  encodeWebProject,
  webProjectStarter,
} from "../lib/web-project.ts";
import { isProjectLanguage } from "../lib/project-validation.ts";

test("web projects round-trip all three files", () => {
  const encoded = encodeWebProject({
    html: "<h1>Hi</h1>",
    css: "h1 { color: blue; }",
    javascript: 'console.log("Hi");',
  });

  assert.deepEqual(decodeWebProject(encoded), {
    html: "<h1>Hi</h1>",
    css: "h1 { color: blue; }",
    javascript: 'console.log("Hi");',
  });
});

test("malformed web project data falls back safely", () => {
  assert.deepEqual(decodeWebProject("not-json"), webProjectStarter);
  assert.deepEqual(
    decodeWebProject(JSON.stringify({ format: "wrong", files: {} })),
    webProjectStarter,
  );
});

test("web preview combines files and blocks network access", () => {
  const preview = createWebPreviewDocument(
    {
      html: '<button id="go">Go</button>',
      css: "button { color: blue; }",
      javascript: 'document.querySelector("#go")?.classList.add("ready");',
    },
    { restrictNetwork: true },
  );

  assert.match(preview, /<button id="go">Go<\/button>/);
  assert.match(preview, /button \{ color: blue; \}/);
  assert.match(preview, /classList\.add\("ready"\)/);
  assert.match(preview, /connect-src 'none'/);
  assert.match(preview, /form-action 'none'/);
});

test("web preview neutralizes closing style and script tags inside file content", () => {
  const preview = createWebPreviewDocument({
    html: "<p>Safe</p>",
    css: 'body::after { content: "</style>"; }',
    javascript: 'const text = "</script>"; console.log(text);',
  });

  assert.match(preview, /<\\\/style>/i);
  assert.match(preview, /<\\\/script>/i);
});

test("web is a supported saved project type", () => {
  assert.equal(isProjectLanguage("web"), true);
});
