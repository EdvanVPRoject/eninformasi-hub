export type CategoryType = string;

export type DifficultyType = 'Pemula' | 'Menengah' | 'Mahir' | 'Lanjutan' | 'Mudah';

export type PostType = 'tutorial' | 'artikel';

export interface TocItem {
  id: string;
  title: string;
}

export interface AffiliateProduct {
  name: string;
  priceEstimate: string;
  linkUrl: string;
  badge?: string;
  description?: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  postType: PostType; // 'tutorial' (langkah praktis) atau 'artikel' (wawasan/analisis)
  category: CategoryType;
  categoryLabel: string;
  difficulty?: DifficultyType;
  pubDate: string;
  updatedDate: string;
  readingTime: string;
  author: string;
  tags: string[];
  affiliateProduct?: AffiliateProduct;
  toc: TocItem[];
  steps?: { id: string; label: string }[];
  content: string;
  tocLevel?: number;
  en?: {
    title?: string;
    description?: string;
    content?: string;
    toc?: TocItem[];
    steps?: { id: string; label: string }[];
  };
  [key: string]: any;
}
