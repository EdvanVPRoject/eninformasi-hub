import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import ArticleDetailView from '@/components/ArticleDetailView';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: 'Artikel Tidak Ditemukan' };

  return {
    title: `${article.title} — EnInformasi Hub`,
    description: article.description,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.pubDate,
    },
  };
}

export default function ArtikelDetailPage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailView article={article} postType="artikel" />;
}
