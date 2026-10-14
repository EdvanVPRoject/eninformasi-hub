import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import ArticleDetailView from '@/components/ArticleDetailView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
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

export default async function ArtikelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailView article={article} postType="artikel" />;
}
