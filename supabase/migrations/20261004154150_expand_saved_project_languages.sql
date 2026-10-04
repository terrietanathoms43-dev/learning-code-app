alter table public.saved_projects
  drop constraint if exists saved_projects_language_check;

alter table public.saved_projects
  add constraint saved_projects_language_check
  check (language in ('python', 'html', 'css', 'javascript'));
