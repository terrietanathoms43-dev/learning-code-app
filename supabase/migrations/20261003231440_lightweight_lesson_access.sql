drop function if exists public.get_learning_dashboard_payload();

create or replace function public.can_access_lesson(p_slug text)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  with target_lesson as (
    select id, sort_order
    from public.lessons
    where slug = p_slug
      and is_published = true
    limit 1
  ),
  previous_lesson as (
    select id
    from public.lessons
    where is_published = true
      and sort_order < (select sort_order from target_lesson)
    order by sort_order desc
    limit 1
  )
  select coalesce(
    auth.uid() is not null
    and exists (select 1 from target_lesson)
    and (
      not exists (select 1 from previous_lesson)
      or exists (
        select 1
        from public.user_lesson_progress p
        where p.user_id = auth.uid()
          and p.lesson_id = (select id from target_lesson)
          and p.status = 'completed'
      )
      or exists (
        select 1
        from public.user_lesson_progress p
        where p.user_id = auth.uid()
          and p.lesson_id = (select id from previous_lesson)
          and p.status = 'completed'
      )
    ),
    false
  );
$$;

revoke all on function public.can_access_lesson(text) from public, anon;
grant execute on function public.can_access_lesson(text) to authenticated;
