'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Shield, FileText, Info, Mail, Heart } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import EnLogo from './EnLogo';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="w-full border-t border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)] mt-20 text-xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-mono font-bold text-base text-[var(--text-main)] group">
              <EnLogo size={30} />
              <span>EnInformasi<span className="text-emerald-500">.hub</span></span>
            </Link>
            <p className="leading-relaxed">
              {t('footer_tagline')}
            </p>
            <div className="font-mono text-[11px] text-zinc-500 space-y-1">
              <div>© 2026 <strong>Edvan</strong>. {t('footer_rights')}</div>
              <div className="flex items-center gap-3 text-xs text-emerald-500">
                <a href="https://github.com/EdvanVPRoject" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                <span>•</span>
                <a href="https://edvan-portofolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline" title="Edvan Nuriana — Sistem Komputer">{lang === 'en' ? 'Portfolio' : 'Portofolio'}</a>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <span className="font-mono font-semibold uppercase tracking-wider text-[var(--text-main)]">
              {lang === 'en' ? 'Popular Topics' : 'Kategori Populer'}
            </span>
            <ul className="space-y-2">
              <li>
                <Link href="/?category=ai-agents" className="hover:text-emerald-500 transition-colors">
                  {lang === 'en' ? 'Autonomous AI Agents' : 'Autonomous AI Agents'}
                </Link>
              </li>
              <li>
                <Link href="/?category=gaming-esports" className="hover:text-emerald-500 transition-colors">
                  {lang === 'en' ? 'Gaming & Esports' : 'Gaming & Esports'}
                </Link>
              </li>
              <li>
                <Link href="/?category=upcoming-booming" className="hover:text-emerald-500 transition-colors">
                  {lang === 'en' ? 'Upcoming & Booming Releases' : 'Rilis Game Booming'}
                </Link>
              </li>
              <li>
                <Link href="/?category=tech-gadgets" className="hover:text-emerald-500 transition-colors">
                  {lang === 'en' ? 'Future Tech & Hardware' : 'Hardware & Inovasi Masa Depan'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div className="space-y-3">
            <span className="font-mono font-semibold uppercase tracking-wider text-[var(--text-main)]">
              {lang === 'en' ? 'Resource Hub' : 'Resource Hub'}
            </span>
            <ul className="space-y-2">
              <li>
                <Link href="/tools" className="hover:text-emerald-500 transition-colors">
                  {lang === 'en' ? 'Python Scripts & Agents' : 'Koleksi Script Python & Agent'}
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-emerald-500 transition-colors">
                  {lang === 'en' ? 'Ready-to-Use n8n Templates' : 'Template Alur n8n Siap Pakai'}
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-emerald-500 transition-colors">
                  {lang === 'en' ? 'GGUF Quantization Cheatsheet' : 'Cheatsheet Model Kuantisasi GGUF'}
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-emerald-500 transition-colors">
                  {lang === 'en' ? 'Competitive Gaming Settings' : 'Setting Sensitivitas & Autoexec'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages for AdSense Compliance */}
          <div className="space-y-3">
            <span className="font-mono font-semibold uppercase tracking-wider text-[var(--text-main)]">
              {lang === 'en' ? 'Legal & Compliance' : 'Kepatuhan & Legal'}
            </span>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> {lang === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi'}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> {lang === 'en' ? 'Terms & Conditions' : 'Syarat & Ketentuan'}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> {lang === 'en' ? 'Affiliate Disclaimer' : 'Disclaimer Afiliasi'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> {lang === 'en' ? 'About EnInformasi' : 'Tentang EnInformasi'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {lang === 'en' ? 'Contact Us' : 'Hubungi Kami'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            {lang === 'en'
              ? 'Built with dedication for developers, gamers, and tech enthusiasts worldwide.'
              : 'Dibuat dengan dedikasi tinggi untuk developer, gamer, dan kreator teknologi Indonesia.'}
          </div>
          <div className="flex items-center gap-1 text-[var(--text-muted)]">
            <span>Powered by Next.js & Edge Runtime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
