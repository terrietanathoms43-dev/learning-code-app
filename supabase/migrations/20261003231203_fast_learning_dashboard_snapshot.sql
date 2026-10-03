create or replace function public.get_learning_dashboard_snapshot()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'profile',
      coalesce(
        (
          select jsonb_build_object(
            'display_name', p.display_name,
            'username', p.username,
            'daily_goal_xp', p.daily_goal_xp,
            'time_zone', p.time_zone
          )
          from public.profiles p
          where p.id = (select auth.uid())
        ),
        jsonb_build_object(
          'display_name', 'Coder',
          'username', null,
          'daily_goal_xp', 50,
          'time_zone', 'UTC'
        )
      ),
    'stats',
      coalesce(
        (
          select to_jsonb(s)
          from public.get_learning_stats() s
        ),
        jsonb_build_object(
          'total_xp', 0,
          'today_xp', 0,
          'streak', 0
        )
      ),
    'published_lessons',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'id', l.id,
              'slug', l.slug,
              'title', l.title,
              'sort_order', l.sort_order
            )
            order by l.sort_order
          )
          from public.lessons l
          where l.is_published = true
        ),
        '[]'::jsonb
      ),
    'progress',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'lesson_id', p.lesson_id,
              'status', p.status,
              'completed_at', p.completed_at,
              'slug', l.slug,
              'title', l.title
            )
            order by l.sort_order
          )
          from public.user_lesson_progress p
          join public.lessons l on l.id = p.lesson_id
          where p.user_id = (select auth.uid())
        ),
        '[]'::jsonb
      ),
    'recent_events',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'amount', r.amount,
              'created_at', r.created_at,
              'lesson_id', r.lesson_id,
              'slug', r.slug,
              'title', r.title
            )
            order by r.created_at desc
          )
          from (
            select
              x.amount,
              x.created_at,
              x.lesson_id,
              l.slug,
              l.title
            from public.xp_events x
            left join public.lessons l on l.id = x.lesson_id
            where x.user_id = (select auth.uid())
            order by x.created_at desc
            limit 10
          ) r
        ),
        '[]'::jsonb
      )
  );
$$;

revoke all on function public.get_learning_dashboard_snapshot() from public, anon;
grant execute on function public.get_learning_dashboard_snapshot() to authenticated;
