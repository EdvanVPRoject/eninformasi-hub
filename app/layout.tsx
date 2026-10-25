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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eninformasi-hub.entehchin.workers.dev'),
  title: `EnInformasi Hub — Portal ${totalArticleCount} Tutorial, Gaming & Tren Teknologi Terkini`,
  description: `Portal wawasan teknologi modern, gaming & esports, rilis game masa depan, hardware & gadget, serta ${tutorialArticleCount} tutorial praktis dan ${artikelArticleCount} Informasi mendalam terupdate.`,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: `EnInformasi Hub — Portal ${totalArticleCount} Tutorial & Gaming Terupdate`,
    description: `Wawasan teknologi modern, gaming & esports, rilis game masa depan, hardware & gadget, serta tutorial AI terupdate.`,
    url: 'https://eninformasi-hub.entehchin.workers.dev',
    siteName: 'EnInformasi Hub',
    images: [
      {
        url: '/logo-full.png',
        width: 1024,
        height: 571,
        alt: 'EnInformasi Hub Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EnInformasi Hub',
    description: 'Portal wawasan teknologi modern, gaming & esports, serta tutorial praktis.',
    images: ['/logo-full.png'],
  },
  keywords: ['EnInformasi', 'EnInformasi Hub', 'Gaming Esports', 'Mobile Legends', 'Honor of Kings', 'Valorant', 'PUBG Mobile', 'GTA 6 2026', 'NVIDIA Spark', 'Hardware 2026', 'Tutorial AI', 'DeepSeek R1', 'Claude 3.7', 'Teknologi Terupdate 2026'],
  authors: [{ name: 'Edvan' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
    <html lang="id" className={`dark ${inter.variable} ${geistMono.variable} overflow-x-clip`}>
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400 overflow-x-clip min-h-screen">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
