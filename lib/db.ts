/**
 * Lapisan data SnapCal AI (mockup) — Supabase.
 *
 * Aplikasi memakai Supabase Auth sungguhan (sesi berbasis cookie lewat
 * @supabase/ssr). Row Level Security (RLS) memastikan tiap pengguna hanya
 * membaca datanya sendiri, sehingga akun demo tidak lagi dipakai untuk
 * membaca data.
 *
 * Env yang dipakai:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

/** Jumlah token yang diberikan otomatis setiap pembayaran Pro. */
export const TOKENS_PER_PURCHASE = 50;

/** Klien Supabase yang membaca sesi pengguna yang sedang masuk. */
export async function getClient(): Promise<SupabaseClient<Database>> {
  return createServerSupabase();
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

  const {
    data: { user: authUser },
  } = await db.auth.getUser();
  if (!authUser) {
    throw new Error('Belum masuk. Silakan login terlebih dahulu.');
  }

  const [profileRes, screensRes, plansRes, consentRes, subRes, mealsRes, recsRes, actsRes, metricsRes, ledgerRes] =
    await Promise.all([
      db.from('user_profiles').select('*').eq('user_id', authUser.id).maybeSingle(),
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
