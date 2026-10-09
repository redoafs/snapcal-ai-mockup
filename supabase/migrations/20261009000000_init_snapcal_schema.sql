-- SnapCal AI — skema produksi untuk Supabase (Postgres)
-- Menggantikan SQLite (better-sqlite3) agar dapat berjalan di Netlify + Supabase.
--
-- Prinsip:
--   * Tabel milik pengguna memakai user_id uuid -> auth.users(id), dilindungi RLS.
--   * Tabel katalog (food_items, app_screens, plan_tiers) hanya-baca untuk klien.
--   * PK katalog: bigint generated always as identity (bukan serial).
--   * Waktu: timestamptz (timezone-aware). Uang: integer rupiah. Fitur: text[].
--   * Semua kolom foreign key diberi index.

-- ============================================================ KATALOG
create table if not exists public.food_items (
  id            bigint generated always as identity primary key,
  name          text not null,
  category      text not null,
  emoji         text not null default '',
  calories      numeric(7,2) not null,
  protein       numeric(6,2) not null default 0,
  carbs         numeric(6,2) not null default 0,
  fat           numeric(6,2) not null default 0,
  fiber         numeric(6,2) not null default 0,
  gi            integer,
  unit_label    text,
  default_grams numeric(7,2) default 100
);

create table if not exists public.app_screens (
  id           bigint generated always as identity primary key,
  slug         text not null unique,
  flow_id      text not null,
  flow_name    text not null,
  title        text not null,
  description  text not null,
  fr_refs      text[] not null default '{}',
  screen_order integer not null
);

create table if not exists public.plan_tiers (
  id          bigint generated always as identity primary key,
  code        text not null unique,
  name        text not null,
  price_idr   integer not null default 0,
  tagline     text not null,
  features    text[] not null default '{}',
  is_featured boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ============================================================ PROFIL & PERSETUJUAN
create table if not exists public.user_profiles (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  name                text not null,
  email               text not null,
  age                 integer,
  gender              text,
  height_cm           numeric(5,2),
  weight_kg           numeric(5,2),
  activity_level      text,
  goal                text,
  diet_pref           text,
  medical_note        text,
  metabolic_score     numeric(5,2),
  insulin_sensitivity text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists public.consents (
  id             bigint generated always as identity primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  policy_version text not null,
  granted_at     timestamptz not null default now(),
  revoked_at     timestamptz
);
create index if not exists consents_user_id_idx on public.consents (user_id);

-- ============================================================ JURNAL MAKANAN
create table if not exists public.meals (
  id               bigint generated always as identity primary key,
  user_id          uuid not null references auth.users(id) on delete cascade,
  logged_at        timestamptz not null default now(),
  meal_type        text not null,
  detection_source text not null default 'on_device',
  confidence       numeric(4,3),
  photo_label      text,
  note             text,
  created_at       timestamptz not null default now()
);
create index if not exists meals_user_id_logged_at_idx
  on public.meals (user_id, logged_at desc);

create table if not exists public.meal_items (
  id             bigint generated always as identity primary key,
  meal_id        bigint not null references public.meals(id) on delete cascade,
  food_id        bigint not null references public.food_items(id),
  portion_grams  numeric(7,2) not null,
  confidence     numeric(4,3),
  user_corrected boolean not null default false
);
create index if not exists meal_items_meal_id_idx on public.meal_items (meal_id);
create index if not exists meal_items_food_id_idx on public.meal_items (food_id);

create table if not exists public.portion_recommendations (
  id             bigint generated always as identity primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  session_type   text not null,
  target_grams   numeric(7,2) not null,
  calorie_target numeric(7,2) not null,
  rationale      text not null,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);
create index if not exists portion_recommendations_user_id_idx
  on public.portion_recommendations (user_id);

-- ============================================================ METRIK & AKTIVITAS
create table if not exists public.body_metrics (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  measured_on date not null,
  weight_kg   numeric(5,2) not null,
  waist_cm    numeric(5,2),
  created_at  timestamptz not null default now()
);
create index if not exists body_metrics_user_id_measured_on_idx
  on public.body_metrics (user_id, measured_on desc);

create table if not exists public.activities (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  logged_at     timestamptz not null default now(),
  activity_type text not null,
  duration_min  integer not null,
  intensity     text,
  created_at    timestamptz not null default now()
);
create index if not exists activities_user_id_logged_at_idx
  on public.activities (user_id, logged_at desc);

-- ============================================================ LANGGANAN (Lynk.id)
create table if not exists public.subscriptions (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  plan         text not null,
  status       text not null default 'pending',
  price_idr    integer not null default 0,
  renews_at    timestamptz,
  provider     text not null default 'lynk',
  provider_ref text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint subscriptions_status_check
    check (status in ('pending','active','expired','canceled'))
);
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create unique index if not exists subscriptions_provider_ref_idx
  on public.subscriptions (provider_ref) where provider_ref is not null;

-- ============================================================ updated_at otomatis
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ============================================================ profil otomatis saat daftar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (user_id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================ ROW LEVEL SECURITY
alter table public.user_profiles            enable row level security;
alter table public.consents                 enable row level security;
alter table public.meals                    enable row level security;
alter table public.meal_items               enable row level security;
alter table public.portion_recommendations  enable row level security;
alter table public.body_metrics             enable row level security;
alter table public.activities               enable row level security;
alter table public.subscriptions            enable row level security;
alter table public.food_items               enable row level security;
alter table public.app_screens              enable row level security;
alter table public.plan_tiers               enable row level security;

-- Data milik pengguna: hanya pemilik yang boleh akses.
create policy user_profiles_owner on public.user_profiles
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy consents_owner on public.consents
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy meals_owner on public.meals
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy portion_recommendations_owner on public.portion_recommendations
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy body_metrics_owner on public.body_metrics
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy activities_owner on public.activities
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy subscriptions_owner on public.subscriptions
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Item makanan mewarisi kepemilikan dari meal induknya.
create policy meal_items_owner on public.meal_items
  for all to authenticated
  using (
    exists (
      select 1 from public.meals m
      where m.id = meal_items.meal_id and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.meals m
      where m.id = meal_items.meal_id and m.user_id = auth.uid()
    )
  );

-- Katalog: hanya-baca untuk klien (penulisan lewat service role / admin).
create policy plan_tiers_read on public.plan_tiers
  for select to anon, authenticated using (true);

create policy food_items_read on public.food_items
  for select to authenticated using (true);

create policy app_screens_read on public.app_screens
  for select to authenticated using (true);

-- ============================================================ HAK AKSES
grant usage on schema public to anon, authenticated;

grant select on public.plan_tiers to anon, authenticated;
grant select on public.food_items to authenticated;
grant select on public.app_screens to authenticated;

grant select, insert, update, delete on
  public.user_profiles,
  public.consents,
  public.meals,
  public.meal_items,
  public.portion_recommendations,
  public.body_metrics,
  public.activities,
  public.subscriptions
  to authenticated;

grant usage, select on all sequences in schema public to authenticated;
