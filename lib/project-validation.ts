export const projectLanguages = ["python", "html", "css", "javascript", "web"] as const;
export const MAX_SAVED_PROJECTS = 25;
export const MAX_PROJECT_CODE_LENGTH = 20_000;

export type ProjectLanguage = (typeof projectLanguages)[number];

export function normalizeProjectTitle(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function getProjectTitleError(value: string) {
  const title = normalizeProjectTitle(value);
  if (!title) return "Give your project a title.";
  if (title.length > 80) return "Project titles can be at most 80 characters.";
  return null;
}

export function isProjectLanguage(value: string): value is ProjectLanguage {
  return projectLanguages.includes(value as ProjectLanguage);
}

export function getProjectCodeError(value: string) {
  return value.length > MAX_PROJECT_CODE_LENGTH
    ? `Projects can contain at most ${MAX_PROJECT_CODE_LENGTH.toLocaleString()} characters.`
    : null;
}
