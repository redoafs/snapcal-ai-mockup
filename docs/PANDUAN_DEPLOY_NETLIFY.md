# Panduan Deploy SnapCal AI ke Netlify (gratis)

Dengan Netlify, aplikasi bisa dibuka dari **jaringan mana pun** (HP, laptop,
PC) lewat alamat publik `https://<nama-situs>.netlify.app`, tanpa perlu
laptop Anda menyala. Supabase sudah berada di cloud, jadi cukup aplikasi
(Next.js) yang di-host.

Prasyarat:

- Repo GitHub privat `snapcal-ai-mockup` (sudah ada: `redoafs/snapcal-ai-mockup`).
- Kode terbaru sudah di-`push` ke `main`.
- Akun Netlify gratis (netlify.com, bisa login dengan akun GitHub).

---

## Cara 1 (disarankan) — Import dari GitHub

1. Buka **https://app.netlify.com** lalu **Add new site → Import an existing
   project → GitHub**.
2. Pilih repo `snapcal-ai-mockup`. Bila repo privat, izinkan Netlify mengakses
   repositori itu (Netlify akan menampilkan halaman otorisasi GitHub).
3. Netlify otomatis mendeteksi **Next.js**: build command `npm run build`,
   publish directory dikelola runtime Netlify, Node 20 (dari `netlify.toml`).
4. Sebelum deploy pertama, tambahkan **Environment variables** (di *Site
   configuration → Environment variables*) dengan nilai dari `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` → `https://tahnkykyvfshcglwbzui.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → kunci anon/publishable proyek Anda
   - `NEXT_PUBLIC_LYNK_URL` →
     `https://lynk.id/snapcal-ai/vrgg5vo5dxwz/checkout`
   - (opsional) `NEXT_PUBLIC_LYNK_PRO_MONTHLY/_YEARLY/_LIFETIME` bila Anda
     membuat produk Lynk.id terpisah per paket.

   > Variabel `NEXT_PUBLIC_*` nilainya dikunci **saat build**. Jadi isi alat
   > pentingnya sebelum menekan deploy.

5. Klik **Deploy site**. Selesai — aplikasi langsung punya alamat publik.

---

## Cara 2 — CLI (Netlify CLI)

Bila memakai Netlify CLI:

```bash
npx netlify-cli login          # buka browser untuk login akun Netlify
npx netlify-cli init           # tautkan ke situs (buat baru bila perlu)
npx netlify-cli deploy --prod --build
```

Set env lalu deploy:

```bash
npx netlify-cli env:set NEXT_PUBLIC_SUPABASE_URL https://tahnkykyvfshcglwbzui.supabase.co
npx netlify-cli env:set NEXT_PUBLIC_SUPABASE_ANON_KEY <kunci-anda>
npx netlify-cli env:set NEXT_PUBLIC_LYNK_URL https://lynk.id/snapcal-ai/vrgg5vo5dxwz/checkout
npx netlify-cli deploy --prod --build
```

---

## Menghubungkan Supabase Auth ke domain Netlify

Agar tautan **verifikasi email** (akun baru) dan **email magic link** kembali
ke domain Netlify, daftarkan origin tersebut di proyek Supabase:

1. Buka **Supabase Dashboard → Authentication → URL Configuration**.
2. **Site URL**: isi `https://<nama-situs>.netlify.app`.
3. **Redirect URLs**: tambahkan
   - `https://<nama-situs>.netlify.app/**`
   - (bila memakai domain sendiri) `https://snapcal.example.com/**`
4. Simpan.

Aplikasi sudah otomatis mengarahkan `emailRedirectTo` ke
`window.location.origin/auth/confirm`, jadi tidak ada perubahan kode yang
dibutuhkan untuk langkah ini.

---

## Hal yang perlu diketahui

- **Sesi & email**: `Supabase Auth` tetap "Confirm email" aktif. Pendaftar
  harus membuka tautan verifikasi sekali, lalu bisa masuk.
- **Data**: semua pengguna memakai proyek Supabase yang sama, tetapi **RLS**
  (`auth.uid()`) tetap menjaga tiap pengguna hanya melihat datanya sendiri.
- **Tidak ada prerender**: halaman memakai `export const dynamic =
  'force-dynamic'` dan sesi berbasis cookie (`@supabase/ssr`), jadi Netlify
  merender tiap permintaan lewat server/edge function — aman untuk cookie.
- **Token Lynk.id**: alur pembayaran → Google Sheet → Supabase tetap sama.
  Bila webhook Apps Script menulis ke Supabase, pastikan service role key
  disimpan sebagai *Supabase secret* (jangan `NEXT_PUBLIC_`).
- **Coba dulu di lokal**: `npm run build && npm run start` lalu buka
  `http://127.0.0.1:3000` — pastikan berfungsi sebelum deploy.

---

## Menjalankan ulang setelah mengubah kode

Setelah mengubah kode dan `git push origin main`, Netlify otomatis mem-build
ulang. Untuk deploy manual dari CLI:

```bash
npx netlify-cli deploy --prod --build
```