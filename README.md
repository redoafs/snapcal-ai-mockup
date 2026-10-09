# SnapCal AI — UI/UX Mockup

Mockup antarmuka **SnapCal AI**, sebuah aplikasi pendamping kesehatan
metabolik. Repositori ini berisi aplikasi mockup berbasis web yang
menampilkan alur inti produk sesuai PRD SnapCal AI.

> Aplikasi ini **bukan alat diagnosis medis**. Seluruh angka klinis dan
> finansial di dalamnya adalah **data contoh** untuk keperluan validasi
> rancangan, belum divalidasi secara empiris.

## Teknologi

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS 3**
- **Supabase (Postgres)** — sumber data aplikasi, diakses dengan
  `@supabase/supabase-js` (kunci publishable/anon, RLS aktif)
- Launcher Windows (VBS/PowerShell) untuk menjalankan sebagai aplikasi jendela

## Menjalankan

Siapkan variabel lingkungan (lihat `.env.example`, salin ke `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://<proyek>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable/anon key>
SUPABASE_DEMO_EMAIL=redo@snapcal.ai
SUPABASE_DEMO_PASSWORD=snapcal-demo-2026
```

```bash
npm install          # pasang dependensi
npm run db:check     # uji login akun demo + hitung baris tiap tabel
npm run dev          # mode pengembangan -> http://localhost:3000
```

Versi produksi:

```bash
npm run build
npm run start -- -H 127.0.0.1 -p 3000
```

### Menjalankan sebagai aplikasi (Windows)

- `SnapCal AI.vbs` — menyalakan server di background lalu membuka jendela
  aplikasi (tanpa menu browser).
- `Hentikan SnapCal AI.vbs` — menghentikan server background.
- `scripts/buat-shortcut.ps1` — membuat shortcut Desktop dan Start Menu.

Panduan lengkap: lihat `CARA_PAKAI_APLIKASI.md`.

## Basis data (Supabase)

Seluruh data mockup berada di **Supabase** dan dikelola lewat migrasi di
`supabase/migrations/`:

| Objek | Isi |
| --- | --- |
| `food_items`, `app_screens`, `plan_tiers` | katalog (makanan, layar, paket) |
| `user_profiles`, `consents`, `meals`, `meal_items`, `portion_recommendations`, `body_metrics`, `activities`, `subscriptions` | data pengguna |
| `purchases`, `token_ledger` (+ view `token_balances`) | pembelian & token scan |

Aplikasi masuk sebagai **akun demo** (`redo@snapcal.ai`) memakai kunci
publishable/anon, sehingga RLS tetap menjaga isolasi data per pengguna.

## Versi Pro, token, dan pembayaran (Lynk.id)

Paket Pro dijual lewat **Lynk.id**. Layar **Pilih paket** menampilkan tiga paket
Pro (Bulanan/Tahunan/Lifetime) dengan tombol checkout ke Lynk.id.

Atur tautannya lewat environment variable (lihat `.env.example`):

```
NEXT_PUBLIC_LYNK_URL=https://lynk.id/snapcal-ai/vrgg5vo5dxwz/checkout
# opsional, bila tiap paket punya produk Lynk.id sendiri:
NEXT_PUBLIC_LYNK_PRO_MONTHLY=...
NEXT_PUBLIC_LYNK_PRO_YEARLY=...
NEXT_PUBLIC_LYNK_PRO_LIFETIME=...
```

Setiap pembayaran yang tercatat memberi **50 token scan** ke email pembeli
(1 token = 1 scan AI). Alur otomatis Lynk.id → Google Sheet → Supabase
dijelaskan di `docs/PANDUAN_TOKEN_LYNKID.md` (termasuk Apps Script
`integrations/lynk-webhook.gs`).

## Struktur proyek

```
app/                 # Halaman utama (App Router) + gaya global
components/          # Komponen UI dan layar mockup per alur
  screens/           # onboarding, scan, dashboard, other
lib/db.ts            # Klien Supabase + pengambilan data aplikasi
lib/database.types.ts# Tipe hasil generate dari skema Supabase
supabase/migrations/ # Skema + seed data (katalog & akun demo)
scripts/check-supabase.mjs # Uji koneksi/login Supabase
scripts/capture.mjs  # Tangkapan layar otomatis (Playwright)
scripts/*.ps1        # Launcher aplikasi Windows
integrations/        # Apps Script webhook Lynk.id
assets/              # Ikon aplikasi
```

## Keterlacakan requirement

Setiap layar mockup diberi label kode **FR** yang merujuk PRD, mis.
`FR-001` (registrasi) sampai `FR-048` (penghapusan akun). Daftar lengkap
layar tersimpan pada tabel `app_screens` di Supabase dan ditampilkan di
halaman utama.

## Catatan

- Semua akses data memakai `@supabase/supabase-js`; tidak ada lagi basis data
  lokal. Jalankan `npm run db:check` untuk memastikan koneksi & data sesuai.
- Kunci publishable/anon aman untuk klien; RLS membatasi akses per pengguna.
