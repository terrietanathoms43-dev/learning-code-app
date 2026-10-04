export const projectLanguages = ["python", "html", "css", "javascript"] as const;

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
  return value.length > 20000 ? "Projects can contain at most 20,000 characters." : null;
}
