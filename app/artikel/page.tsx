'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  Search, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Layers,
  GraduationCap,
  ChevronDown 
} from 'lucide-react';
import { 
  articleSummaries, 
  totalArticleCount, 
  tutorialArticleCount 
} from '@/lib/data/article-summaries';
import SidebarNav from '@/components/SidebarNav';
import { getArticleCover } from '@/lib/cover-images';
import { useLanguage } from '@/components/LanguageContext';
import { getCategoryLabel } from '@/lib/i18n';
import SortDropdown, { SortOption } from '@/components/SortDropdown';

function ArtikelContent() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [visibleCount, setVisibleCount] = useState<number>(18);

  React.useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    const urlQuery = searchParams.get('q');
    if (urlQuery) setSearchQuery(urlQuery);
    setVisibleCount(18);
  }, [searchParams]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(18);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (cat === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', cat);
      }
      window.history.replaceState(null, '', url.pathname + url.search);
    }
  };

  const artikels = useMemo(() => articleSummaries.filter((a) => a.postType === 'artikel'), []);

  const filteredArtikels = useMemo(() => {
    let list = artikels.filter((article) => {
      if (selectedCategory !== 'all' && article.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesDesc = article.description.toLowerCase().includes(q);
        const matchesTag = article.tags.some((tg) => tg.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTag) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === 'latest') {
      return [...list].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    }
    if (sortBy === 'quick-read') {
      return [...list].sort((a, b) => (parseInt(a.readingTime, 10) || 0) - (parseInt(b.readingTime, 10) || 0));
    }
    if (sortBy === 'deep-read') {
      return [...list].sort((a, b) => (parseInt(b.readingTime, 10) || 0) - (parseInt(a.readingTime, 10) || 0));
    }
    if (sortBy === 'az') {
      return [...list].sort((a, b) => {
        const titleA = (lang === 'en' && a.en?.title) ? a.en.title : a.title;
        const titleB = (lang === 'en' && b.en?.title) ? b.en.title : b.title;
        return titleA.localeCompare(titleB);
      });
    }

    return list;
  }, [artikels, selectedCategory, searchQuery, sortBy, lang]);

  return (
    <div className="max-w-[1880px] mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="relative mb-10 p-6 sm:p-10 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
            <FileText className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>{lang === 'en' ? 'Category: Information, Insights & Future Tech Trends' : 'Kategori: Informasi, Wawasan & Tren Teknologi Masa Depan'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
            {lang === 'en' ? 'Information & Tech Trends Index' : 'Indeks Informasi & Tren Teknologi'}
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            {lang === 'en'
              ? 'In-depth analysis of modern tech landscapes, gaming & esports, upcoming releases, AI model shifts, hardware innovations, and market dynamics.'
              : 'Analisis menyeluruh lanskap teknologi modern, gaming & esports, rilis game masa depan, pergeseran ekosistem AI, inovasi hardware canggih, serta dinamika industri terkini yang disajikan secara santai dan mendalam.'}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6">
        {/* Left Column Filters (Sticky on Scroll) */}
        <aside className="lg:col-span-3 xl:col-span-2 lg:self-start lg:sticky lg:top-20 w-full z-20">
          <div className="pr-1 pb-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-thin">
            <SidebarNav
              currentCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              postType="artikel"
            />
          </div>
        </aside>

        {/* Right Column Grid */}
        <main className="lg:col-span-9 xl:col-span-10 space-y-6">
          {/* Mobile Dropdown for Content Type */}
          <div className="sm:hidden mb-3 space-y-1.5">
            <label htmlFor="mobile-artikel-type-select" className="flex items-center justify-between text-xs font-mono font-semibold text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5 text-[var(--text-main)]">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lang === 'en' ? 'Content Type' : 'Pilihan Jenis Konten'}</span>
              </span>
              <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                {artikels.length} {lang === 'en' ? 'Articles' : 'Artikel'}
              </span>
            </label>
            <div className="relative">
              <select
                id="mobile-artikel-type-select"
                value="/artikel"
                onChange={(e) => router.push(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)] font-semibold focus:outline-none focus:border-emerald-500/60 shadow-sm pr-9 cursor-pointer"
              >
                <option value="/" className="bg-zinc-900 text-zinc-100">
                  {t('tab_all')} ({totalArticleCount})
                </option>
                <option value="/tutorial" className="bg-zinc-900 text-zinc-100">
                  {t('tab_tutorials')} ({tutorialArticleCount})
                </option>
                <option value="/artikel" className="bg-zinc-900 text-zinc-100">
                  {t('tab_articles')} ({artikels.length})
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-emerald-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Desktop Section Segment Tabs: Semua | Tutorial | EnInformasi (Sticky saat scroll) */}
          <div className="hidden sm:block sticky top-16 z-30 pt-3 pb-2 -mt-3 bg-[var(--bg-main)]/95 backdrop-blur-md transition-all">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs font-mono shadow-sm">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('tab_all')}</span>
                <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">
                  {totalArticleCount}
                </span>
              </Link>

              <Link
                href="/tutorial"
                className="px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t('tab_tutorials')}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400">
                  {tutorialArticleCount}
                </span>
              </Link>

              <Link
                href="/artikel"
                className="px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 bg-emerald-500 text-zinc-950 shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('tab_articles')}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/20">
                  {artikels.length}
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search articles and insights...' : 'Cari artikel dan analisis...'}
                className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-transparent border-none outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <SortDropdown value={sortBy} onChange={setSortBy} />

              {(selectedCategory !== 'all' || searchQuery || sortBy !== 'recommended') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSortBy('recommended');
                  }}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[var(--bg-main)] hover:bg-zinc-500/10 text-[var(--text-muted)] border border-[var(--border-color)] transition-all whitespace-nowrap"
                >
                  Reset Filter
                </button>
              )}
            </div>
            <div className="text-xs font-mono text-[var(--text-muted)] px-2">
              {lang === 'en' ? (
                <>Showing <span className="font-bold text-emerald-500">{filteredArtikels.length}</span> articles</>
              ) : (
                <>Menampilkan <span className="font-bold text-emerald-500">{filteredArtikels.length}</span> artikel</>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
            {filteredArtikels.slice(0, visibleCount).map((article) => {
              const displayTitle = (lang === 'en' && article.en?.title) ? article.en.title : article.title;
              const displayDesc = (lang === 'en' && article.en?.description) ? article.en.description : article.description;

              return (
                <article
                  key={article.slug}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/50 hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                >
                  <div>
                    {/* Featured Image Thumbnail Header */}
                    <Link href={`/artikel/${article.slug}`} className="block relative aspect-[16/9] w-full overflow-hidden bg-zinc-900 border-b border-[var(--border-color)]">
                      <img
                        src={getArticleCover(article.slug, article.category, article.tags).url}
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-black/75 text-sky-400 border border-sky-500/30 backdrop-blur-md">
                          {lang === 'en' ? 'Information' : 'Informasi'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono text-zinc-300 bg-black/75 backdrop-blur-md border border-white/10">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{article.readingTime}</span>
                      </div>

                      <div className="absolute bottom-2.5 left-3 text-[11px] font-mono text-zinc-200 drop-shadow flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{getCategoryLabel(article.category, lang)}</span>
                      </div>
                    </Link>

                    <div className="p-3.5 sm:p-4 space-y-2">
                      {/* 100% Full Title Without Clamping */}
                      <h3 className="font-bold text-sm sm:text-base text-[var(--text-main)] group-hover:text-emerald-500 transition-colors leading-snug line-clamp-3">
                        <Link href={`/artikel/${article.slug}`}>
                          {displayTitle}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                        {displayDesc}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-[var(--border-color)]/70 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'en' ? 'Deep Dive & Insights' : 'Wawasan & Komparasi'}</span>
                    </div>
                    <Link
                      href={`/artikel/${article.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-500 hover:text-emerald-400 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>{lang === 'en' ? 'Read Article' : 'Baca Informasi'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {visibleCount < filteredArtikels.length && (
            <div className="pt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-semibold bg-[var(--card-bg)] hover:bg-emerald-500 hover:text-zinc-950 text-[var(--text-main)] border border-[var(--border-color)] hover:border-emerald-500 shadow-sm transition-all"
              >
                {lang === 'en'
                  ? `Load More Articles (${filteredArtikels.length - visibleCount} remaining)`
                  : `Muat Artikel Lainnya (${filteredArtikels.length - visibleCount} tersisa)`}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ArtikelPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-zinc-500">Memuat katalog Informasi...</div>}>
      <ArtikelContent />
    </Suspense>
  );
}
