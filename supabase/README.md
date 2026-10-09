# Skema Supabase — SnapCal AI

Skema produksi (Postgres) untuk menggantikan lapisan SQLite saat aplikasi
dipasang di Netlify + Supabase.

- Proyek: `tahnkykyvfshcglwbzui`
- URL: `https://tahnkykyvfshcglwbzui.supabase.co`

## Migrasi

| Berkas | Isi |
| --- | --- |
| `migrations/20261009000000_init_snapcal_schema.sql` | 11 tabel, index FK, trigger, RLS, grant |
| `migrations/20261009000100_harden_trigger_functions.sql` | perbaikan keamanan fungsi trigger |

Sudah diterapkan ke proyek.

Untuk menerapkan ulang di proyek lain, gunakan Supabase CLI:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

atau MCP Supabase (`apply_migration`) dengan isi berkas migrasi.

## Tabel

**Katalog (hanya-baca untuk klien):**
`food_items`, `app_screens`, `plan_tiers`

**Milik pengguna (RLS `auth.uid() = user_id`):**
`user_profiles`, `consents`, `meals`, `meal_items`,
`portion_recommendations`, `body_metrics`, `activities`, `subscriptions`

## Keamanan

- RLS aktif di seluruh tabel.
- `meal_items` mewarisi kepemilikan dari `meals` (policy via subquery).
- Katalog diberi `select` saja; penulisan hanya lewat service role.
- Profil otomatis dibuat saat pengguna baru mendaftar (trigger
  `on_auth_user_created` -> `handle_new_user`).
- `updated_at` diperbarui otomatis lewat trigger.
- Status security advisor: bersih, kecuali `rls_auto_enable()` (fungsi bawaan
  platform Supabase, owner `postgres`) — diabaikan dengan sadar.

## Environment variable aplikasi (langkah berikutnya)

```
NEXT_PUBLIC_SUPABASE_URL=https://tahnkykyvfshcglwbzui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable/anon key>
SUPABASE_SERVICE_ROLE_KEY=<rahasia; hanya di server>
```

## Catatan integrasi

Aplikasi mockup saat ini masih memakai `better-sqlite3` (lokal). Langkah
berikutnya: ganti `lib/db.ts` agar memakai `@supabase/supabase-js`, tambahkan
Supabase Auth, lalu pindahkan data seed katalog ke tabel Supabase.
