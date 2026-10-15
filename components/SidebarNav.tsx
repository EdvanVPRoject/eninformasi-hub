'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  Bot, 
  Cpu, 
  Layers, 
  SlidersHorizontal, 
  Sparkles, 
  HardDrive, 
  Wrench,
  Gamepad2,
  Flame
} from 'lucide-react';
import { PostType } from '@/lib/types';
import { getCategoriesWithCount, totalArticleCount } from '@/lib/data/article-summaries';
import { useLanguage } from './LanguageContext';
import { getCategoryLabel } from '@/lib/i18n';

interface SidebarNavProps {
  currentCategory?: string;
  onSelectCategory?: (cat: string) => void;
  postType?: PostType | 'all';
}

function SidebarNavInner({
  currentCategory,
  onSelectCategory,
  postType,
}: SidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();

  const categories = getCategoriesWithCount(postType === 'all' ? undefined : postType);
  const totalCount = categories.find((c) => c.id === 'all')?.count ?? totalArticleCount;
  const activeCat = currentCategory ?? searchParams.get('category') ?? 'all';

  const getTargetBasePath = () => {
    if (pathname === '/tutorial') return '/tutorial';
    if (pathname === '/artikel') return '/artikel';
    return '/';
  };

  const handleCategoryClick = (id: string) => {
    if (onSelectCategory) {
      onSelectCategory(id);
    } else {
      const basePath = getTargetBasePath();
      const params = new URLSearchParams();
      if (id !== 'all') params.set('category', id);
      const queryStr = params.toString();
      router.push(`${basePath}${queryStr ? `?${queryStr}` : ''}`);
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'gaming-esports':
        return <Gamepad2 className="w-4 h-4 text-purple-400 shrink-0" />;
      case 'upcoming-booming':
        return <Flame className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'tech-gadgets':
        return <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'ai-agents':
        return <Bot className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'llm-models':
        return <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'tools-automation':
        return <Wrench className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'prompting':
        return <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />;
      case 'hardware-setup':
        return <HardDrive className="w-4 h-4 text-blue-400 shrink-0" />;
      default:
        return <Layers className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  const filterContent = (
    <div className="space-y-6 text-sm">
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-color)]">
          <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)] flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" /> {t('filter_category_title')}
          </span>
          <span className="font-mono text-[11px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold border border-emerald-500/20">
            {lang === 'en' ? `${totalCount} Items` : `${totalCount} Konten`}
          </span>
        </div>

        <div className="space-y-1">
          {categories.map((cat) => {
            const isActive = activeCat === cat.id;
            const displayLabel = getCategoryLabel(cat.id, lang);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/30 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--card-bg)] border border-transparent hover:border-[var(--border-color)]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  {getCategoryIcon(cat.id)}
                  <span className="truncate group-hover:translate-x-0.5 transition-transform">
                    {displayLabel}
                  </span>
                </span>
                <span
                  className={`text-xs font-mono px-1.5 py-0.5 rounded transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-zinc-500/10 text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Free Tools Banner */}
      <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-2.5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'en' ? 'Free Downloads' : 'Gratis Download'}</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {lang === 'en'
            ? 'Collection of prompts, n8n templates, and AI agent scripts ready to use for free.'
            : 'Kumpulan prompt sakti, template n8n, dan skrip agen AI siap pakai tanpa bayar.'}
        </p>
        <Link 
          href="/tools"
          className="inline-block w-full text-center px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
        >
          {lang === 'en' ? 'Open Tools Hub →' : 'Buka Tools Hub →'}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Horizontal Interactive Category Carousel */}
      <div className="lg:hidden mb-4 space-y-2">
        <div className="flex items-center justify-between px-1 text-xs font-mono text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('filter_category_title')}</span>
          </span>
          <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
            {lang === 'en' ? `${totalCount} Items` : `${totalCount} Konten`}
          </span>
        </div>

        {/* Scrollable Chips with Touch Momentum */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 no-scrollbar scroll-smooth -mx-4 px-4">
          {categories.map((cat) => {
            const isActive = activeCat === cat.id;
            const displayLabel = getCategoryLabel(cat.id, lang);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-150 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-emerald-500/40 hover:text-[var(--text-main)]'
                }`}
              >
                <span>{getCategoryIcon(cat.id)}</span>
                <span className="whitespace-nowrap font-medium">{displayLabel}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-black/20 text-zinc-950' : 'bg-zinc-500/10 text-[var(--text-muted)]'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden lg:block">
        {filterContent}
      </div>
    </>
  );
}

export default function SidebarNav(props: SidebarNavProps) {
  return (
    <Suspense fallback={<div className="p-4 text-xs font-mono text-zinc-500">Memuat kategori...</div>}>
      <SidebarNavInner {...props} />
    </Suspense>
  );
}
