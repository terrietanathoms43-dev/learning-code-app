create unique index if not exists profiles_username_lower_unique
  on public.profiles ((lower(username)))
  where username is not null;

alter table public.profiles
  drop constraint if exists profiles_username_key;

alter table public.profiles
  drop constraint if exists profiles_username_format_check;

alter table public.profiles
  add constraint profiles_username_format_check
  check (
    username is null
    or (
      username = lower(username)
      and username ~ '^[a-z0-9][a-z0-9_]{2,19}$'
      and username not in (
        'admin','administrator','codetrail','help','moderator',
        'root','security','staff','support','system'
      )
    )
  );
