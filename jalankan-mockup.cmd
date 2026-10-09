@echo off
REM ===== SnapCal AI Mockup - jalankan lokal (localhost saja) =====
REM Klik dua kali berkas ini untuk menyalakan aplikasi.
REM Setelah jendela ini menampilkan "Ready", buka http://localhost:3000
REM Tutup jendela ini (atau tekan Ctrl+C) untuk mematikan server.

set "NODE_DIR=C:\Program Files\nodejs"
set "PATH=%NODE_DIR%;%PATH%"
cd /d "%~dp0"

echo [1/2] Membangun versi produksi...
call "%NODE_DIR%\npm.cmd" run build
if errorlevel 1 (
  echo.
  echo GAGAL saat build. Periksa pesan di atas.
  pause
  exit /b 1
)

echo.
echo [2/2] Menyalakan server di http://localhost:3000
echo       Hanya dapat dibuka dari PC ini. Tekan Ctrl+C untuk berhenti.
echo.
call "%NODE_DIR%\npx.cmd" next start -H 127.0.0.1 -p 3000

pause
