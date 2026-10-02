update public.exercise_attempts
set submitted_answer = '{}'::jsonb
where submitted_answer <> '{}'::jsonb;

alter table public.exercise_attempts
  alter column submitted_answer set default '{}'::jsonb;
