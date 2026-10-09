import {
  ScreenHead,
  ScreenBody,
  Chip,
  Note,
  Progress,
  BottomAction,
  StatusBar,
  BottomNav,
  Avatar,
} from '@/components/ui';

export function LogScreen() {
  const quick = [
    ['🍚', 'Nasi', '150 g'],
    ['🍗', 'Ayam', '120 g'],
    ['🥚', 'Telur', '2 butir'],
    ['🥗', 'Sayur', '100 g'],
    ['🍞', 'Roti', '40 g'],
    ['🍌', 'Pisang', '120 g'],
  ];
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <ScreenHead
        title="Tambah catatan"
        sub="Input cepat tanpa perlu foto bila sedang sibuk."
      />
      <ScreenBody>
        <div className="grid grid-cols-3 gap-2">
          {quick.map(([emoji, name, gram]) => (
            <div
              key={name}
              className="card flex flex-col items-center gap-1 p-2.5 text-center"
            >
              <span className="text-xl leading-none">{emoji}</span>
              <span className="text-[0.68rem] font-medium text-ink-800">{name}</span>
              <span className="tabular text-[0.6rem] text-ink-400">{gram}</span>
            </div>
          ))}
        </div>

        <div>
          <label className="field-label">Pilih sesi makan</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              ['Sarapan', false],
              ['Makan siang', true],
              ['Snack', false],
              ['Makan malam', false],
            ].map(([label, on]) => (
              <div key={label as string} className={`option justify-center p-2 ${on ? 'option-active' : ''}`}>
                <span className="text-[0.7rem] font-medium">{label as string}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label">Porsi (gram)</label>
          <input className="field tabular" defaultValue="150" inputMode="numeric" />
        </div>

        <div>
          <label className="field-label">Catatan</label>
          <input className="field" placeholder="Opsional, misal: kurang pedas" />
        </div>

        <div className="divider" />

        <div className="flex items-center justify-between">
          <span className="text-[0.82rem] font-semibold text-ink-900">
            Catat berat badan
          </span>
          <span className="tabular text-[0.8rem] text-ink-600">74,5 kg</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[0.82rem] font-semibold text-ink-900">
            Catat aktivitas
          </span>
          <span className="text-[0.7rem] text-brand-700">Tambah</span>
        </div>
      </ScreenBody>
      <BottomAction>
        <button className="btn-primary w-full">Simpan catatan</button>
      </BottomAction>
    </div>
  );
}

export function CoachingScreen() {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <ScreenHead
        title="Coaching"
        sub="Check-in singkat, tanpa menghakimi."
        right={<Chip tone="brand">hari ke-9</Chip>}
      />
      <ScreenBody className="pb-4">
        {/* Streak */}
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <span className="label">Konsistensi</span>
            <span className="text-[0.68rem] text-ink-400">target 12 hari</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0].map((done, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-full items-center justify-center rounded-lg text-[0.7rem] font-semibold ${
                    done ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-300'
                  }`}
                >
                  {done ? '✓' : ''}
                </div>
                <span className="text-[0.5rem] text-ink-400">
                  {['S', 'R', 'K', 'J', 'S', 'R', 'K'][i % 7]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Progress value={75} label="8 dari 12 hari" hint="75%" tone="good" />
          </div>
        </div>

        {/* Check-in */}
        <div className="card border-brand-200 bg-brand-50">
          <div className="mb-3">
            <div className="text-[0.88rem] font-semibold text-ink-900">
              Bagaimana hari Anda?
            </div>
            <p className="mt-0.5 text-[0.72rem] text-ink-600">
              Menjawab membantu rekomendasi besok lebih tepat.
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="field-label">Kepatuhan porsi</label>
              <div className="flex gap-2">
                {['Tidak', 'Sebagian', 'Penuh'].map((o, i) => (
                  <div key={o} className={`option flex-1 justify-center p-2.5 ${i === 2 ? 'option-active' : ''}`}>
                    <span className="text-[0.72rem] font-medium">{o}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">Hambatan</label>
              <div className="flex flex-wrap gap-1.5">
                {['Waktu', 'Biaya', 'Susah masak', 'Malas'].map((h, i) => (
                  <Chip key={h} tone={i === 0 ? 'brand' : 'neutral'}>
                    {h}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">Catatan hari ini</label>
              <textarea
                className="field h-16 resize-none"
                defaultValue="Makan siang lebih besar karena ada rapat."
              />
            </div>
          </div>
          <button className="btn-primary mt-3 w-full">Kirim check-in</button>
        </div>

        {/* Adaptive recommendation */}
        <div className="card">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="label">Rekomendasi yang disesuaikan</span>
            <Chip tone="brand">otomatis</Chip>
          </div>
          <div className="space-y-2">
            {[
              [
                'Porsi makan malam turun 10 persen',
                'Karena sugar load hari ini tinggi, porsi malam dikecilkan agar gula darah lebih stabil.',
              ],
              [
                'Jadwal scan sarapan lebih awal',
                'Check-in menunjukkan metabolism terbaik sebelum jam 8 pagi.',
              ],
            ].map(([title, why]) => (
              <div key={title} className="rounded-lg bg-ink-50 p-2.5">
                <div className="text-[0.78rem] font-semibold text-ink-900">
                  {title}
                </div>
                <p className="mt-0.5 text-[0.7rem] leading-snug text-ink-600">{why}</p>
              </div>
            ))}
          </div>
        </div>

        <Note tone="info" title="Coaching bukan nasihat medis">
          Saran di sini bersifat umum untuk gaya hidup dan tidak
          menggantikan konsultasi tenaga profesional.
        </Note>
      </ScreenBody>
      <BottomNav active="home" />
    </div>
  );
}

export function ReportScreen() {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <ScreenHead
        title="Laporan"
        sub="Siap dibagikan ke tenaga profesional."
        right={<Chip tone="neutral">PDF</Chip>}
      />
      <ScreenBody className="pb-4">
        <div className="card">
          <div className="mb-2 flex items-center justify-between">
            <span className="label">Periode</span>
            <span className="text-[0.7rem] text-brand-700">Ubah</span>
          </div>
          <div className="text-[0.88rem] font-semibold text-ink-950">
            1 - 7 Oktober 2026
          </div>
          <div className="mt-0.5 text-[0.68rem] text-ink-500">
            7 hari, 5 hari dengan data lengkap
          </div>
        </div>

        <div className="card">
          <div className="label mb-2.5">Ringkasan</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Rata-rata energi', '2.053', 'kkal/hari'],
              ['Kepatuhan porsi', '87', 'persen'],
              ['Sesi tercatat', '26', 'dari 28'],
              ['Rata-rata gula', '31', 'g/hari'],
            ].map(([label, val, unit]) => (
              <div key={label}>
                <div className="text-[0.65rem] text-ink-500">{label}</div>
                <div className="tabular mt-0.5 text-[1.05rem] font-semibold text-ink-950">
                  {val}{' '}
                  <span className="text-[0.62rem] font-medium text-ink-400">
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="label mb-2">Yang perlu diperhatikan</div>
          <ul className="space-y-2">
            {[
              'Sugar load sore konsisten tinggi selama 4 hari terakhir.',
              'Asupan protein pada hari latihan perlu ditinjau.',
              'Berat badan turun 0,9 kg dengan aktivitas tinggi, wajar.',
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span className="text-[0.73rem] leading-snug text-ink-700">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-flat">
          <div className="label mb-1.5">Berbagi data</div>
          <p className="text-[0.73rem] leading-snug text-ink-600">
            Laporan memuat tren, bukan data mentah. Foto tidak
            disertakan kecuali Anda memilih.
          </p>
        </div>

        <button className="btn-primary w-full">Unduh laporan PDF</button>
        <button className="btn-secondary w-full">Bagikan ke praktisi</button>
      </ScreenBody>
    </div>
  );
}

export function SubscribeScreen({ plans }: { plans: any[] }) {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <ScreenHead
        title="Pilih paket"
        sub="Mulai gratis, naikkan bila diperlukan."
      />
      <ScreenBody className="pb-4">
        {plans.map((p) => (
          <div
            key={p.code}
            className={`card relative ${
              p.is_featured ? 'border-2 border-brand-500 bg-brand-50/40' : ''
            }`}
          >
            {p.is_featured ? (
              <span className="absolute -top-2 right-4 rounded-full bg-brand-600 px-2.5 py-0.5 text-[0.6rem] font-semibold text-white">
                paling umum
              </span>
            ) : null}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[1rem] font-semibold text-ink-950">{p.name}</div>
                <div className="mt-0.5 text-[0.7rem] text-ink-500">{p.tagline}</div>
              </div>
              <div className="text-right">
                <div className="tabular text-[1.1rem] font-semibold text-ink-950">
                  {p.price_idr === 0 ? (
                    'Gratis'
                  ) : (
                    <>
                      {Math.round(p.price_idr / 1000)}
                      <span className="text-[0.7rem] font-medium text-ink-500">rb/bln</span>
                    </>
                  )}
                </div>
                {p.price_idr > 0 ? (
                  <div className="text-[0.6rem] text-ink-400">bisa bulanan</div>
                ) : null}
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 border-t border-ink-100 pt-3">
              {p.featureList.map((f: string) => (
                <li key={f} className="flex gap-2">
                  <span
                    className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[0.55rem] font-bold text-white ${
                      p.is_featured ? 'bg-brand-600' : 'bg-ink-400'
                    }`}
                  >
                    ✓
                  </span>
                  <span className="text-[0.73rem] leading-snug text-ink-700">{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`${p.is_featured ? 'btn-primary' : 'btn-secondary'} mt-3 w-full`}
            >
              {p.is_featured ? 'Coba gratis 14 hari' : 'Tetap di gratis'}
            </button>
          </div>
        ))}

        <Note tone="info" title="Batal kapan saja">
          Tidak ada kontrak jangka panjang. Pembatalan berlaku di akhir
          periode berjalan.
        </Note>

        <p className="text-center text-[0.65rem] leading-snug text-ink-400">
          Harga final dan ketersediaan metode pembayaran per wilayah
          masih dalam tahap validasi.
        </p>
      </ScreenBody>
      <BottomNav active="more" />
    </div>
  );
}

export function PrivacyScreen({ consent, subscription }: { consent: any; subscription: any }) {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <ScreenHead
        title="Privasi dan data"
        sub="Kontrol penuh atas data Anda."
      />
      <ScreenBody className="pb-4">
        <div className="card border-brand-200 bg-brand-50">
          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none">🛡</span>
            <div>
              <div className="text-[0.82rem] font-semibold text-brand-900">
                Inferensi utama di perangkat
              </div>
              <p className="mt-0.5 text-[0.7rem] leading-snug text-brand-800">
                Deteksi makanan berjalan lokal. Foto hanya terkirim atas
                izin Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Consent record */}
        <div className="card">
          <div className="mb-2 flex items-center justify-between">
            <span className="label">Persetujuan aktif</span>
            <Chip tone="good">v{consent?.policy_version ?? '1.0'}</Chip>
          </div>
          <dl className="space-y-1.5 text-[0.75rem]">
            {[
              ['Status', consent?.revoked_at ? 'Dicabut' : 'Aktif'],
              [
                'Tanggal disetujui',
                consent?.granted_at
                  ? new Date(consent.granted_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-',
              ],
              ['Kebijakan', consent?.policy_version ?? 'v1.0'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-ink-500">{k}</dt>
                <dd className="text-right font-medium text-ink-800">{v}</dd>
              </div>
            ))}
          </dl>
          <button className="btn-ghost mt-2 w-full text-[0.75rem]">
            Cabut persetujuan
          </button>
        </div>

        {/* Data controls */}
        <div className="card p-0">
          {[
            ['Unduh data saya', 'Semua riwayat, log, dan laporan'],
            ['Kelola izin data', 'Atur per jenis data dan perangkat'],
            ['Riwayat akses', 'Lihat siapa mengakses data Anda'],
          ].map(([title, desc], i) => (
            <div
              key={title}
              className={`flex items-center gap-3 p-3.5 ${i > 0 ? 'border-t border-ink-100' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-[0.82rem] font-semibold text-ink-900">
                  {title}
                </div>
                <div className="text-[0.68rem] text-ink-500">{desc}</div>
              </div>
              <span className="text-ink-300">›</span>
            </div>
          ))}
        </div>

        {/* Plan status */}
        <div className="card">
          <div className="mb-2 flex items-center justify-between">
            <span className="label">Paket aktif</span>
            <Chip tone="neutral">{subscription?.plan ?? 'free'}</Chip>
          </div>
          <div className="text-[0.75rem] text-ink-600">
            {subscription?.plan === 'free'
              ? 'Anda memakai paket gratis. Scan dibatasi 5 foto per hari.'
              : 'Paket premium aktif. Perpanjang otomatis setiap bulan.'}
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl2 border border-red-200 bg-white p-4">
          <div className="label mb-1 text-red-700">Zona berisiko</div>
          <p className="mb-3 text-[0.73rem] leading-snug text-ink-600">
            Menghapus akun akan menghapus profil, riwayat makan, foto,
            dan laporan secara permanen sesuai kebijakan retensi.
          </p>
          <button className="btn-danger w-full border-red-300">
            Hapus akun dan data
          </button>
        </div>
      </ScreenBody>
      <BottomNav active="more" />
    </div>
  );
}

export function SettingsScreen({ user }: { user: any }) {
  const rows = [
    ['Profil tubuh', `Berat ${user?.weight_kg} kg, tinggi ${user?.height_cm} cm`],
    ['Target dan tujuan', user?.goal ?? '-'],
    ['Preferensi makanan', user?.diet_pref ?? '-'],
    ['Pengingat harian', 'Aktif, 07:00 dan 19:00'],
    ['Bahasa dan wilayah', 'Bahasa Indonesia, Rupiah (Rp)'],
    ['Deteksi otomatis', 'On-device aktif'],
  ];
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <ScreenHead title="Pengaturan" sub="Profil, notifikasi, dan preferensi." />
      <ScreenBody className="pb-4">
        <div className="card flex items-center gap-3">
          <Avatar name={user?.name ?? 'Redo'} size={46} />
          <div className="min-w-0 flex-1">
            <div className="text-[0.9rem] font-semibold text-ink-950">
              {user?.name}
            </div>
            <div className="truncate text-[0.72rem] text-ink-500">{user?.email}</div>
          </div>
          <span className="text-ink-300">›</span>
        </div>

        <div className="card p-0">
          {rows.map(([title, desc], i) => (
            <div
              key={title}
              className={`flex items-center gap-3 p-3.5 ${i > 0 ? 'border-t border-ink-100' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-[0.82rem] font-semibold text-ink-900">
                  {title}
                </div>
                <div className="truncate text-[0.68rem] text-ink-500">{desc}</div>
              </div>
              <span className="text-ink-300">›</span>
            </div>
          ))}
        </div>

        <div className="card-flat">
          <div className="label mb-1.5">Tentang</div>
          <div className="space-y-1 text-[0.72rem] text-ink-600">
            <div className="flex justify-between">
              <span>Versi aplikasi</span>
              <span className="tabular">0.1.0 (mockup)</span>
            </div>
            <div className="flex justify-between">
              <span>Kebijakan privasi</span>
              <span className="text-brand-700">v1.0</span>
            </div>
          </div>
        </div>

        <Note tone="warn" title="Mockup UI/UX">
          Layar ini adalah rancangan antarmuka untuk validasi desain.
          Data berasal dari basis data contoh, bukan pengguna nyata.
        </Note>
      </ScreenBody>
      <BottomNav active="more" />
    </div>
  );
}
