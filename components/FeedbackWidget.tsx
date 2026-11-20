'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThumbsUp, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface FeedbackWidgetProps {
  slug: string;
  articleTitle?: string;
}

export default function FeedbackWidget({ slug, articleTitle }: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(`eninformasi_fb_${slug}`) ||
        localStorage.getItem(`enkode_fb_${slug}`);
      if (stored === 'yes' || stored === 'no') {
        setFeedback(stored);
      }
    } catch {
      // Ignore storage access errors in private browsing modes
    }
  }, [slug]);

  const handleFeedback = async (type: 'yes' | 'no') => {
    if (feedback !== null || submitting) return;
    setSubmitting(true);
    setFeedback(type);

    try {
      localStorage.setItem(`eninformasi_fb_${slug}`, type);
      await fetch(`/api/metrics/${slug}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      }).catch(() => {});
    } catch {
      // Non-blocking metrics call
    } finally {
      setSubmitting(false);
    }
  };

  const reportHref = `/contact?subject=${encodeURIComponent(
    lang === 'en' ? 'Issue Report' : 'Laporan Kendala Konten'
  )}&ref=${encodeURIComponent(articleTitle || slug)}`;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-3 mt-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
            {feedback ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'Thank you for your feedback!'
                    : 'Terima kasih atas tanggapan Anda!'}
                </span>
              </>
            ) : (
              <span>
                {lang === 'en'
                  ? 'Was this guide or insight helpful to you?'
                  : 'Apakah panduan atau wawasan ini bermanfaat untuk Anda?'}
              </span>
            )}
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            {feedback === 'yes'
              ? lang === 'en'
                ? 'Your positive feedback has been saved locally and helps guide future coverage.'
                : 'Penilaian Anda tercatat di perangkat ini untuk membantu evaluasi kualitas konten.'
              : feedback === 'no'
              ? lang === 'en'
                ? 'Found an outdated code snippet, broken link, or inaccuracy? Let us fix it quickly.'
                : 'Menemukan kode error, tautan rusak, atau info kurang tepat? Kirim detailnya agar segera diperbaiki.'
              : lang === 'en'
              ? 'Your feedback helps us keep all code snippets, guides, and insights accurate and updated.'
              : 'Masukan Anda membantu kami menjaga kualitas materi dan kode tetap akurat serta terupdate.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleFeedback('yes')}
            disabled={feedback !== null || submitting}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ease-out active:scale-95 flex items-center gap-1.5 ${
              feedback === 'yes'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                : feedback === 'no'
                ? 'bg-zinc-500/10 text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:-translate-y-0.5 border border-emerald-500/20'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Helpful' : 'Bermanfaat'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFeedback('no')}
            disabled={feedback !== null || submitting}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ease-out active:scale-95 flex items-center gap-1.5 ${
              feedback === 'no'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : feedback === 'yes'
                ? 'bg-zinc-500/10 text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                : 'bg-zinc-500/10 text-[var(--text-muted)] hover:bg-zinc-500/20 hover:-translate-y-0.5 border border-[var(--border-color)]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Report Issue' : 'Ada Kendala'}</span>
          </button>
        </div>
      </div>

      {feedback === 'no' && (
        <div className="pt-3 border-t border-[var(--border-color)]/70 flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            {lang === 'en'
              ? 'Send a quick note to the editor with this article pre-filled:'
              : 'Kirim catatan langsung ke redaksi (judul artikel otomatis terisi):'}
          </span>
          <Link
            href={reportHref}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-all active:scale-95"
          >
            <span>{lang === 'en' ? 'Report Issue Details' : 'Laporkan Detail Kendala'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
