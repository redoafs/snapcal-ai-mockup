# Cara Memakai Aplikasi SnapCal AI

Mockup SnapCal AI kini berbentuk **aplikasi jendela**: server produksi
berjalan di background (tersembunyi) dan tampil di jendela sendiri tanpa
menu browser. Hanya dapat diakses dari PC ini (`127.0.0.1:3000`).

## Buka aplikasi

- **Dua kali klik ikon "SnapCal AI" di Desktop**, atau
- Buka dari **Start Menu → SnapCal AI**.

Yang terjadi saat dibuka:

1. Bila server belum berjalan, ia dinyalakan otomatis di background
   (tanpa jendela hitam) dan menulis log ke `logs\snapcal-out.log`.
2. Jendela aplikasi terbuka (ukuran ponsel, tanpa address bar).
3. Menutup jendela **tidak** mematikan server.

## Masuk ke aplikasi

Saat pertama dibuka, aplikasi menampilkan **halaman pembuka** (`/welcome`)
dengan tombol **Mulai sekarang** (daftar) dan **Masuk**. Masuk memakai akun
demo:

- Email: `redo@snapcal.ai`
- Kata sandi: `snapcal-demo-2026`

Tombol **Gunakan akun demo** mengisi kolom secara otomatis. Untuk mencoba
pendaftaran, buka tautan **Daftar** (`/register`); akun baru otomatis
mendapatkan data contoh **dan** menjalani alur onboarding (profil → data tubuh
→ tujuan → izin data → hasil pertama) sebelum masuk ke layar **Hari ini**.

## Menelusuri alur aplikasi

Setelah masuk, layar saling tersambung seperti aplikasi biasa:

- **Navigasi bawah**: Hari ini · Pindai · Porsi · Tren · Lainnya.
- **Pindai**: tekan tombol rana → layar proses → **review hasil** → **Simpan
  ke log hari ini** kembali ke Beranda.
- **Lainnya**: Pengaturan · Laporan · Coaching · Paket & token · Privasi, juga
  tautan **Galeri** (`/layar`) dan tombol **Keluar**.
- **← Kembali** di bilah atas ponsel untuk mundur satu layar.
- **Ulangi onboarding (demo)**: di Lainnya → Pengaturan, untuk mencoba lagi
  alur onboarding kapan saja.

Galeri di `/layar` menampilkan semua layar statis per alur untuk keperluan
dokumentasi/tangkapan layar.

## Menghentikan server

- **Start Menu → Hentikan SnapCal AI**, atau
- Dua kali klik `Hentikan SnapCal AI.vbs` di folder ini.

## Berkas terkait

| Berkas | Fungsi |
| --- | --- |
| `SnapCal AI.vbs` | Membuka aplikasi (launcher tanpa jendela hitam) |
| `Hentikan SnapCal AI.vbs` | Menghentikan server background |
| `scripts\snapcal-app.ps1` | Inti launcher: nyalakan server + buka jendela |
| `scripts\snapcal-stop.ps1` | Menghentikan server |
| `scripts\buat-shortcut.ps1` | Membuat ulang shortcut Desktop & Start Menu |
| `scripts\make_icon.py` | Membuat ulang ikon aplikasi |
| `assets\snapcal.ico` | Ikon aplikasi |
| `logs\` | Log server dan berkas PID |

## Catatan

- Aplikasi memakai **build produksi** (`.next`). Bila kode aplikasi diubah,
  jalankan `npm run build` lebih dulu agar perubahan ikut terpakai.
- Bila ingin diakses dari HP di Wi-Fi yang sama, ubah `-H 127.0.0.1`
  menjadi `-H 0.0.0.0` di `scripts\snapcal-app.ps1` dan izinkan port 3000
  di Windows Firewall.
