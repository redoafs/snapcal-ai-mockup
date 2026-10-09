import { loadData } from '@/lib/db';
import { Phone } from '@/components/ui';
import { FirstResultScreen } from '@/components/screens/onboarding';
import { ScanScreen, ScanProcessingScreen, ScanReviewScreen, ScanFallbackScreen } from '@/components/screens/scan';
import {
  HomeScreen,
  PortionScreen,
  TrendsScreen,
} from '@/components/screens/dashboard';
import {
  LogScreen,
  CoachingScreen,
  ReportScreen,
  SubscribeScreen,
  PrivacyScreen,
  SettingsScreen,
} from '@/components/screens/other';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const {
    user,
    meals,
    recs,
    acts,
    metrics,
    plans,
    screens,
    consent,
    subscription,
    wallet,
  } = await loadData();

  const kcalToday = Math.round(meals.reduce((a, m) => a + m.totals.kcal, 0));
  const gramsToday = Math.round(
    meals.reduce((a, m) => a + m.items.reduce((x, i) => x + i.portion_grams, 0), 0)
  );
  const activityMin = acts.reduce((a, x) => a + x.duration_min, 0);
  const targetGrams = Math.round(recs.reduce((a, r) => a + r.target_grams, 0));

  const flowOnboarding = {
    id: 'onboarding',
    code: 'UF-01',
    title: 'Registrasi dan onboarding',
    desc: 'Dari pendaftaran sampai melihat hasil pertama. Persetujuan data adalah langkah wajib sebelum data dikirim, dan hasilnya muncul dalam satu sesi.',
    screens: [
      {
        t: 'Selamat datang',
        s: 'welcome',
        r: 'FR-001, FR-004',
        el: <Welcome />,
      },
      { t: 'Buat akun', s: 'signup', r: 'FR-001', el: <Signup /> },
      { t: 'Verifikasi email', s: 'verify', r: 'FR-002', el: <Verify /> },
      {
        t: 'Onboarding: profil dasar',
        s: 'onboarding-profile',
        r: 'FR-003',
        el: <OnbProfile />,
      },
      {
        t: 'Onboarding: data tubuh',
        s: 'onboarding-body',
        r: 'FR-003',
        el: <OnbBody />,
      },
      {
        t: 'Onboarding: tujuan',
        s: 'onboarding-goal',
        r: 'FR-005',
        el: <OnbGoal />,
      },
      { t: 'Izin data', s: 'consent', r: 'FR-004, NFR-013', el: <Consent /> },
      {
        t: 'Hasil pertama',
        s: 'first-result',
        r: 'FR-003, FR-021',
        el: <FirstResultScreen user={user} />,
      },
    ],
  };

  const flowScan = {
    id: 'scan',
    code: 'UF-02',
    title: 'Deteksi makanan dari foto',
    desc: 'Inferensi di perangkat menjadi jalur utama. Bila keyakinan rendah, fallback server selalu meminta izin lebih dahulu dan menjelaskan risikonya.',
    screens: [
      { t: 'Pindai makanan', s: 'scan', r: 'FR-008, FR-009', el: <ScanScreen /> },
      {
        t: 'Proses deteksi',
        s: 'scan-processing',
        r: 'FR-014, NFR-002',
        el: <ScanProcessingScreen />,
      },
      {
        t: 'Review hasil deteksi',
        s: 'scan-review',
        r: 'FR-016, FR-017',
        el: <ScanReviewScreen />,
      },
      {
        t: 'Persetujuan fallback',
        s: 'scan-fallback',
        r: 'FR-015, FR-004',
        el: <ScanFallbackScreen />,
      },
    ],
  };

  const flowDaily = {
    id: 'daily',
    code: 'UF-03 / UF-04',
    title: 'Dashboard, porsi, dan logging',
    desc: 'Layar utama harian. Angka calories, makro, sugar load, dan rekomendasi porsi dibaca langsung dari Supabase.',
    screens: [
      {
        t: 'Dashboard harian',
        s: 'home',
        r: 'FR-033, NFR-016',
        el: <HomeScreen user={user} meals={meals} activities={acts} />,
      },
      {
        t: 'Rekomendasi porsi',
        s: 'portion',
        r: 'FR-021, FR-022, FR-024',
        el: <PortionScreen user={user} recs={recs} />,
      },
      {
        t: 'Tren dan insight',
        s: 'trends',
        r: 'FR-034, FR-035',
        el: <TrendsScreen meals={meals} metrics={metrics} />,
      },
      { t: 'Tambah catatan', s: 'log', r: 'FR-030, FR-032', el: <LogScreen /> },
    ],
  };

  const flowRetention = {
    id: 'retention',
    code: 'UF-05',
    title: 'Coaching dan retensi',
    desc: 'Check-in harian yang ringan, konsistensi tanpa tekanan, dan rekomendasi yang menyesuaikan diri berdasarkan tren pengguna.',
    screens: [
      {
        t: 'Coaching dan retensi',
        s: 'coaching',
        r: 'FR-039, FR-040',
        el: <CoachingScreen />,
      },
    ],
  };

  const flowMoney = {
    id: 'monetization',
    code: 'UF-06',
    title: 'Berlangganan premium',
    desc: 'Paket gratis yang cukup untuk mencoba, dan premium yang membuka fitur analitik serta ekspor laporan.',
    screens: [
      {
        t: 'Pilih paket',
        s: 'subscribe',
        r: 'FR-043, FR-044',
        el: <SubscribeScreen plans={plans} />,
      },
    ],
  };

  const flowPrivacy = {
    id: 'privacy',
    code: 'UF-07 / UF-08',
    title: 'Laporan, privasi, dan pengaturan',
    desc: 'Ekspor laporan untuk profesional, kontrol data pengguna, dan penghapusan akun dengan konsekuensi yang dijelaskan terbuka.',
    screens: [
      { t: 'Laporan', s: 'report', r: 'FR-037', el: <ReportScreen /> },
      {
        t: 'Privasi dan data',
        s: 'privacy',
        r: 'FR-047, FR-048, FR-049',
        el: <PrivacyScreen consent={consent} subscription={subscription} />,
      },
      {
        t: 'Pengaturan',
        s: 'settings',
        r: 'FR-007, FR-036',
        el: <SettingsScreen user={user} wallet={wallet} />,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-ink-100">
      <header className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white">
        <div className="mx-auto max-w-[1680px] px-6 py-10">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div>
              <div className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-brand-200">
                UI/UX Mockup
              </div>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">
                SnapCal AI
              </h1>
              <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-white/75">
                Rancangan antarmuka untuk alur inti sesuai PRD SnapCal AI,
                dibangun dengan Next.js dan data contoh dari Supabase.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-10 gap-y-3 text-[0.8rem] sm:grid-cols-4">
              {[
                ['Layar', String(screens.length)],
                ['Alur', '8'],
                ['Modul FR', '11'],
                ['Tabel DB', '13'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.68rem] uppercase tracking-[0.08em] text-brand-300">
                    {k}
                  </dt>
                  <dd className="tabular text-2xl font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/15 pt-4 text-[0.8rem] text-white/80">
            <span>
              Masuk sebagai{' '}
              <strong className="font-semibold text-white">{user?.email}</strong>
            </span>
            <form action="/auth/signout" method="post">
              <button
                className="rounded-lg border border-white/30 px-3 py-1 font-semibold text-white transition hover:bg-white/10"
                type="submit"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-x-6 gap-y-1.5 px-6 py-3 text-[0.72rem] text-ink-500">
          <span className="font-semibold text-ink-700">Legenda</span>
          <span>Setiap bingkai adalah satu layar aplikasi</span>
          <span className="hidden sm:inline">
            Label <code className="font-mono text-brand-600">/slug</code>{' '}
            adalah rute yang akan dipakai
          </span>
          <span className="hidden md:inline">
            Kode FR merujuk PRD SnapCal AI
          </span>
          <span className="ml-auto hidden lg:inline">
            Data dari <code className="font-mono">Supabase</code>
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1680px] space-y-16 px-6 py-12">
        {[flowOnboarding, flowScan, flowDaily, flowRetention, flowMoney, flowPrivacy].map(
          (f) => (
            <FlowSection key={f.id} {...f} />
          )
        )}

        <section>
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950">
            Daftar lengkap layar
          </h2>
          <p className="mt-1 text-[0.9rem] text-ink-600">
            Disimpan pada tabel{' '}
            <code className="font-mono text-brand-700">app_screens</code>
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl2 border border-ink-200 bg-white shadow-card">
            <table className="w-full text-left text-[0.82rem]">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50">
                  {['#', 'Alur', 'Judul', 'Rute', 'Requirement', 'Deskripsi'].map(
                    (h) => (
                      <th key={h} className="px-4 py-2.5 font-semibold text-ink-800">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {screens.map((s: any) => (
                  <tr key={s.slug} className="border-b border-ink-100 last:border-0">
                    <td className="tabular px-4 py-2.5 text-ink-500">
                      {s.screen_order}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <span className="font-mono text-[0.72rem] text-brand-700">
                        {s.flow_id}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-medium text-ink-900">
                      {s.title}
                    </td>
                    <td className="px-4 py-2.5">
                      <code className="font-mono text-[0.72rem] text-ink-600">
                        /{s.slug}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[0.72rem] text-ink-500">
                      {s.fr_refs}
                    </td>
                    <td className="px-4 py-2.5 text-ink-600">{s.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950">
            Data dari Supabase
          </h2>
          <p className="mt-1 text-[0.9rem] text-ink-600">
            Angka pada layar mockup dibaca langsung dari{' '}
            <code className="mx-1 font-mono text-brand-700">Supabase</code>{' '}
            melalui @supabase/supabase-js, dengan Row Level Security aktif.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                'Profil pengguna',
                user?.name,
                `${user?.weight_kg} kg, ${user?.height_cm} cm, skor metabolisme ${user?.metabolic_score}`,
              ],
              ['Makan hari ini', `${meals.length} sesi`, `${kcalToday} kkal, ${gramsToday} g`],
              [
                'Target porsi',
                `${recs.length} sesi`,
                `${targetGrams} g per hari`,
              ],
              [
                'Aktivitas',
                `${acts.length} sesi`,
                `${activityMin} menit tercatat`,
              ],
            ].map(([label, value, sub]) => (
              <div key={label} className="card">
                <div className="label">{label}</div>
                <div className="tabular mt-1 text-xl font-semibold text-ink-950">
                  {value}
                </div>
                <div className="mt-0.5 text-[0.72rem] text-ink-500">{sub}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-ink-200 bg-white">
        <div className="mx-auto max-w-[1680px] px-6 py-8 text-[0.78rem] text-ink-500">
          <p>
            Mockup UI/UX SnapCal AI. Seluruh target angka dan klaim klinis
            merupakan data contoh dan belum tervalidasi empiris.
          </p>
          <p className="mt-1">
            Sumber: PRD SnapCal AI v1.0, Studi Kelayakan, dan Laporan
            Post-Mortem.
          </p>
        </div>
      </footer>
    </main>
  );
}

function FlowSection({
  id,
  code,
  title,
  desc,
  screens,
}: {
  id: string;
  code: string;
  title: string;
  desc: string;
  screens: { t: string; s: string; r: string; el: React.ReactNode }[];
}) {
  return (
    <section id={id}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[0.78rem] font-semibold text-brand-600">
          {code}
        </span>
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950">
          {title}
        </h2>
      </div>
      <p className="mt-1.5 max-w-3xl text-[0.9rem] leading-relaxed text-ink-600">
        {desc}
      </p>
      <div className="mt-6 flex gap-8 overflow-x-auto pb-4">
        {screens.map((sc) => (
          <Phone key={sc.s} title={sc.t} screenName={sc.s} frRefs={sc.r}>
            {sc.el}
          </Phone>
        ))}
      </div>
    </section>
  );
}

/* Onboarding screens are static mockups; imported here to keep page.tsx tidy. */
import {
  WelcomeScreen as Welcome,
  SignupScreen as Signup,
  VerifyScreen as Verify,
  OnboardingProfileScreen as OnbProfile,
  OnboardingBodyScreen as OnbBody,
  OnboardingGoalScreen as OnbGoal,
  ConsentScreen as Consent,
} from '@/components/screens/onboarding';