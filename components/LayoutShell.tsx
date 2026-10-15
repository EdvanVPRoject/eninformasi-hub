'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CommandSearch from './CommandSearch';
import MobileBottomNav from './MobileBottomNav';
import { LanguageProvider } from './LanguageContext';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Aktifkan shortcut keyboard Ctrl+K / Cmd+K di seluruh halaman
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="flex-1 pb-20 sm:pb-0">{children}</main>
        <Footer />
        <CommandSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <MobileBottomNav onOpenSearch={() => setIsSearchOpen(true)} />
      </div>
    </LanguageProvider>
  );
}
