"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectLanguage } from "@/lib/project-validation";

export type SavedProject = {
  id: string;
  title: string;
  language: ProjectLanguage;
  code: string;
  created_at: string;
  updated_at: string;
};

const starterCode: Record<ProjectLanguage, string> = {
  python: 'print("Hello, CodeTrail!")',
  html: "<h1>Hello, CodeTrail!</h1>",
  css: "body {\n  font-family: sans-serif;\n}",
  javascript: 'console.log("Hello, CodeTrail!");',
};

const fileNames: Record<ProjectLanguage, string> = {
  python: "main.py",
  html: "index.html",
  css: "styles.css",
  javascript: "script.js",
};

export function ProjectWorkspace({
  initialProjects,
}: {
  initialProjects: SavedProject[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [activeId, setActiveId] = useState(initialProjects[0]?.id ?? null);
  const [saveState, setSaveState] = useState<"saved" | "unsaved" | "saving" | "error">("saved");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const active = useMemo(
    () => projects.find((project) => project.id === activeId) ?? null,
    [activeId, projects],
  );

  useEffect(() => {
    if (!active || saveState !== "unsaved") return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSaveState("saving");

      try {
        const response = await fetch(`/api/projects/${active.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            title: active.title,
            language: active.language,
            code: active.code,
          }),
          signal: controller.signal,
        });

        const data = (await response.json()) as {
          project?: SavedProject;
          error?: string;
        };

        if (!response.ok || !data.project) {
          setMessage(data.error || "Project could not be saved.");
          setSaveState("error");
          return;
        }

        setProjects((current) =>
          current.map((project) =>
            project.id === data.project?.id ? data.project : project,
          ),
        );
        setMessage("");
        setSaveState("saved");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMessage("Project could not be saved. Check your connection.");
        setSaveState("error");
      }
    }, 700);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [active, saveState]);

  function updateActive(changes: Partial<SavedProject>) {
    if (!activeId) return;
    setProjects((current) =>
      current.map((project) =>
        project.id === activeId ? { ...project, ...changes } : project,
      ),
    );
    setSaveState("unsaved");
    setMessage("");
  }

  async function createProject() {
    if (creating) return;
    setCreating(true);
    setMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "Untitled project",
          language: "python",
          code: starterCode.python,
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
      setSaveState("saved");
    } catch {
      setMessage("Project could not be created. Check your connection.");
    } finally {
      setCreating(false);
    }
  }

  async function deleteProject(id: string) {
    const project = projects.find((item) => item.id === id);
    if (!project) return;

    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) {
      return;
    }

    const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Project could not be deleted.");
      return;
    }

    const nextProjects = projects.filter((item) => item.id !== id);
    setProjects(nextProjects);
    setActiveId((current) =>
      current === id ? nextProjects[0]?.id ?? null : current,
    );
    setSaveState("saved");
  }

  function changeLanguage(language: ProjectLanguage) {
    if (!active) return;
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
          </div>
          <button
            className="project-new-button"
            type="button"
            onClick={createProject}
            disabled={creating}
          >
            {creating ? "…" : "+"}
          </button>
        </div>

        <div className="project-list">
          {projects.length ? (
            projects.map((project) => (
              <button
                type="button"
                key={project.id}
                className={`project-list-item ${activeId === project.id ? "is-active" : ""}`}
                onClick={() => {
                  setActiveId(project.id);
                  setSaveState("saved");
                  setMessage("");
                }}
              >
                <strong>{project.title}</strong>
                <span>{fileNames[project.language]}</span>
              </button>
            ))
          ) : (
            <div className="project-empty-mini">
              <span>🗂️</span>
              <p>No saved projects yet.</p>
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
              />

              <div className="project-toolbar-actions">
                <select
                  aria-label="Project language"
                  value={active.language}
                  onChange={(event) =>
                    changeLanguage(event.target.value as ProjectLanguage)
                  }
                >
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="javascript">JavaScript</option>
                </select>
                <button
                  className="project-delete-button"
                  type="button"
                  onClick={() => deleteProject(active.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="project-save-row" aria-live="polite">
              <span>{fileNames[active.language]}</span>
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
                <strong>{fileNames[active.language]}</strong>
              </div>
              <textarea
                value={active.code}
                aria-label="Project code"
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                onChange={(event) => updateActive({ code: event.target.value })}
              />
            </div>

            <div className="project-editor-footer">
              <span>{active.code.length.toLocaleString()} / 20,000 characters</span>
              <span>Saved privately to your CodeTrail account.</span>
            </div>
            {message && <p className="form-message" aria-live="polite">{message}</p>}
          </>
        ) : (
          <div className="project-empty">
            <span>💻</span>
            <h2>Start your first coding project.</h2>
            <p>Create a private workspace and keep your code saved across devices.</p>
            <button className="primary-button" type="button" onClick={createProject}>
              Create project
            </button>
            {message && <p className="form-message" aria-live="polite">{message}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
