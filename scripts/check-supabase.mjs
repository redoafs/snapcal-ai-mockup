/**
 * Uji koneksi Supabase: login akun demo lalu hitung baris tiap tabel.
 * Jalankan: node scripts/check-supabase.mjs
 *
 * Variabel lingkungan (opsional, ada default):
 *   SUPABASE_URL, SUPABASE_ANON_KEY (atau NEXT_PUBLIC_SUPABASE_ANON_KEY),
 *   SUPABASE_DEMO_EMAIL, SUPABASE_DEMO_PASSWORD
 */
import { createClient } from '@supabase/supabase-js';

const url =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://tahnkykyvfshcglwbzui.supabase.co';
const key =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';
const email = process.env.SUPABASE_DEMO_EMAIL || 'redo@snapcal.ai';
const password = process.env.SUPABASE_DEMO_PASSWORD || 'snapcal-demo-2026';

if (!key) {
  console.error('SUPABASE_ANON_KEY belum diisi.');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) {
  console.error('LOGIN GAGAL:', error.message);
  process.exit(1);
}
console.log('Login OK sebagai', data.user.email, '(' + data.user.id + ')');
console.log('');

const tables = [
  'food_items',
  'app_screens',
  'plan_tiers',
  'user_profiles',
  'meals',
  'meal_items',
  'portion_recommendations',
  'body_metrics',
  'activities',
  'subscriptions',
  'consents',
  'token_ledger',
];
for (const t of tables) {
  const { count, error: e } = await supabase
    .from(t)
    .select('*', { count: 'exact', head: true });
  console.log('  ' + t.padEnd(24), e ? 'ERR ' + e.message : count);
}

const { data: profile } = await supabase
  .from('user_profiles')
  .select('name,email,weight_kg')
  .maybeSingle();
console.log('\nProfil   :', profile);

const { data: ledger } = await supabase.from('token_ledger').select('delta');
console.log('Saldo     :', (ledger ?? []).reduce((a, x) => a + x.delta, 0), 'token');
