'use client';

import React, { useEffect, useState } from 'react';
import { ListOrdered } from 'lucide-react';
import { TocItem } from '@/lib/types';
import { useLanguage } from './LanguageContext';

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  const { lang } = useLanguage();

  useEffect(() => {
    if (!items || items.length === 0) return;

    // Pastikan ID pertama aktif jika belum ada yang terpilih
    setActiveId((prev) => prev || items[0].id);

    const handleScroll = () => {
      // 1. Jika sudah mencapai dasar halaman (misal membaca sampai checklist/footer)
      const winScroll = window.scrollY || document.documentElement.scrollTop;
      const isAtBottom = window.innerHeight + winScroll >= document.documentElement.scrollHeight - 60;
      if (isAtBottom && items.length > 0) {
        setActiveId(items[items.length - 1].id);
        return;
      }

      // 2. Viewport Scrollspy: Deteksi heading yang sedang dibaca berdasarkan posisi viewport
      let currentSectionId = items[0].id;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            currentSectionId = item.id;
          }
        }
      }

      setActiveId(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (!items || items.length === 0) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
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
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs leading-relaxed transition-all block ${
                  isActive
                    ? 'text-emerald-500 font-semibold bg-emerald-500/10 border-l-2 border-emerald-500 pl-2.5 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--card-bg)]'
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
