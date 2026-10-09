import {
  Phone,
  ScreenHead,
  ScreenBody,
  Chip,
  Progress,
  Note,
  BottomAction,
  StatusBar,
  Avatar,
} from '@/components/ui';

/** Step dots shared by the onboarding screens. */
function StepDots({ current, total = 4 }: { current: number; total?: number }) {
  return (
    <div className="flex items-center gap-1.5 px-5 pt-2">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < current ? 'bg-brand-500' : 'bg-ink-200'
          }`}
        />
      ))}
    </div>
  );
}

export function WelcomeScreen() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-brand-700 via-brand-600 to-brand-800">
      <div className="flex justify-end px-5 pt-3">
        <button className="rounded-lg px-3 py-1.5 text-[0.75rem] font-semibold text-white/90">
          Masuk
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center px-7">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur">
          ◎
        </div>
        <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
          Kenali profil
          <br />
          metabolisme
          <br />
          Anda.
        </h1>
        <p className="mt-4 text-[0.85rem] leading-relaxed text-white/80">
          Pindai makanan, dapatkan rekomendasi ukuran porsi yang
          personal, dan konsisten setiap hari.
        </p>

        <ul className="mt-8 space-y-3">
          {[
            ['Deteksi langsung di perangkat', 'Foto Anda tidak dikirim tanpa izin'],
            ['Rekomendasi ada alasannya', 'Angka disertai penjelasan sederhana'],
            ['Data sepenuhnya milik Anda', 'Unduh atau hapus kapan saja'],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[0.65rem] font-bold text-white">
                ✓
              </span>
              <span>
                <span className="block text-[0.8rem] font-semibold text-white">{t}</span>
                <span className="block text-[0.72rem] text-white/70">{d}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-7 pb-8">
        <button className="btn w-full bg-white text-brand-800 hover:bg-brand-50">
          Mulai sekarang
        </button>
        <p className="mt-3 text-center text-[0.65rem] leading-snug text-white/60">
          Dengan melanjutkan, Anda menyetujui Kebijakan Privasi dan
          PemConditions Usage.
        </p>
      </div>
    </div>
  );
}

export function SignupScreen() {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <ScreenHead
        title="Buat akun"
        sub="Mulai dari email, lalu lengkapi profil singkat."
      />
      <ScreenBody>
        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="field"
            defaultValue="redo@snapcal.ai"
            type="email"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="pass">
            Kata sandi
          </label>
          <input id="pass" className="field" defaultValue="••••••••••" type="password" />
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[0.7rem] text-ink-500">
              Kuat. Minimal 8 karakter.
            </span>
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[0.7rem] text-ink-400">
            atau
          </span>
          <div className="divider" />
        </div>
        <button className="btn-secondary w-full">
          <span className="text-[0.95rem]">✉</span> Kirim tautan lewat email
        </button>
        <p className="text-center text-[0.72rem] text-ink-500">
          Sudah punya akun?{' '}
          <span className="font-semibold text-brand-700">Masuk</span>
        </p>
      </ScreenBody>
      <BottomAction>
        <button className="btn-primary w-full">Lanjutkan</button>
      </BottomAction>
    </div>
  );
}

export function VerifyScreen() {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <ScreenHead title="Verifikasi email" sub="Satu langkah lagi sebelum masuk." />
      <ScreenBody>
        <div className="flex flex-col items-center py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl">
            ✉
          </div>
          <p className="mt-4 text-[0.85rem] leading-relaxed text-ink-700">
            Kami mengirim tautan verifikasi ke
          </p>
          <p className="mt-1 font-semibold text-ink-950">redo@snapcal.ai</p>
        </div>
        <Note tone="info" title="Tidak menerima email?">
          Periksa folder spam, atau kirim ulang tautan. Tautan berlaku
          15 menit.
        </Note>
        <button className="btn-secondary w-full">Kirim ulang tautan</button>
        <p className="text-center text-[0.72rem] text-ink-400">
          Salah alamat?{' '}
          <span className="font-semibold text-brand-700">Ganti email</span>
        </p>
      </ScreenBody>
    </div>
  );
}

export function OnboardingProfileScreen() {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <StepDots current={1} />
      <ScreenHead
        title="Profil dasar"
        sub="Langkah 1 dari 4. Dipakai untuk dasar perhitungan metabolisme."
      />
      <ScreenBody>
        <div>
          <label className="field-label">Nama panggilan</label>
          <input className="field" defaultValue="Redo" />
        </div>
        <div>
          <label className="field-label">Usia</label>
          <div className="grid grid-cols-2 gap-2">
            <input className="field" defaultValue="31" inputMode="numeric" />
            <div className="flex items-center rounded-xl border border-ink-300 px-3 text-[0.9rem] text-ink-600">
              tahun
            </div>
          </div>
        </div>
        <div>
          <label className="field-label">Jenis kelamin</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Pria', true],
              ['Wanita', false],
            ].map(([label, on]) => (
              <div key={label as string} className={`option ${on ? 'option-active' : ''}`}>
                <span className="text-[0.85rem] font-medium">{label as string}</span>
              </div>
            ))}
          </div>
          <p className="mt-1.5 text-[0.68rem] leading-snug text-ink-400">
            Dipakai untuk penyesuaian perhitungan metabolisme.
          </p>
        </div>
      </ScreenBody>
      <BottomAction>
        <button className="btn-primary w-full">Lanjut</button>
      </BottomAction>
    </div>
  );
}

export function OnboardingBodyScreen() {
  const activity = [
    ['Rendah', 'Kantor, jarang olahraga', false],
    ['Sedang', '1-3 kali seminggu', true],
    ['Tinggi', '4-6 kali seminggu', false],
  ];
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <StepDots current={2} />
      <ScreenHead
        title="Data tubuh"
        sub="Langkah 2 dari 4. Dasar perhitungan ukuran porsi."
      />
      <ScreenBody>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Tinggi</label>
            <div className="relative">
              <input className="field tabular" defaultValue="172" inputMode="decimal" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.75rem] text-ink-400">
                cm
              </span>
            </div>
          </div>
          <div>
            <label className="field-label">Berat</label>
            <div className="relative">
              <input className="field tabular" defaultValue="74,5" inputMode="decimal" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.75rem] text-ink-400">
                kg
              </span>
            </div>
          </div>
        </div>
        <div>
          <label className="field-label">Tingkat aktivitas</label>
          <div className="space-y-2">
            {activity.map(([label, desc, on]) => (
              <div key={label as string} className={`option ${on ? 'option-active' : ''}`}>
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    on ? 'border-brand-600 bg-brand-600' : 'border-ink-300'
                  }`}
                >
                  {on ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                </span>
                <span>
                  <span className="block text-[0.83rem] font-medium text-ink-900">
                    {label as string}
                  </span>
                  <span className="block text-[0.7rem] text-ink-500">{desc as string}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <Note tone="brand" title="Bisa diubah nanti">
          Semua data ini dapat Anda perbarui kapan saja di menu Pengaturan.
        </Note>
      </ScreenBody>
      <BottomAction>
        <button className="btn-primary w-full">Lanjut</button>
      </BottomAction>
    </div>
  );
}

export function OnboardingGoalScreen() {
  const goals = [
    ['Menjaga berat badan', false],
    ['Menambah massa otot', true],
    ['Menurunkan berat badan', false],
    ['Mengontrol gula darah', false],
  ];
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <StepDots current={3} />
      <ScreenHead
        title="Tujuan Anda"
        sub="Langkah 3 dari 4. Menentukan fokus rekomendasi porsi."
      />
      <ScreenBody>
        <div className="space-y-2">
          {goals.map(([label, on]) => (
            <div key={label as string} className={`option ${on ? 'option-active' : ''}`}>
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  on ? 'border-brand-600 bg-brand-600' : 'border-ink-300'
                }`}
              >
                {on ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
              </span>
              <span className="text-[0.83rem] font-medium">{label as string}</span>
            </div>
          ))}
        </div>
        <div>
          <label className="field-label">Preferensi makanan</label>
          <div className="flex flex-wrap gap-1.5">
            {['Toleran', 'Vegetarian', 'Halal', 'Rendah gula'].map((p, i) => (
              <Chip key={p} tone={i === 0 ? 'brand' : 'neutral'}>
                {p}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <label className="field-label">Catatan kondisi medis</label>
          <textarea
            className="field h-20 resize-none"
            defaultValue="Insulin resistance ringan"
          />
          <p className="mt-1.5 text-[0.68rem] leading-snug text-ink-400">
            Opsional. Membantu aplikasi menghindari saran yang tidak sesuai.
          </p>
        </div>
      </ScreenBody>
      <BottomAction>
        <button className="btn-primary w-full">Lanjut</button>
      </BottomAction>
    </div>
  );
}

export function ConsentScreen() {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <StepDots current={4} />
      <ScreenHead
        title="Izin pemrosesan data"
        sub="Langkah 4 dari 4. Pilih apa yang boleh kami proses."
      />
      <ScreenBody>
        <Note tone="brand" title="Inferensi berjalan di perangkat">
          Deteksi makanan diproses langsung di HP Anda. Foto hanya dikirim
          bila deteksi lokal tidak yakin dan Anda mengizinkan.
        </Note>
        <div className="space-y-2">
          {[
            ['Simpan riwayat makan', 'Dipakai untuk tren dan rekomendasi', true],
            ['Kirim foto untuk deteksi akurat', 'Hanya saat keyakinan rendah', true],
            ['Gunakan data untuk melatih model', 'Anonim, dapat dimatikan', false],
          ].map(([title, desc, on]) => (
            <div key={title as string} className="flex items-start gap-3 rounded-xl border border-ink-200 bg-white p-3.5">
              <span
                className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${
                  on ? 'bg-brand-600' : 'bg-ink-300'
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white transition ${
                    on ? 'ml-auto' : ''
                  }`}
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.82rem] font-semibold text-ink-900">
                  {title as string}
                </span>
                <span className="block text-[0.7rem] leading-snug text-ink-500">
                  {desc as string}
                </span>
              </span>
            </div>
          ))}
        </div>
        <button className="btn-ghost w-full">Baca Kebijakan Privasi lengkap</button>
      </ScreenBody>
      <BottomAction>
        <button className="btn-primary w-full">Setujui dan lanjutkan</button>
        <p className="mt-2 text-center text-[0.65rem] text-ink-400">
          Anda dapat mencabut izin ini kapan saja di Privasi dan Data.
        </p>
      </BottomAction>
    </div>
  );
}

export function FirstResultScreen({ user }: { user: any }) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-brand-50 to-white">
      <StatusBar />
      <div className="flex flex-1 flex-col justify-center px-7 py-4">
        <div className="mb-1 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand-600">
          Hasil pertama Anda
        </div>
        <h2 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink-950">
          Selamat datang, {user?.name?.split(' ')[0] ?? 'Redo'}
        </h2>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-600">
          Berdasarkan profil Anda, berikut gambaran metabolisme awal.
          Angka ini adalah estimasi, bukan diagnosis.
        </p>

        <div className="card mt-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="label">Skor profil metabolisme</div>
              <div className="tabular mt-1 text-3xl font-semibold tracking-tight text-ink-950">
                {user?.metabolic_score ?? 68}
                <span className="text-base font-medium text-ink-400">/100</span>
              </div>
            </div>
            <Chip tone="brand">estimating</Chip>
          </div>
          <div className="mt-3">
            <Progress value={user?.metabolic_score ?? 68} />
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-ink-100 pt-3">
            <Avatar name={user?.name ?? 'Redo'} size={28} />
            <span className="text-[0.72rem] text-ink-600">
              Diperbarui dari profil: {user?.weight_kg} kg, {user?.height_cm} cm,
              aktivitas {user?.activity_level}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ['Sensitivitas insulin', user?.insulin_sensitivity ?? 'moderate'],
            ['Target caloric', '2.100 kkal'],
            ['Porsi makan', '1.250 g'],
          ].map(([label, val]) => (
            <div key={label as string} className="card-flat p-2.5 text-center">
              <div className="text-[0.6rem] leading-tight text-ink-500">{label as string}</div>
              <div className="mt-1 text-[0.8rem] font-semibold capitalize text-ink-900">
                {val as string}
              </div>
            </div>
          ))}
        </div>

        <Note tone="warn" title="Estimasi, bukan diagnosis">
          Untuk kondisi medis tertentu, konsultasikan ke tenaga
          profesional kesehatan.
        </Note>
      </div>
      <BottomAction>
        <button className="btn-primary w-full">Lihat rekomendasi porsi</button>
      </BottomAction>
    </div>
  );
}

export const onboardingScreens = [
  {
    title: 'Selamat datang',
    slug: 'welcome',
    refs: 'FR-001, FR-004',
    el: <WelcomeScreen />,
  },
  {
    title: 'Buat akun',
    slug: 'signup',
    refs: 'FR-001',
    el: <SignupScreen />,
  },
  {
    title: 'Verifikasi email',
    slug: 'verify',
    refs: 'FR-002',
    el: <VerifyScreen />,
  },
  {
    title: 'Onboarding: profil dasar',
    slug: 'onboarding-profile',
    refs: 'FR-003',
    el: <OnboardingProfileScreen />,
  },
  {
    title: 'Onboarding: data tubuh',
    slug: 'onboarding-body',
    refs: 'FR-003',
    el: <OnboardingBodyScreen />,
  },
  {
    title: 'Onboarding: tujuan',
    slug: 'onboarding-goal',
    refs: 'FR-005',
    el: <OnboardingGoalScreen />,
  },
  {
    title: 'Izin data',
    slug: 'consent',
    refs: 'FR-004, NFR-013',
    el: <ConsentScreen />,
  },
];