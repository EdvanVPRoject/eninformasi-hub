import { allArticles } from '@/lib/articles';
import { getArticleCover } from '@/lib/cover-images';
import { SITE_NAME, SITE_URL, parseArticleDate, resolveAbsoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

function escapeXml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const sorted = [...allArticles]
    .sort(
      (a, b) =>
        parseArticleDate(b.updatedDate || b.pubDate).getTime() -
        parseArticleDate(a.updatedDate || a.pubDate).getTime()
    )
    .slice(0, 50);

  const lastBuildDate =
    sorted.length > 0
      ? parseArticleDate(sorted[0].updatedDate || sorted[0].pubDate).toUTCString()
      : new Date().toUTCString();

  const itemsXml = sorted
    .map((article) => {
      const route = article.postType === 'tutorial' ? 'tutorial' : 'artikel';
      const articleUrl = `${SITE_URL}/${route}/${article.slug}`;
      const pubDate = parseArticleDate(article.pubDate).toUTCString();
      const cover = getArticleCover(article.slug, article.category, article.tags, article.title);
      const imageUrl = resolveAbsoluteUrl(cover.url);
      const tagsXml = (article.tags || [])
        .slice(0, 4)
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.description)}</description>
      <author>septiaedvan@gmail.com (${escapeXml(article.author || 'EdvanVPRoject')})</author>
      <category>${escapeXml(article.categoryLabel || article.category)}</category>
${tagsXml ? `${tagsXml}\n` : ''}      <media:content url="${escapeXml(imageUrl)}" medium="image" width="1200" height="675" />
      <media:description>${escapeXml(cover.caption || article.title)}</media:description>
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(`${SITE_NAME} — Portal Informasi, Gaming & Tutorial Teknologi`)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml('Portal wawasan teknologi modern, AI agents, gaming & esports, analisis hardware, dan tutorial praktis terupdate.')}</description>
    <language>id-ID</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${SITE_URL}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(`${SITE_URL}/icon-192.png`)}</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${escapeXml(SITE_URL)}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
