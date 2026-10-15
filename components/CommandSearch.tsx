'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft, Layers } from 'lucide-react';
import { searchArticles, allArticles } from '@/lib/articles';
import { Article } from '@/lib/types';
import { useLanguage } from './LanguageContext';
import { getCategoryLabel } from '@/lib/i18n';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigateToArticle = useCallback((slug: string, postType: string = 'tutorial') => {
    onClose();
    router.push(`/${postType}/${slug}`);
  }, [onClose, router]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults(searchArticles(''));
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle modal with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Will be handled in parent
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        const item = results[selectedIndex];
        navigateToArticle(item.slug, item.postType);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, navigateToArticle]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    const searchRes = searchArticles(val);
    setResults(searchRes);
    setSelectedIndex(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-2xl overflow-hidden text-[var(--text-main)] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-color)] gap-3">
          <Search className="w-5 h-5 text-emerald-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder={lang === 'en' ? `Search ${allArticles.length} tutorials, gaming, tech & AI guides...` : `Cari ${allArticles.length} tutorial, opini, AI, & tren teknologi...`}
            className="w-full bg-transparent border-none outline-none text-sm placeholder-[var(--text-muted)] text-[var(--text-main)] font-medium"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults(searchArticles(''));
              }}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-xs font-mono rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[var(--border-color)]/40">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--text-muted)]">
              {lang === 'en' ? (
                <>No articles found for &quot;<span className="text-emerald-500">{query}</span>&quot;.</>
              ) : (
                <>Tidak ditemukan artikel untuk kata kunci &quot;<span className="text-emerald-500">{query}</span>&quot;.</>
              )}
            </div>
          ) : (
            results.map((article, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={article.slug}
                  onClick={() => navigateToArticle(article.slug, article.postType)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'hover:bg-[var(--bg-main)] border border-transparent'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                        article.postType === 'tutorial'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-500/10 text-[var(--text-muted)] border border-[var(--border-color)]'
                      }`}>
                        {article.postType === 'tutorial' ? 'Tutorial' : (lang === 'en' ? 'EnInformation' : 'EnInformasi')}
                      </span>
                      <span className="text-emerald-500 font-semibold">{getCategoryLabel(article.category, lang)}</span>
                      <span className="text-[var(--text-muted)]">•</span>
                      <span className="text-[var(--text-muted)]">{article.readingTime}</span>
                    </div>
                    <h5 className="font-semibold text-sm leading-snug text-[var(--text-main)]">
                      {(lang === 'en' && article.en?.title) ? article.en.title : article.title}
                    </h5>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                      {(lang === 'en' && article.en?.description) ? article.en.description : article.description}
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className={`p-1.5 rounded-lg inline-flex ${isSelected ? 'text-emerald-500 bg-emerald-500/20' : 'text-zinc-600'}`}>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 bg-[var(--bg-main)] border-t border-[var(--border-color)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
          <div className="flex items-center gap-4">
            <span>{lang === 'en' ? '↑↓ Navigate' : '↑↓ Navigasi'}</span>
            <span>{lang === 'en' ? '↵ Open Item' : '↵ Buka Konten'}</span>
            <span>{lang === 'en' ? 'ESC Close' : 'ESC Tutup'}</span>
          </div>
          <span>{lang === 'en' ? `${allArticles.length} Items Indexed` : `${allArticles.length} Konten Terindeks`}</span>
        </div>
      </div>
    </div>
  );
}
