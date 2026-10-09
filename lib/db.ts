/**
 * Lapisan data SnapCal AI (mockup) — Supabase.
 *
 * Menggantikan SQLite lokal. Aplikasi masuk sebagai "akun demo" memakai kunci
 * publishable/anon, sehingga Row Level Security (RLS) tetap aktif dan data yang
 * dibaca hanya milik pengguna demo tersebut.
 *
 * Env yang dipakai:
 *   SUPABASE_URL              (atau NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_ANON_KEY         (atau NEXT_PUBLIC_SUPABASE_ANON_KEY)
 *   SUPABASE_DEMO_EMAIL       (default: redo@snapcal.ai)
 *   SUPABASE_DEMO_PASSWORD    (default: snapcal-demo-2026)
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

const DEMO_EMAIL = process.env.SUPABASE_DEMO_EMAIL || 'redo@snapcal.ai';
const DEMO_PASSWORD = process.env.SUPABASE_DEMO_PASSWORD || 'snapcal-demo-2026';

/** Jumlah token yang diberikan otomatis setiap pembayaran Pro. */
export const TOKENS_PER_PURCHASE = 50;

/**
 * Membuat klien Supabase dan masuk sebagai akun demo. Dibuat baru tiap request
 * (mockup tanpa sesi pengguna sungguhan) agar tidak berbagi state.
 */
export async function getClient(): Promise<SupabaseClient<Database>> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase belum dikonfigurasi. Isi SUPABASE_URL dan SUPABASE_ANON_KEY.'
    );
  }
  const db = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await db.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
  if (error) {
    throw new Error('Login Supabase (akun demo) gagal: ' + error.message);
  }
  return db;
}

function unwrap<T>(res: { data: T; error: { message: string } | null }, label: string): T {
  if (res.error) throw new Error(`Supabase ${label}: ${res.error.message}`);
  return res.data;
}

export function getPlans() {
  const fallback = process.env.NEXT_PUBLIC_LYNK_URL || '';
  const checkout: Record<string, string> = {
    free: '',
    pro_monthly: process.env.NEXT_PUBLIC_LYNK_PRO_MONTHLY || fallback,
    pro_yearly: process.env.NEXT_PUBLIC_LYNK_PRO_YEARLY || fallback,
    pro_lifetime: process.env.NEXT_PUBLIC_LYNK_PRO_LIFETIME || fallback,
  };
  const period: Record<string, string> = {
    free: '',
    pro_monthly: '/bulan',
    pro_yearly: '/tahun',
    pro_lifetime: 'sekali bayar',
  };
  const savings: Record<string, number> = { pro_yearly: 32 };
  const decor = (p: any) => ({
    ...p,
    featureList: p.features ?? [],
    checkout_url: checkout[p.code] || '',
    periodLabel: period[p.code] || '',
    savingsPct: savings[p.code] || 0,
  });
  return { checkout, decor };
}

export type AppData = Awaited<ReturnType<typeof loadData>>;

/**
 * Mengambil seluruh data yang dibutuhkan halaman mockup dalam satu panggilan.
 */
export async function loadData() {
  const db = await getClient();

  const [profileRes, screensRes, plansRes, consentRes, subRes, mealsRes, recsRes, actsRes, metricsRes, ledgerRes] =
    await Promise.all([
      db.from('user_profiles').select('*').limit(1).maybeSingle(),
      db.from('app_screens').select('*').order('screen_order'),
      db.from('plan_tiers').select('*').order('price_idr'),
      db.from('consents').select('*').order('granted_at', { ascending: false }).limit(1).maybeSingle(),
      db.from('subscriptions').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      db.from('meals').select('*, meal_items(*, food_items(*))').order('logged_at', { ascending: false }),
      db.from('portion_recommendations').select('*').order('sort_order'),
      db.from('activities').select('*').order('logged_at', { ascending: false }),
      db.from('body_metrics').select('*').order('measured_on', { ascending: false }),
      db.from('token_ledger').select('*').order('created_at', { ascending: false }),
    ]);

  const user = unwrap(profileRes, 'user_profiles');
  const screens = unwrap(screensRes, 'app_screens');
  const plans = unwrap(plansRes, 'plan_tiers');
  const consent = unwrap(consentRes, 'consents');
  const subscription = unwrap(subRes, 'subscriptions');
  const recs = unwrap(recsRes, 'portion_recommendations');
  const acts = unwrap(actsRes, 'activities');
  const metrics = unwrap(metricsRes, 'body_metrics');
  const ledger = unwrap(ledgerRes, 'token_ledger');

  const rawMeals = (unwrap(mealsRes, 'meals') ?? []) as any[];
  const meals = rawMeals.map((m) => {
    const items = (m.meal_items ?? []).map((it: any) => {
      const f = it.food_items ?? {};
      return {
        ...it,
        name: f.name,
        emoji: f.emoji,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        fiber: f.fiber,
        unit_label: f.unit_label,
        kcal: Math.round(((f.calories ?? 0) * it.portion_grams) / 100),
      };
    });
    const totals = items.reduce(
      (a: any, i: any) => ({
        kcal: a.kcal + i.kcal,
        protein: a.protein + ((i.protein ?? 0) * i.portion_grams) / 100,
        carbs: a.carbs + ((i.carbs ?? 0) * i.portion_grams) / 100,
        fat: a.fat + ((i.fat ?? 0) * i.portion_grams) / 100,
        fiber: a.fiber + ((i.fiber ?? 0) * i.portion_grams) / 100,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
    return { ...m, items, totals };
  });

  const { decor } = getPlans();
  const planList = (plans ?? []).map(decor);

  const entries = (ledger ?? []) as any[];
  const balance = entries.reduce((a, e) => a + e.delta, 0);
  const wallet = {
    balance,
    entries,
    perPurchase: TOKENS_PER_PURCHASE,
    checkoutUrl: process.env.NEXT_PUBLIC_LYNK_URL || '',
  };

  return {
    user,
    meals,
    recs: recs ?? [],
    acts: acts ?? [],
    metrics: metrics ?? [],
    plans: planList,
    screens: screens ?? [],
    consent,
    subscription,
    wallet,
  };
}
