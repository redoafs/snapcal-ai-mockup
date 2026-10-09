'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppContext, type OnboardingData, type ScreenKey } from './nav';
import { completeOnboarding, restartOnboarding } from '@/app/actions';
import {
  ConsentScreen,
  FirstResultScreen,
  OnboardingBodyScreen,
  OnboardingGoalScreen,
  OnboardingProfileScreen,
} from '@/components/screens/onboarding';
import {
  HomeScreen,
  PortionScreen,
  TrendsScreen,
} from '@/components/screens/dashboard';
import {
  ScanFallbackScreen,
  ScanProcessingScreen,
  ScanReviewScreen,
  ScanScreen,
} from '@/components/screens/scan';
import {
  CoachingScreen,
  LogScreen,
  MoreScreen,
  PrivacyScreen,
  ReportScreen,
  SettingsScreen,
  SubscribeScreen,
} from '@/components/screens/other';

const META: Record<ScreenKey, { title: string; flow: string }> = {
  'onboarding-profile': { title: 'Profil dasar', flow: 'Onboarding · 1/4' },
  'onboarding-body': { title: 'Data tubuh', flow: 'Onboarding · 2/4' },
  'onboarding-goal': { title: 'Tujuan Anda', flow: 'Onboarding · 3/4' },
  consent: { title: 'Izin pemrosesan data', flow: 'Onboarding · 4/4' },
  'first-result': { title: 'Hasil pertama', flow: 'Onboarding · selesai' },
  home: { title: 'Hari ini', flow: 'Beranda' },
  scan: { title: 'Pindai makanan', flow: 'Deteksi foto' },
  'scan-processing': { title: 'Memproses', flow: 'Deteksi foto' },
  'scan-review': { title: 'Review hasil', flow: 'Deteksi foto' },
  'scan-fallback': { title: 'Bantuan server', flow: 'Deteksi foto' },
  portion: { title: 'Rekomendasi porsi', flow: 'Porsi' },
  trends: { title: 'Tren', flow: 'Tren' },
  log: { title: 'Tambah catatan', flow: 'Catatan cepat' },
  coaching: { title: 'Coaching', flow: 'Retensi' },
  report: { title: 'Laporan', flow: 'Laporan' },
  subscribe: { title: 'Pilih paket', flow: 'Langganan Pro' },
  privacy: { title: 'Privasi dan data', flow: 'Privasi' },
  settings: { title: 'Pengaturan', flow: 'Pengaturan' },
  more: { title: 'Lainnya', flow: 'Menu' },
};

export default function AppShell({
  data,
  needsOnboarding,
}: {
  data: any;
  needsOnboarding: boolean;
}) {
  const router = useRouter();
  const [nav, setNav] = useState<{ stack: ScreenKey[]; current: ScreenKey }>({
    stack: [],
    current: needsOnboarding ? 'onboarding-profile' : 'home',
  });
  const [saving, setSaving] = useState(false);
  const [onboarding, setOnboarding] = useState<OnboardingData>({
    name: data.user?.name ?? undefined,
    age: data.user?.age ? Number(data.user.age) : undefined,
    gender: data.user?.gender ?? undefined,
    height_cm: data.user?.height_cm ? Number(data.user.height_cm) : undefined,
    weight_kg: data.user?.weight_kg ? Number(data.user.weight_kg) : undefined,
    activity_level: data.user?.activity_level ?? 'Sedang',
    goal: data.user?.goal ?? undefined,
    diet_pref: data.user?.diet_pref ?? undefined,
    medical_note: data.user?.medical_note ?? undefined,
  });

  const go = useCallback(
    (s: ScreenKey) =>
      setNav((n) => ({ stack: [...n.stack, n.current], current: s })),
    []
  );
  const back = useCallback(
    () =>
      setNav((n) =>
        n.stack.length
          ? { stack: n.stack.slice(0, -1), current: n.stack[n.stack.length - 1] }
          : n
      ),
    []
  );
  const reset = useCallback((s: ScreenKey) => setNav({ stack: [], current: s }), []);

  const updateOnboarding = useCallback(
    (patch: Partial<OnboardingData>) =>
      setOnboarding((o) => ({ ...o, ...patch })),
    []
  );

  const finishOnboarding = useCallback(async () => {
    setSaving(true);
    try {
      await completeOnboarding(onboarding);
      router.refresh();
    } finally {
      setSaving(false);
    }
    setNav((n) => ({ stack: [...n.stack, n.current], current: 'first-result' }));
  }, [onboarding, router]);

  const restart = useCallback(async () => {
    setSaving(true);
    try {
      await restartOnboarding();
      router.refresh();
    } finally {
      setSaving(false);
    }
    setNav({ stack: [], current: 'onboarding-profile' });
  }, [router]);

  const ctx = useMemo(
    () => ({
      screen: nav.current,
      go,
      back,
      reset,
      canGoBack: nav.stack.length > 0,
      onboarding,
      updateOnboarding,
      finishOnboarding,
      restartOnboarding: restart,
      saving,
    }),
    [nav, go, back, reset, onboarding, updateOnboarding, finishOnboarding, restart, saving]
  );

  const meta = META[nav.current];

  return (
    <AppContext.Provider value={ctx}>
      <main className="min-h-screen bg-ink-100">
        <div className="mx-auto flex max-w-[440px] flex-col items-center px-4 py-6">
          {/* Bilah kendali aplikasi (di luar ponsel) */}
          <div className="flex w-full items-center justify-between gap-2 pb-3">
            <button
              type="button"
              onClick={back}
              disabled={!ctx.canGoBack}
              className="rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-[0.72rem] font-semibold text-ink-700 transition hover:bg-ink-50 disabled:opacity-40"
            >
              ← Kembali
            </button>
            <div className="min-w-0 text-center">
              <div className="truncate text-[0.78rem] font-semibold text-ink-950">
                {meta.title}
              </div>
              <div className="text-[0.6rem] text-ink-500">{meta.flow}</div>
            </div>
            <Link
              href="/layar"
              className="rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-[0.72rem] font-semibold text-ink-700 transition hover:bg-ink-50"
            >
              Galeri
            </Link>
          </div>

          {/* Ponsel */}
          <div className="phone">
            <div className="phone-notch" />
            <div className="phone-scroll">{renderScreen(nav.current, data, ctx)}</div>
          </div>

          <div className="mt-4 flex w-full items-center justify-between gap-3 text-[0.7rem] text-ink-500">
            <span className="truncate">
              Masuk sebagai{' '}
              <strong className="font-semibold text-ink-800">
                {data.user?.email ?? '-'}
              </strong>
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="font-semibold text-brand-700 hover:underline"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </main>
    </AppContext.Provider>
  );
}

function renderScreen(
  screen: ScreenKey,
  data: any,
  ctx: { saving: boolean }
) {
  switch (screen) {
    case 'onboarding-profile':
      return <OnboardingProfileScreen />;
    case 'onboarding-body':
      return <OnboardingBodyScreen />;
    case 'onboarding-goal':
      return <OnboardingGoalScreen />;
    case 'consent':
      return <ConsentScreen />;
    case 'first-result':
      return <FirstResultScreen user={data.user} />;
    case 'home':
      return (
        <HomeScreen user={data.user} meals={data.meals} activities={data.acts} />
      );
    case 'scan':
      return <ScanScreen />;
    case 'scan-processing':
      return <ScanProcessingScreen />;
    case 'scan-review':
      return <ScanReviewScreen />;
    case 'scan-fallback':
      return <ScanFallbackScreen />;
    case 'portion':
      return <PortionScreen user={data.user} recs={data.recs} />;
    case 'trends':
      return <TrendsScreen meals={data.meals} metrics={data.metrics} />;
    case 'log':
      return <LogScreen />;
    case 'coaching':
      return <CoachingScreen />;
    case 'report':
      return <ReportScreen />;
    case 'subscribe':
      return <SubscribeScreen plans={data.plans} />;
    case 'privacy':
      return (
        <PrivacyScreen consent={data.consent} subscription={data.subscription} />
      );
    case 'settings':
      return <SettingsScreen user={data.user} wallet={data.wallet} />;
    case 'more':
      return <MoreScreen user={data.user} wallet={data.wallet} saving={ctx.saving} />;
    default:
      return null;
  }
}
