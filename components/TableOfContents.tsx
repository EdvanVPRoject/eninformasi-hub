'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ListOrdered } from 'lucide-react';
import { TocItem } from '@/lib/types';
import { useLanguage } from './LanguageContext';

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  const { lang } = useLanguage();

  const getElement = useCallback((id: string) => {
    if (!id || typeof document === 'undefined') return null;
    return (
      document.getElementById(id) ||
      document.getElementById(id.replace(/^[0-9]+-/, '')) ||
      document.querySelector(`h3[id="${id}"]`) ||
      document.querySelector(`[id="${id}"]`)
    );
  }, []);

  useEffect(() => {
    if (!items || items.length === 0) return;

    // Reset ke item pertama jika belum terpilih
    setActiveId((prev) => (items.some((it) => it.id === prev) ? prev : items[0].id));

    const handleScroll = () => {
      const winScroll = window.scrollY || document.documentElement.scrollTop;
      const isNearBottom = window.innerHeight + winScroll >= document.documentElement.scrollHeight - 100;

      // 1. Jika sudah mencapai dekat bagian paling bawah artikel/halaman
      if (isNearBottom && items.length > 0) {
        setActiveId(items[items.length - 1].id);
        return;
      }

      // 2. Viewport Scrollspy adaptif: heading aktif begitu masuk ke area fokus baca (sekitar 30% dari atas viewport)
      const triggerOffset = Math.min(260, Math.max(140, window.innerHeight * 0.32));
      let currentSectionId = items[0].id;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const el = getElement(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerOffset) {
            currentSectionId = item.id;
          }
        }
      }

      setActiveId(currentSectionId);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [items, getElement]);

  if (!items || items.length === 0) return null;

  const scrollToSection = (id: string) => {
    const el = getElement(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <div className="space-y-4 text-sm">
      {/* Table of Contents List */}
      <div>
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[var(--border-color)]">
          <ListOrdered className="w-4 h-4 text-emerald-500" />
          <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
            {lang === 'en' ? 'Table of Contents' : 'Daftar Isi Konten'}
          </span>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs leading-relaxed transition-all duration-200 ease-out active:scale-[0.99] block ${
                  isActive
                    ? 'text-emerald-500 font-semibold bg-emerald-500/10 border-l-2 border-emerald-500 pl-2.5 shadow-sm translate-x-1'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--card-bg)] hover:translate-x-0.5'
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
