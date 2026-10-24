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
  ChevronDown,
  TrendingUp,
  X,
  Wrench,
  ArrowRight
} from 'lucide-react';
import { 
  articleSummaries, 
  totalArticleCount, 
  tutorialArticleCount, 
  artikelArticleCount 
} from '@/lib/data/article-summaries';
import SidebarNav from '@/components/SidebarNav';
import { getArticleCover } from '@/lib/cover-images';
import { useLanguage } from '@/components/LanguageContext';
import { getCategoryLabel } from '@/lib/i18n';
import SortDropdown, { SortOption } from '@/components/SortDropdown';

const TRENDING_TOPICS = [
  'Steam Machine',
  'RTX 5090',
  'DeepSeek',
  'Claude',
  'AI Agent',
  'Ollama',
  'GTA 6',
  'FSR'
];

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

  const handleToggleTrending = (topic: string) => {
    if (searchQuery.toLowerCase() === topic.toLowerCase()) {
      setSearchQuery('');
    } else {
      setSearchQuery(topic);
      setVisibleCount(18);
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
    <div className="max-w-[1880px] mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-12">
      {/* Hero Bento Header */}
      <div className="relative mb-8 sm:mb-10 p-4 sm:p-8 lg:p-10 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Hero Title, Value Proposition & Feature Pills */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                <Zap className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>
                  {lang === 'en'
                    ? `EnInformasi Hub — ${totalArticleCount} Tutorials, Gaming & Future Tech Trends`
                    : `EnInformasi Hub — ${totalArticleCount} Tutorial, Gaming & Tren Teknologi Terkini`}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-main)] leading-[1.15]">
                {t('hero_title_prefix')} {t('hero_title_highlight')}
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
                {lang === 'en'
                  ? `Explore cutting-edge tech insights, gaming & esports strategies, upcoming blockbuster releases, hardware breakthroughs, featuring ${tutorialCount} Practical Tutorials (with copy-paste code and settings) and ${artikelCount} Deep-Dive Articles.`
                  : `Eksplorasi wawasan teknologi terkini, tren gaming & esports, rilis game masa depan, inovasi hardware canggih, hingga ${tutorialCount} Tutorial Praktis (langkah demi langkah dengan strategi dan kode siap pakai) dan ${artikelCount} Informasi & Analisis mendalam.`}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-muted)] border-t border-[var(--border-color)] pt-4">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('hero_pill_1')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('hero_pill_2')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('hero_pill_3')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bento Hub (Interactive Stats + Trending Hot Topics + Quick Jump) */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between gap-3.5">
            {/* Top Stats Trio */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleSelectType('all')}
                className={`p-2.5 sm:p-3.5 rounded-xl text-left border transition-all active:scale-[0.98] ${
                  selectedType === 'all'
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-sm'
                    : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)]">
                    {totalArticleCount}
                  </span>
                  <Layers className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${selectedType === 'all' ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--text-main)] truncate">
                  {lang === 'en' ? 'All Content' : 'Semua Konten'}
                </div>
                <div className="text-[11px] sm:text-xs text-[var(--text-muted)] truncate">
                  {lang === 'en' ? 'Full Database' : 'Katalog Lengkap'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('tutorial')}
                className={`p-2.5 sm:p-3.5 rounded-xl text-left border transition-all active:scale-[0.98] ${
                  selectedType === 'tutorial'
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-sm'
                    : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-500">
                    {tutorialCount}
                  </span>
                  <GraduationCap className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${selectedType === 'tutorial' ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--text-main)] truncate">
                  {lang === 'en' ? 'Tutorials' : 'Tutorial'}
                </div>
                <div className="text-[11px] sm:text-xs text-[var(--text-muted)] truncate">
                  {lang === 'en' ? 'Code & Setup' : 'Langkah & Kode'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('artikel')}
                className={`p-2.5 sm:p-3.5 rounded-xl text-left border transition-all active:scale-[0.98] ${
                  selectedType === 'artikel'
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-sm'
                    : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-sky-500 dark:text-sky-400">
                    {artikelCount}
                  </span>
                  <FileText className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${selectedType === 'artikel' ? 'text-sky-500' : 'text-[var(--text-muted)]'}`} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--text-main)] truncate">
                  {lang === 'en' ? 'Information' : 'Informasi'}
                </div>
                <div className="text-[11px] sm:text-xs text-[var(--text-muted)] truncate">
                  {lang === 'en' ? 'Analysis & Trends' : 'Riset & Gaming'}
                </div>
              </button>
            </div>

            {/* Trending Hot Topics Bento Tile */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center gap-1.5 text-[var(--text-main)]">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{lang === 'en' ? 'Trending Topics' : 'Topik Sedang Hangat'}</span>
                </span>
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-emerald-500 hover:underline flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                ) : (
                  <span className="text-xs text-[var(--text-muted)]">
                    {lang === 'en' ? 'Click to filter' : 'Klik untuk filter'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {TRENDING_TOPICS.map((topic) => {
                  const isActive = searchQuery.toLowerCase() === topic.toLowerCase();
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleToggleTrending(topic)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-emerald-500 text-black font-semibold border-emerald-500 shadow-sm scale-105'
                          : 'bg-[var(--bg-main)] text-[var(--text-main)] border-[var(--border-color)] hover:border-emerald-500/60 hover:text-emerald-500'
                      }`}
                    >
                      <span>#{topic}</span>
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Tools Link & Command Palette Trigger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                href="/tools"
                className="group p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/50 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-[var(--text-main)] truncate group-hover:text-emerald-500 transition-colors">
                      {lang === 'en' ? 'Tools & Gear' : 'Tools & Rekomendasi'}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] truncate">
                      {lang === 'en' ? 'Scripts & Presets' : 'Config & Script Siap Pakai'}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
                  }
                }}
                className="group p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/50 flex items-center justify-between transition-all text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center shrink-0 text-[var(--text-muted)] group-hover:text-emerald-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-[var(--text-main)] truncate group-hover:text-emerald-500 transition-colors">
                      {lang === 'en' ? 'Quick Search' : 'Cari Cepat'}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] truncate">
                      {lang === 'en' ? 'Ctrl + K shortcut' : 'Pintasan Ctrl + K'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] shrink-0 ml-2">
                  Ctrl+K
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Article Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6">
        {/* Left Column: Filter Sidebar (Sticky on Scroll) */}
        <aside className="lg:col-span-3 xl:col-span-2 lg:self-start lg:sticky lg:top-20 w-full z-20">
          <div className="pr-1 pb-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-thin">
            <SidebarNav
              currentCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              postType={selectedType}
            />
          </div>
        </aside>

        {/* Right Column: Content Grid */}
        <main className="lg:col-span-9 xl:col-span-10 space-y-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
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
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/50 card-smooth-hover active:scale-[0.99] shadow-sm"
                    >
                      <div>
                        {/* Featured Image Thumbnail Header */}
                        <Link href={targetUrl} className="block relative aspect-[16/9] w-full overflow-hidden bg-zinc-900 border-b border-[var(--border-color)]">
                          <img
                            src={getArticleCover(article.slug, article.category, article.tags).url}
                            alt={displayTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
                          
                          {/* Floating Badges */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold backdrop-blur-md ${
                              article.postType === 'tutorial'
                                ? 'bg-emerald-950/85 text-emerald-400 border border-emerald-500/30'
                                : 'bg-black/75 text-sky-400 border border-sky-500/30'
                            }`}>
                              {article.postType === 'tutorial' ? 'Tutorial' : (lang === 'en' ? 'Information' : 'Informasi')}
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
                          {/* Title - 100% Full Title Without Clamping */}
                          <h3 className="font-bold text-sm sm:text-base text-[var(--text-main)] group-hover:text-emerald-500 transition-colors leading-snug line-clamp-3">
                            <Link href={targetUrl}>
                              {displayTitle}
                            </Link>
                          </h3>

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                            {displayDesc}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Tags & Read CTA */}
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-[var(--border-color)]/70 flex items-center justify-between gap-2">
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
                              : (lang === 'en' ? 'Read Article' : 'Baca Informasi')}
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
