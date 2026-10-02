alter table public.profiles
  drop constraint if exists profiles_daily_goal_xp_check;

alter table public.profiles
  add constraint profiles_daily_goal_xp_check
  check (daily_goal_xp in (20, 30, 50, 75, 100));
