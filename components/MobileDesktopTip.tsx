'use client';

import React, { useState, useEffect } from 'react';
import { Monitor, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function MobileDesktopTip() {
  const { lang } = useLanguage();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Cek apakah user sudah menutup tips ini pada sesi saat ini
    const isDismissed = sessionStorage.getItem('dismiss_desktop_tip');
    if (!isDismissed) {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('dismiss_desktop_tip', 'true');
  };

  if (dismissed) return null;

  return (
    <div className="sm:hidden px-3 pt-2">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-[var(--text-main)] shadow-sm animate-in fade-in duration-200">
        <div className="flex items-center gap-2 min-w-0">
          <Monitor className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="leading-snug">
            {lang === 'en' ? (
              <>
                <span className="font-bold text-emerald-400">Quick tip:</span> If the mobile layout feels tight, switch your browser to <strong className="text-emerald-400">Desktop site</strong> for a wider view!
              </>
            ) : (
              <>
                <span className="font-bold text-emerald-400">Tips santai:</span> Kalau tampilannya agak sempit di HP, coba aktifin <strong className="text-emerald-400">Mode Desktop</strong> di browser biar makin lega! 😉
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--card-bg)] transition-colors shrink-0"
          title={lang === 'en' ? 'Close tip' : 'Tutup tips'}
          aria-label={lang === 'en' ? 'Close tip' : 'Tutup tips'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
