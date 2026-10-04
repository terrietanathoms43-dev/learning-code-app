drop policy if exists "users can read own code run metadata" on public.code_run_events;
create policy "users can read own code run metadata"
on public.code_run_events
for select
to authenticated
using ((select auth.uid()) = user_id);

revoke all privileges on table public.code_run_events from anon, authenticated;
revoke all privileges on sequence public.code_run_events_id_seq from anon, authenticated;
