import { tutorialsPart1 } from './data/tutorials-1';
import { tutorialsPart2 } from './data/tutorials-2';
import { tutorialsPart3 } from './data/tutorials-3';
import { articlesPart1 } from './data/articles-1';
import { articlesPart2 } from './data/articles-2';
import { articlesPart3 } from './data/articles-3';
import { gamingTutorialsPart1 } from './data/gaming-1';
import { gamingArticlesPart2 } from './data/gaming-2';
import { upcomingTrendsArticles } from './data/upcoming-trends';
import { futureTechArticles } from './data/future-tech';
import { englishTranslations } from './data/translations-en';
import { enStepsMap } from './data/en-steps-map';
import { Article, CategoryType, DifficultyType, PostType, TocItem } from './types';
import { getCategoryLabel } from './i18n';

export function extractTocFromContent(content?: string, fallbackToc: TocItem[] = []): TocItem[] {
  if (!content) return fallbackToc;
  const lines = content.split('\n');
  const toc: TocItem[] = [];
  let idx = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      const heading = trimmed.replace('### ', '').trim();
      const numMatch = heading.match(/^(\d+)[\.\)]/);
      let id = '';
      if (numMatch && fallbackToc) {
        const num = parseInt(numMatch[1], 10);
        if (fallbackToc[num - 1]) {
          id = fallbackToc[num - 1].id;
        }
      }
      if (!id && fallbackToc && fallbackToc[idx]) {
        id = fallbackToc[idx].id;
      }
      if (!id) {
        id = heading
          .toLowerCase()
          .replace(/^[0-9]+\.\s*/, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      toc.push({ id, title: heading });
      idx++;
    }
  }
  return toc.length > 0 ? toc : fallbackToc;
}

export function normalizeCategory(rawCat: string): string {
  switch (rawCat) {
    // Gaming & Esports (Including upcoming blockbuster games and gaming hardware)
    case 'pubg-mobile':
    case 'mobile-legends':
    case 'honor-of-kings':
    case 'valorant':
    case 'counter-strike-2':
    case 'free-fire':
    case 'delta-force':
    case 'genshin-impact':
    case 'dota-2':
    case 'esports-analysis':
    case 'game-industry':
    case 'esports-lifestyle':
    case 'hardware-gaming':
    case 'game-review':
    case 'game-psychology':
    case 'game-dev':
    case 'gaming':
    case 'gaming-esports':
    case 'upcoming-gaming':
    case 'upcoming-trends':
    case 'upcoming':
    case 'upcoming-booming':
      return 'gaming-esports';

    // Technology & Hardware Gadgets
    case 'future-hardware':
    case 'gadgets':
    case 'tech-gadgets':
      return 'tech-gadgets';

    // Dev Tools, Workflow & Automation
    case 'automation':
    case 'developer-tools':
    case 'devops':
    case 'web-dev':
    case 'database-dev':
    case 'tools-automation':
      return 'tools-automation';

    // AI Agents & Otomasi
    case 'ai-rag':
    case 'ai-infrastructure':
    case 'audio-ai':
    case 'computer-vision':
    case 'iot-smarthome':
    case 'data-science':
    case 'generative-ai':
    case 'ai-agents':
      return 'ai-agents';

    // LLM & Model Cerdas
    case 'llm-models':
      return 'llm-models';

    // Prompt Engineering
    case 'prompting':
      return 'prompting';

    // Rig Local AI & Komputasi
    case 'hardware-setup':
      return 'hardware-setup';

    default:
      return rawCat;
  }
}

const rawArticles: Article[] = [
  ...tutorialsPart1,
  ...tutorialsPart2,
  ...tutorialsPart3,
  ...gamingTutorialsPart1,
  ...articlesPart1,
  ...articlesPart2,
  ...articlesPart3,
  ...gamingArticlesPart2,
  ...upcomingTrendsArticles,
  ...futureTechArticles,
];

// Normalize categories and attach full English translation to 100% of articles
export const allArticles: Article[] = rawArticles.map((article) => {
  const normCategory = normalizeCategory(article.category);
  const extraEn = englishTranslations[article.slug];
  const stepsEn = enStepsMap[article.slug];
  
  // Base en data
  const baseEn = article.en && article.en.content 
    ? article.en 
    : extraEn 
      ? { ...extraEn, ...(article.en || {}) } 
      : article.en;

  // Ensure 100% English TOC and English steps
  const mergedEn = baseEn ? {
    ...baseEn,
    toc: (baseEn.toc && baseEn.toc.length > 0)
      ? baseEn.toc
      : extractTocFromContent(baseEn.content, article.toc || []),
    steps: (baseEn.steps && baseEn.steps.length > 0)
      ? baseEn.steps
      : stepsEn || (extraEn?.steps) || article.steps,
  } : undefined;

  return {
    ...article,
    category: normCategory,
    categoryLabel: getCategoryLabel(normCategory, 'id'),
    en: mergedEn,
  };
});

export function getAllArticles(): Article[] {
  return allArticles;
}

export function getTutorials(): Article[] {
  return allArticles.filter((a) => a.postType === 'tutorial');
}

export function getArtikels(): Article[] {
  return allArticles.filter((a) => a.postType === 'artikel');
}

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}

export function getArticlesByPostType(postType: 'all' | PostType): Article[] {
  if (postType === 'all') return allArticles;
  return allArticles.filter((a) => a.postType === postType);
}

export function getArticlesByCategory(category: string, postType?: PostType): Article[] {
  let list = allArticles;
  if (postType) {
    list = list.filter((a) => a.postType === postType);
  }
  if (category === 'all') return list;
  return list.filter((a) => a.category === category);
}

export function getCategoriesWithCount(postType?: PostType): { id: string; label: string; count: number }[] {
  const baseList = postType ? allArticles.filter((a) => a.postType === postType) : allArticles;

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Semua Topik' },
    { id: 'gaming-esports', label: 'Gaming & Esports' },
    { id: 'tech-gadgets', label: 'Teknologi & Hardware' },
    { id: 'ai-agents', label: 'AI Agents & Otomasi' },
    { id: 'llm-models', label: 'LLM & Model Cerdas' },
    { id: 'tools-automation', label: 'Dev Tools & Workflow' },
    { id: 'prompting', label: 'Prompt Engineering' },
    { id: 'hardware-setup', label: 'Rig Local AI & Komputasi' },
  ];

  return categories.map((cat) => {
    const count =
      cat.id === 'all'
        ? baseList.length
        : baseList.filter((a) => a.category === cat.id).length;
    return { ...cat, count };
  });
}

export function searchArticles(query: string, postType?: PostType): Article[] {
  let list = allArticles;
  if (postType) {
    list = list.filter((a) => a.postType === postType);
  }
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      (a.en?.title && a.en.title.toLowerCase().includes(q)) ||
      (a.en?.description && a.en.description.toLowerCase().includes(q)) ||
      a.categoryLabel.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}
