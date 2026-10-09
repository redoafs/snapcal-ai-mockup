/**
 * Capture screenshots of the SnapCal AI mockup.
 *
 * Usage:
 *   node scripts/capture.mjs [baseUrl]
 *
 * Produces PNG files in screenshots/ :
 *   - header.png          page header
 *   - flow-<id>.png       one strip per user flow
 *   - full-page.png       entire page
 *   - screen-<slug>.png   every individual phone frame
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] || 'http://127.0.0.1:3200';
const OUT = path.join(process.cwd(), 'screenshots');

const FLOWS = [
  { id: 'onboarding', code: 'UF-01', name: 'Registrasi dan onboarding' },
  { id: 'scan', code: 'UF-02', name: 'Deteksi makanan dari foto' },
  { id: 'daily', code: 'UF-03 / UF-04', name: 'Dashboard, porsi, dan logging' },
  { id: 'retention', code: 'UF-05', name: 'Coaching dan retensi' },
  { id: 'monetization', code: 'UF-06', name: 'Berlangganan premium' },
  { id: 'privacy', code: 'UF-07 / UF-08', name: 'Laporan, privasi, dan pengaturan' },
];

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1680, height: 1200 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

console.log(`Opening ${BASE} ...`);
await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120000 });
// Let fonts settle and animations stop so screenshots are deterministic.
await page.waitForTimeout(1500);
await page.evaluate(() => {
  const s = document.createElement('style');
  s.textContent =
    '*,*::before,*::after{animation:none !important;transition:none !important}';
  document.head.appendChild(s);
});
await page.waitForTimeout(400);

// 1. Header
const header = page.locator('header');
if (await header.count()) {
  await header.first().screenshot({ path: path.join(OUT, 'header.png') });
  console.log('  header.png');
}

// 2. One strip per flow
for (const f of FLOWS) {
  const sec = page.locator(`section#${f.id}`);
  if (!(await sec.count())) {
    console.log(`  ! section #${f.id} not found`);
    continue;
  }
  const strip = sec.locator('> div').last();
  const file = `flow-${f.id}.png`;
  await strip.screenshot({ path: path.join(OUT, file) });
  console.log(`  ${file}  (${f.code} ${f.name})`);
}

// 3. Every individual phone frame
const frames = page.locator('.phone');
const n = await frames.count();
console.log(`Phone frames found: ${n}`);
for (let i = 0; i < n; i++) {
  const f = frames.nth(i);
  const fig = f.locator('xpath=..');
  const cap = await fig.locator('figcaption').innerText().catch(() => '');
  const lines = cap.split('\n').filter(Boolean);
  const title = (lines[0] || `screen-${i}`).trim();
  const slugLine = (lines[1] || '').replace(/^\//, '').trim();
  const slug = (slugLine || `frame-${i}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const file = `screen-${String(i + 1).padStart(2, '0')}-${slug}.png`;
  await f.screenshot({ path: path.join(OUT, file) });
  console.log(`  ${file}  ${title}`);
}

// 4. Full page
await page.screenshot({
  path: path.join(OUT, 'full-page.png'),
  fullPage: true,
});
console.log('  full-page.png');

await browser.close();

// 5. Manifest for the report generator
const files = fs.readdirSync(OUT).filter((f) => f.endsWith('.png')).sort();
fs.writeFileSync(
  path.join(OUT, 'manifest.json'),
  JSON.stringify(
    {
      base: BASE,
      capturedAt: new Date().toISOString(),
      flows: FLOWS,
      screens: files.filter((f) => f.startsWith('screen-')),
      files,
    },
    null,
    2
  )
);
console.log(`\nDone. ${files.length} PNG files in screenshots/`);