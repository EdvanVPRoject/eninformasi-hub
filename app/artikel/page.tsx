import type { Metadata } from 'next';
import ArtikelIndexClient from '@/components/ArtikelIndexClient';
import { articleSummaries, artikelArticleCount } from '@/lib/data/article-summaries';
import { SITE_NAME, SITE_URL, getCollectionSchema } from '@/lib/seo';

const pageTitle = `Indeks ${artikelArticleCount} Informasi & Tren Teknologi Terkini — ${SITE_NAME}`;
const pageDescription =
  'Analisis mendalam lanskap teknologi modern, gaming & esports, rilis game masa depan, ekosistem AI, dan inovasi hardware di EnInformasi Hub.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/artikel',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/artikel`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function ArtikelPage() {
  const items = articleSummaries
    .filter((a) => a.postType === 'artikel')
    .slice(0, 18)
    .map((a) => ({
      title: a.title,
      url: `/artikel/${a.slug}`,
    }));

  const collectionSchema = getCollectionSchema({
    title: pageTitle,
    description: pageDescription,
    path: '/artikel',
    items,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <ArtikelIndexClient />
    </>
  );
}
