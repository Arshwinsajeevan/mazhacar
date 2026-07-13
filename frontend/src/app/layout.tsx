import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppProviders from '@/providers/AppProviders';
import MainLayout from '@/components/MainLayout';

export const metadata: Metadata = {
  title: 'MazhaCar - AI-Powered Weather Decisions',
  description: 'An AI-powered weather decision platform. Convert weather reports into actionable everyday decisions.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml" className="h-full" style={{ colorScheme: 'dark light' }}>
      <body className="antialiased min-h-screen bg-slate-900 text-slate-100 font-sans">
        <AppProviders>
          <MainLayout>{children}</MainLayout>
        </AppProviders>
      </body>
    </html>
  );
}
