/**
 * Seed script: creates data/snapcal.db and reports row counts.
 * Run with: npm run db:seed
 */
import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'data', 'snapcal.db');

for (const suffix of ['', '-wal', '-shm']) {
  const f = DB_PATH + suffix;
  if (fs.existsSync(f)) fs.unlinkSync(f);
}
if (!fs.existsSync(path.dirname(DB_PATH)))
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const { getDb, getScreens, getPlans, getTodayMeals, getUser } = await import(
  '../lib/db.ts'
);

const db = getDb();
const count = (t) => db.prepare(`SELECT COUNT(*) AS c FROM ${t}`).get().c;

const line = (label, v) => console.log(`  ${label.padEnd(18)}: ${v}`);
console.log('Seeded', path.relative(process.cwd(), DB_PATH));
console.log('');
line('user', getUser().name + ' / ' + getUser().email);
line('food_items', count('food_items'));
line('meals', count('meals'));
line('meal_items', count('meal_items'));
line('recommendations', count('portion_recommendations'));
line('body_metrics', count('body_metrics'));
line('activities', count('activities'));
line('plan_tiers', count('plan_tiers'));
line('app_screens', count('app_screens'));
line('consents', count('consents'));
console.log('');
console.log('Screens:');
for (const s of getScreens())
  console.log(`  ${s.slug.padEnd(22)} ${s.title.padEnd(28)} ${s.flow_id} [${s.fr_refs}]`);
console.log('');
console.log('Plans:');
for (const p of getPlans())
  console.log(`  ${p.name.padEnd(9)} Rp${String(p.price_idr).padEnd(8)} ${p.tagline}`);
console.log('');
console.log('Today meals:', getTodayMeals().length);