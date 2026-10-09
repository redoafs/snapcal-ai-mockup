/**
 * Uji alur autentikasi + navigasi aplikasi end-to-end (Playwright):
 *   1. Buka "/" tanpa sesi      -> dialihkan ke /welcome
 *   2. Halaman pembuka          -> tombol "Mulai sekarang" & "Masuk"
 *   3. Masuk dengan akun demo   -> aplikasi muncul (layar "Hari ini")
 *   4. Navigasi bottom nav      -> Lainnya / Paket & token / kembali
 *   5. Keluar                   -> kembali ke /welcome
 *
 * Prasyarat: server berjalan di http://127.0.0.1:3000
 * Jalankan: node scripts/check-auth.mjs   (atau: npm run auth:test)
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3000';
const EMAIL = process.env.SUPABASE_DEMO_EMAIL || 'redo@snapcal.ai';
const PASSWORD = process.env.SUPABASE_DEMO_PASSWORD || 'snapcal-demo-2026';

let pass = 0;
let fail = 0;
const ok = (label, v) => {
  if (v) pass++;
  else fail++;
  console.log(`  ${v ? 'OK  ' : 'GAGAL'}  ${label}`);
};

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  // 1. Belum masuk -> dialihkan ke /welcome
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  ok('Belum masuk dialihkan ke /welcome', page.url().includes('/welcome'));

  // 2. Halaman pembuka menampilkan tombol masuk/daftar
  const welcomeHtml = await page.content();
  ok('Halaman pembuka: tombol "Mulai sekarang"', welcomeHtml.includes('Mulai sekarang'));
  ok('Halaman pembuka: tombol "Masuk"', welcomeHtml.includes('Masuk'));

  // 3. Masuk lewat halaman /login
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('#email', EMAIL);
  await page.fill('#password', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 30000 });
  await page.waitForLoadState('networkidle');
  ok('Login berhasil (keluar dari /login)', !page.url().includes('/login'));

  // Aplikasi (bukan lagi galeri) tampil dengan tab Beranda
  const appHtml = await page.content();
  ok('Aplikasi tampil: layar "Hari ini"', appHtml.includes('Hari ini'));
  ok('Email pengguna tampil', appHtml.includes(EMAIL));
  ok('Navigasi bawah tersedia', appHtml.includes('Pindai') && appHtml.includes('Lainnya'));

  // 4. Navigasi ke menu Lainnya
  await page.getByRole('button', { name: /Lainnya/ }).click();
  await page.waitForTimeout(400);
  const moreHtml = await page.content();
  ok('Menu Lainnya: "Pengaturan"', moreHtml.includes('Pengaturan'));
  ok('Menu Lainnya: tautan galeri', moreHtml.includes('Lihat semua layar'));

  // → Paket & token (langganan Pro + Lynk.id)
  await page.getByText('Paket & token', { exact: false }).first().click();
  await page.waitForTimeout(400);
  const subHtml = await page.content();
  ok('Paket Pro: tombol "Langganan via Lynk.id"', subHtml.includes('Langganan via Lynk.id'));
  ok('Paket Pro: catatan +50 token', subHtml.includes('+50 token scan otomatis'));

  // kembali ke Beranda lewat bottom nav
  await page.getByRole('button', { name: /Hari ini/ }).click();
  await page.waitForTimeout(400);
  ok(
    'Kembali ke Beranda',
    (await page.content()).includes('Kalori hari ini') ||
      (await page.content()).includes('Hari ini')
  );

  // 5. Keluar
  await page.click('form[action="/auth/signout"] button');
  await page.waitForURL((u) => u.pathname.includes('/welcome'), { timeout: 30000 });
  ok('Keluar kembali ke /welcome', page.url().includes('/welcome'));

  // 6. Setelah keluar, "/" terproteksi lagi
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  ok('Setelah keluar, "/" dialihkan ke /welcome', page.url().includes('/welcome'));
} finally {
  await browser.close();
}

console.log(`\n  Hasil: ${pass}/${pass + fail} lulus`);
process.exit(fail === 0 ? 0 : 1);
