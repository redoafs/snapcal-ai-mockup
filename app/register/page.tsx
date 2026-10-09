'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const TRANSLATE: Record<string, string> = {
  'User already registered': 'Email sudah terdaftar. Coba masuk.',
  'Invalid login credentials': 'Email atau kata sandi salah.',
  'Password should be at least 6 characters': 'Kata sandi minimal 6 karakter.',
  'Email rate limit exceeded': 'Terlalu banyak percobaan. Coba lagi nanti.',
  'Unable to validate email address: invalid format':
    'Format email tidak valid.',
};

function terjemah(msg: string) {
  return TRANSLATE[msg] ?? msg;
}

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/auth/confirm`
            : undefined,
      },
    });
    setLoading(false);

    if (error) {
      setError(terjemah(error.message));
      return;
    }

    // Bila konfirmasi email dimatikan, sesi langsung aktif.
    if (data.session) {
      router.push('/');
      router.refresh();
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-100 px-4 py-10">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl">
            ✉
          </div>
          <h1 className="text-xl font-semibold text-ink-950">
            Periksa email Anda
          </h1>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-600">
            Kami mengirim tautan verifikasi ke{' '}
            <span className="font-semibold text-ink-900">{email}</span>. Buka
            tautan itu untuk mengaktifkan akun, lalu masuk.
          </p>
          <Link href="/login" className="btn-primary mt-5 inline-flex w-full justify-center">
            Ke halaman masuk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-100 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-2xl text-white">
            ◎
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950">
            Buat akun SnapCal AI
          </h1>
          <p className="mt-1 text-[0.85rem] text-ink-600">
            Akun baru otomatis mendapat data contoh.
          </p>
        </div>

        <form onSubmit={onSubmit} className="card space-y-3">
          <div>
            <label className="field-label" htmlFor="name">
              Nama
            </label>
            <input
              id="name"
              className="field"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama panggilan"
            />
          </div>
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
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[0.78rem] text-red-700">
              {error}
            </div>
          ) : null}

          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Memproses…' : 'Daftar'}
          </button>
        </form>

        <p className="mt-4 text-center text-[0.8rem] text-ink-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-brand-700">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}
