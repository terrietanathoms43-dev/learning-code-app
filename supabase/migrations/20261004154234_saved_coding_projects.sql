create table if not exists public.coding_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  language text not null default 'python',
  code text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint coding_projects_title_length_check
    check (char_length(btrim(title)) between 1 and 80),
  constraint coding_projects_code_length_check
    check (char_length(code) <= 20000),
  constraint coding_projects_language_check
    check (language in ('python', 'html', 'css', 'javascript'))
);

create index if not exists coding_projects_user_updated_idx
  on public.coding_projects (user_id, updated_at desc);

alter table public.coding_projects enable row level security;

drop policy if exists "users can view own projects" on public.coding_projects;
create policy "users can view own projects"
on public.coding_projects
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users can create own projects" on public.coding_projects;
create policy "users can create own projects"
on public.coding_projects
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "users can update own projects" on public.coding_projects;
create policy "users can update own projects"
on public.coding_projects
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "users can delete own projects" on public.coding_projects;
create policy "users can delete own projects"
on public.coding_projects
for delete
to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.coding_projects from anon, authenticated;
grant select, insert, update, delete on table public.coding_projects to authenticated;
