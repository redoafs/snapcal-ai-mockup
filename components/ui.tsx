import type { ReactNode } from 'react';

/** Wraps a mockup screen in a phone frame with a caption. */
export function Phone({
  title,
  screenName,
  frRefs,
  children,
}: {
  title: string;
  screenName: string;
  frRefs?: string;
  children: ReactNode;
}) {
  return (
    <figure className="flex shrink-0 flex-col items-center gap-3">
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-scroll">{children}</div>
      </div>
      <figcaption className="max-w-[320px] px-2 text-center">
        <div className="text-[0.82rem] font-semibold text-ink-900">{title}</div>
        <div className="mt-0.5 font-mono text-[0.68rem] text-brand-600">
          /{screenName}
        </div>
        {frRefs ? (
          <div className="mt-1 text-[0.65rem] leading-tight text-ink-500">
            {frRefs}
          </div>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** Section heading inside a phone screen. */
export function ScreenHead({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="screen-head">
      <div className="min-w-0">
        <h2 className="screen-title">{title}</h2>
        {sub ? <p className="screen-sub">{sub}</p> : null}
      </div>
      {right ? <div className="shrink-0 pt-1">{right}</div> : null}
    </div>
  );
}

/** Body container with consistent horizontal padding. */
export function ScreenBody({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`space-y-3 px-5 ${className}`}>{children}</div>;
}

/** Avatar bubble showing the user initial. */
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className="tabular inline-flex shrink-0 items-center justify-center
                 rounded-full bg-brand-600 font-semibold text-white"
    >
      {initial}
    </span>
  );
}

/** Small status pill. */
export function Chip({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'warn' | 'good' | 'bad' | 'info';
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-ink-100 text-ink-700',
    brand: 'bg-brand-100 text-brand-800',
    warn: 'bg-amber-100 text-amber-800',
    good: 'bg-emerald-100 text-emerald-800',
    bad: 'bg-red-100 text-red-700',
    info: 'bg-sky-100 text-sky-800',
  };
  return <span className={`chip ${tones[tone]}`}>{children}</span>;
}

/** Progress bar with optional right-aligned value text. */
export function Progress({
  value,
  label,
  hint,
  tone = 'brand',
}: {
  value: number;
  label?: string;
  hint?: string;
  tone?: 'brand' | 'accent' | 'good';
}) {
  const pct = Math.max(0, Math.min(100, value));
  const fill: Record<string, string> = {
    brand: 'bg-brand-500',
    accent: 'bg-accent-400',
    good: 'bg-emerald-500',
  };
  return (
    <div>
      {(label || hint) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          {label ? <span className="text-[0.78rem] text-ink-700">{label}</span> : null}
          {hint ? <span className="tabular text-[0.75rem] font-semibold text-ink-800">{hint}</span> : null}
        </div>
      )}
      <div className="progress-track">
        <div className={`progress-fill ${fill[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Macro breakdown row with a colored bar. */
export function MacroBar({
  label,
  value,
  target,
  unit = 'g',
  color,
}: {
  label: string;
  value: number;
  target: number;
  unit?: string;
  color: string;
}) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[0.75rem] text-ink-600">{label}</span>
        <span className="tabular text-[0.72rem] text-ink-500">
          {Math.round(value)}
          {unit} / {target}
          {unit}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-200">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

/** Confidence badge for AI detection results. */
export function ConfidenceBadge({ value }: { value: number | null }) {
  if (value === null || value === undefined)
    return <Chip tone="neutral">input manual</Chip>;
  const pct = Math.round(value * 100);
  const tone = value >= 0.85 ? 'good' : value >= 0.65 ? 'warn' : 'bad';
  const label = value >= 0.85 ? 'yakin' : value >= 0.65 ? 'perlu cek' : 'ragu';
  return <Chip tone={tone}>{pct}% {label}</Chip>;
}

/** Callout box for rationale, disclaimers, or privacy notes. */
export function Note({
  children,
  tone = 'info',
  title,
}: {
  children: ReactNode;
  tone?: 'info' | 'warn' | 'brand';
  title?: string;
}) {
  const tones: Record<string, string> = {
    info: 'border-sky-200 bg-sky-50 text-sky-900',
    warn: 'border-amber-200 bg-amber-50 text-amber-900',
    brand: 'border-brand-200 bg-brand-50 text-brand-900',
  };
  return (
    <div className={`rounded-xl border p-3 text-[0.76rem] leading-snug ${tones[tone]}`}>
      {title ? <div className="mb-1 font-semibold">{title}</div> : null}
      {children}
    </div>
  );
}

/** Bottom navigation used across the main app screens. */
export function BottomNav({ active }: { active: string }) {
  const items = [
    { key: 'home', label: 'Hari ini', icon: '◧' },
    { key: 'scan', label: 'Pindai', icon: '◎' },
    { key: 'portion', label: 'Porsi', icon: '◑' },
    { key: 'trends', label: 'Tren', icon: '◔' },
    { key: 'more', label: 'Lainnya', icon: '···' },
  ];
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 border-t border-ink-200 bg-white/95 backdrop-blur">
      <ul className="flex items-stretch justify-around px-1 pb-4 pt-2">
        {items.map((it) => {
          const on = it.key === active;
          return (
            <li key={it.key} className="flex-1">
              <span
                className={`flex flex-col items-center gap-0.5 rounded-lg py-1
                  ${on ? 'text-brand-700' : 'text-ink-400'}`}
              >
                <span className="text-[1.1rem] leading-none">{it.icon}</span>
                <span className="text-[0.6rem] font-medium leading-none">
                  {it.label}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Fake device status bar. */
export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-2 text-[0.65rem] font-semibold text-ink-800">
      <span className="tabular">09:41</span>
      <span className="tracking-widest text-ink-500">SNAPCAL</span>
      <span className="tabular">5G ▮</span>
    </div>
  );
}

/** Fake primary action pinned near the bottom of a screen. */
export function BottomAction({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-5 mt-4 border-t border-ink-200 bg-white/95 px-5 py-3 backdrop-blur">
      {children}
    </div>
  );
}