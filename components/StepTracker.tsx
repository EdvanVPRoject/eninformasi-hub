'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ListChecks, RotateCcw } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface Step {
  id: string;
  label: string;
}

interface StepTrackerProps {
  steps: Step[];
  slug?: string;
}

export default function StepTracker({ steps, slug }: StepTrackerProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (!slug) return;
    try {
      const stored = localStorage.getItem(`enkode_steps_${slug}`);
      if (stored) {
        setCompletedSteps(JSON.parse(stored));
      }
    } catch (e) {}
  }, [slug]);

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => {
      const updated = {
        ...prev,
        [id]: !prev[id],
      };
      if (slug) {
        try {
          localStorage.setItem(`enkode_steps_${slug}`, JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  };

  const resetSteps = () => {
    setCompletedSteps({});
    if (slug) {
      try {
        localStorage.removeItem(`enkode_steps_${slug}`);
      } catch (e) {}
    }
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  if (!steps || steps.length === 0) return null;

  return (
    <div className="my-6 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-emerald-500" />
          <h4 className="font-semibold text-xs sm:text-sm text-[var(--text-main)]">
            {t('step_checklist')}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              onClick={resetSteps}
              className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] hover:text-rose-400 transition-colors mr-1"
              title={lang === 'en' ? 'Reset Checklist' : 'Reset Daftar Centang'}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'en' ? 'Reset' : 'Reset'}</span>
            </button>
          )}
          <span className="font-mono text-xs text-emerald-500 font-bold">
            {completedCount}/{steps.length} {lang === 'en' ? 'Done' : 'Selesai'} ({Math.round(progressPercent)}%)
          </span>
        </div>
      </div>

      <div className="w-full bg-zinc-500/10 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="space-y-2 pt-1">
        {steps.map((step, idx) => {
          const isDone = !!completedSteps[step.id];
          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`p-2.5 rounded-lg flex items-start gap-3 cursor-pointer text-xs transition-all ${
                isDone
                  ? 'bg-emerald-500/5 text-[var(--text-muted)] line-through border border-emerald-500/20'
                  : 'bg-[var(--bg-main)] hover:bg-zinc-500/5 text-[var(--text-main)] border border-[var(--border-color)]'
              }`}
            >
              <button
                type="button"
                className="pt-0.5 text-emerald-500 focus:outline-none"
                aria-label={`Tandai langkah ${idx + 1}`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-zinc-950" />
                ) : (
                  <Circle className="w-4 h-4 text-zinc-500 hover:text-emerald-500 transition-colors" />
                )}
              </button>
              <div className="flex-1 font-medium leading-relaxed">
                <span className="font-mono font-bold mr-1.5 text-emerald-500">#{idx + 1}</span>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
