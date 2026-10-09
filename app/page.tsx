import { loadData } from '@/lib/db';
import AppShell from '@/components/app/AppShell';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await loadData();

  // Pengguna baru (belum mengisi tujuan) masuk ke alur onboarding dulu.
  const needsOnboarding = !data.user?.goal;

  return <AppShell data={data} needsOnboarding={needsOnboarding} />;
}
