import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import LayoutShell from '@/components/LayoutShell';
import { totalArticleCount, tutorialArticleCount, artikelArticleCount } from '@/lib/data/article-summaries';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: `EnInformasi Hub — Portal ${totalArticleCount} Tutorial, Gaming & Tren Teknologi Terkini`,
  description: `Portal wawasan teknologi modern, gaming & esports, rilis game masa depan, hardware & gadget, serta ${tutorialArticleCount} tutorial praktis dan ${artikelArticleCount} EnInformasi mendalam terupdate.`,
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
    <html lang="id" className={`dark ${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
