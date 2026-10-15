'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, GraduationCap, FileText } from 'lucide-react';
import SidebarNav from '@/components/SidebarNav';
import { useLanguage } from '@/components/LanguageContext';
import { allArticles, getTutorials, getArtikels } from '@/lib/articles';

export interface ContentLayoutProps {
  headerBanner?: React.ReactNode;
  activeType?: 'all' | 'tutorial' | 'artikel';
  onSelectType?: (type: 'all' | 'tutorial' | 'artikel') => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  tutorialCount?: number;
  artikelCount?: number;
  totalCount?: number;
  children: React.ReactNode;
}

export default function ContentLayout({
  headerBanner,
  activeType = 'all',
  onSelectType,
  selectedCategory,
  onSelectCategory,
  tutorialCount,
  artikelCount,
  totalCount,
  children,
}: ContentLayoutProps) {
  const { t } = useLanguage();
  const currentTotal = totalCount ?? allArticles.length;
  const currentTutorials = tutorialCount ?? getTutorials().length;
  const currentArtikels = artikelCount ?? getArtikels().length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {headerBanner && <div className="mb-10">{headerBanner}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-1 pb-6">
            <SidebarNav currentCategory={selectedCategory} onSelectCategory={onSelectCategory} />
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-6">
          <div className="sticky top-16 z-30 pt-3 pb-2 -mt-3 bg-[var(--bg-main)]/95 backdrop-blur-md transition-all">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-x-auto text-xs font-mono shadow-sm">
              {onSelectType ? (
                <>
                  <button
                    onClick={() => onSelectType('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                      activeType === 'all'
                        ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t('tab_all')}</span>
                    <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">{currentTotal}</span>
                  </button>

                  <button
                    onClick={() => onSelectType('tutorial')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                      activeType === 'tutorial'
                        ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{t('tab_tutorials')}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeType === 'tutorial' ? 'bg-black/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {currentTutorials}
                    </span>
                  </button>

                  <button
                    onClick={() => onSelectType('artikel')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                      activeType === 'artikel'
                        ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t('tab_articles')}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeType === 'artikel' ? 'bg-black/20' : 'bg-zinc-500/10 text-[var(--text-muted)]'}`}>
                      {currentArtikels}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                      activeType === 'all'
                        ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t('tab_all')}</span>
                    <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">{currentTotal}</span>
                  </Link>

                  <Link
                    href="/tutorial"
                    className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                      activeType === 'tutorial'
                        ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{t('tab_tutorials')}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeType === 'tutorial' ? 'bg-black/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {currentTutorials}
                    </span>
                  </Link>

                  <Link
                    href="/artikel"
                    className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                      activeType === 'artikel'
                        ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t('tab_articles')}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeType === 'artikel' ? 'bg-black/20' : 'bg-zinc-500/10 text-[var(--text-muted)]'}`}>
                      {currentArtikels}
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
