/**
 * Menyimpan tangkapan layar alur aplikasi (Playwright) untuk pratinjau.
 * Jalankan: node scripts/shot-flow.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3000';
const OUT =
  process.env.SHOT_DIR || 'C:/Users/ACER/AppData/Local/Temp/opencode/snapcal-shots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 800 } });

const shot = async (name) => {
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('saved', name);
};

// Pembuka (publik)
await page.goto(BASE + '/welcome', { waitUntil: 'networkidle' });
await shot('01-welcome');

// Masuk
await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
await page.fill('#email', 'redo@snapcal.ai');
await page.fill('#password', 'snapcal-demo-2026');
await page.click('button[type="submit"]');
await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 30000 });
await page.waitForLoadState('networkidle');
await shot('02-home');

// Pindai -> proses -> review
await page.getByRole('button', { name: /Pindai/ }).click();
await shot('03-scan');
await page.locator('button:has(span.rounded-full.bg-brand-600)').click();
await shot('04-scan-processing');
await page.waitForTimeout(2200);
await shot('05-scan-review');

// Simpan -> beranda
await page.getByRole('button', { name: /Simpan ke log hari ini/ }).click();
await shot('06-home-after-save');

// Porsi & Tren
await page.getByRole('button', { name: /Porsi/ }).click();
await shot('07-portion');
await page.getByRole('button', { name: /Tren/ }).click();
await shot('08-trends');

// Menu Lainnya -> Paket -> Pengaturan
await page.getByRole('button', { name: /Lainnya/ }).click();
await shot('09-more');
await page.getByText('Paket & token', { exact: false }).first().click();
await shot('10-subscribe');
await page.getByRole('button', { name: /Lainnya/ }).click();
await page.getByText('Pengaturan', { exact: false }).first().click();
await shot('11-settings');

await browser.close();
console.log('done ->', OUT);
