'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { OnboardingData } from '@/components/app/nav';

/**
 * Menyimpan hasil onboarding ke `user_profiles` milik pengguna yang sedang
 * masuk. Skor metabolisme hanya estimasi mockup (bukan diagnosis medis).
 */
export async function completeOnboarding(input: OnboardingData) {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { ok: false, error: 'Belum masuk.' };

  const age = Number(input.age) || 30;
  const height = Number(input.height_cm) || 170;
  const weight = Number(input.weight_kg) || 70;

  // Estimasi mockup sederhana dari aktivitas (bukan angka klinis).
  const levelBonus =
    input.activity_level === 'Tinggi'
      ? 16
      : input.activity_level === 'Rendah'
        ? 4
        : 10;
  const metabolic = Math.max(40, Math.min(92, Math.round(56 + levelBonus)));
  const insulin =
    metabolic >= 70 ? 'baik' : metabolic >= 62 ? 'moderate' : 'perlu perhatian';

  const { error } = await db
    .from('user_profiles')
    .update({
      name: input.name?.trim() || undefined,
      age,
      gender: input.gender ?? null,
      height_cm: height,
      weight_kg: weight,
      activity_level: input.activity_level ?? null,
      goal: input.goal ?? null,
      diet_pref: input.diet_pref ?? null,
      medical_note: input.medical_note ?? null,
      metabolic_score: metabolic,
      insulin_sensitivity: insulin,
    })
    .eq('user_id', user.id);

  revalidatePath('/');
  return { ok: !error, error: error?.message };
}

/** Mengosongkan tujuan agar alur onboarding bisa dicoba lagi (mode demo). */
export async function restartOnboarding() {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { ok: false, error: 'Belum masuk.' };

  const { error } = await db
    .from('user_profiles')
    .update({ goal: null })
    .eq('user_id', user.id);

  revalidatePath('/');
  return { ok: !error, error: error?.message };
}
