import type { Metadata } from 'next';
import HomeFeedClient from '@/components/HomeFeedClient';
import {
  articleSummaries,
  totalArticleCount,
  tutorialArticleCount,
  artikelArticleCount,
} from '@/lib/data/article-summaries';
import { SITE_NAME, SITE_URL, getCollectionSchema } from '@/lib/seo';

const homeTitle = `${SITE_NAME} — Portal ${totalArticleCount} Tutorial, Gaming & Tren Teknologi Terkini`;
const homeDescription = `EnInformasi Hub adalah portal teknologi, AI agents, gaming & esports, hardware & gadget dengan ${tutorialArticleCount} tutorial praktis dan ${artikelArticleCount} analisis mendalam terupdate.`;

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function HomePage() {
  const collectionSchema = getCollectionSchema({
    title: homeTitle,
    description: homeDescription,
    path: '/',
    items: articleSummaries.slice(0, 18).map((a) => ({
      title: a.title,
      url: `/${a.postType}/${a.slug}`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <HomeFeedClient />
    </>
  );
}
