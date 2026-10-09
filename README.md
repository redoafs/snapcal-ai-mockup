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
- **Supabase (Postgres)** — sumber data + **autentikasi** aplikasi, diakses
  dengan `@supabase/supabase-js` dan `@supabase/ssr` (kunci publishable/anon,
  RLS aktif, sesi berbasis cookie)
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

Akun demo di atas adalah **pengguna Supabase Auth asli** — pakai untuk masuk di
halaman `/login`. Halaman pembuka `/welcome` adalah titik masuk: dari sana Anda
bisa masuk atau mendaftar. Untuk mencoba halaman `/register`, buat akun baru
(data contoh + alur onboarding otomatis disiapkan, lihat bagian Autentikasi).

Versi produksi:

```bash
npm run build
npm run start -- -H 127.0.0.1 -p 3000
npm run auth:test    # uji alur login/keluar end-to-end (butuh server jalan)
```

### Menjalankan sebagai aplikasi (Windows)

- `SnapCal AI.vbs` — menyalakan server di background lalu membuka jendela
  aplikasi (tanpa menu browser).
- `Hentikan SnapCal AI.vbs` — menghentikan server background.
- `scripts/buat-shortcut.ps1` — membuat shortcut Desktop dan Start Menu.

Panduan lengkap: lihat `CARA_PAKAI_APLIKASI.md`.

## Autentikasi (login, daftar, keluar)

Aplikasi memakai **Supabase Auth** sungguhan dengan sesi berbasis cookie
(`@supabase/ssr`). Halaman utama `/` hanya bisa dibuka setelah masuk.

| Rute | Fungsi |
| --- | --- |
| `/welcome` | halaman pembuka publik (tombol **Mulai sekarang** & **Masuk**) |
| `/login` | masuk dengan email + kata sandi (ada tombol "Gunakan akun demo") |
| `/register` | buat akun baru (nama, email, kata sandi) |
| `/` | aplikasi: onboarding (bila belum lengkap) atau layar **Hari ini** |
| `/layar` | galeri semua layar mockup per alur (dokumentasi) |
| `/auth/signout` | keluar (POST dari tombol **Keluar**) |
| `/auth/confirm` | menerima tautan verifikasi email |

- **Proteksi rute**: `middleware.ts` mengalihkan pengunjung yang belum masuk ke
  `/welcome`, dan mengalihkan pengguna yang sudah masuk menjauh dari
  `/welcome`, `/login`, & `/register`.
- **Isolasi data**: RLS Supabase memakai `auth.uid()`, jadi tiap pengguna hanya
  membaca datanya sendiri.
- **Provisioning otomatis**: saat mendaftar, trigger `handle_new_user`
  menjalankan `public.provision_starter_data()` sehingga akun baru langsung
  punya profil, langganan **gratis**, consent, rekomendasi porsi, metrik,
  aktivitas, satu hari log makanan, dan **5 token** bonus selamat datang.
- **Onboarding**: akun yang belum mengisi tujuan (`goal` kosong) diarahkan ke
  alur onboarding (profil → data tubuh → tujuan → izin data → hasil pertama)
  sebelum masuk ke layar **Hari ini**. Hasilnya disimpan ke `user_profiles`
  lewat server action `app/actions.ts`. Untuk mencoba ulang, buka
  **Lainnya → Pengaturan → Ulangi onboarding (demo)**.
- **Konfirmasi email**: bila opsi "Confirm email" aktif di Supabase, pendaftar
  harus membuka tautan verifikasi sebelum bisa masuk. Untuk mempermudah uji
  coba, opsi ini bisa dimatikan di
  *Supabase Dashboard → Authentication → Sign In / Providers → Email*.

## Alur aplikasi (UI/UX menyatu)

Seluruh layar kini tersambung menjadi **satu aplikasi yang bisa dinavigasi**
(bukan lagi dinding galeri). Setelah masuk, aplikasi berjalan di dalam bingkai
ponsel dengan navigasi bawah: **Hari ini · Pindai · Porsi · Tren · Lainnya**.

```
/welcome ──Masuk──► /login ──► (onboarding bila perlu) ──► Hari ini
   │                                                        │
   └──Daftar──► /register                                   ├── Pindai → proses → review → simpan
                                                            ├── Porsi / Tren
                                                            └── Lainnya → Pengaturan · Laporan ·
                                                                        Coaching · Paket & token ·
                                                                        Privasi · Galeri · Keluar
```

- Tombol di dalam layar (mis. **+ Tambah catatan**, tombol rana kamera,
  **Setujui dan lanjutkan**) memindahkan layar secara nyata.
- Bilah kendali di atas ponsel menyediakan tombol **← Kembali** dan pintasan ke
  **Galeri** (`/layar`).
- Galeri `/layar` tetap memuat semua layar statis per alur untuk keperluan
  dokumentasi dan tangkapan layar.

## Basis data (Supabase)

Seluruh data mockup berada di **Supabase** dan dikelola lewat migrasi di
`supabase/migrations/`:

| Objek | Isi |
| --- | --- |
| `food_items`, `app_screens`, `plan_tiers` | katalog (makanan, layar, paket) |
| `user_profiles`, `consents`, `meals`, `meal_items`, `portion_recommendations`, `body_metrics`, `activities`, `subscriptions` | data pengguna |
| `purchases`, `token_ledger` (+ view `token_balances`) | pembelian & token scan |

Aplikasi memakai kunci publishable/anon dan **Supabase Auth** (sesi berbasis
cookie), sehingga RLS tetap menjaga isolasi data per pengguna. Akun baru
disiapkan otomatis oleh migrasi `20261009000400_provision_new_users.sql`.

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

## Deploy ke Netlify (bisa dibuka dari jaringan mana pun)

Agar aplikasi bisa dibuka dari HP/laptop/PC pada jaringan mana saja tanpa
laptop menyala, deploy ke **Netlify Free**:

1. Repo sudah berisi `netlify.toml` (Node 20, runtime Next.js otomatis).
2. Di **app.netlify.com → Add new site → Import from GitHub** pilih
   `snapcal-ai-mockup`.
3. Isi environment variables sebelum deploy:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `NEXT_PUBLIC_LYNK_URL` (nilainya dari `.env.local`).
4. Di **Supabase → Authentication → URL Configuration**: set Site URL ke
   `https://<nama-situs>.netlify.app` dan Redirect URLs ke
   `https://<nama-situs>.netlify.app/**` (agar verifikasi email balik ke
   domain Netlify).

Panduan lengkap: `docs/PANDUAN_DEPLOY_NETLIFY.md`.

## Struktur proyek

```
app/                 # / (aplikasi), /welcome, /layar (galeri), /login, /register, rute auth
  actions.ts         # Server action: simpan onboarding, ulangi onboarding
components/          # Komponen UI dan layar mockup
  app/               # AppShell + konteks navigasi (alur menyatu)
  screens/           # onboarding, scan, dashboard, other
lib/db.ts            # Pengambilan data aplikasi (sesi pengguna)
lib/supabase/        # Klien Supabase server & browser (@supabase/ssr)
lib/database.types.ts# Tipe hasil generate dari skema Supabase
middleware.ts        # Penyegar sesi + proteksi rute
supabase/migrations/ # Skema, seed data, dan provisioning akun baru
scripts/check-supabase.mjs # Uji koneksi/login Supabase
scripts/check-auth.mjs     # Uji alur masuk/keluar + navigasi (Playwright)
scripts/shot-flow.mjs      # Tangkapan layar alur aplikasi (Playwright)
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
