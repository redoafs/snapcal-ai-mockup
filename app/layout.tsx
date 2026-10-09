import type { Metadata, Viewport } from 'next';
import './globals.css';

// Aplikasi memakai sesi Supabase (cookie) di hampir semua halaman, jadi
// render dinamis per-request. Tanpa ini, `next build` mencoba meng-prerender
// /login & /register dan gagal saat env Supabase tidak ada pada saat build.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SnapCal AI - UI/UX Mockup',
  description:
    'Mockup antarmuka SnapCal AI untuk alur inti sesuai PRD SnapCal AI',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a6672',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}