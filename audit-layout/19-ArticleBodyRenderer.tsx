'use client';

import React from 'react';
import CodeBlock from './CodeBlock';
import { TocItem } from '@/lib/types';

interface ArticleBodyRendererProps {
  content: string;
  toc?: TocItem[];
}

export default function ArticleBodyRenderer({ content, toc }: ArticleBodyRendererProps) {
  // Split content by code blocks ```...```
  const parts = content.split(/(```[\s\S]*?```)/g);
  let h3Count = 0;

  return (
    <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[var(--text-main)] font-normal">
      {parts.map((part, index) => {
        if (!part.trim()) return null;

        // Check if this part is a code block
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          let language = 'bash';
          let codeContent = lines.join('\n');

          // If first line has language tag (e.g. ```bash, ```python, ```json)
          if (['bash', 'python', 'javascript', 'typescript', 'json', 'yaml', 'markdown', 'text', 'sh'].includes(firstLine.toLowerCase())) {
            language = firstLine.toLowerCase();
            codeContent = lines.slice(1).join('\n');
          }

          return (
            <CodeBlock
              key={index}
              code={codeContent}
              language={language}
            />
          );
        }

        // Regular text block: parse sub-elements (H3, H4, bullet points, quotes)
        const subLines = part.split('\n');
        return (
          <div key={index} className="space-y-3">
            {subLines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              // Headings H3
              if (trimmed.startsWith('### ')) {
                const headingText = trimmed.replace('### ', '');
                const currentH3Idx = h3Count++;

                // 1. Try matching by numbered prefix e.g. "1. ", "2. ", "3. "
                const numMatch = headingText.match(/^(\d+)[\.\)]/);
                let targetId = '';
                if (numMatch && toc) {
                  const num = parseInt(numMatch[1], 10);
                  if (toc[num - 1]) {
                    targetId = toc[num - 1].id;
                  }
                }

                // 2. Fallback to sequential toc index
                if (!targetId && toc && toc[currentH3Idx]) {
                  targetId = toc[currentH3Idx].id;
                }

                // 3. Fallback to slugified text
                const anchorId = headingText
                  .toLowerCase()
                  .replace(/^[0-9]+\.\s*/, '')
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '');

                if (!targetId) {
                  targetId = anchorId;
                }

                return (
                  <div key={lineIdx} className="relative">
                    {/* Alias anchor if targetId differs from slugified anchorId */}
                    {targetId !== anchorId && (
                      <span id={anchorId} className="absolute -top-24 pointer-events-none" />
                    )}
                    <h3
                      id={targetId}
                      className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-main)] pt-4 pb-1 border-b border-[var(--border-color)]/60 scroll-mt-24"
                    >
                      {headingText}
                    </h3>
                  </div>
                );
              }

              // Headings H4
              if (trimmed.startsWith('#### ')) {
                return (
                  <h4 key={lineIdx} className="text-base font-bold text-[var(--text-main)] pt-2">
                    {trimmed.replace('#### ', '')}
                  </h4>
                );
              }

              // Horizontal rule
              if (trimmed === '---') {
                return <hr key={lineIdx} className="my-6 border-[var(--border-color)]" />;
              }

              // Blockquotes
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={lineIdx}
                    className="p-3.5 my-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-500/5 text-xs sm:text-sm italic text-[var(--text-main)] leading-relaxed"
                  >
                    {trimmed.replace(/^>\s*/, '')}
                  </blockquote>
                );
              }

              // Bullet points
              if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                const itemContent = trimmed.replace(/^(\*|-)\s*/, '');
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 pl-2 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemContent) }} />
                  </div>
                );
              }

              // Numbered items
              if (/^[0-9]+\.\s+/.test(trimmed)) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2 text-xs sm:text-sm">
                    <span className="font-mono text-emerald-500 font-semibold shrink-0">
                      {trimmed.match(/^[0-9]+\./)?.[0]}
                    </span>
                    <span
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatInlineMarkdown(trimmed.replace(/^[0-9]+\.\s+/, '')),
                      }}
                    />
                  </div>
                );
              }

              // Regular paragraph
              return (
                <p
                  key={lineIdx}
                  className="leading-relaxed text-xs sm:text-sm"
                  dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatInlineMarkdown(text: string): string {
  const safeText = escapeHtml(text);
  return safeText
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-emerald-400">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 text-[11px] font-mono rounded bg-zinc-800 text-emerald-300 border border-zinc-700/60">$1</code>');
}
