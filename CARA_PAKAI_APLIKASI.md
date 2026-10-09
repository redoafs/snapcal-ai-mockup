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
