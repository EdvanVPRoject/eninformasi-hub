import { MetadataRoute } from 'next';
import { allArticles } from '@/lib/articles';
import { SITE_URL, parseArticleDate } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const articleDates = allArticles.map((article) =>
    parseArticleDate(article.updatedDate || article.pubDate)
  );
  const latestTimestamp = articleDates.reduce(
    (max, d) => (d.getTime() > max ? d.getTime() : max),
    new Date('2026-10-18T00:00:00.000Z').getTime()
  );
  const latestSiteUpdate = new Date(latestTimestamp);

  const articleUrls: MetadataRoute.Sitemap = allArticles.map((article, idx) => {
    const route = article.postType === 'tutorial' ? 'tutorial' : 'artikel';
    return {
      url: `${SITE_URL}/${route}/${article.slug}`,
      lastModified: articleDates[idx],
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  const staticRoutes: {
    path: string;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
    priority: number;
  }[] = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/artikel', changeFrequency: 'daily', priority: 0.9 },
    { path: '/tutorial', changeFrequency: 'daily', priority: 0.9 },
    { path: '/tools', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/privacy-policy', changeFrequency: 'monthly', priority: 0.4 },
    { path: '/terms', changeFrequency: 'monthly', priority: 0.4 },
    { path: '/disclaimer', changeFrequency: 'monthly', priority: 0.4 },
  ];

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: latestSiteUpdate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticUrls, ...articleUrls];
}
