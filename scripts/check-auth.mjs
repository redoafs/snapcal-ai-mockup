/**
 * Uji alur autentikasi end-to-end (Playwright):
 *   1. Buka "/" tanpa sesi  -> harus dialihkan ke /login
 *   2. Masuk dengan akun demo
 *   3. Setelah masuk        -> halaman utama memuat data dari Supabase
 *   4. Keluar               -> kembali ke /login
 *
 * Prasyarat: server berjalan di http://127.0.0.1:3000
 * Jalankan: node scripts/check-auth.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3000';
const EMAIL = process.env.SUPABASE_DEMO_EMAIL || 'redo@snapcal.ai';
const PASSWORD = process.env.SUPABASE_DEMO_PASSWORD || 'snapcal-demo-2026';

const ok = (label, v) => console.log(`  ${v ? 'OK  ' : 'GAGAL'}  ${label}`);

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  // 1. Belum masuk -> dialihkan ke /login
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  ok('Belum masuk dialihkan ke /login', page.url().includes('/login'));

  // 2. Masuk dengan akun demo
  await page.fill('#email', EMAIL);
  await page.fill('#password', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 25000 });
  await page.waitForLoadState('networkidle');
  ok('Login berhasil (keluar dari /login)', !page.url().includes('/login'));

  // 3. Halaman utama memuat data Supabase
  const html = await page.content();
  ok('Nama pengguna tampil', html.includes('Redo Alfiansyah'));
  ok('Label "Data dari Supabase"', html.includes('Data dari Supabase'));
  ok('Kartu token tampil', html.includes('Token scan'));
  ok('Tautan Lynk.id tampil', html.includes('lynk.id/snapcal-ai'));

  // 4. Keluar
  await page.click('form[action="/auth/signout"] button');
  await page.waitForURL((u) => u.pathname.includes('/login'), { timeout: 25000 });
  ok('Keluar kembali ke /login', page.url().includes('/login'));

  // 5. Setelah keluar, "/" terproteksi lagi
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  ok('Setelah keluar, "/" terproteksi lagi', page.url().includes('/login'));
} finally {
  await browser.close();
}
