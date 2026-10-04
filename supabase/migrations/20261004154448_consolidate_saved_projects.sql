do $$
begin
  if to_regclass('public.coding_projects') is not null then
    execute '
      insert into public.saved_projects (id, user_id, title, language, code, created_at, updated_at)
      select id, user_id, title, language, code, created_at, updated_at
      from public.coding_projects
      on conflict (id) do nothing
    ';
  end if;
end
$$;

drop table if exists public.coding_projects;

drop policy if exists "users can create own saved projects" on public.saved_projects;
create policy "users can create own saved projects"
on public.saved_projects
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "users can update own saved projects" on public.saved_projects;
create policy "users can update own saved projects"
on public.saved_projects
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "users can delete own saved projects" on public.saved_projects;
create policy "users can delete own saved projects"
on public.saved_projects
for delete
to authenticated
using ((select auth.uid()) = user_id);

revoke all privileges on table public.saved_projects from anon, authenticated;
grant select, insert, update, delete on table public.saved_projects to authenticated;
