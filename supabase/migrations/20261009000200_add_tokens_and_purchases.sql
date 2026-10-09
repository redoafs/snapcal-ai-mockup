-- Token scan + pencatatan pembelian (integrasi Lynk.id).
-- Alur: webhook Lynk.id -> (Apps Script) insert ke public.purchases ->
-- trigger purchases_grant_tokens menambah +tokens_granted ke public.token_ledger.
-- Saldo dihitung dari view public.token_balances.

create table if not exists public.purchases (
  id             bigint generated always as identity primary key,
  user_id        uuid references auth.users(id) on delete set null,
  email          text not null,
  name           text,
  phone          text,
  product        text,
  amount_idr     integer not null default 0,
  tokens_granted integer not null default 50,
  provider       text not null default 'lynk',
  provider_ref   text unique,
  status         text not null default 'paid'
                 check (status in ('paid','pending','refunded')),
  purchased_at   timestamptz not null default now(),
  created_at     timestamptz not null default now()
);
create index if not exists purchases_email_idx   on public.purchases (lower(email));
create index if not exists purchases_user_id_idx on public.purchases (user_id);

create table if not exists public.token_ledger (
  id           bigint generated always as identity primary key,
  user_id      uuid references auth.users(id) on delete set null,
  email        text not null,
  delta        integer not null,
  reason       text not null default 'purchase'
               check (reason in ('purchase','scan','bonus','adjustment','refund')),
  provider     text not null default 'lynk',
  provider_ref text,
  note         text,
  created_at   timestamptz not null default now(),
  constraint token_ledger_delta_nonzero check (delta <> 0)
);
create index if not exists token_ledger_email_idx   on public.token_ledger (lower(email));
create index if not exists token_ledger_user_id_idx on public.token_ledger (user_id);

create or replace view public.token_balances
with (security_invoker = true) as
select email,
       coalesce(sum(delta), 0)::integer as balance,
       max(created_at) as last_at
from public.token_ledger
group by email;

-- Saat pembelian tercatat: otomatis tambah token ke ledger.
create or replace function public.grant_tokens_on_purchase()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'paid' and new.tokens_granted <> 0 then
    insert into public.token_ledger (user_id, email, delta, reason, provider, provider_ref, note)
    values (new.user_id, new.email, new.tokens_granted, 'purchase', new.provider,
            new.provider_ref, 'Pembelian ' || coalesce(new.product, 'Pro'));
  end if;
  return new;
end;
$$;

drop trigger if exists purchases_grant_tokens on public.purchases;
create trigger purchases_grant_tokens
  after insert on public.purchases
  for each row execute function public.grant_tokens_on_purchase();

-- Saat pendaftaran: tautkan pembelian/token lama berdasarkan email.
create or replace function public.link_tokens_on_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.token_ledger set user_id = new.id
    where user_id is null and lower(email) = lower(new.email);
  update public.purchases set user_id = new.id
    where user_id is null and lower(email) = lower(new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_link_tokens on auth.users;
create trigger on_auth_user_link_tokens
  after insert on auth.users
  for each row execute function public.link_tokens_on_signup();

alter table public.purchases    enable row level security;
alter table public.token_ledger enable row level security;

create policy purchases_owner on public.purchases for select to authenticated
  using (user_id = auth.uid() or lower(email) = lower(coalesce(auth.jwt() ->> 'email','')));

create policy token_ledger_owner on public.token_ledger for select to authenticated
  using (user_id = auth.uid() or lower(email) = lower(coalesce(auth.jwt() ->> 'email','')));

grant select on public.purchases, public.token_ledger to authenticated;
grant select on public.token_balances to authenticated;

revoke all on function public.grant_tokens_on_purchase() from anon, authenticated, public;
revoke all on function public.link_tokens_on_signup() from anon, authenticated, public;
