import { Article } from './types';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://eninformasi-hub.entehchin.workers.dev'
).replace(/\/$/, '');

export const SITE_NAME = 'EnInformasi Hub';
export const SITE_ALTERNATE_NAMES = [
  'EnInformasi.hub',
  'EnInformasi',
  'eninformasi hub',
];
export const OWNER_NAME = 'Edvan Nuriana Putra Septia';
export const OWNER_HANDLE = 'EdvanVPRoject';
export const OWNER_GITHUB = 'https://github.com/EdvanVPRoject';
export const OWNER_PORTFOLIO = 'https://edvan-portofolio.vercel.app/';

const INDONESIAN_MONTHS: Record<string, number> = {
  januari: 0,
  februari: 1,
  pebruari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  nopember: 10,
  desember: 11,
};

const FALLBACK_DATE_ISO = '2026-10-18T00:00:00.000Z';

/**
 * Parses ISO dates as well as Indonesian editorial date strings (e.g. "18 Oktober 2026")
 * into a valid Date object without throwing or returning Invalid Date.
 */
export function parseArticleDate(dateStr?: string): Date {
  if (!dateStr) return new Date(FALLBACK_DATE_ISO);

  const trimmed = dateStr.trim();
  const direct = new Date(trimmed);
  if (!isNaN(direct.getTime())) {
    return direct;
  }

  const indoMatch = trimmed.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (indoMatch) {
    const day = parseInt(indoMatch[1], 10);
    const monthName = indoMatch[2].toLowerCase();
    const year = parseInt(indoMatch[3], 10);
    const monthIdx = INDONESIAN_MONTHS[monthName];
    if (monthIdx !== undefined && day >= 1 && day <= 31 && year >= 2000) {
      return new Date(Date.UTC(year, monthIdx, day, 7, 0, 0));
    }
  }

  return new Date(FALLBACK_DATE_ISO);
}

export function toIsoDateString(dateStr?: string): string {
  return parseArticleDate(dateStr).toISOString();
}

export function resolveAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return `${SITE_URL}/logo-full.png`;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${cleanPath}`;
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    description:
      'Portal informasi teknologi modern, AI agents, gaming & esports, analisis hardware, dan tutorial praktis berbahasa Indonesia & Inggris.',
    inLanguage: ['id-ID', 'en-US'],
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon-192.png`,
      width: 192,
      height: 192,
    },
    founder: {
      '@type': 'Person',
      name: OWNER_NAME,
      alternateName: OWNER_HANDLE,
      url: OWNER_PORTFOLIO,
      sameAs: [OWNER_GITHUB, OWNER_PORTFOLIO],
    },
    sameAs: [
      OWNER_GITHUB,
      OWNER_PORTFOLIO,
      'https://www.linkedin.com/in/edvannuriana',
      'https://www.instagram.com/edvan_nr/',
    ],
  };
}

export function getCollectionSchema(params: {
  title: string;
  description: string;
  path: string;
  items: { title: string; url: string }[];
}) {
  const fullUrl = resolveAbsoluteUrl(params.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${fullUrl}#collection`,
    url: fullUrl,
    name: params.title,
    description: params.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: params.items.length,
      itemListElement: params.items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: resolveAbsoluteUrl(item.url),
        name: item.title,
      })),
    },
  };
}

export function getArticleSchema(article: Article, imageUrl: string) {
  const route = article.postType === 'tutorial' ? 'tutorial' : 'artikel';
  const canonicalUrl = `${SITE_URL}/${route}/${article.slug}`;
  const publishedIso = toIsoDateString(article.pubDate);
  const modifiedIso = toIsoDateString(article.updatedDate || article.pubDate);

  return {
    '@context': 'https://schema.org',
    '@type': article.postType === 'tutorial' ? 'TechArticle' : 'Article',
    '@id': `${canonicalUrl}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: article.title,
    description: article.description,
    image: [resolveAbsoluteUrl(imageUrl)],
    datePublished: publishedIso,
    dateModified: modifiedIso,
    inLanguage: 'id-ID',
    articleSection: article.categoryLabel || article.category,
    keywords: Array.isArray(article.tags) ? article.tags.join(', ') : '',
    author: {
      '@type': 'Person',
      name: article.author || OWNER_HANDLE,
      url: OWNER_GITHUB,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  };
}

export function getBreadcrumbSchema(article: Article) {
  const route = article.postType === 'tutorial' ? 'tutorial' : 'artikel';
  const sectionLabel =
    article.postType === 'tutorial' ? 'Tutorial Praktis' : 'Informasi & Tren';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: sectionLabel,
        item: `${SITE_URL}/${route}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${SITE_URL}/${route}/${article.slug}`,
      },
    ],
  };
}
