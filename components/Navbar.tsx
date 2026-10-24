'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Github, 
  Sun, 
  Moon, 
  Wrench, 
  UserCheck,
  Menu,
  X,
  Globe,
  Home,
  BookOpen,
  Zap
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { totalArticleCount, tutorialArticleCount, artikelArticleCount } from '@/lib/data/article-summaries';
import EnLogo from './EnLogo';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, toggleLang, t } = useLanguage();

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-main)]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[1880px] mx-auto px-2 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 font-mono font-bold tracking-tight text-base sm:text-lg group">
            <EnLogo size={32} />
            <span className="text-[var(--text-main)]">
              EnInformasi<span className="text-emerald-500">.hub</span>
            </span>
          </Link>
          <span className="hidden xl:inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            {totalArticleCount} {lang === 'en' ? 'Items' : 'Konten'}
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[var(--text-muted)]">
          {pathname !== '/' && (
            <Link 
              href="/" 
              className="transition-colors flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono text-xs bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20"
            >
              <Home className="w-3.5 h-3.5" /> 
              <span>{lang === 'en' ? '← Main Page' : '← Halaman Utama'}</span>
            </Link>
          )}

          <Link 
            href="/tools" 
            className={`transition-colors flex items-center gap-1.5 ${
              pathname === '/tools' ? 'text-emerald-500 font-semibold' : 'hover:text-emerald-500'
            }`}
          >
            <Wrench className="w-4 h-4" /> 
            <span>Resource Tools</span>
          </Link>

          <Link 
            href="/about" 
            className={`transition-colors flex items-center gap-1.5 ${
              pathname === '/about' ? 'text-emerald-500 font-semibold' : 'hover:text-emerald-500'
            }`}
          >
            <UserCheck className="w-4 h-4" /> 
            <span>{lang === 'en' ? 'About Me' : 'Tentang Saya'}</span>
          </Link>
        </nav>

        {/* Search Bar on Desktop */}
        <div className="hidden sm:block flex-1 max-w-xs sm:max-w-sm mx-2 sm:mx-4">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:border-emerald-500/50 hover:text-[var(--text-main)] active:scale-[0.99] transition-all duration-200 ease-out shadow-sm group"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 group-hover:text-emerald-500 transition-colors duration-150 shrink-0" />
              <span className="truncate">
                {lang === 'en' ? `Search ${totalArticleCount} items...` : `Cari ${totalArticleCount} konten...`}
              </span>
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] shrink-0">
              Ctrl+K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Icon Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-emerald-400 active:scale-95 transition-all duration-200 ease-out"
            title="Cari"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Mobile Single Tap Lang Switch */}
          <button
            type="button"
            onClick={toggleLang}
            className="sm:hidden px-2 py-1.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[11px] font-mono font-bold text-emerald-400 active:scale-95 transition-all duration-200 ease-out"
            title="Ganti Bahasa / Switch Language"
          >
            <span>{lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
          </button>

          {/* Desktop Dual Lang Switch */}
          <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-xs font-mono font-bold shadow-sm">
            <button
              type="button"
              onClick={() => setLang('id')}
              className={`px-2 py-1 rounded-md transition-all duration-200 ease-out active:scale-95 flex items-center gap-1 ${
                lang === 'id'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm font-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
              title="Bahasa Indonesia"
            >
              <span>🇮🇩 ID</span>
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-md transition-all duration-200 ease-out active:scale-95 flex items-center gap-1 ${
                lang === 'en'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm font-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
              title="English Language"
            >
              <span>🇬🇧 EN</span>
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-emerald-500/40 active:scale-95 transition-all duration-200 ease-out"
            title={t('nav_toggle_theme')}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          <a
            href="https://github.com/EdvanVPRoject"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-emerald-500/40 transition-all"
            title="GitHub Edvan"
          >
            <Github className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-emerald-500/40 transition-all"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-emerald-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-4 space-y-2 shadow-xl">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20"
          >
            <div className="flex items-center gap-2.5 text-sm">
              <Home className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'en' ? 'Main Feed' : 'Halaman Utama'}</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              {totalArticleCount}
            </span>
          </Link>

          <Link 
            href="/tutorial" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl text-[var(--text-main)] hover:bg-[var(--card-bg)] transition-colors"
          >
            <div className="flex items-center gap-2.5 text-sm">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'en' ? 'Practical Tutorials' : 'Tutorial Praktis'}</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
              {tutorialArticleCount}
            </span>
          </Link>

          <Link 
            href="/artikel" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl text-[var(--text-main)] hover:bg-[var(--card-bg)] transition-colors"
          >
            <div className="flex items-center gap-2.5 text-sm">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'en' ? 'Information & Trends' : 'Informasi & Tren'}</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-500/10 text-[var(--text-muted)] font-bold">
              {artikelArticleCount}
            </span>
          </Link>

          <Link 
            href="/tools" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl text-[var(--text-main)] hover:bg-[var(--card-bg)] transition-colors"
          >
            <div className="flex items-center gap-2.5 text-sm">
              <Wrench className="w-4 h-4 text-emerald-500" />
              <span>Resource Tools</span>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">{lang === 'en' ? 'Free' : 'Gratis'}</span>
          </Link>

          <Link 
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl text-[var(--text-main)] hover:bg-[var(--card-bg)] transition-colors"
          >
            <div className="flex items-center gap-2.5 text-sm">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'en' ? 'About Author' : 'Tentang Penulis'}</span>
            </div>
            <span className="text-xs font-mono text-zinc-500">Edvan</span>
          </Link>

          <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {lang === 'en' ? 'Select Language:' : 'Pilih Bahasa:'}
            </span>
            <div className="flex items-center p-0.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-xs font-mono font-bold shadow-sm">
              <button
                type="button"
                onClick={() => setLang('id')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                  lang === 'id'
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm font-black'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <span>🇮🇩 ID</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                  lang === 'en'
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm font-black'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <span>🇬🇧 EN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
