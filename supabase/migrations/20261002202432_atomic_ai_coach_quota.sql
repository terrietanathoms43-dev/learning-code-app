create or replace function public.reserve_ai_tutor_usage(
  p_user_id uuid,
  p_lesson_slug text,
  p_exercise_key text,
  p_mode text,
  p_limit integer
)
returns table (
  event_id bigint,
  remaining integer
)
language plpgsql
volatile
security invoker
set search_path = public
as $$
declare
  usage_count integer;
  new_event_id bigint;
  bounded_limit integer := greatest(1, least(coalesce(p_limit, 20), 100));
begin
  if p_user_id is null then
    raise exception 'user id is required';
  end if;

  if p_mode not in ('hint', 'explain', 'example') then
    raise exception 'invalid coach mode';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  select count(*)::integer
  into usage_count
  from public.ai_tutor_events
  where user_id = p_user_id
    and created_at >= now() - interval '24 hours';

  if usage_count >= bounded_limit then
    return;
  end if;

  insert into public.ai_tutor_events (
    user_id,
    lesson_slug,
    exercise_key,
    mode
  )
  values (
    p_user_id,
    left(p_lesson_slug, 120),
    left(p_exercise_key, 120),
    p_mode
  )
  returning id into new_event_id;

  return query
  select new_event_id, greatest(0, bounded_limit - usage_count - 1);
end;
$$;

revoke all on function public.reserve_ai_tutor_usage(uuid, text, text, text, integer)
from public, anon, authenticated;
grant execute on function public.reserve_ai_tutor_usage(uuid, text, text, text, integer)
to service_role;
