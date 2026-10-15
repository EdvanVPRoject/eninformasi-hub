'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Search, Zap, User } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface MobileBottomNavProps {
  onOpenSearch: () => void;
}

export default function MobileBottomNav({ onOpenSearch }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { lang } = useLanguage();

  const isHome = pathname === '/';
  const isTutorial = pathname.startsWith('/tutorial');
  const isArtikel = pathname.startsWith('/artikel');
  const isAbout = pathname.startsWith('/about');

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-3 inset-x-3 z-40 sm:hidden select-none pointer-events-auto"
    >
      <div className="max-w-md mx-auto h-16 rounded-2xl bg-[var(--card-bg)]/90 backdrop-blur-xl border border-[var(--border-color)]/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)] px-2 flex items-center justify-around transition-all">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-90 ${
            isHome
              ? 'text-emerald-500 font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            )}
          </div>
          <span className="text-[10px] font-mono mt-1">
            {lang === 'en' ? 'Home' : 'Beranda'}
          </span>
        </Link>

        {/* 2. Tutorial */}
        <Link
          href="/tutorial"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-90 ${
            isTutorial
              ? 'text-emerald-500 font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5" />
            {isTutorial && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            )}
          </div>
          <span className="text-[10px] font-mono mt-1">
            Tutorial
          </span>
        </Link>

        {/* 3. Center Elevated Quick Search Trigger */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-5">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-12 h-12 rounded-2xl bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-[var(--bg-main)] active:scale-90 transition-all hover:bg-emerald-400 cursor-pointer"
            title={lang === 'en' ? 'Quick Search (Ctrl+K)' : 'Pencarian Cepat (Ctrl+K)'}
            aria-label={lang === 'en' ? 'Search articles' : 'Cari artikel'}
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>
          <span className="text-[10px] font-mono font-semibold text-emerald-500 mt-1">
            {lang === 'en' ? 'Search' : 'Cari'}
          </span>
        </div>

        {/* 4. EnInformasi / Artikel */}
        <Link
          href="/artikel"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-90 ${
            isArtikel
              ? 'text-emerald-500 font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <div className="relative">
            <Zap className="w-5 h-5" />
            {isArtikel && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            )}
          </div>
          <span className="text-[10px] font-mono mt-1">
            Artikel
          </span>
        </Link>

        {/* 5. Tentang / Profil */}
        <Link
          href="/about"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-90 ${
            isAbout
              ? 'text-emerald-500 font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <div className="relative">
            <User className="w-5 h-5" />
            {isAbout && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            )}
          </div>
          <span className="text-[10px] font-mono mt-1">
            {lang === 'en' ? 'About' : 'Profil'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
