import { WelcomeScreen } from '@/components/screens/onboarding';

export const dynamic = 'force-dynamic';

/** Halaman pembuka publik: titik masuk sebelum masuk/daftar. */
export default function WelcomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-800 via-brand-700 to-brand-900 px-4 py-10">
      <div className="flex flex-col items-center">
        <div className="phone">
          <div className="phone-notch" />
          <div className="phone-scroll">
            <WelcomeScreen />
          </div>
        </div>
        <p className="mt-4 max-w-[320px] text-center text-[0.7rem] leading-snug text-white/70">
          SnapCal AI — mockup UI/UX. Data bersifat contoh; bukan alat diagnosis
          medis.
        </p>
      </div>
    </main>
  );
}
