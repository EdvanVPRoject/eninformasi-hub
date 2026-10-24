'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  Sparkles, 
  Globe, 
  ListOrdered,
  ListChecks,
  Share2,
  Check,
  ArrowUp,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Image as ImageIcon,
  BookOpen
} from 'lucide-react';
import { Article, PostType } from '@/lib/types';
import { getArticleCover } from '@/lib/cover-images';
import { getArticleReference, resolveSourceUrl, resolvePhotoSource } from '@/lib/article-references';
import SidebarNav from '@/components/SidebarNav';
import TableOfContents from '@/components/TableOfContents';
import FeedbackWidget from '@/components/FeedbackWidget';
import StepTracker from '@/components/StepTracker';
import ArticleBodyRenderer from '@/components/ArticleBodyRenderer';
import { useLanguage } from '@/components/LanguageContext';
import { getCategoryLabel } from '@/lib/i18n';

interface ArticleDetailViewProps {
  article: Article;
  postType: PostType;
}

function formatCleanCategory(catId: string, lang: 'id' | 'en') {
  const label = getCategoryLabel(catId, lang);
  if (label && label !== catId && !label.includes('-')) return label;
  return catId
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ArticleDetailView({ article, postType }: ArticleDetailViewProps) {
  const { lang, setLang, toggleLang } = useLanguage();
  const [maxProgress, setMaxProgress] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const storageKey = `read_progress_${article.slug}`;

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      setMaxProgress(Number(saved));
    }

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const currentPct = Math.min(100, Math.max(0, Math.round((currentScrollY / scrollHeight) * 100)));
        setMaxProgress((prev) => {
          const nextMax = Math.max(prev, currentPct);
          sessionStorage.setItem(storageKey, String(nextMax));
          return nextMax;
        });
      }
      setShowTopBtn(currentScrollY > 500);
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', updateScroll);
  }, [storageKey]);

  const handleResetProgress = () => {
    sessionStorage.removeItem(storageKey);
    setMaxProgress(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryName = formatCleanCategory(article.category, lang);
  const backUrl = postType === 'tutorial' ? '/tutorial' : '/artikel';

  const displayTitle = (lang === 'en' && article.en?.title) ? article.en.title : article.title;
  const displayDesc = (lang === 'en' && article.en?.description) ? article.en.description : article.description;
  const displayContent = (lang === 'en' && article.en?.content) ? article.en.content : article.content;
  const displayToc = (lang === 'en' && article.en?.toc) ? article.en.toc : article.toc;
  const displaySteps = (lang === 'en' && article.en?.steps) ? article.en.steps : article.steps;
  const heroVisual = getArticleCover(article.slug, article.category, article.tags);
  const heroPhotoInfo = heroVisual ? resolvePhotoSource(heroVisual.url, heroVisual.source) : null;
  const isHeroImageInBody = Boolean(displayContent && heroVisual?.url && displayContent.includes(heroVisual.url));
  const articleRef = getArticleReference(article.slug, article.category, displayTitle);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative">

      <div className="max-w-[1880px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] xl:grid-cols-[290px_1fr_290px] 2xl:grid-cols-[320px_1fr_320px] gap-5 xl:gap-6 py-8">
          
          <aside className="hidden lg:block lg:self-start lg:sticky lg:top-20 w-full">
            <div className="pr-1 pb-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <SidebarNav currentCategory={article.category} />
            </div>
          </aside>

          <main className="space-y-6 min-w-0 w-full">
            <nav className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] flex-wrap">
              <Link href="/" className="hover:text-emerald-500 transition-colors">
                {lang === 'en' ? 'Home' : 'Beranda'}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={backUrl} className="hover:text-emerald-500 transition-colors">
                {postType === 'tutorial'
                  ? (lang === 'en' ? 'Tutorials' : 'Tutorial Praktis')
                  : (lang === 'en' ? 'Information' : 'Informasi')}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/?category=${article.category}`} className="hover:text-emerald-500 transition-colors text-emerald-500/90">
                {categoryName}
              </Link>
            </nav>

            <div className="space-y-4 pb-6 border-b border-[var(--border-color)]">
              <div className="flex items-center justify-between gap-2.5 text-xs font-mono flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-semibold ${
                    postType === 'tutorial'
                      ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-500/10 text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}>
                    {postType === 'tutorial' ? 'Tutorial' : (lang === 'en' ? 'Information' : 'Informasi')}
                  </span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="text-emerald-400 font-medium">
                    {categoryName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] hover:text-emerald-400 hover:border-emerald-500/40 active:scale-95 transition-all duration-200 ease-out shadow-sm"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">{lang === 'en' ? 'Copied!' : 'Tersalin!'}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Share' : 'Bagikan'}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center p-0.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[11px] font-mono font-bold shadow-sm">
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
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-main)] leading-tight">
                {displayTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {lang === 'en' ? 'Updated' : 'Diperbarui'}: {article.updatedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {lang === 'en' ? 'Read time' : 'Waktu baca'}: {article.readingTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {lang === 'en' ? 'By' : 'Oleh'}{' '}<a href="https://github.com/EdvanVPRoject" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 font-medium underline decoration-dotted transition-colors" title="GitHub @EdvanVPRoject">{article.author || 'EdvanVPRoject'}</a>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs sm:text-sm text-[var(--text-main)] leading-relaxed text-left sm:text-justify [text-align-last:left] hyphens-auto break-words">
                <strong className="text-emerald-400 font-mono block mb-1">
                  {lang === 'en' ? '⚡ Quick Summary:' : '⚡ Ringkasan Cepat:'}
                </strong>
                {displayDesc}
              </div>
            </div>

            {/* Featured Hero Visual Figure with Credible Source */}
            {heroVisual && !isHeroImageInBody && (
              <figure className="my-2 max-w-xl mx-auto rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm text-left [text-align:left]">
                <a
                  href={heroPhotoInfo?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden bg-black/40 flex items-center justify-center aspect-[16/9] max-h-[220px] sm:max-h-[280px] group/hero block cursor-pointer"
                  title={`Buka foto asli resolusi penuh (${heroPhotoInfo?.label || 'Unsplash'})`}
                >
                  <img
                    src={heroVisual.url}
                    alt={heroVisual.caption}
                    className="w-full h-full object-cover aspect-video group-hover/hero:scale-105 transition-transform duration-300"
                    loading="eager"
                  />
                </a>
                <figcaption className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[var(--card-bg)] border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-left [text-align:left]">
                  <span className="text-[var(--text-main)] font-semibold flex items-center gap-1.5 text-left [text-align:left] min-w-0">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="leading-snug">{heroVisual.caption}</span>
                  </span>
                  <a
                    href={heroPhotoInfo?.url || resolveSourceUrl(heroVisual.source)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] bg-emerald-500/10 text-emerald-500 hover:text-emerald-400 dark:text-emerald-400 dark:hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/20 font-semibold self-start sm:self-auto transition-all group/src cursor-pointer shrink-0 whitespace-nowrap text-left [text-align:left]"
                    title={`Buka sumber asli foto: ${heroPhotoInfo?.label || heroVisual.source}`}
                  >
                    <ExternalLink className="w-3 h-3 shrink-0 group-hover/src:translate-x-0.5 group-hover/src:-translate-y-0.5 transition-transform" />
                    <span>Sumber: {heroPhotoInfo?.label || heroVisual.source}</span>
                    <span className="text-[10px] opacity-70">↗</span>
                  </a>
                </figcaption>
              </figure>
            )}

            {displaySteps && displaySteps.length > 0 && (
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-[var(--border-color)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                      <ListChecks className="w-4 h-4" />
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                      {lang === 'en' ? 'Practice Roadmap & Steps' : 'Peta Tahapan Praktik'} ({displaySteps.length})
                    </span>
                  </div>
                  <a
                    href="#praktik-checklist"
                    className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{lang === 'en' ? 'Track Progress' : 'Catat Progres'}</span>
                    <span>↓</span>
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {displaySteps.map((step, idx) => (
                    <div
                      key={step.id || idx}
                      className="p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)]/70 flex items-start gap-2.5 text-xs text-[var(--text-muted)] hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 ease-out"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="line-clamp-2 text-[var(--text-main)] leading-snug">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Reading Progress & Collapsible Table of Contents */}
            <div className="lg:hidden p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                  {maxProgress >= 95 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : null}
                  {maxProgress >= 95
                    ? (lang === 'en' ? 'Completed!' : 'Selesai Dibaca!')
                    : (lang === 'en' ? 'Reading Progress' : 'Progres Baca')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">{maxProgress}%</span>
                  {maxProgress > 0 && (
                    <button
                      type="button"
                      onClick={handleResetProgress}
                      title={lang === 'en' ? 'Reset progress' : 'Ulangi progres'}
                      className="text-[var(--text-muted)] hover:text-rose-400 transition-colors p-0.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${maxProgress}%` }}
                />
              </div>

              {displayToc && displayToc.length > 0 && (
                <details className="group pt-2 border-t border-[var(--border-color)]/60">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-mono font-semibold text-[var(--text-main)] select-none">
                    <span className="flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-emerald-500" />
                      <span>{lang === 'en' ? 'Table of Contents' : 'Daftar Isi Konten'} ({displayToc.length})</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="pt-3 border-t border-[var(--border-color)]/60 mt-3">
                    <TableOfContents key={`toc-m-${lang}`} items={displayToc} />
                  </div>
                </details>
              )}
            </div>

            <article className="prose prose-invert max-w-none text-[var(--text-main)] space-y-4 leading-relaxed">
              <ArticleBodyRenderer key={`body-${lang}`} content={displayContent} toc={displayToc} />
            </article>

            {displaySteps && displaySteps.length > 0 && (
              <div id="praktik-checklist" className="pt-4 scroll-mt-24">
                <StepTracker key={`steps-${lang}`} slug={article.slug} steps={displaySteps} />
              </div>
            )}

            {/* Verified Source & Primary Attribution */}
            <section className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-[var(--border-color)] space-y-3.5 shadow-sm text-left [text-align:left]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[var(--border-color)]/70">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)] font-mono">
                      {lang === 'en' ? 'Verified Source & Primary Attribution' : 'Rujukan Sumber & Atribusi Orisinal'}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {lang === 'en'
                        ? 'Ground truth verified against official industry documentation & primary coverage.'
                        : 'Informasi diverifikasi langsung berdasarkan dokumentasi resmi dan investigasi industri.'}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold self-start sm:self-auto">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{lang === 'en' ? 'Fact-Checked' : 'Terverifikasi'}</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="space-y-1 text-xs">
                  <div className="text-[var(--text-muted)] font-mono text-[11px]">
                    {lang === 'en' ? 'Primary Publisher / Authority:' : 'Penerbit & Otoritas Sumber:'}
                  </div>
                  <div className="text-[var(--text-main)] font-semibold flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{articleRef.publisher}</span>
                  </div>
                  {articleRef.note && (
                    <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed pt-0.5 text-left [text-align:left]">
                      {articleRef.note}
                    </p>
                  )}
                </div>

                <a
                  href={articleRef.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-sm shrink-0 self-start sm:self-auto"
                >
                  <span>{lang === 'en' ? 'Open Original Article / Report' : 'Buka Artikel & Laporan Lengkap'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>

            <div className="pt-6 border-t border-[var(--border-color)] flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[var(--text-muted)] mr-1">
                {lang === 'en' ? 'Tags:' : 'Tag Artikel:'}
              </span>
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?q=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:border-emerald-500/40 hover:text-emerald-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-out"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <FeedbackWidget slug={article.slug} />

            <div className="pt-8 flex flex-wrap items-center justify-between gap-4">
              <Link
                href={backUrl}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-emerald-500/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-out"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>
                  {postType === 'tutorial'
                    ? (lang === 'en' ? 'Back to Tutorials' : 'Indeks Tutorial')
                    : (lang === 'en' ? 'Back to Information' : 'Indeks Informasi')}
                </span>
              </Link>

              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-out shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Download Scripts & Tools' : 'Unduh Script & Tools'}</span>
              </Link>
            </div>
          </main>

          <aside className="hidden lg:block lg:self-start lg:sticky lg:top-20 w-full">
            <div className="space-y-5 pr-1 pb-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    {maxProgress >= 95 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : null}
                    {maxProgress >= 95
                      ? (lang === 'en' ? 'Completed!' : 'Selesai Dibaca!')
                      : (lang === 'en' ? 'Reading Progress' : 'Progres Baca')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">{maxProgress}%</span>
                    {maxProgress > 0 && (
                      <button
                        type="button"
                        onClick={handleResetProgress}
                        title={lang === 'en' ? 'Reset progress' : 'Ulangi progres'}
                        className="text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${maxProgress}%` }}
                  />
                </div>
              </div>

              <TableOfContents key={`toc-d-${lang}`} items={displayToc} />

              {displaySteps && displaySteps.length > 0 && (
                <a
                  href="#praktik-checklist"
                  className="block p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/50 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 ease-out space-y-1"
                >
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-between">
                    <span>✅ {lang === 'en' ? 'Practical Checklist' : 'Checklist Langkah Praktis'}</span>
                    <span>{displaySteps.length} {lang === 'en' ? 'Steps' : 'Langkah'} →</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {lang === 'en'
                      ? 'Jump to interactive checklist at the bottom of this guide.'
                      : 'Lompat ke daftar centang praktek di bagian akhir panduan ini.'}
                  </p>
                </a>
              )}

              <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-3 card-smooth-hover">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Recommended Resource' : 'Rekomendasi Tools & Gear'}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[var(--text-main)] leading-snug">
                  {lang === 'en'
                    ? 'Ready-to-Use Configs, Scripts & Hardware Picks'
                    : 'Koleksi Script Otomasi, Config & Rekomendasi Gear'}
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {lang === 'en'
                    ? 'Save hours of setup time with our tested templates and curated hardware links.'
                    : 'Hemat waktu setup berjam-jam dengan template teruji dan rekomendasi perangkat terbaik.'}
                </p>
                <Link
                  href="/tools"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-bold rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-out shadow-sm"
                >
                  <span>{lang === 'en' ? 'Explore Tools Hub' : 'Cek Tools & Rekomendasi'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {showTopBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3 rounded-xl bg-emerald-500 text-zinc-950 shadow-lg hover:bg-emerald-400 hover:-translate-y-0.5 active:scale-90 transition-all duration-200 ease-out animate-in fade-in zoom-in-90"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
