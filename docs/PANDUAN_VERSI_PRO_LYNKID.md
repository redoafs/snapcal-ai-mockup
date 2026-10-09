# Panduan Versi Pro Berbayar (Lynk.id)

Dokumen ini menjelaskan cara mengaktifkan paket **Pro** berbayar pada aplikasi
SnapCal AI menggunakan **Lynk.id** sebagai halaman checkout.

## 1. Menyiapkan produk di Lynk.id

1. Daftar di [lynk.id](https://lynk.id) dengan paket **Free** (fee 5% per transaksi,
   tanpa biaya langganan).
2. Buat tiga produk digital:
   - `SnapCal Pro - Bulanan` — Rp49.000
   - `SnapCal Pro - Tahunan` — Rp399.000
   - `SnapCal Pro - Lifetime` — Rp899.000 (kuota terbatas)
3. Aktifkan pembayaran lokal: QRIS, Virtual Account (BCA/BRI/Mandiri/BNI),
   dan e-wallet (GoPay/OVO/DANA/ShopeePay).
4. Salin tautan publik tiap produk: `https://lynk.id/<username>/<produk>`.

## 2. Menghubungkan tautan ke aplikasi

Tautan dibaca dari environment variable (lihat `.env.example`):

```
NEXT_PUBLIC_LYNK_URL=https://lynk.id/snapcal-ai/vrgg5vo5dxwz/checkout

# Opsional: isi bila membuat produk Lynk.id terpisah untuk tiap paket.
# NEXT_PUBLIC_LYNK_PRO_MONTHLY=
# NEXT_PUBLIC_LYNK_PRO_YEARLY=
# NEXT_PUBLIC_LYNK_PRO_LIFETIME=
```

> Catatan: satu tautan Lynk.id hanya menunjuk ke satu produk dengan satu harga.
> Bila hanya ada satu produk (mis. "SnapCal AI" Rp49.000), ketiga tombol paket
> akan mengarah ke checkout yang sama. Agar harga yang dibayar sesuai paket yang
> dipilih, buat produk terpisah dan isi variabel per paket di atas.

Langkah:

1. Salin `.env.example` menjadi `.env.local` dan isi nilainya.
2. `npm run build` (variabel `NEXT_PUBLIC_*` disematkan saat build).
3. Jalankan aplikasi dan buka layar **Pilih paket** untuk memastikan tombol
   "Langganan via Lynk.id" mengarah ke tautan yang benar.

Paket dan harga didefinisikan pada tabel `plan_tiers` di **Supabase**
(di-seed lewat `supabase/migrations/20261009000300_seed_demo_data.sql`). Ubah
tabel tersebut lalu perbarui tautan paket di `.env.local` bila perlu.

## 3. Alur aktivasi pembeli

1. Pembeli menekan tombol paket Pro → diarahkan ke Lynk.id → membayar.
2. Lynk.id memverifikasi pembayaran dan mengirim notifikasi ke penjual.
3. Penjual mengaktifkan akses Pro pembeli (kirim kode / tandai akun).
4. Opsi lanjutan: pasang **Webhook** Lynk.id ke endpoint server untuk aktivasi
   otomatis.

Target layanan: aktivasi maksimal 1x24 jam. Proses manual memadai untuk fase awal.

## 4. Catatan deploy (Netlify + Supabase)

Aplikasi mockup ini sudah memakai **Supabase (Postgres)** melalui
`@supabase/supabase-js`, sehingga dapat berjalan di fungsi serverless Netlify
(tidak ada lagi basis data SQLite lokal). Sebelum produksi:

- Isi variabel Supabase di Netlify:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_DEMO_EMAIL`, `SUPABASE_DEMO_PASSWORD` (lihat `.env.example`).
- Simpan `service role key` (untuk webhook/aktivasi) hanya di environment
  variable server; **jangan** pernah dipakai di klien.
- Deploy lewat Netlify (paket Free: 100 GB bandwidth/bulan, 300 menit build).
- Perhatikan batas Supabase Free: 500 MB DB, dan proyek **pause** bila 7 hari
  tidak aktif (siapkan keep-alive).

Rincian lengkap (langkah, harga, simulasi margin) ada pada dokumen
`Panduan_Versi_Pro_dan_Strategi_Harga_SnapCal_AI.docx` dan
`Simulasi_Operasional_dan_Margin_SnapCal_AI.xlsx`.
