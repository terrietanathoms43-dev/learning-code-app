"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CodeEditor } from "@/components/code-editor";
import {
  MAX_PROJECT_CODE_LENGTH,
  MAX_SAVED_PROJECTS,
  type ProjectLanguage,
} from "@/lib/project-validation";
import {
  createWebPreviewDocument,
  decodeWebProject,
  encodeWebProject,
  webProjectStarter,
  type WebProjectFile,
} from "@/lib/web-project";

export type SavedProject = {
  id: string;
  title: string;
  language: ProjectLanguage;
  code: string;
  created_at: string;
  updated_at: string;
};

type SaveState = "saved" | "unsaved" | "saving" | "error";

const starterCode: Record<ProjectLanguage, string> = {
  python: 'print("Hello, CodeTrail!")',
  html: "<h1>Hello, CodeTrail!</h1>",
  css: "body {\n  font-family: sans-serif;\n}",
  javascript: 'console.log("Hello, CodeTrail!");',
  web: encodeWebProject(webProjectStarter),
};

const fileNames: Record<ProjectLanguage, string> = {
  python: "main.py",
  html: "index.html",
  css: "styles.css",
  javascript: "script.js",
  web: "3 files",
};

const languageLabels: Record<ProjectLanguage, string> = {
  python: "Python",
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  web: "Web App",
};

const languageIcons: Record<ProjectLanguage, string> = {
  python: "🐍",
  html: "🌐",
  css: "🎨",
  javascript: "⚡",
  web: "🧩",
};

const webFileNames: Record<WebProjectFile, string> = {
  html: "index.html",
  css: "styles.css",
  javascript: "script.js",
};

const webFileLabels: Record<WebProjectFile, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
};

function getDownloadName(project: SavedProject) {
  const extension =
    project.language === "web"
      ? "html"
      : fileNames[project.language].split(".").pop() || "txt";
  const safeTitle =
    project.title
      .trim()
      .replace(/[^a-z0-9-_ ]/gi, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "codetrail-project";

  return `${safeTitle}.${extension}`;
}

function getCopyTitle(title: string) {
  const suffix = " copy";
  return `${title.slice(0, 80 - suffix.length).trim()}${suffix}`;
}

export function ProjectWorkspace({
  initialProjects,
}: {
  initialProjects: SavedProject[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [activeId, setActiveId] = useState(initialProjects[0]?.id ?? null);
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>(() =>
    Object.fromEntries(initialProjects.map((project) => [project.id, "saved"])) as Record<string, SaveState>,
  );
  const saveTimers = useRef(new Map<string, number>());
  const saveControllers = useRef(new Map<string, AbortController>());
  const saveRevisions = useRef(new Map<string, number>());
  const pendingSaves = useRef(new Map<string, { project: SavedProject; revision: number }>());
  const [creating, setCreating] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newProjectMenuOpen, setNewProjectMenuOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [activeWebFile, setActiveWebFile] = useState<WebProjectFile>("html");
  const [runState, setRunState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [runStdout, setRunStdout] = useState("");
  const [runStderr, setRunStderr] = useState("");
  const [runError, setRunError] = useState("");
  const [runExitCode, setRunExitCode] = useState<number | null>(null);
  const [runRemaining, setRunRemaining] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const active = useMemo(
    () => projects.find((project) => project.id === activeId) ?? null,
    [activeId, projects],
  );
  const saveState = active ? saveStates[active.id] ?? "saved" : "saved";
  const activeDeleting = Boolean(active && deletingId === active.id);
  const activeWebFiles = useMemo(
    () => (active?.language === "web" ? decodeWebProject(active.code) : null),
    [active],
  );
  const activeEditorValue =
    active?.language === "web" && activeWebFiles
      ? activeWebFiles[activeWebFile]
      : active?.code ?? "";
  const activeEditorName =
    active?.language === "web"
      ? webFileNames[activeWebFile]
      : active
        ? fileNames[active.language]
        : "";
  const visibleProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        languageLabels[project.language].toLowerCase().includes(query),
    );
  }, [projectSearch, projects]);

  const previewDocument = useMemo(() => {
    if (!active) return "";

    if (active.language === "web") {
      return createWebPreviewDocument(decodeWebProject(active.code), {
        restrictNetwork: true,
      });
    }

    if (active.language !== "html" && active.language !== "css") {
      return "";
    }

    const csp =
      "default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'none'; font-src 'none'; connect-src 'none';";

    if (active.language === "html") {
      return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><style>body{font-family:system-ui,sans-serif;padding:24px;color:#18203b}</style></head><body>${active.code}</body></html>`;
    }

    const safeCss = active.code.replace(/<\/style/gi, "<\\/style");
    return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><style>${safeCss}</style></head><body><main><h1>CodeTrail Preview</h1><p>Edit your CSS to style this sample page.</p><button type="button">Sample button</button></main></body></html>`;
  }, [active]);

  useEffect(() => {
    const timers = saveTimers.current;
    const controllers = saveControllers.current;
    const pending = pendingSaves.current;

    return () => {
      for (const timeout of timers.values()) {
        window.clearTimeout(timeout);
      }

      for (const controller of controllers.values()) {
        controller.abort();
      }

      for (const { project } of pending.values()) {
        void fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            title: project.title,
            language: project.language,
            code: project.code,
          }),
          keepalive: true,
        }).catch(() => undefined);
      }
    };
  }, []);

  function setProjectSaveState(projectId: string, state: SaveState) {
    setSaveStates((current) => ({ ...current, [projectId]: state }));
  }

  async function persistProject(project: SavedProject, revision: number) {
    const controller = new AbortController();
    saveControllers.current.set(project.id, controller);
    setProjectSaveState(project.id, "saving");

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          language: project.language,
          code: project.code,
        }),
        signal: controller.signal,
      });

      const data = (await response.json()) as {
        project?: SavedProject;
        error?: string;
      };

      if (saveRevisions.current.get(project.id) !== revision) return;

      if (!response.ok || !data.project) {
        setMessage(data.error || "Project could not be saved.");
        setProjectSaveState(project.id, "error");
        return;
      }

      pendingSaves.current.delete(project.id);
      setProjects((current) =>
        current.map((item) => (item.id === data.project?.id ? data.project : item)),
      );
      setMessage("");
      setProjectSaveState(project.id, "saved");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (saveRevisions.current.get(project.id) !== revision) return;
      setMessage("Project could not be saved. Check your connection.");
      setProjectSaveState(project.id, "error");
    } finally {
      if (saveControllers.current.get(project.id) === controller) {
        saveControllers.current.delete(project.id);
      }
    }
  }

  function queueProjectSave(project: SavedProject) {
    const previousTimer = saveTimers.current.get(project.id);
    if (previousTimer !== undefined) {
      window.clearTimeout(previousTimer);
    }

    saveControllers.current.get(project.id)?.abort();

    const revision = (saveRevisions.current.get(project.id) ?? 0) + 1;
    saveRevisions.current.set(project.id, revision);
    pendingSaves.current.set(project.id, { project, revision });

    const timeout = window.setTimeout(() => {
      saveTimers.current.delete(project.id);
      void persistProject(project, revision);
    }, 700);

    saveTimers.current.set(project.id, timeout);
  }

  function flushProjectSave(projectId: string) {
    const pending = pendingSaves.current.get(projectId);
    if (!pending) return;

    const activeController = saveControllers.current.get(projectId);
    if (activeController && !activeController.signal.aborted) {
      return;
    }
    if (activeController?.signal.aborted) {
      saveControllers.current.delete(projectId);
    }

    const timeout = saveTimers.current.get(projectId);
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
      saveTimers.current.delete(projectId);
    }

    void persistProject(pending.project, pending.revision);
  }

  function cancelProjectSave(projectId: string) {
    const timeout = saveTimers.current.get(projectId);
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
      saveTimers.current.delete(projectId);
    }
    saveControllers.current.get(projectId)?.abort();
    saveControllers.current.delete(projectId);
    pendingSaves.current.delete(projectId);
    saveRevisions.current.delete(projectId);
  }

  function resetRunResult() {
    setRunState("idle");
    setRunStdout("");
    setRunStderr("");
    setRunError("");
    setRunExitCode(null);
    setRunRemaining(null);
  }

  function updateActive(changes: Partial<SavedProject>) {
    if (!active || activeDeleting) return;

    const nextProject = { ...active, ...changes };
    resetRunResult();
    setProjects((current) =>
      current.map((project) =>
        project.id === active.id ? nextProject : project,
      ),
    );
    setProjectSaveState(active.id, "unsaved");
    setMessage("");
    queueProjectSave(nextProject);
  }

  function updateWebFile(file: WebProjectFile, value: string) {
    if (!active || active.language !== "web" || activeDeleting) return;

    const files = decodeWebProject(active.code);
    const nextCode = encodeWebProject({
      ...files,
      [file]: value,
    });

    if (nextCode.length > MAX_PROJECT_CODE_LENGTH) {
      setMessage(
        `Web App projects can contain at most ${MAX_PROJECT_CODE_LENGTH.toLocaleString()} characters across all three files.`,
      );
      return;
    }

    updateActive({ code: nextCode });
  }\n\n  function resetActiveEditor() {
    if (!active || activeDeleting) return;

    const starterValue =
      active.language === "web"
        ? webProjectStarter[activeWebFile]
        : starterCode[active.language];

    if (activeEditorValue === starterValue) return;

    if (!window.confirm(`Reset ${activeEditorName} to its starter code?`)) {
      return;
    }

    if (active.language === "web") {
      updateWebFile(activeWebFile, starterValue);
      return;
    }

    updateActive({ code: starterValue });
  }

  async function createProject(language: ProjectLanguage = "python") {
    if (creating || deletingId || projects.length >= MAX_SAVED_PROJECTS) return;
    setCreating(true);
    setMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: `Untitled ${languageLabels[language]} project`,
          language,
          code: starterCode[language],
        }),
      });

      const data = (await response.json()) as {
        project?: SavedProject;
        error?: string;
      };

      if (!response.ok || !data.project) {
        setMessage(data.error || "Project could not be created.");
        return;
      }

      setProjects((current) => [data.project!, ...current]);
      setActiveId(data.project.id);
      setActiveWebFile("html");
      setProjectSaveState(data.project.id, "saved");
      setProjectSearch("");
      setNewProjectMenuOpen(false);
      resetRunResult();
    } catch {
      setMessage("Project could not be created. Check your connection.");
    } finally {
      setCreating(false);
    }
  }

  async function duplicateProject() {
    if (
      !active ||
      duplicating ||
      deletingId ||
      projects.length >= MAX_SAVED_PROJECTS
    ) {
      return;
    }

    flushProjectSave(active.id);
    setDuplicating(true);
    setMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: getCopyTitle(active.title),
          language: active.language,
          code: active.code,
        }),
      });

      const data = (await response.json()) as {
        project?: SavedProject;
        error?: string;
      };

      if (!response.ok || !data.project) {
        setMessage(data.error || "Project could not be duplicated.");
        return;
      }

      setProjects((current) => [data.project!, ...current]);
      setActiveId(data.project.id);
      setProjectSaveState(data.project.id, "saved");
      setProjectSearch("");
      resetRunResult();
    } catch {
      setMessage("Project could not be duplicated. Check your connection.");
    } finally {
      setDuplicating(false);
    }
  }

  function exportProject() {
    if (!active) return;

    const exportedCode =
      active.language === "web"
        ? createWebPreviewDocument(decodeWebProject(active.code))
        : active.code;
    const blob = new Blob([exportedCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = getDownloadName(active);
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function saveActiveNow() {
    if (!active || activeDeleting || saveState === "saving") return;
    queueProjectSave(active);
    flushProjectSave(active.id);
  }

  function handleSaveShortcut(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveActiveNow();
    }
  }

  async function deleteProject(id: string) {
    if (deletingId) return;

    const project = projects.find((item) => item.id === id);
    if (!project) return;

    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) {
      return;
    }

    const shouldRestoreSave = (saveStates[id] ?? "saved") !== "saved";
    setDeletingId(id);
    cancelProjectSave(id);

    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) {
        setMessage("Project could not be deleted.");
        if (shouldRestoreSave) {
          setProjectSaveState(id, "unsaved");
          queueProjectSave(project);
        }
        return;
      }

      const nextProjects = projects.filter((item) => item.id !== id);
      setProjects(nextProjects);
      setSaveStates((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      setActiveId((current) =>
        current === id ? nextProjects[0]?.id ?? null : current,
      );
      setMessage("");
      resetRunResult();
    } catch {
      setMessage("Project could not be deleted. Check your connection.");
      if (shouldRestoreSave) {
        setProjectSaveState(id, "unsaved");
        queueProjectSave(project);
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function runCode() {
    if (
      !active ||
      activeDeleting ||
      (active.language !== "python" && active.language !== "javascript")
    ) {
      return;
    }

    if (runState === "running") return;

    setRunState("running");
    setRunStdout("");
    setRunStderr("");
    setRunError("");
    setRunExitCode(null);

    try {
      const response = await fetch("/api/run-code", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          language: active.language,
          code: active.code,
        }),
      });

      const data = (await response.json()) as {
        stdout?: string;
        stderr?: string;
        exitCode?: number;
        remaining?: number;
        error?: string;
      };

      if (!response.ok) {
        setRunError(data.error || "Code could not be run.");
        setRunState("error");
        return;
      }

      setRunStdout(data.stdout ?? "");
      setRunStderr(data.stderr ?? "");
      setRunExitCode(typeof data.exitCode === "number" ? data.exitCode : null);
      setRunRemaining(typeof data.remaining === "number" ? data.remaining : null);
      setRunState("done");
    } catch {
      setRunError("The secure runner could not be reached. Try again.");
      setRunState("error");
    }
  }

  function changeLanguage(language: ProjectLanguage) {
    if (!active || language === active.language) return;

    if (language === "web") {
      const files = { ...webProjectStarter };

      if (active.language === "html") files.html = active.code;
      if (active.language === "css") files.css = active.code;
      if (active.language === "javascript") files.javascript = active.code;

      setActiveWebFile(
        active.language === "html" ||
          active.language === "css" ||
          active.language === "javascript"
          ? active.language
          : "html",
      );
      updateActive({ language, code: encodeWebProject(files) });
      return;
    }

    if (active.language === "web") {
      const files = decodeWebProject(active.code);
      const nextCode =
        language === "html" || language === "css" || language === "javascript"
          ? files[language]
          : starterCode.python;

      if (
        !window.confirm(
          `Switch to ${languageLabels[language]}? This changes the project back to one file.`,
        )
      ) {
        return;
      }

      updateActive({ language, code: nextCode });
      return;
    }

    const shouldReplace =
      !active.code.trim() ||
      Object.values(starterCode).some((sample) => sample === active.code);

    updateActive({
      language,
      code: shouldReplace ? starterCode[language] : active.code,
    });
  }

  return (
    <div className="project-workspace">
      <aside className="project-sidebar">
        <div className="project-sidebar-heading">
          <div>
            <p className="eyebrow">Cloud workspace</p>
            <h1>My Projects</h1>
            <small>{projects.length} / {MAX_SAVED_PROJECTS} saved</small>
          </div>
          <div className="project-new-wrap">
            <button
              className="project-new-button"
              type="button"
              onClick={() => setNewProjectMenuOpen((current) => !current)}
              disabled={
                creating || Boolean(deletingId) || projects.length >= MAX_SAVED_PROJECTS
              }
              aria-expanded={newProjectMenuOpen}
              aria-haspopup="menu"
              title={
                projects.length >= MAX_SAVED_PROJECTS
                  ? `Project limit reached (${MAX_SAVED_PROJECTS})`
                  : "Create project"
              }
            >
              {creating ? "…" : "+"}
            </button>
            {newProjectMenuOpen && (
              <div className="project-new-menu" role="menu">
                {(Object.keys(starterCode) as ProjectLanguage[]).map((language) => (
                  <button
                    type="button"
                    role="menuitem"
                    key={language}
                    onClick={() => void createProject(language)}
                  >
                    <span aria-hidden="true">{languageIcons[language]}</span>
                    <span>
                      <strong>{languageLabels[language]}</strong>
                      <small>{fileNames[language]}</small>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {projects.length > 0 && (
          <label className="project-search">
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={projectSearch}
              onChange={(event) => setProjectSearch(event.target.value)}
              placeholder="Search projects"
            />
          </label>
        )}

        <div className="project-list">
          {visibleProjects.length ? (
            visibleProjects.map((project) => (
              <button
                type="button"
                key={project.id}
                className={`project-list-item ${activeId === project.id ? "is-active" : ""}`}
                onClick={() => {
                  if (active) flushProjectSave(active.id);
                  setActiveId(project.id);
                  setMessage("");
                  resetRunResult();
                }}
              >
                <strong>{project.title}</strong>
                <span>{fileNames[project.language]}</span>
              </button>
            ))
          ) : (
            <div className="project-empty-mini">
              <span>🗂️</span>
              <p>
                {projects.length
                  ? "No projects match that search."
                  : "No saved projects yet."}
              </p>
            </div>
          )}
        </div>
      </aside>

      <section className="project-editor-shell">
        {active ? (
          <>
            <div className="project-editor-toolbar">
              <input
                className="project-title-input"
                value={active.title}
                maxLength={80}
                aria-label="Project title"
                onChange={(event) => updateActive({ title: event.target.value })}
                onBlur={() => flushProjectSave(active.id)}
                onKeyDown={handleSaveShortcut}
                disabled={activeDeleting}
              />

              <div className="project-toolbar-actions">
                <button
                  className="project-save-button"
                  type="button"
                  onClick={saveActiveNow}
                  disabled={
                    activeDeleting ||
                    saveState === "saved" ||
                    saveState === "saving"
                  }
                >
                  {saveState === "error"
                    ? "Retry save"
                    : saveState === "saving"
                      ? "Saving…"
                      : "Save"}
                </button>
                {(active.language === "python" || active.language === "javascript") && (
                  <button
                    className="project-run-button"
                    type="button"
                    onClick={runCode}
                    disabled={
                      activeDeleting || runState === "running" || !active.code.trim()
                    }
                  >
                    {runState === "running" ? "Running…" : "▶ Run"}
                  </button>
                )}
                <select
                  aria-label="Project language"
                  value={active.language}
                  onChange={(event) =>
                    changeLanguage(event.target.value as ProjectLanguage)
                  }
                  disabled={activeDeleting}
                >
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="javascript">JavaScript</option>
                  <option value="web">Web App · 3 files</option>
                </select>
                <button
                  className="project-utility-button"
                  type="button"
                  onClick={() => void duplicateProject()}
                  disabled={
                    duplicating ||
                    Boolean(deletingId) ||
                    projects.length >= MAX_SAVED_PROJECTS
                  }
                >
                  {duplicating ? "Duplicating…" : "Duplicate"}
                </button>
                <button
                  className="project-utility-button"
                  type="button"
                  onClick={exportProject}
                >
                  Export
                </button>
                <button
                  className="project-delete-button"
                  type="button"
                  onClick={() => deleteProject(active.id)}
                  disabled={Boolean(deletingId)}
                >
                  {deletingId === active.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>

            <div className="project-save-row" aria-live="polite">
              <span>
                {active.language === "web"
                  ? `Web App · ${activeEditorName}`
                  : fileNames[active.language]}
              </span>
              <strong className={`save-state save-state--${saveState}`}>
                {saveState === "saved" && "Saved"}
                {saveState === "unsaved" && "Unsaved changes"}
                {saveState === "saving" && "Saving…"}
                {saveState === "error" && "Save failed"}
              </strong>
            </div>

            <div className="project-code-editor">
              <div className="editor-bar">
                <span /><span /><span />
                <strong>{activeEditorName}</strong>
              </div>

              {active.language === "web" && (
                <div className="project-file-tabs" role="tablist" aria-label="Web App files">
                  {(Object.keys(webFileNames) as WebProjectFile[]).map((file) => (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeWebFile === file}
                      className={activeWebFile === file ? "is-active" : ""}
                      key={file}
                      onClick={() => setActiveWebFile(file)}
                      disabled={activeDeleting}
                    >
                      <strong>{webFileLabels[file]}</strong>
                      <small>{webFileNames[file]}</small>
                    </button>
                  ))}
                </div>
              )}

              <CodeEditor
                value={activeEditorValue}
                ariaLabel={
                  active.language === "web"
                    ? `${activeEditorName} code`
                    : "Project code"
                }
                fileName={activeEditorName}
                language={
                  active.language === "web"
                    ? activeWebFile
                    : active.language
                }
                maxLength={MAX_PROJECT_CODE_LENGTH}
                onChange={(value) =>
                  active.language === "web"
                    ? updateWebFile(activeWebFile, value)
                    : updateActive({ code: value })
                }
                onBlur={() => flushProjectSave(active.id)}
                onSave={saveActiveNow}
                onReset={resetActiveEditor}
                canReset={
                  activeEditorValue !==
                  (active.language === "web"
                    ? webProjectStarter[activeWebFile]
                    : starterCode[active.language])
                }
                disabled={activeDeleting}
              />
            </div>

            <div className="project-editor-footer">
              <span>
                {active.language === "web"
                  ? `${activeEditorValue.length.toLocaleString()} in ${activeEditorName} · ${active.code.length.toLocaleString()} / ${MAX_PROJECT_CODE_LENGTH.toLocaleString()} total`
                  : `${active.code.length.toLocaleString()} / ${MAX_PROJECT_CODE_LENGTH.toLocaleString()} characters`}
              </span>
              <span>
                Saved privately to your CodeTrail account · Ctrl/Cmd + S saves now.
              </span>
            </div>

            {(active.language === "python" || active.language === "javascript") && (
              <section className="project-output-panel" aria-live="polite">
                <div className="project-output-heading">
                  <strong>Output</strong>
                  <span>
                    {runRemaining !== null
                      ? `${runRemaining} secure runs left this hour`
                      : "Isolated sandbox · network disabled"}
                  </span>
                </div>
                {runState === "idle" && (
                  <p className="project-output-placeholder">
                    Run your code to see printed output and errors here.
                  </p>
                )}
                {runState === "running" && (
                  <p className="project-output-placeholder">Starting a secure sandbox…</p>
                )}
                {runState === "error" && (
                  <p className="project-output-error">{runError}</p>
                )}
                {runState === "done" && (
                  <div className="project-output-results">
                    <div
                      className={`project-run-status ${runExitCode === 0 ? "is-success" : "is-error"}`}
                    >
                      <strong>
                        {runExitCode === 0 ? "✓ Finished successfully" : "⚠ Run finished with errors"}
                      </strong>
                      <span>Exit code {runExitCode ?? "unknown"}</span>
                    </div>

                    {runStdout.trim() && (
                      <div className="project-output-stream">
                        <span className="project-output-label">Program output</span>
                        <pre className="project-output-terminal">{runStdout}</pre>
                      </div>
                    )}

                    {runStderr.trim() && (
                      <div className="project-output-stream project-output-stream--error">
                        <span className="project-output-label">Errors</span>
                        <pre className="project-output-terminal project-output-terminal--error">
                          {runStderr}
                        </pre>
                      </div>
                    )}

                    {!runStdout.trim() && !runStderr.trim() && (
                      <p className="project-output-placeholder">
                        Program finished with no printed output.
                      </p>
                    )}
                  </div>
                )}
              </section>
            )}

            {(active.language === "html" ||
              active.language === "css" ||
              active.language === "web") && (
              <section className="project-preview-panel">
                <div className="project-output-heading">
                  <strong>Live preview</strong>
                  <span>
                    {active.language === "web"
                      ? "JavaScript runs in an isolated preview · network blocked"
                      : "Scripts and network requests are blocked"}
                  </span>
                </div>
                <iframe
                  className="project-preview-frame"
                  title={`${active.title} preview`}
                  sandbox={active.language === "web" ? "allow-scripts" : ""}
                  srcDoc={previewDocument}
                />
              </section>
            )}

            {message && <p className="form-message" aria-live="polite">{message}</p>}
          </>
        ) : (
          <div className="project-empty">
            <span>💻</span>
            <h2>Start your first coding project.</h2>
            <p>Create a private workspace and keep your code saved across devices.</p>
            <div className="project-empty-actions">
              {(Object.keys(starterCode) as ProjectLanguage[]).map((language) => (
                <button
                  className="secondary-button"
                  type="button"
                  key={language}
                  onClick={() => void createProject(language)}
                  disabled={creating}
                >
                  {languageIcons[language]} {languageLabels[language]}
                </button>
              ))}
            </div>
            {message && <p className="form-message" aria-live="polite">{message}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
