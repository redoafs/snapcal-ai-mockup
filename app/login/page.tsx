'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const TRANSLATE: Record<string, string> = {
  'Invalid login credentials': 'Email atau kata sandi salah.',
  'Email not confirmed': 'Email belum diverifikasi. Periksa kotak masuk Anda.',
  'User already registered': 'Email sudah terdaftar.',
  'Password should be at least 6 characters': 'Kata sandi minimal 6 karakter.',
  'Email rate limit exceeded': 'Terlalu banyak percobaan. Coba lagi nanti.',
};

function terjemah(msg: string) {
  return TRANSLATE[msg] ?? msg;
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(terjemah(error.message));
      setLoading(false);
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-100 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-2xl text-white">
            ◎
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950">
            Masuk ke SnapCal AI
          </h1>
          <p className="mt-1 text-[0.85rem] text-ink-600">
            UI/UX Mockup — bukan alat diagnosis medis.
          </p>
        </div>

        <form onSubmit={onSubmit} className="card space-y-3">
          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="field"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Kata sandi
            </label>
            <input
              id="password"
              className="field"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[0.78rem] text-red-700">
              {error}
            </div>
          ) : null}

          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Memproses…' : 'Masuk'}
          </button>

          <button
            className="btn-ghost w-full text-[0.78rem]"
            type="button"
            onClick={() => {
              setEmail('redo@snapcal.ai');
              setPassword('snapcal-demo-2026');
            }}
          >
            Gunakan akun demo
          </button>
        </form>

        <p className="mt-4 text-center text-[0.8rem] text-ink-600">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold text-brand-700">
            Daftar
          </Link>
        </p>
      </div>
    </main>
  );
}
