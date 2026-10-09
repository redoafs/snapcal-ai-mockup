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
- **better-sqlite3** — data contoh dibaca dari SQLite lokal
- Launcher Windows (VBS/PowerShell) untuk menjalankan sebagai aplikasi jendela

## Menjalankan

```bash
npm install          # pasang dependensi
npm run db:seed      # buat data/snapcal.db beserta data contoh
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

## Versi Pro & pembayaran (Lynk.id)

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

Paket & harga didefinisikan di `lib/db.ts` (`PLAN_TIERS`) dan disinkronkan
otomatis ke basis data. Panduan lengkap: `docs/PANDUAN_VERSI_PRO_LYNKID.md`.

## Struktur proyek

```
app/                 # Halaman utama (App Router) + gaya global
components/          # Komponen UI dan layar mockup per alur
  screens/           # onboarding, scan, dashboard, other
lib/db.ts            # Skema SQLite, data contoh, dan query
scripts/seed.mjs     # Seed data/snapcal.db
scripts/capture.mjs  # Tangkapan layar otomatis (Playwright)
scripts/*.ps1        # Launcher aplikasi Windows
assets/              # Ikon aplikasi
data/                # Basis data SQLite (dibuat lokal, tidak di-commit)
```

## Keterlacakan requirement

Setiap layar mockup diberi label kode **FR** yang merujuk PRD, mis.
`FR-001` (registrasi) sampai `FR-048` (penghapusan akun). Daftar lengkap
layar tersimpan pada tabel `app_screens` di `data/snapcal.db` dan
ditampilkan di halaman utama.

## Catatan

- Basis data `data/snapcal.db` **tidak** disertakan; dibuat ulang dengan
  `npm run db:seed`.
- Berkode `better-sqlite3` bersifat native; `npm install` perlu berhasil
  mengunduh pratinjau (prebuild) yang sesuai.
