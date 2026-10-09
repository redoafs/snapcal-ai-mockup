import {
  ScreenHead,
  ScreenBody,
  Chip,
  Note,
  Progress,
  BottomAction,
  StatusBar,
  BottomNav,
  ConfidenceBadge,
} from '@/components/ui';

export function ScanScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-[300px] shrink-0 overflow-hidden bg-ink-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[4rem] opacity-70">🍚</span>
        </div>

        {/* Framing guides */}
        <div className="absolute inset-8 rounded-2xl border-2 border-dashed border-white/45" />
        <div className="absolute inset-x-8 top-1/2 h-px bg-brand-300/70 animate-scan-line" />

        <div className="absolute left-3 top-3 flex gap-1.5">
          <Chip tone="neutral">📷 Belakang</Chip>
          <Chip tone="neutral">✦ Flash</Chip>
        </div>
        <div className="absolute right-3 top-3">
          <Chip tone="neutral">🖼 Galeri</Chip>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ScreenHead
          title="Pindai makanan"
          sub="Letakkan piring di dalam bingkai. Pastikan pencahayaan cukup."
        />
        <ScreenBody>
          <Note tone="brand" title="Tips hasil terbaik">
            Ambil foto dari atas, dengan cahaya alami, dan piring memenuhi
            bingkai.
          </Note>
          <div className="grid grid-cols-3 gap-2">
            {[
              ['☀', 'Cukup terang'],
              ['◎', 'Tidak blur'],
              ['▣', 'Piring penuh'],
            ].map(([icon, label]) => (
              <div key={label} className="card-flat p-2 text-center">
                <div className="text-base leading-none">{icon}</div>
                <div className="mt-1 text-[0.62rem] leading-tight text-ink-600">
                  {label}
                </div>
              </div>
            ))}
          </div>
          <Note tone="warn">
            Deteksi berjalan di perangkat. Foto hanya terkirim bila
            keyakinan lokal di bawah ambang dan Anda mengizinkan.
          </Note>
        </ScreenBody>
      </div>

      <div className="absolute inset-x-0 bottom-[58px] z-10 flex justify-center">
        <button className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/80 bg-white shadow-lift">
          <span className="h-12 w-12 rounded-full bg-brand-600" />
        </button>
      </div>
      <BottomNav active="scan" />
    </div>
  );
}

export function ScanProcessingScreen() {
  return (
    <div className="flex h-full flex-col bg-ink-950 text-white">
      <StatusBar />
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="relative mb-8 h-28 w-28">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            🍲
          </div>
          <div className="absolute inset-0 animate-ping rounded-2xl border-2 border-brand-300/60" />
        </div>
        <h2 className="text-[1.15rem] font-semibold">Mendeteksi di perangkat</h2>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-white/70">
          Model berjalan lokal. Data foto Anda belum meninggalkan perangkat.
        </p>
        <div className="mt-8 w-full space-y-3">
          {[
            ['Validasi kualitas foto', true],
            ['Deteksi item makanan', false],
            ['Estimasi ukuran porsi', false],
          ].map(([label, done]) => (
            <div key={label as string} className="flex items-center gap-2.5">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold ${
                  done ? 'bg-brand-400 text-ink-950' : 'border border-white/25 text-white/50'
                }`}
              >
                {done ? '✓' : ''}
              </span>
              <span
                className={`text-[0.8rem] ${done ? 'text-white' : 'text-white/50'}`}
              >
                {label as string}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-8 pb-10 text-center">
        <p className="text-[0.65rem] leading-snug text-white/40">
          Rata-rata selesai di bawah 2 detik pada perangkat yang didukung.
        </p>
      </div>
    </div>
  );
}

export function ScanReviewScreen() {
  const detected = [
    { name: 'Nasi putih', emoji: '🍚', grams: 120, conf: 0.91, corrected: true },
    { name: 'Ayam bakar', emoji: '🍗', grams: 130, conf: 0.89, corrected: false },
    { name: 'Sayur lodeh', emoji: '🥘', grams: 150, conf: 0.74, corrected: false },
  ];
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <ScreenHead
        title="Review hasil"
        sub="3 item terdeteksi. Koreksi bila perlu agar akurat."
        right={<Chip tone="good">on-device</Chip>}
      />
      <ScreenBody>
        <div className="card p-0">
          {detected.map((d, i) => (
            <div
              key={d.name}
              className={`flex items-center gap-3 p-3 ${i > 0 ? 'border-t border-ink-100' : ''}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-2xl">
                {d.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[0.85rem] font-semibold text-ink-900">
                    {d.name}
                  </span>
                  {d.corrected ? <Chip tone="brand">dikoreksi</Chip> : null}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <ConfidenceBadge value={d.conf} />
                  {d.conf !== null && d.conf < 0.8 ? (
                    <span className="text-[0.68rem] text-ink-400">perlu dicek</span>
                  ) : null}
                </div>
              </div>
              <div className="text-right">
                <div className="tabular text-[0.85rem] font-semibold text-ink-900">
                  {d.grams} g
                </div>
                <div className="text-[0.65rem] text-ink-400">per porsi</div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-secondary w-full border-dashed">
          + Tambah item lain
        </button>

        <div className="card-flat">
          <div className="mb-2 flex items-center justify-between">
            <span className="label">Total Energi</span>
            <span className="tabular text-[1.1rem] font-semibold text-ink-950">
              596 <span className="text-[0.75rem] font-medium text-ink-500">kkal</span>
            </span>
          </div>
          <Progress
            value={72}
            label="Terhadap target makan siang 620 kkal"
            hint="596 / 620"
            tone="accent"
          />
        </div>

        <Note tone="warn" title="Dua item perlu diperiksa">
          Sayur lodeh memiliki keyakinan 74 persen. Koreksi bila jenis
          makanannya berbeda.
        </Note>
      </ScreenBody>
      <BottomAction>
        <button className="btn-primary w-full">Simpan ke log hari ini</button>
      </BottomAction>
    </div>
  );
}

export function ScanFallbackScreen() {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <ScreenHead
        title="Perlu bantuan server"
        sub="Deteksi lokal kurang yakin untuk foto ini."
      />
      <ScreenBody>
        <div className="card">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lg">
              ⚠
            </span>
            <div>
              <div className="text-[0.88rem] font-semibold text-ink-900">
                Keyakinan deteksi lokal 58 persen
              </div>
              <p className="mt-1 text-[0.75rem] leading-snug text-ink-600">
                Foto ini kurang jelas atau jenisnya tidak umum. Kami dapat
                mengirim ke model cadangan untuk hasil lebih baik.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="label mb-2">Rincian</div>
          <dl className="space-y-1.5 text-[0.75rem]">
            {[
              ['Sumber saat ini', 'On-device model'],
              ['Keyakinan', '58 persen'],
              ['Sumber alternatif', 'LLM Vision fallback'],
              ['Foto tetap di perangkat?', 'Tidak'],
              ['Biaya', 'Termasuk paket harian'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-ink-500">{k}</dt>
                <dd className="text-right font-medium text-ink-800">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Note tone="brand" title="Anda yang memutuskan">
          Tidak ada yang dikirim tanpa persetujuan Anda. Tolak tetap dapat
          memakai input manual.
        </Note>

        <div className="space-y-2">
          <button className="btn-primary w-full">Izinkan sekali ini</button>
          <button className="btn-secondary w-full">Input manual saja</button>
          <button className="btn-ghost w-full">Ambil ulang foto</button>
        </div>
      </ScreenBody>
    </div>
  );
}

export const scanScreens = [
  { title: 'Pindai makanan', slug: 'scan', refs: 'FR-008, FR-009', el: <ScanScreen /> },
  {
    title: 'Proses deteksi',
    slug: 'scan-processing',
    refs: 'FR-014, NFR-002',
    el: <ScanProcessingScreen />,
  },
  {
    title: 'Review hasil deteksi',
    slug: 'scan-review',
    refs: 'FR-016, FR-017',
    el: <ScanReviewScreen />,
  },
  {
    title: 'Persetujuan fallback',
    slug: 'scan-fallback',
    refs: 'FR-015, FR-004',
    el: <ScanFallbackScreen />,
  },
];