'use client';

import {
  ScreenHead,
  ScreenBody,
  Chip,
  Note,
  Progress,
  MacroBar,
  BottomNav,
  StatusBar,
  Avatar,
  ConfidenceBadge,
} from '@/components/ui';
import { useApp } from '@/components/app/nav';

type MealRow = {
  id: number;
  meal_type: string;
  logged_at: string;
  detection_source: string;
  confidence: number | null;
  photo_label: string | null;
  items: any[];
  totals: { kcal: number; protein: number; carbs: number; fat: number; fiber: number };
};

function timeOf(iso: string) {
  const d = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T'));
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

function sourceChip(src: string) {
  if (src === 'on_device') return <Chip tone="good">on-device</Chip>;
  if (src === 'llm_vision') return <Chip tone="warn">fallback server</Chip>;
  return <Chip tone="neutral">manual</Chip>;
}

export function HomeScreen({
  user,
  meals,
  activities,
}: {
  user: any;
  meals: MealRow[];
  activities: any[];
}) {
  const app = useApp();
  const totals = meals.reduce(
    (a, m) => ({
      kcal: a.kcal + m.totals.kcal,
      protein: a.protein + m.totals.protein,
      carbs: a.carbs + m.totals.carbs,
      fat: a.fat + m.totals.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
  const kcalTarget = 2100;
  const remain = Math.max(0, kcalTarget - totals.kcal);
  const activityMin = activities.reduce((a, x) => a + x.duration_min, 0);

  return (
    <div className="flex h-full flex-col pb-20">
      <StatusBar />
      <ScreenHead
        title="Hari ini"
        sub="Kamis, 1 Oktober 2026"
        right={
          <button type="button" onClick={() => app?.reset('more')} title="Profil">
            <Avatar name={user?.name ?? 'Redo'} size={34} />
          </button>
        }
      />
      <ScreenBody className="pb-4">
        {/* Calorie ring */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#eceef2" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#25808a" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(Math.min(1, totals.kcal / kcalTarget) * 264).toFixed(1)} 264`}
                />
              </svg>
              <div className="absolute text-center">
                <div className="tabular text-lg font-semibold leading-none text-ink-950">
                  {Math.round(totals.kcal)}
                </div>
                <div className="text-[0.55rem] text-ink-500">dari {kcalTarget}</div>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <div className="text-[0.7rem] text-ink-500">Sisa energi</div>
                <div className="tabular text-[1.3rem] font-semibold leading-tight text-ink-950">
                  {Math.round(remain)} <span className="text-[0.75rem] font-medium text-ink-500">kkal</span>
                </div>
              </div>
              <div>
                <MacroBar label="Protein" value={totals.protein} target={130} color="#25808a" />
              </div>
              <div>
                <MacroBar label="Karbohidrat" value={totals.carbs} target={240} color="#e5764b" />
              </div>
              <div>
                <MacroBar label="Lemak" value={totals.fat} target={70} color="#8593ad" />
              </div>
            </div>
          </div>
        </div>

        {/* Sugar load warning */}
        <div className="card border-amber-200 bg-amber-50">
          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none">⚠</span>
            <div className="min-w-0">
              <div className="text-[0.8rem] font-semibold text-amber-900">
                Sugar load sedang tinggi
              </div>
              <p className="mt-0.5 text-[0.7rem] leading-snug text-amber-800">
                Es teh manis 250 g menyumbang 26 g gula. Coba ganti air
                putih untuk sesi berikutnya.
              </p>
            </div>
          </div>
        </div>

        {/* Meals */}
        <div className="flex items-center justify-between pt-1">
          <span className="label">Sesi makan</span>
          <button
            type="button"
            onClick={() => app?.go('trends')}
            className="text-[0.7rem] font-medium text-brand-700 hover:underline"
          >
            Lihat semua
          </button>
        </div>
        <div className="card p-0">
          {meals.map((m, i) => (
            <div key={m.id} className={`flex items-center gap-3 p-3 ${i > 0 ? 'border-t border-ink-100' : ''}`}>
              <div className="tabular w-11 shrink-0 text-[0.7rem] text-ink-400">
                {timeOf(m.logged_at)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[0.82rem] font-semibold text-ink-900">
                    {m.meal_type}
                  </span>
                  {sourceChip(m.detection_source)}
                </div>
                <div className="mt-0.5 truncate text-[0.68rem] text-ink-500">
                  {m.photo_label ?? m.items.map((x) => x.name).join(', ')}
                </div>
              </div>
              <div className="tabular shrink-0 text-[0.8rem] font-semibold text-ink-900">
                {Math.round(m.totals.kcal)}
                <span className="text-[0.6rem] font-medium text-ink-400"> kkal</span>
              </div>
            </div>
          ))}
        </div>

        {/* Activity + portion summary */}
        <div className="grid grid-cols-2 gap-2">
          <div className="card-flat">
            <div className="label mb-1">Aktivitas</div>
            <div className="tabular text-[1.05rem] font-semibold text-ink-950">
              {activityMin} <span className="text-[0.7rem] font-medium text-ink-500">menit</span>
            </div>
            <div className="mt-0.5 text-[0.65rem] text-ink-500">
              {activities.length} sesi tercatat
            </div>
          </div>
          <div className="card-flat">
            <div className="label mb-1">Porsi tercatat</div>
            <div className="tabular text-[1.05rem] font-semibold text-ink-950">
              1.093 <span className="text-[0.7rem] font-medium text-ink-500">g</span>
            </div>
            <div className="mt-0.5 text-[0.65rem] text-brand-700">87% target 1.250 g</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => app?.reset('coaching')}
            className="btn-secondary w-full text-[0.8rem]"
          >
            Coaching harian
          </button>
          <button
            type="button"
            onClick={() => app?.reset('subscribe')}
            className="btn-secondary w-full text-[0.8rem]"
          >
            Paket Pro
          </button>
        </div>

        <button
          type="button"
          onClick={() => app?.go('log')}
          className="btn-primary w-full"
        >
          + Tambah catatan
        </button>
      </ScreenBody>
      <BottomNav active="home" />
    </div>
  );
}

export function PortionScreen({ user, recs }: { user: any; recs: any[] }) {
  const app = useApp();
  const totalGrams = recs.reduce((a, r) => a + r.target_grams, 0);
  const totalKcal = recs.reduce((a, r) => a + r.calorie_target, 0);
  const done = new Set([1, 2, 3]);

  return (
    <div className="flex h-full flex-col pb-20">
      <StatusBar />
      <ScreenHead
        title="Rekomendasi porsi"
        sub="Disesuaikan dengan profil dan progres Anda."
        right={<Chip tone="brand">diper personalize</Chip>}
      />
      <ScreenBody className="pb-4">
        {/* Plate visual */}
        <div className="card">
          <div className="mb-2 flex items-center justify-between">
            <span className="label">Target hari ini</span>
            <span className="text-[0.68rem] text-ink-400">1.250 g / 2.100 kkal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 rounded-full bg-ink-50">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-1/2 w-1/2 bg-emerald-300" />
                <div className="absolute right-0 top-0 h-1/2 w-1/2 bg-amber-300" />
                <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-sky-300" />
                <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-rose-200" />
              </div>
              <div className="absolute inset-2 rounded-full border border-white/70" />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5 text-[0.7rem]">
              {[
                ['bg-emerald-300', 'Sayur dan serat'],
                ['bg-amber-300', 'Karbohidrat'],
                ['bg-sky-300', 'Protein'],
                ['bg-rose-200', 'Lemak sehat'],
              ].map(([bg, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${bg}`} />
                  <span className="text-ink-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink-100 pt-3">
            <div className="text-center">
              <div className="tabular text-[1.15rem] font-semibold text-ink-950">
                {Math.round(totalGrams)} g
              </div>
              <div className="text-[0.62rem] text-ink-500">total porsi</div>
            </div>
            <div className="border-l border-ink-100 text-center">
              <div className="tabular text-[1.15rem] font-semibold text-ink-950">
                {Math.round(totalKcal)} kkal
              </div>
              <div className="text-[0.62rem] text-ink-500">target energi</div>
            </div>
          </div>
        </div>

        {/* Per session */}
        {recs.map((r, i) => (
          <div key={r.id} className="card">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[0.88rem] font-semibold text-ink-900">
                    {r.session_type}
                  </span>
                  {done.has(i + 1) ? <Chip tone="good">tercatat</Chip> : null}
                </div>
                <div className="tabular mt-1 text-[1.05rem] font-semibold text-ink-950">
                  {r.target_grams} g
                  <span className="ml-1.5 text-[0.7rem] font-medium text-ink-500">
                    {r.calorie_target} kkal
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="tabular text-[0.65rem] text-ink-400">
                  {Math.round((r.target_grams / totalGrams) * 100)}%
                </div>
                <div className="text-[0.6rem] text-ink-400">dari harian</div>
              </div>
            </div>
            <div className="mt-2 rounded-lg bg-ink-50 p-2.5">
              <div className="mb-0.5 flex items-center gap-1.5">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.06em] text-brand-700">
                  Mengapa
                </span>
              </div>
              <p className="text-[0.72rem] leading-snug text-ink-700">{r.rationale}</p>
            </div>
          </div>
        ))}

        <Note tone="warn" title="Estimasi, bukan resep">
          Rekomendasi ini disusun dari data yang Anda masukkan dan dapat
          berubah bila profil atau target Anda diperbarui.
        </Note>

        <button
          type="button"
          onClick={() => app?.go('settings')}
          className="btn-secondary w-full"
        >
          Sesuaikan target manual
        </button>
      </ScreenBody>
      <BottomNav active="portion" />
    </div>
  );
}

export function TrendsScreen({ meals, metrics }: { meals: MealRow[]; metrics: any[] }) {
  const week = [
    { d: 'Sen', kcal: 2050, target: 2100 },
    { d: 'Sel', kcal: 2280, target: 2100 },
    { d: 'Rab', kcal: 1960, target: 2100 },
    { d: 'Kam', kcal: 1874, target: 2100 },
    { d: 'Jum', kcal: 2100, target: 2100 },
    { d: 'Sab', kcal: 0, target: 2100 },
    { d: 'Min', kcal: 0, target: 2100 },
  ];
  const max = Math.max(...week.map((w) => Math.max(w.kcal, w.target)));
  const todayIdx = 4;

  return (
    <div className="flex h-full flex-col pb-20">
      <StatusBar />
      <ScreenHead
        title="Tren"
        sub="Minggu 1 Oktober 2026"
        right={<Chip tone="neutral">mingguan</Chip>}
      />
      <ScreenBody className="pb-4">
        {/* Calorie bars */}
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <span className="label">Energi per hari</span>
            <span className="text-[0.65rem] text-ink-400">target 2.100 kkal</span>
          </div>
          <div className="flex h-32 items-end justify-between gap-1.5">
            {week.map((w, i) => {
              const h = (w.kcal / max) * 100;
              const t = (w.target / max) * 100;
              const isToday = i === todayIdx;
              const over = w.kcal > w.target;
              return (
                <div key={w.d} className="flex flex-1 flex-col items-center gap-1">
                  <div className="relative flex h-28 w-full items-end justify-center">
                    <div className="absolute inset-x-0 border-t border-dashed border-ink-300" style={{ bottom: `${t}%` }} />
                    {w.kcal > 0 ? (
                      <div
                        className={`w-full max-w-[18px] rounded-t ${over ? 'bg-accent-400' : isToday ? 'bg-brand-600' : 'bg-brand-300'}`}
                        style={{ height: `${h}%` }}
                      />
                    ) : (
                      <div className="h-1 w-full max-w-[18px] rounded bg-ink-200" />
                    )}
                  </div>
                  <span className={`text-[0.6rem] ${isToday ? 'font-semibold text-brand-700' : 'text-ink-400'}`}>
                    {w.d}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-4 border-t border-ink-100 pt-2.5 text-[0.62rem] text-ink-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-brand-600" /> dalam target
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-accent-400" /> melewati target
            </span>
            <span className="flex items-center gap-1">
              <span className="h-px w-3 border-t border-dashed border-ink-400" /> target
            </span>
          </div>
        </div>

        {/* Insights */}
        <div className="card border-brand-200 bg-brand-50">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-brand-700">
              Insight otomatis
            </span>
          </div>
          <ul className="space-y-2">
            {[
              'Rata-rata energi 2.053 kkal, 2 persen di bawah target.',
              'Hari dengan aktivitas tinggi rata-rata caloric lebih tinggi, dan itu wajar.',
              'Gula halus pada sesi sore menjadi penyumbang sugar load terbesar.',
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                <span className="text-[0.73rem] leading-snug text-ink-700">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weight trend */}
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <span className="label">Berat badan</span>
            <span className="tabular text-[0.65rem] text-ink-400">-0,9 kg dalam 2 minggu</span>
          </div>
          <svg viewBox="0 0 260 70" className="h-[70px] w-full">
            <polyline
              points={metrics
                .slice()
                .reverse()
                .map((m, i) => {
                  const xs = metrics.slice().reverse();
                  const y =
                    10 + ((76 - m.weight_kg) / 2) * 40;
                  return `${20 + i * ((220) / Math.max(1, xs.length - 1))},${Math.min(64, y)}`;
                })
                .join(' ')}
              fill="none"
              stroke="#25808a"
              strokeWidth="2"
            />
            {metrics
              .slice()
              .reverse()
              .map((m, i) => {
                const xs = metrics.slice().reverse();
                const y = 10 + ((76 - m.weight_kg) / 2) * 40;
                return (
                  <circle
                    key={m.id}
                    cx={20 + i * (220 / Math.max(1, xs.length - 1))}
                    cy={Math.min(64, y)}
                    r="3"
                    fill="#25808a"
                  />
                );
              })}
          </svg>
          <div className="mt-1 flex justify-between text-[0.6rem] text-ink-400">
            <span>17 Sep</span>
            <span>24 Sep</span>
            <span>1 Okt</span>
          </div>
        </div>

        {/* Meal quality */}
        <div className="card">
          <div className="mb-2.5 label">Mutu sesi makan</div>
          <div className="space-y-2.5">
            {[
              ['Sarapan', 0.86, 'good'],
              ['Makan siang', 0.72, 'warn'],
              ['Snack', 0.34, 'bad'],
              ['Makan malam', 0.51, 'bad'],
            ].map(([label, score, tone]) => (
              <div key={label as string}>
                <Progress
                  value={(score as number) * 100}
                  label={label as string}
                  hint={
                    (score as number) >= 0.7
                      ? 'seimbang'
                      : (score as number) >= 0.45
                        ? 'perbaiki'
                        : 'lemah'
                  }
                  tone={tone as any}
                />
              </div>
            ))}
          </div>
        </div>

        <Note tone="info" title="Data belum cukup untuk tren jangka panjang">
          Tren mingguan memerlukan minimal 4 minggu data konsisten.
        </Note>
      </ScreenBody>
      <BottomNav active="trends" />
    </div>
  );
}
