import type { Metadata, Viewport } from 'next';
import './globals.css';
import LayoutShell from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: 'EnInformasi Hub — Portal 150 Tutorial, Gaming & Tren Teknologi Terkini (Update 14 Oktober 2026)',
  description: 'Portal wawasan teknologi modern, gaming & esports, rilis game masa depan, hardware & gadget, serta 65 tutorial praktis dan 85 EnInformasi mendalam terupdate per 14 Oktober 2026.',
  keywords: ['EnInformasi', 'EnInformasi Hub', 'Gaming Esports', 'Mobile Legends', 'Honor of Kings', 'Valorant', 'PUBG Mobile', 'GTA 6 2026', 'NVIDIA Spark', 'Hardware 2026', 'Tutorial AI', 'DeepSeek R1', 'Claude 3.7', 'Teknologi Terupdate 2026'],
  authors: [{ name: 'Edvan' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
