import type { Metadata } from 'next';
import TutorialIndexClient from '@/components/TutorialIndexClient';
import { articleSummaries, tutorialArticleCount } from '@/lib/data/article-summaries';
import { SITE_NAME, SITE_URL, getCollectionSchema } from '@/lib/seo';

const pageTitle = `Indeks ${tutorialArticleCount} Tutorial Praktis AI, Coding & Gaming — ${SITE_NAME}`;
const pageDescription =
  'Kumpulan panduan teknis langkah demi langkah, skrip AI agent, LLM lokal, otomasi, dan konfigurasi gaming kompetitif di EnInformasi Hub.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/tutorial',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/tutorial`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function TutorialPage() {
  const items = articleSummaries
    .filter((a) => a.postType === 'tutorial')
    .slice(0, 18)
    .map((a) => ({
      title: a.title,
      url: `/tutorial/${a.slug}`,
    }));

  const collectionSchema = getCollectionSchema({
    title: pageTitle,
    description: pageDescription,
    path: '/tutorial',
    items,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <TutorialIndexClient />
    </>
  );
}
