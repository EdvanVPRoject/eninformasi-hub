'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Copy, 
  Github, 
  Cpu, 
  Bot, 
  Globe, 
  Database,
  Layers
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

interface ToolItem {
  id: string;
  name: string;
  author: string;
  repoUrl: string;
  version: string;
  category: string;
  description: string;
  descriptionEn: string;
  commandOrUrl: string;
}

const officialTools: ToolItem[] = [
  {
    id: 'crewai',
    name: 'CrewAI — Multi-Agent Orchestration Framework',
    author: 'crewAIInc',
    repoUrl: 'https://github.com/crewAIInc/crewAI',
    version: 'v0.100+',
    category: 'AI Agents',
    description: 'Framework orkestrasi agen otonom paling populer di dunia. Memungkinkan AI berkolaborasi dalam peran dan tugas modular.',
    descriptionEn: 'The leading open-source framework for orchestrating role-playing, autonomous AI agents to solve complex tasks collaboratively.',
    commandOrUrl: 'pip install crewai crewai-tools',
  },
  {
    id: 'langgraph',
    name: 'LangGraph — Stateful Agentic Workflows',
    author: 'langchain-ai',
    repoUrl: 'https://github.com/langchain-ai/langgraph',
    version: 'v0.2+',
    category: 'Agent State Machine',
    description: 'Pustaka graf status siklikal dari LangChain untuk merancang alur kerja multi-agen deterministik dengan human-in-the-loop.',
    descriptionEn: 'Build resilient language agents as cyclical graphs with controllable state management and human-in-the-loop authorization.',
    commandOrUrl: 'pip install langgraph langchain-core',
  },
  {
    id: 'crawl4ai',
    name: 'Crawl4AI — Open Source LLM Web Crawler',
    author: 'unclecode',
    repoUrl: 'https://github.com/unclecode/crawl4ai',
    version: 'v0.4+',
    category: 'Web Scraping',
    description: 'Crawler web asinkron tercepat khusus AI. Mengikis JavaScript dinamis dan mengekstrak Markdown bersih siap pakai untuk prompt.',
    descriptionEn: 'Blazing-fast, open-source asynchronous web crawler and scraper engineered specifically for LLM context windows and prompts.',
    commandOrUrl: 'pip install crawl4ai && crawl4ai-setup',
  },
  {
    id: 'ollama',
    name: 'Ollama — Run Llama 3 & DeepSeek-R1 Locally',
    author: 'ollama',
    repoUrl: 'https://github.com/ollama/ollama',
    version: 'v0.5+',
    category: 'Local LLM',
    description: 'Runtime model bahasa lokal resmi. Jalankan DeepSeek-R1, Llama 3.3, dan Mistral langsung di laptop atau server tanpa cloud.',
    descriptionEn: 'Get up and running with large language models locally. Simple CLI to download, run, and serve models with an OpenAI-compatible API.',
    commandOrUrl: 'curl -fsSL https://ollama.com/install.sh | sh',
  },
  {
    id: 'open-webui',
    name: 'Open WebUI — Self-Hosted AI Platform',
    author: 'open-webui',
    repoUrl: 'https://github.com/open-webui/open-webui',
    version: 'v0.5+',
    category: 'Interface & RAG',
    description: 'Antarmuka ChatGPT-style mandiri dengan fitur RAG bawaan, parsing dokumen, multi-user role, dan integrasi Ollama/vLLM.',
    descriptionEn: 'User-friendly self-hosted WebUI for LLMs with built-in RAG, document parsing, web search, and fine-grained access control.',
    commandOrUrl: 'docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data ghcr.io/open-webui/open-webui:main',
  },
  {
    id: 'vllm',
    name: 'vLLM — High-Throughput Serving Engine',
    author: 'vllm-project',
    repoUrl: 'https://github.com/vllm-project/vllm',
    version: 'v0.7+',
    category: 'Inference Engine',
    description: 'Engine penyaji model open-source berkecepatan tinggi dengan algoritma PagedAttention untuk throughput inferensi 5x lipat.',
    descriptionEn: 'A high-throughput and memory-efficient LLM inference and serving engine powered by the state-of-the-art PagedAttention algorithm.',
    commandOrUrl: 'pip install vllm',
  },
  {
    id: 'unsloth',
    name: 'Unsloth — 5x Faster LLM Fine-Tuning',
    author: 'unslothai',
    repoUrl: 'https://github.com/unslothai/unsloth',
    version: 'v2026+',
    category: 'Fine-Tuning',
    description: 'Pustaka fine-tuning LoRA/QLoRA super efisien dengan kernel Triton kustom yang memangkas penggunaan VRAM hingga 70%.',
    descriptionEn: 'Fine-tune Llama 3.3, Mistral, and DeepSeek models 5x faster with 70% less VRAM using hand-written OpenAI Triton kernels.',
    commandOrUrl: 'pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"',
  },
  {
    id: 'mcp-sdk',
    name: 'Model Context Protocol (MCP) TypeScript SDK',
    author: 'modelcontextprotocol',
    repoUrl: 'https://github.com/modelcontextprotocol/typescript-sdk',
    version: 'v1.1+',
    category: 'Protocol & Tools',
    description: 'SDK resmi standar terbuka Anthropic untuk menghubungkan Claude Desktop, Claude Code, dan Cursor ke basis data eksternal.',
    descriptionEn: 'Official Anthropic TypeScript SDK implementing the Model Context Protocol to securely connect LLMs to data and execution tools.',
    commandOrUrl: 'npm install @modelcontextprotocol/sdk',
  },
  {
    id: 'mem0',
    name: 'Mem0 — The Memory Layer for AI Agents',
    author: 'mem0ai',
    repoUrl: 'https://github.com/mem0ai/mem0',
    version: 'v0.1+',
    category: 'Memory & State',
    description: 'Lapisan memori personal adaptif untuk asisten AI agar dapat mengingat preferensi dan konteks pengguna lintas sesi chat.',
    descriptionEn: 'Personalized, adaptive long-term memory layer for AI agents and assistants that learns and remembers across user interactions.',
    commandOrUrl: 'pip install mem0ai',
  },
  {
    id: 'comfyui',
    name: 'ComfyUI — Modular Generative AI GUI',
    author: 'comfyanonymous',
    repoUrl: 'https://github.com/comfyanonymous/ComfyUI',
    version: 'v0.3+',
    category: 'Generative Media',
    description: 'Antarmuka visual berbasis graph node paling bertenaga untuk menjalankan model gambar generatif FLUX.1 dan Stable Diffusion.',
    descriptionEn: 'The most powerful modular node-based GUI and backend for running FLUX.1, SDXL, and generative image/video pipelines locally.',
    commandOrUrl: 'git clone https://github.com/comfyanonymous/ComfyUI.git',
  },
];

export default function ToolsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { lang, t } = useLanguage();

  const handleCopy = async (tool: ToolItem) => {
    try {
      await navigator.clipboard.writeText(tool.commandOrUrl);
      setCopiedId(tool.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-3xl mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <Github className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'en' ? 'Official Open-Source Hub' : 'Direktori Resmi Open-Source'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
          {lang === 'en' ? 'Verified Developer Repositories & Utilities' : 'Tools & Repositori Resmi Pengembang'}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          {lang === 'en'
            ? 'Curated list of verified upstream open-source repositories from the official creators behind today’s leading AI agent frameworks, local LLM runtimes, and inference engines.'
            : 'Koleksi repositori open-source resmi langsung dari para kreator dan pengembang asli di balik framework AI agents, runtime LLM lokal, dan engine inferensi terdepan.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officialTools.map((tool) => {
          const isCopied = copiedId === tool.id;
          return (
            <div
              key={tool.id}
              className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] flex flex-col justify-between space-y-4 hover:border-emerald-500/50 hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                    {tool.category}
                  </span>
                  <a
                    href={tool.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-emerald-400 transition-colors bg-zinc-500/10 px-2 py-0.5 rounded border border-zinc-500/20"
                    title={`Buka GitHub ${tool.author}`}
                  >
                    <Github className="w-3 h-3" />
                    <span>@{tool.author}</span>
                  </a>
                </div>

                <h3 className="font-bold text-base text-[var(--text-main)] leading-snug">
                  {tool.name}
                </h3>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                  {lang === 'en' ? tool.descriptionEn : tool.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
                <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] font-mono text-[11px] text-zinc-300 overflow-x-auto truncate">
                  <code>{tool.commandOrUrl}</code>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(tool)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold rounded-lg transition-all ${
                      isCopied
                        ? 'bg-emerald-400 text-zinc-950 shadow-sm'
                        : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-zinc-950" />
                        <span>{lang === 'en' ? 'Copied!' : 'Tersalin!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Copy Cmd' : 'Salin Perintah'}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={tool.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
