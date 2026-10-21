'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Zap, 
  Search, 
  Clock, 
  Layers, 
  GraduationCap, 
  FileText, 
  ChevronRight, 
  CheckCircle2,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { 
  articleSummaries, 
  totalArticleCount, 
  tutorialArticleCount, 
  artikelArticleCount 
} from '@/lib/data/article-summaries';
import SidebarNav from '@/components/SidebarNav';
import { useLanguage } from '@/components/LanguageContext';
import { getCategoryLabel } from '@/lib/i18n';
import SortDropdown, { SortOption } from '@/components/SortDropdown';

function HomeContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialType = (searchParams.get('type') as 'all' | 'tutorial' | 'artikel') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedType, setSelectedType] = useState<'all' | 'tutorial' | 'artikel'>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [visibleCount, setVisibleCount] = useState<number>(18);

  // Sinkronkan state ketika parameter URL berubah (misal diklik dari Footer atau halaman Artikel)
  React.useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    const urlType = searchParams.get('type') as 'all' | 'tutorial' | 'artikel';
    if (urlType) setSelectedType(urlType);
    const urlQuery = searchParams.get('q');
    if (urlQuery) setSearchQuery(urlQuery);
    setVisibleCount(18);
  }, [searchParams]);

  const handleSelectType = (type: 'all' | 'tutorial' | 'artikel') => {
    setSelectedType(type);
    setVisibleCount(18);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (type === 'all') {
        url.searchParams.delete('type');
      } else {
        url.searchParams.set('type', type);
      }
      window.history.replaceState(null, '', url.pathname + url.search);
    }
  };

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

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSearchQuery('');
    setSortBy('recommended');
    setVisibleCount(18);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('category');
      url.searchParams.delete('type');
      url.searchParams.delete('q');
      window.history.replaceState(null, '', url.pathname + url.search);
    }
  };

  const filteredArticles = useMemo(() => {
    const filtered = articleSummaries.filter((article) => {
      // Type filter (Tutorial vs Artikel)
      if (selectedType !== 'all' && article.postType !== selectedType) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && article.category !== selectedCategory) {
        return false;
      }
      // Search query
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

    // Sorting
    if (sortBy === 'latest') {
      return [...filtered].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    }
    if (sortBy === 'quick-read') {
      return [...filtered].sort((a, b) => {
        const timeA = parseInt(a.readingTime, 10) || 0;
        const timeB = parseInt(b.readingTime, 10) || 0;
        return timeA - timeB;
      });
    }
    if (sortBy === 'deep-read') {
      return [...filtered].sort((a, b) => {
        const timeA = parseInt(a.readingTime, 10) || 0;
        const timeB = parseInt(b.readingTime, 10) || 0;
        return timeB - timeA;
      });
    }
    if (sortBy === 'az') {
      return [...filtered].sort((a, b) => {
        const titleA = (lang === 'en' && a.en?.title) ? a.en.title : a.title;
        const titleB = (lang === 'en' && b.en?.title) ? b.en.title : b.title;
        return titleA.localeCompare(titleB);
      });
    }

    return filtered;
  }, [selectedCategory, selectedType, searchQuery, sortBy, lang]);

  const tutorialCount = tutorialArticleCount;
  const artikelCount = artikelArticleCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Bento Header */}
      <div className="relative mb-10 p-6 sm:p-10 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>
              {lang === 'en'
                ? `EnInformasi Hub — ${totalArticleCount} Tutorials, Gaming & Future Tech Trends`
                : `EnInformasi Hub — ${totalArticleCount} Tutorial, Gaming & Tren Teknologi Terkini`}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-main)] leading-[1.15]">
            {t('hero_title_prefix')}{' '}
            <span className="text-emerald-500 dark:text-emerald-400">
              {t('hero_title_highlight')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            {lang === 'en'
              ? `Explore cutting-edge tech insights, gaming & esports strategies, upcoming blockbuster releases, hardware breakthroughs, featuring ${tutorialCount} Practical Tutorials (with copy-paste code and settings) and ${artikelCount} Deep-Dive Articles.`
              : `Eksplorasi wawasan teknologi terkini, tren gaming & esports, rilis game masa depan, inovasi hardware canggih, hingga ${tutorialCount} Tutorial Praktis (langkah demi langkah dengan strategi dan kode siap pakai) dan ${artikelCount} EnInformasi & Analisis mendalam.`}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{t('hero_pill_1')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{t('hero_pill_2')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{t('hero_pill_3')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Article Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Filter Sidebar (Sticky on Scroll) */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-1 pb-6">
            <SidebarNav
              currentCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              postType={selectedType}
            />
          </div>
        </aside>

        {/* Right Column: Content Grid */}
        <main className="lg:col-span-9 space-y-6">
          {/* Mobile Dropdown for Content Type */}
          <div className="sm:hidden mb-3 space-y-1.5">
            <label htmlFor="mobile-type-select" className="flex items-center justify-between text-xs font-mono font-semibold text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5 text-[var(--text-main)]">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lang === 'en' ? 'Content Type' : 'Pilihan Jenis Konten'}</span>
              </span>
              <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                {selectedType === 'all' ? totalArticleCount : selectedType === 'tutorial' ? tutorialCount : artikelCount}
              </span>
            </label>
            <div className="relative">
              <select
                id="mobile-type-select"
                value={selectedType}
                onChange={(e) => handleSelectType(e.target.value as 'all' | 'tutorial' | 'artikel')}
                className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)] font-semibold focus:outline-none focus:border-emerald-500/60 shadow-sm pr-9 cursor-pointer"
              >
                <option value="all" className="bg-zinc-900 text-zinc-100">
                  {t('tab_all')} ({totalArticleCount})
                </option>
                <option value="tutorial" className="bg-zinc-900 text-zinc-100">
                  {t('tab_tutorials')} ({tutorialCount})
                </option>
                <option value="artikel" className="bg-zinc-900 text-zinc-100">
                  {t('tab_articles')} ({artikelCount})
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-emerald-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Desktop Section Segment Tabs: Semua | Tutorial | Artikel (Sticky saat scroll) */}
          <div className="hidden sm:block sticky top-16 z-30 pt-3 pb-2 -mt-3 bg-[var(--bg-main)]/95 backdrop-blur-md transition-all">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs font-mono shadow-sm">
              <button
                onClick={() => handleSelectType('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-out active:scale-95 whitespace-nowrap flex items-center gap-2 ${
                  selectedType === 'all'
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('tab_all')}</span>
                <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">
                  {totalArticleCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectType('tutorial')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-out active:scale-95 whitespace-nowrap flex items-center gap-2 ${
                  selectedType === 'tutorial'
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t('tab_tutorials')}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedType === 'tutorial' ? 'bg-black/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {tutorialCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectType('artikel')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-out active:scale-95 whitespace-nowrap flex items-center gap-2 ${
                  selectedType === 'artikel'
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('tab_articles')}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedType === 'artikel' ? 'bg-black/20' : 'bg-zinc-500/10 text-[var(--text-muted)]'}`}>
                  {artikelCount}
                </span>
              </button>
            </div>
          </div>

          {/* Top Search, Sort & Counter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('filter_search_placeholder')}
                className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-transparent border-none outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Modern Custom Sort Dropdown */}
              <SortDropdown value={sortBy} onChange={setSortBy} />

              {(selectedCategory !== 'all' || selectedType !== 'all' || searchQuery || sortBy !== 'recommended') && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[var(--bg-main)] hover:bg-zinc-500/10 text-[var(--text-muted)] border border-[var(--border-color)] transition-all whitespace-nowrap"
                >
                  Reset
                </button>
              )}

              <div className="text-xs font-mono text-[var(--text-muted)] px-1 whitespace-nowrap">
                {lang === 'en' ? (
                  <>Showing <span className="font-bold text-emerald-500">{filteredArticles.length}</span> items</>
                ) : (
                  <>Menampilkan <span className="font-bold text-emerald-500">{filteredArticles.length}</span> konten</>
                )}
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-muted)] space-y-3">
              <p className="text-sm">
                {t('no_content_found')}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-mono rounded-lg bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all"
              >
                {t('no_content_reset')}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredArticles.slice(0, visibleCount).map((article) => {
                  const targetUrl =
                    article.postType === 'tutorial'
                      ? `/tutorial/${article.slug}`
                      : `/artikel/${article.slug}`;

                  const displayTitle = (lang === 'en' && article.en?.title) ? article.en.title : article.title;
                  const displayDesc = (lang === 'en' && article.en?.description) ? article.en.description : article.description;

                  return (
                    <article
                      key={article.slug}
                      className="group flex flex-col justify-between p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/50 card-smooth-hover active:scale-[0.99]"
                    >
                      <div className="space-y-3">
                        {/* Meta Pill bar */}
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded font-semibold ${
                              article.postType === 'tutorial' 
                                ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20' 
                                : 'bg-zinc-500/10 text-[var(--text-muted)] border border-[var(--border-color)]'
                            }`}>
                              {article.postType === 'tutorial' ? 'Tutorial' : (lang === 'en' ? 'EnInformation' : 'EnInformasi')}
                            </span>
                            <span className="text-[var(--text-muted)]">{getCategoryLabel(article.category, lang)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[var(--text-muted)]">
                            <Clock className="w-3 h-3 text-emerald-500" />
                            <span>{article.readingTime}</span>
                          </div>
                        </div>

                        {/* Title - 100% Full Title Without Clamping */}
                        <h3 className="font-bold text-base sm:text-lg text-[var(--text-main)] group-hover:text-emerald-500 transition-colors leading-snug">
                          <Link href={targetUrl}>
                            {displayTitle}
                          </Link>
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                          {displayDesc}
                        </p>
                      </div>

                      {/* Bottom Tags & Read CTA */}
                      <div className="pt-4 mt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-500/10 text-[var(--text-muted)]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={targetUrl}
                          className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-500 hover:text-emerald-400 group-hover:translate-x-0.5 transition-all whitespace-nowrap"
                        >
                          <span>
                            {article.postType === 'tutorial'
                              ? (lang === 'en' ? 'Start Tutorial' : 'Mulai Tutorial')
                              : (lang === 'en' ? 'Read Article' : 'Baca EnInformasi')}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {visibleCount < filteredArticles.length && (
                <div className="pt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 18)}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-semibold bg-[var(--card-bg)] hover:bg-emerald-500 hover:text-zinc-950 text-[var(--text-main)] border border-[var(--border-color)] hover:border-emerald-500 shadow-sm transition-all"
                  >
                    {lang === 'en'
                      ? `Load More Content (${filteredArticles.length - visibleCount} remaining)`
                      : `Muat Konten Lainnya (${filteredArticles.length - visibleCount} tersisa)`}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-zinc-500">Memuat katalog EnInformasi Hub...</div>}>
      <HomeContent />
    </Suspense>
  );
}
