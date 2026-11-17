import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import { getTutorials, getArticleBySlug } from '@/lib/articles';
import { getArticleCover } from '@/lib/cover-images';
import {
  SITE_NAME,
  SITE_URL,
  OWNER_GITHUB,
  toIsoDateString,
  resolveAbsoluteUrl,
  getArticleSchema,
  getBreadcrumbSchema,
} from '@/lib/seo';
import ArticleDetailView from '@/components/ArticleDetailView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tutorials = getTutorials();
  return tutorials.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: `Tutorial Tidak Ditemukan — ${SITE_NAME}` };

  const canonicalPath =
    article.postType === 'artikel'
      ? `/artikel/${article.slug}`
      : `/tutorial/${article.slug}`;
  const cover = getArticleCover(article.slug, article.category, article.tags, article.title);
  const coverUrl = resolveAbsoluteUrl(cover.url);
  const publishedTime = toIsoDateString(article.pubDate);
  const modifiedTime = toIsoDateString(article.updatedDate || article.pubDate);

  return {
    title: `${article.title} — ${SITE_NAME}`,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: article.author || 'EdvanVPRoject', url: OWNER_GITHUB }],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${article.title} — ${SITE_NAME}`,
      description: article.description,
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime,
      modifiedTime,
      section: article.categoryLabel || article.category,
      tags: article.tags,
      images: [
        {
          url: coverUrl,
          width: 1200,
          height: 675,
          alt: cover.caption || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [coverUrl],
    },
  };
}

export default async function TutorialDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  if (article.postType === 'artikel') {
    permanentRedirect(`/artikel/${article.slug}`);
  }

  const cover = getArticleCover(article.slug, article.category, article.tags, article.title);
  const articleSchema = getArticleSchema(article, cover.url);
  const breadcrumbSchema = getBreadcrumbSchema(article);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ArticleDetailView article={article} postType="tutorial" />
    </>
  );
}
