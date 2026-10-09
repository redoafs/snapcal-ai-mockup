-- Perbaikan keamanan setelah init_snapcal_schema.
-- Menanggapi Supabase security advisor:
--   1) function_search_path_mutable       -> set search_path = ''
--   2) anon/authenticated SECURITY DEFINER -> cabut EXECUTE fungsi trigger
--
-- Catatan: warning `rls_auto_enable()` berasal dari fungsi bawaan platform
-- Supabase (owner postgres), bukan bagian dari skema SnapCal.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from anon, authenticated, public;
revoke all on function public.handle_new_user() from anon, authenticated, public;
