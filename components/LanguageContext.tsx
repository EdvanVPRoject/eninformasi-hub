'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, translations, getTranslation } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: keyof typeof translations['id'], fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'id',
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('id');
  const [mounted, setMounted] = useState(false);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('eninformasi_lang', newLang);
      document.documentElement.lang = newLang;
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const nextLang = prev === 'id' ? 'en' : 'id';
      try {
        localStorage.setItem('eninformasi_lang', nextLang);
        document.documentElement.lang = nextLang;
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      return nextLang;
    });
  }, []);

  // Initial client mount
  useEffect(() => {
    setMounted(true);
    let initialLang: Language = 'id';
    try {
      const saved = localStorage.getItem('eninformasi_lang') as Language;
      if (saved === 'en' || saved === 'id') {
        initialLang = saved;
      }
    } catch (e) {}

    setLangState(initialLang);
    document.documentElement.lang = initialLang;
  }, []);

  const t = useCallback(
    (key: keyof typeof translations['id'], fallback?: string): string => {
      return getTranslation(lang, key, fallback);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
