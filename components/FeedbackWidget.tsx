'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface FeedbackWidgetProps {
  slug: string;
}

export default function FeedbackWidget({ slug }: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const [yesCount, setYesCount] = useState(142);
  const [noCount, setNoCount] = useState(3);
  const { lang, t } = useLanguage();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`enkode_fb_${slug}`);
      if (stored === 'yes' || stored === 'no') {
        setFeedback(stored);
      }
    } catch (e) {}
  }, [slug]);

  const handleFeedback = (type: 'yes' | 'no') => {
    if (feedback !== null) return;
    setFeedback(type);
    if (type === 'yes') {
      setYesCount((prev) => prev + 1);
    } else {
      setNoCount((prev) => prev + 1);
    }

    try {
      localStorage.setItem(`enkode_fb_${slug}`, type);
      // Call metrics API asynchronously
      fetch(`/api/metrics/${slug}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      }).catch(() => {});
    } catch (e) {}
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 shadow-sm">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
          {feedback ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'en' ? 'Thank you for your feedback!' : 'Terima kasih atas tanggapan Anda!'}</span>
            </>
          ) : (
            <span>{lang === 'en' ? 'Was this guide or insight helpful to you?' : 'Apakah panduan atau wawasan ini bermanfaat untuk Anda?'}</span>
          )}
        </h4>
        <p className="text-xs text-[var(--text-muted)]">
          {lang === 'en'
            ? 'Your feedback helps us keep all code snippets, guides, and insights accurate and updated.'
            : 'Masukan Anda membantu kami menjaga kualitas materi dan kode tetap akurat serta terupdate.'}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => handleFeedback('yes')}
          disabled={feedback !== null}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
            feedback === 'yes'
              ? 'bg-emerald-500 text-zinc-950 font-bold'
              : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Helpful' : 'Ya, Berhasil'} ({yesCount})</span>
        </button>

        <button
          onClick={() => handleFeedback('no')}
          disabled={feedback !== null}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
            feedback === 'no'
              ? 'bg-amber-500 text-zinc-950 font-bold'
              : 'bg-zinc-500/10 text-[var(--text-muted)] hover:bg-zinc-500/20 border border-[var(--border-color)]'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Issues' : 'Kendala'} ({noCount})</span>
        </button>
      </div>
    </div>
  );
}
