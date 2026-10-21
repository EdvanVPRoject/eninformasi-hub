'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Search, 
  Clock, 
  ChevronRight, 
  Layers,
  FileText,
  ChevronDown
} from 'lucide-react';
import { 
  articleSummaries, 
  totalArticleCount, 
  artikelArticleCount 
} from '@/lib/data/article-summaries';
import SidebarNav from '@/components/SidebarNav';
import { useLanguage } from '@/components/LanguageContext';
import { getCategoryLabel } from '@/lib/i18n';
import SortDropdown, { SortOption } from '@/components/SortDropdown';

function TutorialContent() {
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

  const tutorials = useMemo(() => articleSummaries.filter((a) => a.postType === 'tutorial'), []);

  const filteredTutorials = useMemo(() => {
    let list = tutorials.filter((article) => {
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
  }, [tutorials, selectedCategory, searchQuery, sortBy, lang]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="relative mb-10 p-6 sm:p-10 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'en' ? 'Category: Step-by-Step Hands-on Tutorials' : 'Kategori: Tutorial Langkah demi Langkah (Hands-on)'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
            {lang === 'en' ? 'Practical Guides & Tutorials Index' : 'Indeks Panduan & Tutorial Praktis'}
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            {lang === 'en'
              ? 'Hands-on technical guides with copy-paste commands, scripts, in-game configs, and checklists for AI agents, automation, local rigs, and competitive gaming.'
              : 'Kumpulan panduan teknis langsung dengan panduan langkah demi langkah, perintah terminal, setting in-game, dan kode siap pakai untuk agen AI, otomasi, hardware, hingga gaming kompetitif.'}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Filters (Sticky on Scroll) */}
        <aside className="lg:col-span-3 lg:self-start">
          <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-1 pb-6">
            <SidebarNav
              currentCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              postType="tutorial"
            />
          </div>
        </aside>

        {/* Right Column Grid */}
        <main className="lg:col-span-9 space-y-6">
          {/* Mobile Dropdown for Content Type */}
          <div className="sm:hidden mb-3 space-y-1.5">
            <label htmlFor="mobile-tutorial-type-select" className="flex items-center justify-between text-xs font-mono font-semibold text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5 text-[var(--text-main)]">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lang === 'en' ? 'Content Type' : 'Pilihan Jenis Konten'}</span>
              </span>
              <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                {tutorials.length} {lang === 'en' ? 'Tutorials' : 'Tutorial'}
              </span>
            </label>
            <div className="relative">
              <select
                id="mobile-tutorial-type-select"
                value="/tutorial"
                onChange={(e) => router.push(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)] font-semibold focus:outline-none focus:border-emerald-500/60 shadow-sm pr-9 cursor-pointer"
              >
                <option value="/" className="bg-zinc-900 text-zinc-100">
                  {t('tab_all')} ({totalArticleCount})
                </option>
                <option value="/tutorial" className="bg-zinc-900 text-zinc-100">
                  {t('tab_tutorials')} ({tutorials.length})
                </option>
                <option value="/artikel" className="bg-zinc-900 text-zinc-100">
                  {t('tab_articles')} ({artikelArticleCount})
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
                className="px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 bg-emerald-500 text-zinc-950 shadow-sm"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t('tab_tutorials')}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/20">
                  {tutorials.length}
                </span>
              </Link>

              <Link
                href="/artikel"
                className="px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('tab_articles')}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-500/10 text-[var(--text-muted)]">
                  {artikelArticleCount}
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
                placeholder={lang === 'en' ? 'Search practical tutorials...' : 'Cari tutorial praktis...'}
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
                <>Showing <span className="font-bold text-emerald-500">{filteredTutorials.length}</span> tutorials</>
              ) : (
                <>Menampilkan <span className="font-bold text-emerald-500">{filteredTutorials.length}</span> tutorial</>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTutorials.slice(0, visibleCount).map((article) => {
              const displayTitle = (lang === 'en' && article.en?.title) ? article.en.title : article.title;
              const displayDesc = (lang === 'en' && article.en?.description) ? article.en.description : article.description;

              return (
                <article
                  key={article.slug}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/50 hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-500 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {getCategoryLabel(article.category, lang)}
                      </span>
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        <span>{article.readingTime}</span>
                      </div>
                    </div>

                    {/* 100% Full Title Without Clamping */}
                    <h3 className="font-bold text-base sm:text-lg text-[var(--text-main)] group-hover:text-emerald-500 transition-colors leading-snug">
                      <Link href={`/tutorial/${article.slug}`}>
                        {displayTitle}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                      {displayDesc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {lang === 'en' ? 'Practical Steps Included' : 'Langkah Praktis Tersedia'}
                    </span>
                    <Link
                      href={`/tutorial/${article.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-500 hover:text-emerald-400 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>{lang === 'en' ? 'Start Tutorial' : 'Mulai Tutorial'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {visibleCount < filteredTutorials.length && (
            <div className="pt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-semibold bg-[var(--card-bg)] hover:bg-emerald-500 hover:text-zinc-950 text-[var(--text-main)] border border-[var(--border-color)] hover:border-emerald-500 shadow-sm transition-all"
              >
                {lang === 'en'
                  ? `Load More Tutorials (${filteredTutorials.length - visibleCount} remaining)`
                  : `Muat Tutorial Lainnya (${filteredTutorials.length - visibleCount} tersisa)`}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function TutorialPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-zinc-500">Memuat tutorial...</div>}>
      <TutorialContent />
    </Suspense>
  );
}
