'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  ArrowDownAZ,
  LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export type SortOption = 'recommended' | 'latest' | 'quick-read' | 'deep-read' | 'az';

interface OptionItem {
  value: SortOption;
  labelId: string;
  labelEn: string;
  icon: LucideIcon;
}

const SORT_OPTIONS: OptionItem[] = [
  {
    value: 'recommended',
    labelId: 'Pilihan & Populer',
    labelEn: 'Featured & Popular',
    icon: Sparkles,
  },
  {
    value: 'latest',
    labelId: 'Terbaru',
    labelEn: 'Latest Released',
    icon: Calendar,
  },
  {
    value: 'az',
    labelId: 'Judul (A — Z)',
    labelEn: 'Alphabetical (A — Z)',
    icon: ArrowDownAZ,
  },
  {
    value: 'quick-read',
    labelId: 'Baca Cepat (< 10m)',
    labelEn: 'Quick Read (< 10m)',
    icon: Clock,
  },
  {
    value: 'deep-read',
    labelId: 'Mendalam (> 15m)',
    labelEn: 'Deep Dive (> 15m)',
    icon: BookOpen,
  },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export default function SortDropdown({ value, onChange, className = '' }: SortDropdownProps) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];
  const CurrentIcon = currentOption.icon;
  const currentLabel = lang === 'en' ? currentOption.labelEn : currentOption.labelId;

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 border outline-none cursor-pointer select-none ${
          isOpen
            ? 'bg-[var(--card-bg)] border-emerald-500/60 ring-2 ring-emerald-500/20 text-[var(--text-main)] shadow-md'
            : 'bg-[var(--bg-main)] hover:bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-main)] hover:border-zinc-700 shadow-sm'
        }`}
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <CurrentIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0 hidden sm:inline" />
        <span className="font-medium whitespace-nowrap">{currentLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-emerald-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-56 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-2xl shadow-black/60 p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] mb-1 flex items-center justify-between">
            <span>{lang === 'en' ? 'Sort Catalog' : 'Urutkan Konten'}</span>
            <span className="text-[9px] text-emerald-400/80 font-semibold">{SORT_OPTIONS.length} opsi</span>
          </div>

          <div className="space-y-0.5">
            {SORT_OPTIONS.map((opt) => {
              const isSelected = opt.value === value;
              const Icon = opt.icon;
              const label = lang === 'en' ? opt.labelEn : opt.labelId;

              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-main)] hover:text-emerald-400 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? 'text-emerald-400' : 'text-[var(--text-muted)]'
                      }`}
                    />
                    <span className="truncate">{label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
