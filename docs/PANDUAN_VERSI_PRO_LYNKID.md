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
NEXT_PUBLIC_LYNK_URL=https://lynk.id/<username>
NEXT_PUBLIC_LYNK_PRO_MONTHLY=https://lynk.id/<username>/pro-bulanan
NEXT_PUBLIC_LYNK_PRO_YEARLY=https://lynk.id/<username>/pro-tahunan
NEXT_PUBLIC_LYNK_PRO_LIFETIME=https://lynk.id/<username>/pro-lifetime
```

Langkah:

1. Salin `.env.example` menjadi `.env.local` dan isi nilainya.
2. `npm run build` (variabel `NEXT_PUBLIC_*` disematkan saat build).
3. Jalankan aplikasi dan buka layar **Pilih paket** untuk memastikan tombol
   "Langganan via Lynk.id" mengarah ke tautan yang benar.

Paket dan harga didefinisikan di `lib/db.ts` (konstanta `PLAN_TIERS`) dan
disinkronkan otomatis ke basis data saat aplikasi dibuka — tanpa perlu seed ulang.

## 3. Alur aktivasi pembeli

1. Pembeli menekan tombol paket Pro → diarahkan ke Lynk.id → membayar.
2. Lynk.id memverifikasi pembayaran dan mengirim notifikasi ke penjual.
3. Penjual mengaktifkan akses Pro pembeli (kirim kode / tandai akun).
4. Opsi lanjutan: pasang **Webhook** Lynk.id ke endpoint server untuk aktivasi
   otomatis.

Target layanan: aktivasi maksimal 1x24 jam. Proses manual memadai untuk fase awal.

## 4. Catatan deploy (Netlify + Supabase)

Aplikasi mockup ini memakai **SQLite** (`better-sqlite3`) yang **tidak berjalan**
di fungsi serverless Netlify. Sebelum produksi:

- Pindahkan lapisan data dari SQLite ke **Supabase (Postgres)**.
- Simpan `service role key` hanya di environment variable server (jangan di klien).
- Deploy lewat Netlify (paket Free: 100 GB bandwidth/bulan, 300 menit build).
- Perhatikan batas Supabase Free: 500 MB DB, dan proyek **pause** bila 7 hari
  tidak aktif (siapkan keep-alive).

Rincian lengkap (langkah, harga, simulasi margin) ada pada dokumen
`Panduan_Versi_Pro_dan_Strategi_Harga_SnapCal_AI.docx` dan
`Simulasi_Operasional_dan_Margin_SnapCal_AI.xlsx`.
