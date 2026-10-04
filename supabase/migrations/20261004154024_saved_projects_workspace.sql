create table if not exists public.saved_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Untitled project',
  language text not null default 'python',
  code text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saved_projects_title_check
    check (char_length(btrim(title)) between 1 and 80),
  constraint saved_projects_language_check
    check (language in ('python')),
  constraint saved_projects_code_length_check
    check (char_length(code) <= 20000)
);

create index if not exists saved_projects_user_updated_idx
  on public.saved_projects(user_id, updated_at desc);

alter table public.saved_projects enable row level security;

drop policy if exists "users can read own saved projects" on public.saved_projects;
create policy "users can read own saved projects"
  on public.saved_projects
  for select
  to authenticated
  using (user_id = (select auth.uid()));

revoke all privileges on table public.saved_projects from anon, authenticated;
grant select on table public.saved_projects to authenticated;

alter default privileges for role postgres in schema public
  revoke insert, update, delete on tables from authenticated;
