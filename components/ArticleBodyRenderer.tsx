'use client';

import React from 'react';
import CodeBlock from './CodeBlock';
import { TocItem } from '@/lib/types';
import { Image as ImageIcon, ExternalLink, BarChart3, ChevronRight } from 'lucide-react';
import { resolveSourceUrl, resolvePhotoSource } from '@/lib/article-references';

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

        // Regular text block: parse sub-elements (H3, H4, tables, images, bullet points, quotes)
        const sanitizedPart = part.replace(/([a-zA-Z0-9)])(?:ln|\\n)([A-Z])/g, '$1\n\n$2');
        const rawLines = sanitizedPart.split('\n');

        // Group lines into table blocks vs regular lines
        type BlockItem = 
          | { type: 'table'; rows: string[] }
          | { type: 'line'; text: string };

        const blocks: BlockItem[] = [];
        let currentTableRows: string[] = [];

        for (let i = 0; i < rawLines.length; i++) {
          const trimmed = rawLines[i].trim();
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            currentTableRows.push(trimmed);
          } else {
            if (currentTableRows.length > 0) {
              blocks.push({ type: 'table', rows: currentTableRows });
              currentTableRows = [];
            }
            blocks.push({ type: 'line', text: rawLines[i] });
          }
        }
        if (currentTableRows.length > 0) {
          blocks.push({ type: 'table', rows: currentTableRows });
        }

        return (
          <div key={index} className="space-y-3">
            {blocks.map((block, blockIdx) => {
              // 1. Render Table Block
              if (block.type === 'table') {
                if (block.rows.length < 2) return null;
                const headerCells = block.rows[0].split('|').slice(1, -1).map(c => c.trim());
                // Skip separator row (row 1 e.g. |---|---|)
                const dataRows = block.rows.slice(2).map(r => r.split('|').slice(1, -1).map(c => c.trim()));

                return (
                  <div key={blockIdx} className="my-6 rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
                    <div className="px-3.5 sm:px-4 py-2.5 bg-emerald-500/10 border-b border-[var(--border-color)] flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
                        <BarChart3 className="w-4 h-4 shrink-0" />
                        <span>Komparasi & Benchmark</span>
                      </span>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-0.5 sm:hidden">
                        <span>Geser tabel</span>
                        <ChevronRight className="w-3 h-3 text-emerald-500" />
                      </span>
                    </div>
                    <div className="overflow-x-auto scrollbar-thin">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[540px]">
                        <thead>
                          <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)]">
                            {headerCells.map((header, hIdx) => (
                              <th key={hIdx} className="px-3.5 sm:px-4 py-3 font-semibold text-[var(--text-main)] font-mono text-xs whitespace-nowrap">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                          {dataRows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-emerald-500/5 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-3.5 sm:px-4 py-3 text-[var(--text-main)] text-xs sm:text-sm">
                                  <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              // 2. Render Single Line
              const trimmed = block.text.trim();
              if (!trimmed) return null;

              // Markdown Images: ![alt](url) or ![alt | Sumber: Source](url)
              const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/);
              if (imgMatch) {
                const rawAlt = imgMatch[1];
                const imgSrc = imgMatch[2];
                const optTitle = imgMatch[3] || '';

                let caption = rawAlt;
                let source = optTitle;

                if (rawAlt.includes('|')) {
                  const parts = rawAlt.split('|');
                  caption = parts[0].trim();
                  source = parts[1].replace(/^(Sumber|Source):\s*/i, '').trim();
                }

                const cleanSource = source ? source.replace(/^(Sumber|Source):\s*/i, '').trim() : '';
                const photoInfo = resolvePhotoSource(imgSrc, cleanSource);

                return (
                  <figure key={blockIdx} className="my-5 max-w-xl mx-auto rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm text-left [text-align:left]">
                    <a
                      href={photoInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative overflow-hidden bg-black/40 flex items-center justify-center aspect-[16/9] max-h-[220px] sm:max-h-[280px] group/img block cursor-pointer"
                      title={`Buka foto asli resolusi penuh (${photoInfo.label})`}
                    >
                      <img
                        src={imgSrc}
                        alt={caption}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                        loading="lazy"
                      />
                    </a>
                    <figcaption className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[var(--card-bg)] border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-left [text-align:left]">
                      <span className="text-[var(--text-main)] font-semibold flex items-center gap-1.5 text-left [text-align:left] min-w-0">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="leading-snug">{caption}</span>
                      </span>
                      <a
                        href={photoInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] bg-emerald-500/10 text-emerald-500 hover:text-emerald-400 dark:text-emerald-400 dark:hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/20 font-semibold self-start sm:self-auto transition-all group/src cursor-pointer shrink-0 whitespace-nowrap text-left [text-align:left]"
                        title={`Buka sumber asli foto: ${photoInfo.label}`}
                      >
                        <ExternalLink className="w-3 h-3 shrink-0 group-hover/src:translate-x-0.5 group-hover/src:-translate-y-0.5 transition-transform" />
                        <span>Sumber: {photoInfo.label}</span>
                        <span className="text-[10px] opacity-70">↗</span>
                      </a>
                    </figcaption>
                  </figure>
                );
              }

              // Headings H3
              if (trimmed.startsWith('### ')) {
                const rawH3 = trimmed.replace(/^###\s+/, '').trim();
                let headingText = rawH3;
                let extraParagraph: string | null = null;

                // Defensive check: if heading is merged with paragraph text
                if (rawH3.length > 85 && (/\.\s+[A-Z]/.test(rawH3) || /:\s+[A-Z]/.test(rawH3) || /[a-z][\.\?!][A-Z]/.test(rawH3))) {
                  const match = rawH3.match(/^((?:\d+[\.\)]\s*)?[^\.\?\!]{5,75}?(?:Context|Breakdown|Landscape|Sentiment|Takeaways|Trajectory|Overview|Peristiwa|Mendalam|Pasar|Industri|Konsumen|Depan|[A-Za-z0-9\s-]{5,60}))(?:[\.\?\!](?:\s+|$)|(?=[A-Z][a-z]{3,}))([\s\S]*)/);
                  if (match) {
                    headingText = match[1].trim();
                    extraParagraph = match[2]?.trim() || null;
                  } else {
                    const dotIdx = rawH3.search(/(?<=[^\d]\.)\s+[A-Z]/);
                    if (dotIdx !== -1) {
                      headingText = rawH3.slice(0, dotIdx + 1).trim();
                      extraParagraph = rawH3.slice(dotIdx + 2).trim();
                    }
                  }
                }

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
                  <React.Fragment key={blockIdx}>
                    <div className="relative">
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
                    {extraParagraph && (
                      <p
                        className="leading-relaxed text-xs sm:text-sm text-justify"
                        dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(extraParagraph) }}
                      />
                    )}
                  </React.Fragment>
                );
              }

              // Headings H4
              if (trimmed.startsWith('#### ')) {
                return (
                  <h4 key={blockIdx} className="text-base font-bold text-[var(--text-main)] pt-2">
                    {trimmed.replace('#### ', '')}
                  </h4>
                );
              }

              // Horizontal rule
              if (trimmed === '---') {
                return <hr key={blockIdx} className="my-6 border-[var(--border-color)]" />;
              }

              // Blockquotes
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={blockIdx}
                    className="p-3.5 my-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-500/5 text-xs sm:text-sm italic text-[var(--text-main)] leading-relaxed"
                  >
                    {trimmed.replace(/^>\s*/, '')}
                  </blockquote>
                );
              }

              // Verified Source Citation Callout: *Sumber: ...* or *Source: ...*
              if (/^\*(Sumber|Source|Data Source):\s*/i.test(trimmed)) {
                const sourceText = trimmed.replace(/^\*|\*$/g, '');
                const cleanQuery = sourceText.replace(/^(Sumber|Source|Data Source):\s*/i, '');
                const sourceUrl = resolveSourceUrl(cleanQuery);

                return (
                  <div key={blockIdx} className="my-4 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-left [text-align:left]">
                    <div className="flex items-center gap-2 text-[var(--text-main)] font-medium text-left [text-align:left]">
                      <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                      <span className="leading-snug text-left [text-align:left]">{sourceText}</span>
                    </div>
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:scale-95 transition-all shrink-0 self-start sm:self-auto shadow-sm whitespace-nowrap text-left [text-align:left]"
                    >
                      <span>Buka Laporan Sumber</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  </div>
                );
              }

              // Bullet points
              if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                const itemContent = trimmed.replace(/^(\*|-)\s*/, '');
                return (
                  <div key={blockIdx} className="flex items-start gap-2.5 pl-1 sm:pl-2 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemContent) }} />
                  </div>
                );
              }

              // Numbered items
              if (/^[0-9]+\.\s+/.test(trimmed)) {
                return (
                  <div key={blockIdx} className="flex items-start gap-2 pl-1 sm:pl-2 text-xs sm:text-sm">
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
                  key={blockIdx}
                  className="leading-relaxed text-xs sm:text-sm text-left sm:text-justify [text-align-last:left] hyphens-auto break-words"
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
