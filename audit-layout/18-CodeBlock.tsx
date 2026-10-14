'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = 'bash', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { lang } = useLanguage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="my-5 rounded-xl border border-[var(--border-color)] bg-[#0d0d11] overflow-hidden text-sm shadow-md">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141419] border-b border-zinc-800/80 text-zinc-400">
        <div className="flex items-center gap-2">
          {/* Terminal Dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <Terminal className="w-3.5 h-3.5 text-zinc-500" />
          <span className="font-mono text-xs text-zinc-300 font-medium">
            {filename || language.toUpperCase()}
          </span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-300 hover:text-white transition-all border border-zinc-700/50"
          title={lang === 'en' ? 'Copy code to clipboard' : 'Salin kode ke clipboard'}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">{lang === 'en' ? 'Copied!' : 'Tersalin!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Copy' : 'Salin'}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed text-zinc-200">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
