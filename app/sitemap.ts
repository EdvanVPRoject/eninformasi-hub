import { MetadataRoute } from 'next';
import { allArticles } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://enkode.hub';

  const articleUrls = allArticles.map((article) => {
    const route = article.postType === 'tutorial' ? 'tutorial' : 'artikel';
    return {
      url: `${baseUrl}/${route}/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  const staticUrls = [
    '',
    '/tutorial',
    '/artikel',
    '/tools',
    '/about',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/contact',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1.0 : 0.7,
  }));

  return [...staticUrls, ...articleUrls];
}
