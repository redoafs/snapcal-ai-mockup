'use client';

import { createContext, useContext } from 'react';

/** Semua layar aplikasi yang bisa dituju. */
export type ScreenKey =
  | 'onboarding-profile'
  | 'onboarding-body'
  | 'onboarding-goal'
  | 'consent'
  | 'first-result'
  | 'home'
  | 'scan'
  | 'scan-processing'
  | 'scan-review'
  | 'scan-fallback'
  | 'portion'
  | 'trends'
  | 'log'
  | 'coaching'
  | 'report'
  | 'subscribe'
  | 'privacy'
  | 'settings'
  | 'more';

/** Data yang diisi pengguna saat onboarding. */
export type OnboardingData = {
  name?: string;
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  activity_level?: string;
  goal?: string;
  diet_pref?: string;
  medical_note?: string;
};

export type AppContextValue = {
  screen: ScreenKey;
  /** Buka layar baru (menambah riwayat untuk tombol kembali). */
  go: (s: ScreenKey) => void;
  /** Kembali ke layar sebelumnya. */
  back: () => void;
  /** Buka layar dan kosongkan riwayat (mis. kembali ke tab utama). */
  reset: (s: ScreenKey) => void;
  canGoBack: boolean;
  onboarding: OnboardingData;
  updateOnboarding: (patch: Partial<OnboardingData>) => void;
  /** Simpan onboarding ke Supabase lalu tampilkan hasil pertama. */
  finishOnboarding: () => Promise<void>;
  /** Kosongkan tujuan agar onboarding bisa dicoba lagi (demo). */
  restartOnboarding: () => Promise<void>;
  saving: boolean;
};

export const AppContext = createContext<AppContextValue | null>(null);

/** Ambil konteks aplikasi. Null bila dipakai di luar alur (mis. galeri layar). */
export function useApp() {
  return useContext(AppContext);
}
