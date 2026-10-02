revoke update (display_name, daily_goal_xp, time_zone)
on table public.profiles
from authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_display_name_length_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_display_name_length_check
      check (char_length(btrim(display_name)) between 2 and 40);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_daily_goal_xp_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_daily_goal_xp_check
      check (daily_goal_xp in (20, 30, 50, 75, 100));
  end if;
end
$$;
