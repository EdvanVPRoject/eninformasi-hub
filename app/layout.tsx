import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import LayoutShell from '@/components/LayoutShell';
import {
  totalArticleCount,
  tutorialArticleCount,
  artikelArticleCount,
} from '@/lib/data/article-summaries';
import {
  SITE_URL,
  SITE_NAME,
  OWNER_NAME,
  OWNER_PORTFOLIO,
  getWebsiteSchema,
  getOrganizationSchema,
} from '@/lib/seo';

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
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: `${SITE_NAME} — Portal ${totalArticleCount} Tutorial, Gaming & Tren Teknologi Terkini`,
  description: `EnInformasi Hub adalah portal wawasan teknologi modern, gaming & esports, rilis game masa depan, hardware & gadget, serta ${tutorialArticleCount} tutorial praktis dan ${artikelArticleCount} informasi mendalam terupdate.`,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: `${SITE_NAME} — Portal ${totalArticleCount} Tutorial, Gaming & Tren Teknologi`,
    description: `Wawasan teknologi modern, gaming & esports, rilis game masa depan, hardware & gadget, serta tutorial AI terupdate di EnInformasi Hub.`,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/logo-full.png',
        width: 1024,
        height: 571,
        alt: `${SITE_NAME} Logo`,
      },
    ],
    locale: 'id_ID',
    alternateLocale: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Portal Informasi & Tutorial Teknologi`,
    description:
      'Portal wawasan teknologi modern, gaming & esports, AI agents, serta tutorial praktis terupdate.',
    images: ['/logo-full.png'],
  },
  keywords: [
    'EnInformasi Hub',
    'EnInformasi',
    'EnInformasi.hub',
    'Portal Teknologi Indonesia',
    'Gaming Esports',
    'Tutorial AI Agent',
    'Hardware & GPU',
    'LLM & Model Open Source',
    'Automasi Workflow',
  ],
  authors: [{ name: OWNER_NAME, url: OWNER_PORTFOLIO }],
  creator: OWNER_NAME,
  publisher: SITE_NAME,
  category: 'technology',
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
  const websiteSchema = getWebsiteSchema();
  const orgSchema = getOrganizationSchema();

  return (
    <html lang="id" className={`dark ${inter.variable} ${geistMono.variable} overflow-x-clip`}>
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} RSS Feed`}
          href={`${SITE_URL}/feed.xml`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400 overflow-x-clip min-h-screen">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
