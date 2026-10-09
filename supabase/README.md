# Skema Supabase — SnapCal AI

Skema produksi (Postgres) untuk aplikasi SnapCal AI. Aplikasi mockup mengakses
data ini lewat `@supabase/supabase-js` (tidak ada lagi basis data SQLite lokal).

- Proyek: `tahnkykyvfshcglwbzui`
- URL: `https://tahnkykyvfshcglwbzui.supabase.co`

## Migrasi

| Berkas | Isi |
| --- | --- |
| `migrations/20261009000000_init_snapcal_schema.sql` | 11 tabel inti, index FK, trigger, RLS, grant |
| `migrations/20261009000100_harden_trigger_functions.sql` | perbaikan keamanan fungsi trigger |
| `migrations/20261009000200_add_tokens_and_purchases.sql` | `purchases`, `token_ledger`, view `token_balances`, trigger token |
| `migrations/20261009000300_seed_demo_data.sql` | akun demo + seed data (katalog & pengguna contoh) |

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

## Environment variable aplikasi

```
NEXT_PUBLIC_SUPABASE_URL=https://tahnkykyvfshcglwbzui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable/anon key>
SUPABASE_DEMO_EMAIL=redo@snapcal.ai
SUPABASE_DEMO_PASSWORD=snapcal-demo-2026
SUPABASE_SERVICE_ROLE_KEY=<rahasia; hanya untuk webhook/aktivasi di server>
```

## Catatan integrasi

Aplikasi memakai `lib/db.ts` (klien `@supabase/supabase-js`) yang masuk sebagai
**akun demo** memakai kunci publishable/anon, sehingga RLS tetap aktif dan hanya
data milik akun demo yang terbaca. Jalankan `npm run db:check` untuk menguji
login + menghitung baris tiap tabel. Akun demo dibuat oleh migrasi seed
(`20261009000300_seed_demo_data.sql`).
