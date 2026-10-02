alter default privileges for role postgres in schema public
  revoke select, insert, update, delete, truncate, references, trigger on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke usage, select, update on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public;

revoke all privileges on table
  public.courses,
  public.units,
  public.lessons,
  public.exercises,
  public.profiles,
  public.user_lesson_progress,
  public.exercise_attempts,
  public.xp_events,
  public.ai_tutor_events
from anon, authenticated;

grant select on table
  public.courses,
  public.units,
  public.lessons,
  public.exercises
to anon, authenticated;

grant select on table
  public.profiles,
  public.user_lesson_progress,
  public.xp_events
to authenticated;

grant update (display_name, daily_goal_xp, time_zone)
on table public.profiles
to authenticated;

create or replace function public.get_learning_stats()
returns table (
  total_xp bigint,
  today_xp bigint,
  streak integer
)
language sql
stable
security invoker
set search_path = public
as $$
  with params as (
    select coalesce(
      (
        select p.time_zone
        from public.profiles p
        where p.id = (select auth.uid())
      ),
      'UTC'
    ) as time_zone
  ),
  events as (
    select
      x.amount,
      (x.created_at at time zone params.time_zone)::date as activity_date
    from public.xp_events x
    cross join params
    where x.user_id = (select auth.uid())
  ),
  active_days as (
    select distinct activity_date
    from events
  ),
  today_value as (
    select (now() at time zone params.time_zone)::date as today
    from params
  ),
  anchor as (
    select
      case
        when exists (
          select 1 from active_days d where d.activity_date = today_value.today
        ) then today_value.today
        when exists (
          select 1 from active_days d where d.activity_date = today_value.today - 1
        ) then today_value.today - 1
        else null::date
      end as anchor_day
    from today_value
  ),
  ordered_days as (
    select
      d.activity_date,
      row_number() over (order by d.activity_date desc)::integer as row_number
    from active_days d
    cross join anchor a
    where a.anchor_day is not null
      and d.activity_date <= a.anchor_day
  )
  select
    coalesce((select sum(e.amount)::bigint from events e), 0::bigint) as total_xp,
    coalesce((
      select sum(e.amount)::bigint
      from events e
      cross join today_value t
      where e.activity_date = t.today
    ), 0::bigint) as today_xp,
    coalesce((
      select count(*)::integer
      from ordered_days d
      cross join anchor a
      where d.activity_date = a.anchor_day - (d.row_number - 1)
    ), 0) as streak;
$$;

revoke all on function public.get_learning_stats() from public, anon;
grant execute on function public.get_learning_stats() to authenticated;
