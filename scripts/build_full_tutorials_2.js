// Full generator for lib/data/tutorials-2.ts with 17 complete, practical, in-depth tutorials
const fs = require('fs');
const path = require('path');

const tutorials = [
  {
    slug: 'tutorial-bikin-custom-mcp-server-postgresql',
    title: 'Bikin Custom MCP Server PostgreSQL Sendiri (Biar Cursor & Claude Bisa Query Database Langsung)',
    description: 'Panduan langkah demi langkah membuat Model Context Protocol (MCP) server kustom untuk PostgreSQL menggunakan TypeScript SDK. Memungkinkan asisten coding AI membaca skema, menjalankan query terisolasi, dan menjelaskan tabel.',
    postType: 'tutorial',
    category: 'database-dev',
    categoryLabel: 'Database Dev',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['MCP', 'PostgreSQL', 'TypeScript', 'Cursor', 'Claude Desktop', 'Database'],
    affiliateProduct: {
      name: 'Managed Cloud PostgreSQL Instance',
      priceEstimate: 'Rp 220.000/bln',
      linkUrl: 'https://neon.tech',
      badge: 'Database Pilihan',
      description: 'Database serverless PostgreSQL dengan branching instan untuk sandbox testing MCP server.'
    },
    toc: [
      { id: 'apa-itu-mcp-server', title: '1. Apa Itu Model Context Protocol (MCP) Server?' },
      { id: 'persiapan-proyek-typescript', title: '2. Inisialisasi Proyek TypeScript & SDK MCP' },
      { id: 'menulis-resource-dan-tools', title: '3. Menulis Resource Skema & Tools Query PostgreSQL' },
      { id: 'konfigurasi-claude-cursor', title: '4. Menghubungkan ke Claude Desktop & Cursor IDE' },
      { id: 'keamanan-dan-read-only-guard', title: '5. Best Practice Keamanan: Mencegah Query Destruktif' }
    ],
    steps: [
      { id: 'step-1', label: 'Buat proyek TypeScript dan instal @modelcontextprotocol/sdk serta pg' },
      { id: 'step-2', label: 'Tulis handler MCP Server untuk membaca schema information_schema' },
      { id: 'step-3', label: 'Terapkan tool execute_sql dengan validasi Read-Only (hanya SELECT)' },
      { id: 'step-4', label: 'Daftarkan server di claude_desktop_config.json dan uji interaksi AI' }
    ],
    content: `
### 1. Apa Itu Model Context Protocol (MCP) Server?
Model Context Protocol (MCP) adalah standar terbuka dari Anthropic ([github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)) yang memungkinkan LLM seperti Claude Desktop, Claude Code, dan Cursor terhubung secara aman ke sumber data eksternal maupun perkakas operasional lokal.

Sebelum MCP hadir, Anda harus menyalin (*copy-paste*) DDL tabel, skema relasi, atau hasil query SQL secara manual ke jendela chat. Dengan MCP server kustom PostgreSQL:
* Editor atau LLM dapat membaca katalog tabel (*schema discovery*) otomatis.
* Model dapat mengeksekusi query \`SELECT\` untuk menganalisis anomali data riil.
* Debugging query ORM (Prisma/Drizzle) langsung divalidasi ke engine database secara instan.

### 2. Inisialisasi Proyek TypeScript & SDK MCP
Siapkan folder proyek dan instal dependensi resmi MCP TypeScript SDK:

\`\`\`bash
mkdir pg-mcp-server && cd pg-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk pg dotenv
npm install -D typescript @types/node @types/pg tsx
npx tsc --init
\`\`\`

Pastikan pada file \`package.json\` Anda menambahkan konfigurasi \`"type": "module"\` dan script build:

\`\`\`json
{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  }
}
\`\`\`

### 3. Menulis Resource Skema & Tools Query PostgreSQL
Buat file utama \`src/index.ts\`. Server akan berkomunikasi lewat *Standard I/O (stdio)*:

\`\`\`typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mydb'
});

const server = new Server(
  { name: "postgres-inspector", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_tables",
        description: "Dapatkan daftar seluruh tabel dan total baris di database publik.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "run_readonly_query",
        description: "Jalankan SQL query SELECT secara aman (hanya query baca).",
        inputSchema: {
          type: "object",
          properties: {
            sql: { type: "string", description: "Query SQL diawali dengan SELECT" }
          },
          required: ["sql"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_tables") {
    const res = await pool.query(\`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    \`);
    return { content: [{ type: "text", text: JSON.stringify(res.rows, null, 2) }] };
  }

  if (name === "run_readonly_query") {
    const query = (args?.sql as string || '').trim();
    if (!query.toLowerCase().startsWith('select')) {
      throw new Error("Izin ditolak: Hanya perintah SELECT yang diperbolehkan demi keamanan.");
    }
    const res = await pool.query(query);
    return { content: [{ type: "text", text: JSON.stringify(res.rows, null, 2) }] };
  }

  throw new Error("Perkakas tidak dikenali");
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP PostgreSQL Server berhasil terhubung via stdio.");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
\`\`\`

### 4. Menghubungkan ke Claude Desktop & Cursor IDE
Kompilasi TypeScript menjadi JavaScript biasa dengan perintah:
\`\`\`bash
npm run build
\`\`\`

Buka file konfigurasi Claude Desktop di sistem Anda (\`claude_desktop_config.json\`):
* **Windows**: \`%APPDATA%\\Claude\\claude_desktop_config.json\`
* **macOS**: \`~/Library/Application Support/Claude/claude_desktop_config.json\`

Tambahkan entri server berikut:

\`\`\`json
{
  "mcpServers": {
    "postgres-local": {
      "command": "node",
      "args": ["C:/Users/edvan/Projects/pg-mcp-server/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://postgres:rahasia@localhost:5432/ecommerce_db"
      }
    }
  }
}
\`\`\`

Buka kembali Claude Desktop. Ikon palu (*tools*) akan otomatis menyala hijau, siap menerima pertanyaan seperti: *"Tampilkan 5 transaksi paling besar dari tabel orders bulan ini."*

### 5. Best Practice Keamanan: Mencegah Query Destruktif
Dalam implementasi produksi:
1. **User Database Terbatas**: Selalu buat database user khusus dengan izin \`GRANT SELECT ON ALL TABLES\` saja. Jangan gunakan superuser \`postgres\`.
2. **Statement Timeout**: Pasang batasan waktu eksekusi (\`statement_timeout = 3000\`) agar LLM tidak menjalankan query scan jutaan baris yang membebani CPU database utama.
3. **Audit Log**: Simpan riwayat query yang dipanggil oleh model ke dalam file log terpisah untuk pemantauan kepatuhan privasi data.
`,
    en: {
      title: 'Build Your Own Custom PostgreSQL MCP Server (Let Cursor & Claude Query Databases Safely)',
      description: 'Step-by-step guide to building a custom Model Context Protocol (MCP) server for PostgreSQL using TypeScript. Learn how to expose read-only schema inspection and query execution to AI assistants.',
      content: `
### 1. What is Model Context Protocol (MCP) Server?
The Model Context Protocol (MCP) is an open specification created by Anthropic ([github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)) enabling AI tools such as Claude Desktop and Cursor to interface safely with local databases, external APIs, and developer toolchains.

### 2. TypeScript Project Initialization & MCP SDK
Initialize your project and install official packages:
\`\`\`bash
mkdir pg-mcp-server && cd pg-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk pg dotenv
npm install -D typescript @types/node @types/pg tsx
\`\`\`

### 3. Writing Schema Resources & PostgreSQL Query Tools
Implement the server with \`StdioServerTransport\` and expose safe \`get_tables\` and read-only \`run_readonly_query\` tools with SQL assertion safeguards.

### 4. Configuring Claude Desktop & Cursor IDE
Register the built script in \`claude_desktop_config.json\` with your Postgres connection URL and restart the client.

### 5. Production Security Best Practices
Always bind the MCP server to a dedicated read-only database role, apply tight statement timeouts, and log every query for regulatory compliance.
`
    }
  },
  {
    slug: 'panduan-autogen-0-4-grup-chat-multi-agent',
    title: 'Panduan Praktis AutoGen 0.4: Bikin Grup Chat Multi-Agent untuk Analisis Pasar Otomatis',
    description: 'Pelajari arsitektur baru Microsoft AutoGen 0.4 event-driven. Membangun ruang obrolan multi-agen berisi Agen Peneliti Web, Agen Analis Keuangan, dan Agen Pembuat Laporan Markdown.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Lanjutan',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '10 min baca',
    author: 'Edvan',
    tags: ['AutoGen', 'Microsoft', 'Multi-Agent', 'Python', 'Financial Analysis'],
    affiliateProduct: {
      name: 'Dedicated AI Inference VPS',
      priceEstimate: 'Rp 280.000/bln',
      linkUrl: 'https://hetzner.com',
      badge: 'Compute Power',
      description: 'Server dengan multi-core tinggi untuk menjalankan simulasi orkestrasi 5+ agen secara simultan.'
    },
    toc: [
      { id: 'perubahan-besar-autogen-0-4', title: '1. Perubahan Arsitektur AutoGen 0.4 (Core & AgentChat)' },
      { id: 'instalasi-dan-lingkungan-python', title: '2. Instalasi Paket autogen-agentchat & autogen-ext' },
      { id: 'merancang-tim-analis-finansial', title: '3. Merancang Tim: Peneliti, Analis Finansial, & Editor' },
      { id: 'orkestrasi-round-robin-group-chat', title: '4. Menjalankan RoundRobinGroupChat & Terminasi Syarat' },
      { id: 'evaluasi-dan-simulasi-pasar', title: '5. Menjalankan Simulasi Riset Saham & Menyimak Hasil' }
    ],
    steps: [
      { id: 'step-1', label: 'Instal paket autogen-agentchat dan autogen-ext terbaru' },
      { id: 'step-2', label: 'Inisialisasi OpenAIChatCompletionClient atau model backend lokal' },
      { id: 'step-3', label: 'Tentukan 3 AssistantAgent dengan system_message spesifik' },
      { id: 'step-4', label: 'Bungkus agen ke dalam RoundRobinGroupChat dan jalankan runtime stream' }
    ],
    content: `
### 1. Perubahan Arsitektur AutoGen 0.4 (Core & AgentChat)
Pada pembaruan besar Microsoft AutoGen versi 0.4 ([github.com/microsoft/autogen](https://github.com/microsoft/autogen)), arsitektur monolitik lama digantikan dengan desain modular modern berbasis *Event-Driven Actor Model*:
* **autogen-core**: Pondasi sistem pesan terdistribusi berbasis asynchronous event loop.
* **autogen-agentchat**: Abstraksi tingkat tinggi untuk menyusun percakapan tim agen tanpa kode boilerplate.
* **autogen-ext**: Modul integrasi eksternal untuk model OpenAI, Azure, Anthropic, dan eksekusi Docker.

### 2. Instalasi Paket autogen-agentchat & autogen-ext
Gunakan Python 3.10 atau lebih tinggi dan pasang paket resmi versi 0.4:

\`\`\`bash
pip install -U autogen-agentchat autogen-ext[openai] python-dotenv
\`\`\`

Simpan kunci API model Anda pada file \`.env\`:
\`\`\`env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
\`\`\`

### 3. Merancang Tim: Peneliti, Analis Finansial, & Editor
Buat file \`financial_team.py\`. Di sini kita definisikan tiga agen spesialis yang saling mengoreksi draf:

\`\`\`python
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main():
    # 1. Konfigurasi model client
    model_client = OpenAIChatCompletionClient(model="gpt-4o-mini")

    # 2. Agen 1: Peneliti Tren Makro
    researcher = AssistantAgent(
        name="Peneliti_Pasar",
        model_client=model_client,
        system_message="Anda adalah peneliti data ekonomi. Tugas Anda adalah memaparkan fakta, berita terbaru, dan tren fundamental sektor teknologi."
    )

    # 3. Agen 2: Analis Keuangan & Risiko
    analyst = AssistantAgent(
        name="Analis_Risiko",
        model_client=model_client,
        system_message="Anda adalah analis risiko kuantitatif. Evaluasi data dari Peneliti_Pasar, berikan catatan valuasi P/E, risiko volatilitas, dan potensi sentimen negatif."
    )

    # 4. Agen 3: Editor Eksekutif
    editor = AssistantAgent(
        name="Editor_Eksekutif",
        model_client=model_client,
        system_message="Anda merangkum semua argumen ke dalam 1 lembar eksekutif ringkas. Jika laporan sudah komprehensif dan matang, akhiri pesan dengan kata: SELESAI_LAPORAN."
    )
\`\`\`

### 4. Menjalankan RoundRobinGroupChat & Terminasi Syarat
Kelompokkan ketiga agen tersebut ke dalam tim *Round Robin* dan tambahkan kondisi terminasi teks:

\`\`\`python
    # Syarat berhenti ketika Editor mengeluarkan kata kunci
    termination_condition = TextMentionTermination("SELESAI_LAPORAN")

    # Bungkus dalam Tim
    team = RoundRobinGroupChat(
        participants=[researcher, analyst, editor],
        termination_condition=termination_condition,
        max_turns=12
    )

    prompt = "Buatkan analisis prospek investasi sektor semikonduktor AI untuk kuartal ke-4 tahun 2026."

    print("=== MEMULAI SIMULASI TIM AUTOGEN 0.4 ===")
    async for message in team.run_stream(task=prompt):
        print(f"\\n[{message.source}]:\\n{message.content}")

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

### 5. Evaluasi dan Simulasi Pasar
Jalankan skrip di terminal:
\`\`\`bash
python financial_team.py
\`\`\`

Perhatikan bagaimana pesan bergerak terstruktur:
1. Peneliti Pasar memaparkan lonjakan adopsi arsitektur AI on-device.
2. Analis Risiko menantang proyeksi tersebut dengan risiko kenaikan suku bunga global dan keterbatasan pasokan silicon wafer.
3. Editor Eksekutif menengahi kedua argumen, membuat poin rekomendasi portofolio seimbang, lalu memicu kata kunci terminasi. Tidak ada loop berputar tanpa batas!
`,
    en: {
      title: 'Practical AutoGen 0.4 Guide: Building Multi-Agent Market Research Group Chats',
      description: 'Master Microsoft AutoGen 0.4 event-driven architecture. Build a collaborative multi-agent squad featuring Web Researchers, Financial Risk Analysts, and Executive Markdown Editors.',
      content: `
### 1. AutoGen 0.4 Architectural Paradigm Shift
AutoGen 0.4 rewrote the core into an asynchronous, actor-based framework split between \`autogen-core\`, \`autogen-agentchat\`, and \`autogen-ext\`.

### 2. Environment Setup
Install the modern components:
\`\`\`bash
pip install -U autogen-agentchat autogen-ext[openai] python-dotenv
\`\`\`

### 3. Configuring Specialized Agents
Configure \`AssistantAgent\` instances powered by \`OpenAIChatCompletionClient\` with distinct domain personas.

### 4. RoundRobinGroupChat & Termination Logic
Group the squad inside \`RoundRobinGroupChat\` coupled with a strict \`TextMentionTermination\` predicate to ensure clean convergence.

### 5. Execution & Analysis Output
Run the async stream loop to inspect step-by-step reasoning and synthesized markdown deliverables.
`
    }
  },
  {
    slug: 'cara-bikin-ekstensi-chrome-ai-plasmo-gemini',
    title: 'Cara Bikin Ekstensi Chrome Berbasis AI Menggunakan Plasmo Framework & Gemini Nano / API',
    description: 'Panduan lengkap membungkus kecerdasan buatan ke dalam browser extension. Menggunakan framework Plasmo (React + TypeScript) dan integrasi Gemini API untuk merangkum teks halaman web dengan 1-klik.',
    postType: 'tutorial',
    category: 'web-dev',
    categoryLabel: 'Web Dev',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['Plasmo', 'Chrome Extension', 'React', 'Gemini API', 'TypeScript'],
    affiliateProduct: {
      name: 'Google Workspace Developer Account',
      priceEstimate: 'Rp 75.000/bln',
      linkUrl: 'https://workspace.google.com',
      badge: 'Dev Suite',
      description: 'Akses penuh ke ekosistem Google AI Studio dan kuota API tier produksi.'
    },
    toc: [
      { id: 'kenapa-memilih-plasmo-framework', title: '1. Kenapa Memilih Plasmo Framework untuk Ekstensi Browser?' },
      { id: 'membuat-proyek-plasmo-react', title: '2. Inisialisasi Proyek Plasmo + Tailwind CSS' },
      { id: 'integrasi-gemini-sdk-popup', title: '3. Menghubungkan Google GenAI SDK di Popup Extension' },
      { id: 'content-script-ekstraksi-halaman', title: '4. Ekstraksi Teks Halaman dengan Content Script' },
      { id: 'build-dan-load-unpacked-chrome', title: '5. Build Produksi & Menjalankan di Google Chrome' }
    ],
    steps: [
      { id: 'step-1', label: 'Inisialisasi proyek Plasmo dengan template React dan TypeScript' },
      { id: 'step-2', label: 'Pasang @google/genai SDK dan siapkan API Key di environment' },
      { id: 'step-3', label: 'Tulis UI Popup modern dengan status loading dan tombol rangkum' },
      { id: 'step-4', label: 'Kirim pesan ke Content Script untuk mengambil teks artikel aktif' }
    ],
    content: `
### 1. Kenapa Memilih Plasmo Framework untuk Ekstensi Browser?
Membangun ekstensi browser tradisional menggunakan manifest v3 murni sering kali melelahkan karena minimnya dukungan bawaan untuk bundler modern, HMR (*Hot Module Replacement*), dan TypeScript.

**Plasmo Framework** ([github.com/PlasmoHQ/plasmo](https://github.com/PlasmoHQ/plasmo)) adalah standar emas pengembangan WebExtension modern. Plasmo mengotomatisasi pembuatan \`manifest.json\`, mendukung React/Vue, Tailwind CSS, serta isolasi penyimpanan lokal tanpa pusing mengelola konfigurasi Webpack.

### 2. Inisialisasi Proyek Plasmo + Tailwind CSS
Buka terminal dan jalankan generator proyek resmi Plasmo:

\`\`\`bash
pnpm create plasmo --with-react ai-summarizer-ext
cd ai-summarizer-ext
pnpm install @google/genai
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

Konfigurasi file \`tailwind.config.js\`:
\`\`\`javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}", "./popup.tsx"],
  theme: { extend: {} },
  plugins: []
}
\`\`\`

### 3. Menghubungkan Google GenAI SDK di Popup Extension
Buat antarmuka popup di file \`popup.tsx\`. Komponen ini akan tampil saat ikon ekstensi diklik oleh pengguna di toolbar Chrome:

\`\`\`tsx
import { useState } from "react"
import { GoogleGenAI } from "@google/genai"
import "./style.css"

export default function IndexPopup() {
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(process.env.PLASMO_PUBLIC_GEMINI_KEY || "")

  const summarizeCurrentTab = async () => {
    setLoading(true)
    setSummary("")

    try {
      // 1. Dapatkan tab browser yang sedang aktif
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab.id) return

      // 2. Eksekusi script untuk mengambil konten teks artikel
      const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const article = document.querySelector("article") || document.querySelector("main") || document.body
          return article.innerText.slice(0, 8000) // Ambil 8000 karakter pertama
        }
      })

      const pageText = injectionResults[0]?.result
      if (!pageText) throw new Error("Gagal mengambil teks dari halaman.")

      // 3. Panggil Gemini API
      const ai = new GoogleGenAI({ apiKey })
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: \`Rangkum artikel berikut dalam 3 poin bullet penting berbahasa Indonesia:\\n\\n\${pageText}\`
      })

      setSummary(response.text || "Tidak ada respon.")
    } catch (err: any) {
      setSummary(\`Error: \${err.message}\`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-96 p-4 bg-slate-900 text-slate-100 font-sans">
      <h1 className="text-lg font-bold text-sky-400 mb-2">⚡ AI Page Summarizer</h1>
      <p className="text-xs text-slate-400 mb-4">Rangkum artikel web panjang menjadi 3 poin ringkas dalam 2 detik.</p>
      
      <button
        onClick={summarizeCurrentTab}
        disabled={loading}
        className="w-full py-2 px-4 rounded bg-sky-600 hover:bg-sky-500 font-medium text-sm transition disabled:opacity-50"
      >
        {loading ? "Menganalisis Konten..." : "Rangkum Halaman Ini"}
      </button>

      {summary && (
        <div className="mt-4 p-3 bg-slate-800 rounded border border-slate-700 text-xs leading-relaxed whitespace-pre-line">
          {summary}
        </div>
      )}
    </div>
  )
}
\`\`\`

### 4. Content Script Ekstraksi Halaman
Tambahkan izin pada file \`package.json\` di bagian manifest kustom Plasmo agar ekstensi memiliki hak akses membaca tab aktif:

\`\`\`json
{
  "manifest": {
    "permissions": ["activeTab", "scripting"],
    "host_permissions": ["https://*/*"]
  }
}
\`\`\`

### 5. Build Produksi & Menjalankan di Google Chrome
Uji ekstensi Anda dalam mode live-reload development:
\`\`\`bash
pnpm dev
\`\`\`

1. Buka browser Google Chrome, navigasikan ke alamat \`chrome://extensions/\`.
2. Aktifkan sakelar **Developer mode** di pojok kanan atas.
3. Klik tombol **Load unpacked**, lalu arahkan ke folder \`build/chrome-mv3-dev\` di dalam proyek Anda.
4. Buka halaman berita atau blog teknis, lalu klik ikon ekstensi AI Anda untuk merangkum secara instan!
`,
    en: {
      title: 'How to Build an AI-Powered Chrome Extension with Plasmo & Gemini',
      description: 'Comprehensive tutorial on creating browser extensions using the Plasmo framework (React + TypeScript) and the Google GenAI SDK to summarize web articles in one click.',
      content: `
### 1. Why Choose Plasmo Framework?
Plasmo ([github.com/PlasmoHQ/plasmo](https://github.com/PlasmoHQ/plasmo)) provides zero-config Manifest V3 scaffolding, instant hot reloading, and native React support for browser extension engineering.

### 2. Scaffolding Project with Tailwind CSS
Generate the boilerplate and install necessary dependencies:
\`\`\`bash
pnpm create plasmo --with-react ai-summarizer-ext
cd ai-summarizer-ext
pnpm install @google/genai
\`\`\`

### 3. Integrating Google GenAI SDK in Extension Popup
Build a sleek interactive popup leveraging \`chrome.tabs.query\` and \`chrome.scripting.executeScript\` to extract active DOM text and summarize via \`gemini-2.5-flash\`.

### 4. Manifest V3 Permissions
Declare \`activeTab\` and \`scripting\` in \`package.json\` manifest overrides.

### 5. Development Build & Chrome Unpacked Loading
Execute \`pnpm dev\`, open \`chrome://extensions\`, toggle Developer Mode, and select \`build/chrome-mv3-dev\` to inspect live.
`
    }
  },
  {
    slug: 'tutorial-langchain-expression-language-lcel',
    title: 'Tutorial LangChain Expression Language (LCEL): Bangun Pipeline RAG Modern Tanpa Ribet',
    description: 'Panduan mendalam menguasai sintaks pipe operator (|) pada LCEL. Menggantikan kelas legacy chain dengan pipeline komposisi fungsional yang mendukung streaming, batching, dan async secara otomatis.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '8 min baca',
    author: 'Edvan',
    tags: ['LangChain', 'LCEL', 'RAG', 'Python', 'Vector DB', 'Prompt Engineering'],
    affiliateProduct: {
      name: 'Serverless Vector Database Tier',
      priceEstimate: 'Rp 175.000/bln',
      linkUrl: 'https://pinecone.io',
      badge: 'Database AI',
      description: 'Indeks vektor instan dengan latensi sub-50ms untuk pipeline RAG produksi.'
    },
    toc: [
      { id: 'kenapa-langchain-beralih-ke-lcel', title: '1. Kenapa LangChain Beralih ke LCEL?' },
      { id: 'konsep-dasar-pipe-operator', title: '2. Anatomi Dasar Operator Pipe (|) & Runnable' },
      { id: 'membangun-pipeline-rag-lcel', title: '3. Membangun Pipeline RAG Lengkap dengan Vector Store' },
      { id: 'fitur-bawaan-streaming-dan-async', title: '4. Fitur Bawaan: Streaming Token & Pemanggilan Asynchronous' },
      { id: 'debugging-lcel-dengan-langsmith', title: '5. Debugging & Visualisasi Eksekusi Chain' }
    ],
    steps: [
      { id: 'step-1', label: 'Instal langchain-core, langchain-community, dan penyedia LLM' },
      { id: 'step-2', label: 'Pahami fungsi RunnablePassthrough dan StrOutputParser' },
      { id: 'step-3', label: 'Hubungkan retriever dokumen dengan prompt template via operator |' },
      { id: 'step-4', label: 'Gunakan method .stream() untuk output real-time di terminal' }
    ],
    content: `
### 1. Kenapa LangChain Beralih ke LCEL?
Pada versi LangChain awal, pengguna dihadapkan pada puluhan kelas rantai (*chains*) yang kaku seperti \`LLMChain\`, \`ConversationalRetrievalChain\`, atau \`SequentialChain\`. Setiap kelas memiliki parameter tersembunyi yang sulit di-debug dan tidak ramah streaming.

**LangChain Expression Language (LCEL)** ([github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain)) mengubah paradigma tersebut menjadi gaya deklaratif fungsional:
* Setiap komponen adalah **Runnable**.
* Komposisi dilakukan lewat operator pipe (\`|\`), mirip pipa Unix di terminal bash.
* Setiap pipeline secara otomatis mendapatkan dukungan sinkron, asinkron (\`ainvoke\`), batching (\`batch\`), dan streaming token (\`stream\`) tanpa perlu menulis ulang fungsi.

### 2. Konsep Dasar Pipe Operator (|) & Runnable
Perhatikan contoh pipeline paling sederhana di bawah ini:

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

# 1. Definisikan komponen runnable
prompt = ChatPromptTemplate.from_template("Berikan 3 analogi sederhana untuk menjelaskan konsep {topik}.")
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
output_parser = StrOutputParser()

# 2. Rangkai dengan operator pipe (|)
chain = prompt | model | output_parser

# 3. Eksekusi
result = chain.invoke({"topik": "Asynchronous Event Loop"})
print(result)
\`\`\`

Data mengalir mulus: Dictionary input masuk ke Prompt -> Menghasilkan PromptValue -> Diteruskan ke LLM -> Menghasilkan AIMessage -> Dikonversi menjadi String murni oleh Output Parser.

### 3. Membangun Pipeline RAG Lengkap dengan Vector Store
Mari kita buat sistem tanya jawab dokumen (*Retrieval-Augmented Generation*) menggunakan LCEL murni:

\`\`\`python
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Inisialisasi basis data pengetahuan mini
corpus = [
    "Peraturan Perusahaan Pasal 14: Jam kerja fleksibel dimulai antara pukul 08.00 hingga 10.00 WIB.",
    "Peraturan Perusahaan Pasal 15: Cuti tahunan berjumlah 14 hari kerja setelah masa kerja 1 tahun.",
    "Peraturan Perusahaan Pasal 16: Tunjangan internet bulanan sebesar Rp 500.000 untuk karyawan WFH."
]

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_texts(corpus, embedding=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

# Template instruksi LLM
template = """Jawab pertanyaan berikut hanya berdasarkan konteks yang disediakan:
Konteks:
{context}

Pertanyaan: {question}
Jawaban:"""

rag_prompt = ChatPromptTemplate.from_template(template)
llm = ChatOpenAI(model="gpt-4o-mini")

# Fungsi pembantu merapikan dokumen retriever
def format_docs(docs):
    return "\\n\\n".join(d.page_content for d in docs)

# RAG Chain LCEL
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | rag_prompt
    | llm
    | StrOutputParser()
)

response = rag_chain.invoke("Berapa tunjangan pulsa atau internet untuk karyawan remote?")
print("HASIL RAG:", response)
\`\`\`

### 4. Fitur Bawaan: Streaming Token & Pemanggilan Asynchronous
Keunggulan utama LCEL adalah Anda tidak perlu memodifikasi kode chain untuk menampilkan efek mengetik secara real-time:

\`\`\`python
import sys

print("Streaming jawaban: ", end="", flush=True)
for chunk in rag_chain.stream("Berapa lama masa cuti tahunan dan syaratnya?"):
    sys.stdout.write(chunk)
    sys.stdout.flush()
print()
\`\`\`

### 5. Debugging & Visualisasi Eksekusi Chain
Gunakan variabel lingkungan \`LANGCHAIN_TRACING_V2="true"\` dan sambungkan ke akun **LangSmith**. Setiap langkah dalam pipa LCEL Anda (durasi latensi, token input, respons mentah JSON) akan langsung terpeta rapi dalam diagram alur web yang mudah dianalisis.
`,
    en: {
      title: 'LangChain Expression Language (LCEL) Tutorial: Modern RAG Pipelines',
      description: 'Master the declarative pipe operator (|) in LCEL. Replace cumbersome legacy chain classes with modern functional runnables that natively support streaming, batching, and async execution.',
      content: `
### 1. Why Migrate to LCEL?
LCEL ([github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain)) transitions LangChain from opaque classes into composable, transparent Runnables connected via the Unix pipe (\`|\`) paradigm.

### 2. Anatomy of the Pipe Operator & Runnables
Compose prompt templates, model clients, and output parsers declaratively: \`chain = prompt | model | parser\`.

### 3. Full-Fledged RAG Pipeline with Vector Retrieval
Construct production RAG architectures using \`RunnablePassthrough\` and vector store retrievers without boilerplate wrappers.

### 4. Native Streaming & Asynchronous Primitives
Every LCEL chain natively exposes \`.stream()\`, \`.ainvoke()\`, and \`.batch()\` without code modifications.

### 5. Tracing with LangSmith
Set \`LANGCHAIN_TRACING_V2=true\` to visualize execution trees, latency bottlenecks, and token expenditure.
`
    }
  },
  {
    slug: 'cara-setup-vllm-ubuntu-server-inferensi-kilat',
    title: 'Cara Setup vLLM di Ubuntu Server: Inferensi Model LLM Berkecepatan Tinggi dengan PagedAttention',
    description: 'Panduan komprehensif menginstal dan mengonfigurasi vLLM di server GPU Ubuntu. Mengoptimalkan throughput token per detik hingga 10x lipat lebih tinggi dari HuggingFace standar menggunakan PagedAttention.',
    postType: 'tutorial',
    category: 'ai-infrastructure',
    categoryLabel: 'AI Infrastructure',
    difficulty: 'Lanjutan',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '10 min baca',
    author: 'Edvan',
    tags: ['vLLM', 'Linux', 'Ubuntu', 'GPU', 'NVIDIA', 'LLM Serving', 'PagedAttention'],
    affiliateProduct: {
      name: 'GPU Cloud Instance (NVIDIA RTX 4090 / A10G)',
      priceEstimate: 'Rp 650.000/bln',
      linkUrl: 'https://runpod.io',
      badge: 'Compute Pilihan',
      description: 'Server GPU siap pakai dengan driver CUDA 12.4 terkonfigurasi untuk vLLM.'
    },
    toc: [
      { id: 'kenapa-memilih-vllm', title: '1. Kenapa vLLM Jauh Lebih Cepat Dibanding Solusi Lain?' },
      { id: 'persiapan-server-ubuntu-cuda', title: '2. Persiapan Driver NVIDIA & CUDA Toolkit di Ubuntu' },
      { id: 'instalasi-vllm-python-env', title: '3. Instalasi vLLM dalam Virtual Environment' },
      { id: 'menjalankan-openai-compatible-server', title: '4. Menjalankan Server API OpenAI-Compatible' },
      { id: 'benchmarking-dan-tuning-memory', title: '5. Parameter Tuning: gpu-memory-utilization & max-model-len' }
    ],
    steps: [
      { id: 'step-1', label: 'Pastikan driver NVIDIA dan CUDA 12.1+ sudah aktif dengan perintah nvidia-smi' },
      { id: 'step-2', label: 'Instal vLLM menggunakan pip pada lingkungan virtual Python 3.10+' },
      { id: 'step-3', label: 'Jalankan vllm serve dengan model DeepSeek atau Llama 3' },
      { id: 'step-4', label: 'Kirim HTTP POST request ke endpoint /v1/chat/completions untuk validasi' }
    ],
    content: `
### 1. Kenapa vLLM Jauh Lebih Cepat Dibanding Solusi Lain?
Saat melayani banyak permintaan (*concurrency* tinggi) ke sebuah LLM, pemborosan memori terbesar terletak pada **KV Cache** (Key-Value cache dari layer attention).

Framework konvensional mengalokasikan memori KV cache secara statis berdasarkan panjang konteks maksimum teoritis, menyebabkan fragmentasi memori hingga 60-80%.

**vLLM** ([github.com/vllm-project/vllm](https://github.com/vllm-project/vllm)) memecahkan masalah ini dengan algoritma revolusioner bernama **PagedAttention** (terinspirasi dari virtual memory paging di sistem operasi Linux). Hasilnya:
* Fragmentasi memori mendekati 0%.
* Dukungan *continuous batching* otomatis.
* Throughput inferensi meningkat **5x hingga 10x lipat** dibandingkan Hugging Face Transformers biasa pada GPU yang sama.

### 2. Persiapan Driver NVIDIA & CUDA Toolkit di Ubuntu
Pastikan server Anda memiliki GPU diskret dengan VRAM minimal 16GB (seperti RTX 4090, A4000, A10G, atau A100). Verifikasi status GPU di terminal:

\`\`\`bash
nvidia-smi
\`\`\`

Pastikan versi CUDA yang didukung minimal **12.1** atau **12.4**. Perbarui repositori paket Ubuntu:

\`\`\`bash
sudo apt update && sudo apt install -y python3-pip python3-venv git
\`\`\`

### 3. Instalasi vLLM dalam Virtual Environment
Buat lingkungan virtual terpisah agar tidak merusak paket sistem:

\`\`\`bash
python3 -m venv vllm-env
source vllm-env/bin/activate
pip install --upgrade pip

# Instal paket vLLM pra-kompilasi CUDA
pip install vllm
\`\`\`

### 4. Menjalankan Server API OpenAI-Compatible
vLLM menyediakan server API bawaan yang 100% kompatibel dengan format endpoint OpenAI (\`/v1/chat/completions\`). Artinya, Anda bisa langsung menghubungkannya ke antarmuka chat seperti Open WebUI, Dify, atau Cline.

Jalankan perintah berikut untuk mengunduh dan menyajikan model Llama-3.1-8B-Instruct:

\`\`\`bash
python3 -m vllm.entrypoints.openai.api_server \\
    --model meta-llama/Llama-3.1-8B-Instruct \\
    --port 8000 \\
    --gpu-memory-utilization 0.90 \\
    --max-model-len 8192
\`\`\`

Jika menggunakan model terkuantisasi (AWQ / GPTQ) untuk menghemat VRAM:
\`\`\`bash
python3 -m vllm.entrypoints.openai.api_server \\
    --model casperhansen/llama-3.1-8b-instruct-awq \\
    --quantization awq \\
    --port 8000
\`\`\`

### 5. Parameter Tuning: gpu-memory-utilization & max-model-len
Untuk menghindari galat *Out Of Memory (OOM)* pada beban kerja produksi:
1. \`--gpu-memory-utilization 0.92\`: Memberikan 92% VRAM untuk model dan KV cache, menyisakan 8% untuk overhead komputasi CUDA.
2. \`--tensor-parallel-size 2\`: Jika Anda memiliki 2 unit GPU, flag ini akan memecah bobot model secara seimbang menggunakan NVLink/PCIe.
3. **Uji Endpoint dengan cURL**:

\`\`\`bash
curl http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "meta-llama/Llama-3.1-8B-Instruct",
    "messages": [
      {"role": "user", "content": "Jelaskan apa itu PagedAttention dalam 2 kalimat."}
    ],
    "temperature": 0.2
  }'
\`\`\`
`,
    en: {
      title: 'How to Setup vLLM on Ubuntu Server: High-Throughput Inference with PagedAttention',
      description: 'Comprehensive guide to configuring vLLM on GPU Linux machines. Achieve 10x higher token generation throughput with zero memory fragmentation using PagedAttention.',
      content: `
### 1. Why vLLM Dominates LLM Serving
vLLM ([github.com/vllm-project/vllm](https://github.com/vllm-project/vllm)) introduces PagedAttention, managing attention keys and values like virtual memory pages in operating systems.

### 2. NVIDIA Drivers & CUDA Verification
Ensure NVIDIA drivers and CUDA 12.1+ are operational via \`nvidia-smi\`.

### 3. Installing vLLM in Isolated Environments
Set up a clean virtual environment and install prebuilt CUDA wheels via \`pip install vllm\`.

### 4. Deploying OpenAI-Compatible Endpoints
Serve models with \`vllm.entrypoints.openai.api_server\` exposing \`/v1/chat/completions\` directly compatible with third-party web UIs.

### 5. Memory & Quantization Tuning
Tune \`--gpu-memory-utilization\` and configure multi-GPU tensor parallelism for rock-solid stability.
`
    }
  },
  {
    slug: 'tutorial-rag-multimodal-colpali-baca-grafik-pdf',
    title: 'Tutorial RAG Multimodal dengan ColPali: Tanya Jawab Dokumen PDF Kompleks Termasuk Grafik & Tabel',
    description: 'Tinggalkan OCR konvensional yang sering salah baca! Pelajari cara membangun sistem RAG berbasis vision multimodal menggunakan model ColPali untuk memahami dokumen laporan keuangan, diagram, dan tabel kompleks.',
    postType: 'tutorial',
    category: 'ai-rag',
    categoryLabel: 'AI & RAG',
    difficulty: 'Lanjutan',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '10 min baca',
    author: 'Edvan',
    tags: ['ColPali', 'Multimodal RAG', 'Vision AI', 'PDF Extraction', 'Python', 'Embeddings'],
    affiliateProduct: {
      name: 'High RAM Cloud Computing Instance',
      priceEstimate: 'Rp 450.000/bln',
      linkUrl: 'https://vast.ai',
      badge: 'Vision Power',
      description: 'Instance GPU VRAM 24GB untuk melakukan render dan indexing embedding gambar PDF resolusi tinggi.'
    },
    toc: [
      { id: 'masalah-ocr-pada-rag-biasa', title: '1. Kenapa OCR Biasa Selalu Gagal pada Dokumen Kompleks?' },
      { id: 'arsitektur-revolusioner-colpali', title: '2. Arsitektur ColPali: ColBERT Bertemu Vision Transformer' },
      { id: 'konversi-pdf-ke-embedding-gambar', title: '3. Konversi Lembar PDF Menjadi Vektor Multi-Vektor' },
      { id: 'querying-dan-late-interaction', title: '4. Eksekusi Query Menggunakan Late Interaction Scoring' },
      { id: 'sintesis-jawaban-dengan-vlm', title: '5. Mengirim Lembar Halaman Terpilih ke Vision LLM' }
    ],
    steps: [
      { id: 'step-1', label: 'Konversi file PDF menjadi rangkaian gambar JPEG/PNG per halaman' },
      { id: 'step-2', label: 'Instal colpali-engine dan muat model vidore/colpali-v1.2' },
      { id: 'step-3', label: 'Ekstrak multi-vector patch embeddings untuk setiap halaman dokumen' },
      { id: 'step-4', label: 'Lakukan pencarian kesamaan patch dan teruskan halaman terbaik ke Vision LLM' }
    ],
    content: `
### 1. Kenapa OCR Biasa Selalu Gagal pada Dokumen Kompleks?
Sistem RAG teks tradisional selalu mengandalkan konversi OCR (*Optical Character Recognition*) seperti Tesseract atau pdfplumber sebelum memecah dokumen menjadi chunks.

Pendekatan lama ini memiliki kelemahan fatal:
* **Tabel Kompleks Hancur**: Urutan kolom dan baris sering kali tertukar menjadi paragraf teks yang acak-acakan.
* **Grafik & Infografis Hilang**: Diagram batang, flowchart arsitektur, dan peta proses dilewati begitu saja karena tidak mengandung teks polos.
* **Konteks Spasial Lenyap**: Hubungan antara *caption* di bawah gambar dengan diagram di atasnya terputus saat teks di-ekstrak secara linear.

### 2. Arsitektur Revolusioner ColPali: ColBERT Bertemu Vision Transformer
**ColPali** ([github.com/illuin-tech/colpali](https://github.com/illuin-tech/colpali)) memperkenalkan paradigma baru: **Membaca dokumen seperti mata manusia membaca kertas**.

Dibangun di atas fondasi Vision-Language Model PaliGemma dan teknik pencocokan *Late Interaction* ColBERT:
* Dokumen tidak di-OCR menjadi teks. Setiap lembar halaman PDF diubah menjadi gambar utuh.
* Gambar dipecah menjadi ratusan patch visual kecil (16x16 piksel) yang masing-masing memiliki representasi vektor 128-dimensi.
* Saat pengguna bertanya, pertanyaan teks dicocokkan langsung ke patch visual (tabel, kurva grafik, atau header teks) dengan kecepatan tinggi.

### 3. Konversi Lembar PDF Menjadi Vektor Multi-Vektor
Pasang pustaka yang diperlukan:

\`\`\`bash
pip install colpali-engine pdf2image torch transformers pillow
\`\`\`

Gunakan skrip Python berikut untuk memproses lembar dokumen PDF:

\`\`\`python
import torch
from pdf2image import convert_from_path
from PIL import Image
from colpali_engine.models import ColPali, ColPaliProcessor

# 1. Muat model ColPali ke GPU
device = "cuda" if torch.cuda.is_available() else "cpu"
model_name = "vidore/colpali-v1.2"

model = ColPali.from_pretrained(model_name, torch_dtype=torch.bfloat16, device_map=device)
processor = ColPaliProcessor.from_pretrained(model_name)

# 2. Render lembar PDF ke list objek PIL Images
images = convert_from_path("laporan_keuangan_q3_2026.pdf")
print(f"Total halaman dokumen yang diproses: {len(images)}")

# 3. Hitung embedding multi-vektor untuk setiap halaman
dataloader = processor.process_images(images).to(device)
with torch.no_grad():
    image_embeddings = model(**dataloader)

print("Dimensi embedding per halaman:", image_embeddings.shape)
\`\`\`

### 4. Querying dan Late Interaction Scoring
Saat pertanyaan diajukan, ColPali melakukan perhitungan kesamaan maksimal (*MaxSim*) antara vektor kata pertanyaan dan vektor patch visual dokumen:

\`\`\`python
pertanyaan = "Berapa persen pertumbuhan laba bersih pada diagram kuartal ketiga?"

# Proses teks pertanyaan
query_input = processor.process_queries([pertanyaan]).to(device)
with torch.no_grad():
    query_embeddings = model(**query_input)

# Hitung skor kemiripan Late Interaction
scores = processor.score_multi_vector(query_embeddings, image_embeddings)
best_page_idx = torch.argmax(scores[0]).item()

print(f"Halaman paling relevan ditemukan pada: Halaman {best_page_idx + 1}")
\`\`\`

### 5. Sintesis Jawaban dengan VLM
Setelah ColPali menemukan nomor halaman yang tepat, kirimkan gambar lembar tersebut secara utuh ke model seperti **Gemini 2.5 Flash** atau **Claude 3.7 Sonnet**:

\`\`\`python
from google import genai

client = genai.Client()
target_image = images[best_page_idx]
target_image.save("selected_page.jpg")

with open("selected_page.jpg", "rb") as f:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            "Ekstrak angka pertumbuhan laba bersih dari diagram batang di halaman ini dan jelaskan secara rinci.",
            genai.types.Part.from_bytes(f.read(), mime_type="image/jpeg")
        ]
    )

print("Jawaban Eksekutif:\\n", response.text)
\`\`\`
`,
    en: {
      title: 'Multimodal RAG with ColPali: Querying Complex PDFs, Graphs, and Tables',
      description: 'Ditch flawed OCR parsers! Learn how to build vision-based multimodal RAG with ColPali to accurately parse financial charts, diagrams, and complex tabular documents.',
      content: `
### 1. The Fundamental Limits of Traditional OCR
Standard RAG frameworks decompose PDFs into textual chunks using OCR engines that frequently destroy tabular schemas and omit graphical insights.

### 2. The ColPali Architecture
ColPali ([github.com/illuin-tech/colpali](https://github.com/illuin-tech/colpali)) embeds document pages as collections of visual token vectors powered by PaliGemma and ColBERT late interaction.

### 3. Converting PDF Pages to Multi-Vector Representations
Utilize \`pdf2image\` and \`colpali_engine\` to ingest full-fidelity page renders directly into patch embedding matrices.

### 4. Querying via Late Interaction Scoring
Match query token embeddings against visual patches using MaxSim operators to identify target pages.

### 5. Answer Synthesis with Vision-Language Models
Feed the retrieved high-resolution page render directly into multimodal models (e.g. Gemini 2.5 Flash) for factual synthesis.
`
    }
  },
  {
    slug: 'bikin-bot-whatsapp-ai-baileys-groq-api-ngebut',
    title: 'Bikin Bot WhatsApp AI Super Cepat dengan Library Baileys & Groq Llama 3.3 API',
    description: 'Panduan merakit bot asisten WhatsApp pintar berbasis Node.js. Menghubungkan library soket Baileys dengan akselerator LPU Groq untuk menghasilkan balasan pesan cerdas dalam waktu di bawah 1 detik.',
    postType: 'tutorial',
    category: 'automation',
    categoryLabel: 'Automation',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['WhatsApp Bot', 'Baileys', 'Node.js', 'Groq', 'Llama 3', 'Automation'],
    affiliateProduct: {
      name: 'VPS Cloud 2 vCPU 4GB RAM',
      priceEstimate: 'Rp 89.000/bln',
      linkUrl: 'https://contabo.com',
      badge: 'Best Value Host',
      description: 'Server dengan uptime 99.9% untuk menjalankan koneksi socket WhatsApp 24 jam nonstop.'
    },
    toc: [
      { id: 'kenapa-baileys-dan-groq', title: '1. Kombinasi Maut: Baileys Tanpa Browser & Groq LPU' },
      { id: 'persiapan-proyek-nodejs', title: '2. Inisialisasi Proyek Node.js & Instalasi Dependensi' },
      { id: 'autentikasi-qr-multi-device', title: '3. Konfigurasi Autentikasi QR Code Multi-Device' },
      { id: 'integrasi-groq-cloud-sdk', title: '4. Menghubungkan Groq SDK untuk Balasan Super Cepat' },
      { id: 'menjaga-bot-tetap-hidup-pm2', title: '5. Menjalankan Bot Nonstop Menggunakan PM2' }
    ],
    steps: [
      { id: 'step-1', label: 'Inisialisasi proyek Node.js dan pasang @whiskeysockets/baileys serta groq-sdk' },
      { id: 'step-2', label: 'Tulis skrip listener event connection.update untuk menampilkan kode QR di terminal' },
      { id: 'step-3', label: 'Filter pesan masuk yang mengandung awalan perintah (misal: !tanya)' },
      { id: 'step-4', label: 'Kirim prompt ke model Llama 3.3 70B di Groq dan balas via sendMessage' }
    ],
    content: `
### 1. Kombinasi Maut: Baileys Tanpa Browser & Groq LPU
Membangun bot WhatsApp menggunakan Puppeteer atau browser automation sering memakan RAM hingga lebih dari 1.5 GB dan rawan terputus.

Solusi terbaik adalah menggunakan **Baileys** ([github.com/WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)), pustaka TypeScript murni yang berkomunikasi langsung dengan protokol WebSocket enkripsi WhatsApp Web tanpa membutuhkan browser Chromium sama sekali (hemat RAM di bawah 100 MB).

Dikombinasikan dengan **Groq API** ([groq.com](https://groq.com)) yang ditenagai chip LPU (*Language Processing Unit*), respons model Llama 3.3 70B dapat dikembalikan ke ponsel pengguna dengan kecepatan luar biasa: **di bawah 800 milidetik!**

### 2. Inisialisasi Proyek Node.js & Instalasi Dependensi
Buka terminal Anda dan siapkan direktori kerja:

\`\`\`bash
mkdir wa-ai-bot && cd wa-ai-bot
npm init -y
npm install @whiskeysockets/baileys qrcode-terminal groq-sdk dotenv pino
npm install -D tsx typescript @types/node
\`\`\`

Buat file \`.env\` untuk menyimpan kunci API Groq:
\`\`\`env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxx
\`\`\`

### 3. Autentikasi QR Code Multi-Device
Buat file \`index.ts\`. Skrip ini akan mengelola sesi login dan menyimpan kredensial ke folder \`auth_info_baileys\`:

\`\`\`typescript
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import Groq from 'groq-sdk';
import pino from 'pino';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function startWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_session');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("Silakan scan QR code berikut menggunakan aplikasi WhatsApp Anda:");
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Koneksi terputus. Menyambung ulang...', shouldReconnect);
      if (shouldReconnect) {
        startWhatsAppBot();
      }
    } else if (connection === 'open') {
      console.log('✅ Bot WhatsApp AI Berhasil Terhubung!');
    }
  });

  // Listener pesan masuk
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const senderJid = msg.key.remoteJid!;
    const messageText = 
      msg.message.conversation || 
      msg.message.extendedTextMessage?.text || '';

    // Deteksi jika pesan ditujukan ke bot
    if (messageText.toLowerCase().startsWith('!tanya ')) {
      const query = messageText.slice(7).trim();
      await sock.sendPresenceUpdate('composing', senderJid);

      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'Anda adalah asisten WhatsApp pribadi yang cerdas, ramah, dan ringkas. Berikan jawaban informatif dalam bahasa Indonesia dengan format rapi tanpa bertele-tele.'
            },
            { role: 'user', content: query }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.6
        });

        const replyText = chatCompletion.choices[0]?.message?.content || 'Maaf, gagal memproses jawaban.';
        await sock.sendMessage(senderJid, { text: replyText }, { quoted: msg });
      } catch (error: any) {
        console.error("Gagal memanggil Groq:", error);
        await sock.sendMessage(senderJid, { text: "Terjadi kesalahan saat memproses jawaban AI." });
      }
    }
  });
}

startWhatsAppBot();
\`\`\`

### 4. Integrasi Groq Cloud SDK
Pada kode di atas, model \`llama-3.3-70b-versatile\` digunakan karena menawarkan kemampuan penalaran setara GPT-4o namun dengan latensi token per detik yang sangat superior untuk interaksi chat instan di ponsel.

### 5. Menjalankan Bot Nonstop Menggunakan PM2
Agar bot tidak mati saat terminal Anda ditutup atau server restart:

\`\`\`bash
# Instal PM2 secara global
npm install -g pm2

# Jalankan bot sebagai background daemon
pm2 start "npx tsx index.ts" --name wa-ai-bot
pm2 save
pm2 startup
\`\`\`

Sekarang Anda memiliki asisten AI pribadi di kantong Anda 24/7 yang siap merespons setiap pertanyaan dalam sekejap mata!
`,
    en: {
      title: 'Build Ultra-Fast AI WhatsApp Bots with Baileys & Groq LPU',
      description: 'Step-by-step guide to building a lightweight Node.js WhatsApp AI assistant using Baileys socket library and Groq Llama 3.3 API for sub-second smart replies.',
      content: `
### 1. Why Baileys and Groq Outperform Browsers
Baileys ([github.com/WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)) communicates directly through WhatsApp Web WebSockets without heavy Chromium dependencies, while Groq LPU infrastructure yields near-instant responses.

### 2. Node.js Project Setup
Initialize project and install dependencies:
\`\`\`bash
npm install @whiskeysockets/baileys qrcode-terminal groq-sdk dotenv pino
\`\`\`

### 3. QR Authentication & Multi-Device Sessions
Configure \`useMultiFileAuthState\` to serialize sessions securely on disk and listen to socket events.

### 4. Hooking Groq Llama 3.3 70B
Intercept inbound messages matching \`!tanya\`, trigger typing status indicators, and query Groq with concise system instructions.

### 5. Production Daemonization via PM2
Daemonize using PM2 to maintain persistent socket reconnection and high availability.
`
    }
  },
  {
    slug: 'cara-bikin-ai-coding-assistant-neovim-avante',
    title: 'Cara Setup AI Coding Assistant di Neovim Menggunakan Avante.nvim (Alternatif Cursor di Terminal)',
    description: 'Ubah editor Neovim Anda menjadi IDE AI canggih layaknya Cursor. Pelajari cara memasang avante.nvim, mengonfigurasi model Anthropic Claude / DeepSeek, dan melakukan inline code refactoring langsung di terminal.',
    postType: 'tutorial',
    category: 'developer-tools',
    categoryLabel: 'Dev Tools',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '8 min baca',
    author: 'Edvan',
    tags: ['Neovim', 'Avante.nvim', 'Lua', 'Terminal', 'AI Assistant', 'Productivity'],
    affiliateProduct: {
      name: 'Mechanical Ergonomic Keyboard',
      priceEstimate: 'Rp 1.250.000',
      linkUrl: 'https://keychron.com',
      badge: 'Hardware Pilihan',
      description: 'Keyboard split mekanik untuk kecepatan navigasi Neovim dan produktivitas coding maksimal.'
    },
    toc: [
      { id: 'mengenal-avante-nvim', title: '1. Mengenal Avante.nvim: Sensasi Cursor di Editor Terminal' },
      { id: 'prasyarat-dan-dependensi-sistem', title: '2. Prasyarat Sistem & Dependensi Neovim' },
      { id: 'instalasi-via-lazy-nvim', title: '3. Konfigurasi Instalasi Menggunakan Lazy.nvim' },
      { id: 'shortcut-dan-alur-kerja-harian', title: '4. Shortcut Penting & Alur Kerja Refactoring' },
      { id: 'koneksi-ke-deepseek-atau-ollama', title: '5. Mengganti Provider ke DeepSeek R1 atau Ollama Lokal' }
    ],
    steps: [
      { id: 'step-1', label: 'Pastikan Neovim versi 0.10+ sudah terpasang dengan Rust toolchain' },
      { id: 'step-2', label: 'Tambahkan avante.nvim ke file plugins/avante.lua pada Lazy.nvim' },
      { id: 'step-3', label: 'Ekspor variabel lingkungan ANTHROPIC_API_KEY atau DEEPSEEK_API_KEY' },
      { id: 'step-4', label: 'Buka Neovim dan gunakan shortcut <leader>aa untuk membuka panel AI chat' }
    ],
    content: `
### 1. Mengenal Avante.nvim: Sensasi Cursor di Editor Terminal
Cursor IDE telah mengubah cara developer menulis kode melalui fitur interaktif *AI sidebar*, *in-line editing*, dan *smart diff review*. Namun bagi pengguna setia terminal dan Neovim, berpindah ke editor berbasis Electron terasa berat dan kehilangan fleksibilitas modal editing.

**avante.nvim** ([github.com/yetone/avante.nvim](https://github.com/yetone/avante.nvim)) hadir untuk mengisi celah tersebut. Plugin ini meniru seluruh workflow terbaik Cursor langsung di dalam buffer Neovim Anda:
* Panel AI interaktif di sisi samping buffer dengan riwayat multi-turn.
* Kemampuan refactor in-line (*Fast Apply Diff*) langsung di blok kode aktif.
* Dukungan multi-provider: Claude 3.7 Sonnet, OpenAI, DeepSeek, maupun Ollama lokal.

### 2. Prasyarat Sistem & Dependensi Neovim
Pastikan Anda memiliki:
1. **Neovim 0.10.0** atau yang lebih baru.
2. Compiler **Rust & Cargo** (karena avante menggunakan modul parsing native berkecepatan tinggi).
3. Pustaka \`ripgrep\` dan \`curl\` terpasang di sistem operasi Anda.

### 3. Konfigurasi Instalasi Menggunakan Lazy.nvim
Tambahkan konfigurasi plugin ke file \`lua/plugins/avante.lua\`:

\`\`\`lua
return {
  "yetone/avante.nvim",
  event = "VeryLazy",
  lazy = false,
  version = false, -- Gunakan rilis git terbaru
  opts = {
    provider = "claude",
    claude = {
      endpoint = "https://api.anthropic.com",
      model = "claude-3-7-sonnet-20250219",
      temperature = 0,
      max_tokens = 4096,
    },
    behaviour = {
      auto_suggestions = false, -- Set true jika ingin ghost-text inline
      auto_set_highlight_group = true,
      auto_set_keymaps = true,
      auto_apply_diff_after_generation = false,
      support_paste_from_clipboard = true,
    },
    mappings = {
      diff = {
        ours = "co",
        theirs = "ct",
        all_theirs = "ca",
        both = "cb",
        cursor = "cc",
        next = "]x",
        prev = "[x",
      },
      suggestion = {
        accept = "<M-l>",
        next = "<M-]>",
        prev = "<M-[>",
        dismiss = "<C-]>",
      },
      jump = {
        next = "]]",
        prev = "[[",
      },
      submit = {
        normal = "<CR>",
        insert = "<C-s>",
      },
    },
  },
  build = "make",
  dependencies = {
    "stevearc/dressing.nvim",
    "nvim-lua/plenary.nvim",
    "MunifTanjim/nui.nvim",
    "hrsh7th/nvim-cmp",
    "nvim-tree/nvim-web-devicons",
    {
      "HakonHarnes/img-clip.nvim",
      event = "VeryLazy",
      opts = {
        default = {
          embed_image_as_base64 = false,
          prompt_for_file_name = false,
          drag_and_drop = { insert_mode = true },
        },
      },
    },
  },
}
\`\`\`

### 4. Shortcut Penting & Alur Kerja Refactoring
Setelah plugin terpasang, buka proyek coding Anda di Neovim:

* \`<leader>aa\` (*Avante Ask*): Membuka sidebar chat AI di sebelah kanan editor.
* \`<leader>ar\` (*Avante Refresh*): Memuat ulang konteks jendela buffer aktif.
* \`<leader>ae\` (*Avante Edit*): Sorot blok kode dalam mode visual (\`v\`), lalu tekan shortcut ini untuk meminta AI mengubah logika fungsi secara in-place.
* **Diff Resolution**: Saat AI menyarankan perubahan kode, avante akan menampilkan jendela diff split. Tekan \`co\` untuk memilih versi Anda (*ours*) atau \`ct\` untuk menyetujui versi AI (*theirs*).

### 5. Mengganti Provider ke DeepSeek R1 atau Ollama Lokal
Jika ingin menggunakan model yang lebih hemat biaya atau berjalan 100% offline tanpa internet, sesuaikan blok konfigurasi:

\`\`\`lua
opts = {
  provider = "deepseek",
  vendors = {
    deepseek = {
      __inherited_from = "openai",
      api_key_name = "DEEPSEEK_API_KEY",
      endpoint = "https://api.deepseek.com",
      model = "deepseek-coder",
    },
  },
}
\`\`\`
`,
    en: {
      title: 'Setup AI Coding Assistant in Neovim with Avante.nvim (Cursor Alternative for Terminal)',
      description: 'Transform Neovim into a modern AI development environment. Install avante.nvim, connect Claude 3.7 or DeepSeek models, and streamline in-line code edits inside your terminal.',
      content: `
### 1. What is Avante.nvim?
avante.nvim ([github.com/yetone/avante.nvim](https://github.com/yetone/avante.nvim)) emulates Cursor IDE behavior directly within modal terminal Neovim.

### 2. System Prerequisites
Requires Neovim 0.10+, standard Rust compilation tools, \`ripgrep\`, and \`curl\`.

### 3. Installation via Lazy.nvim
Add the plugin spec to your Lua configuration with keybindings for diff selection and prompt dispatch.

### 4. Daily Refactoring Workflows
Leverage \`<leader>aa\` for persistent conversations and \`<leader>ae\` for targeted visual selection modifications.

### 5. Configuring DeepSeek or Local Ollama Endpoints
Swap upstream providers to DeepSeek or self-hosted Ollama endpoints effortlessly.
`
    }
  },
  {
    slug: 'tutorial-local-search-engine-searxng-crawl4ai',
    title: 'Tutorial Membangun Mesin Pencari Lokal Privat Menggunakan SearXNG & Crawl4AI untuk Agen AI',
    description: 'Panduan membangun infrastruktur pencarian dan ekstraksi web mandiri. Menghubungkan metasearch SearXNG dengan crawler cerdas Crawl4AI untuk memberikan kemampuan web-search tanpa biaya API pihak ketiga.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['SearXNG', 'Crawl4AI', 'Docker', 'Web Scraping', 'AI Agents', 'Python'],
    affiliateProduct: {
      name: 'VPS KVM Dedicated IPv4',
      priceEstimate: 'Rp 120.000/bln',
      linkUrl: 'https://ovhcloud.com',
      badge: 'Unmetered Traffic',
      description: 'Bandwidth tanpa batas untuk menjalankan scraping web ribuan halaman setiap hari.'
    },
    toc: [
      { id: 'kenapa-membutuhkan-search-engine-sendiri', title: '1. Kenapa Agen AI Membutuhkan Mesin Pencari Lokal?' },
      { id: 'deploy-searxng-docker-compose', title: '2. Deploy SearXNG Menggunakan Docker Compose' },
      { id: 'instalasi-crawl4ai-markdown', title: '3. Instalasi Crawl4AI: Scraper Web Khusus LLM' },
      { id: 'menggabungkan-pencarian-dan-ekstraksi', title: '4. Membangun Skrip Integrasi Python Search-and-Crawl' },
      { id: 'menjadikan-tool-untuk-crewai-langchain', title: '5. Mendaftarkan Hasil sebagai Tool untuk CrewAI / LangChain' }
    ],
    steps: [
      { id: 'step-1', label: 'Buat file docker-compose.yml untuk menjalankan kontainer SearXNG dan Redis' },
      { id: 'step-2', label: 'Aktifkan format keluaran JSON pada konfigurasi settings.yml SearXNG' },
      { id: 'step-3', label: 'Instal pustaka crawl4ai dan lakukan setup browser Playwright' },
      { id: 'step-4', label: 'Tulis skrip Python yang mencari tautan via SearXNG lalu mengekstrak markdown via Crawl4AI' }
    ],
    content: `
### 1. Kenapa Agen AI Membutuhkan Mesin Pencari Lokal?
Sebagian besar framework agen AI bergantung pada API pencarian komersial seperti Tavily, SerpAPI, atau Brave Search. Meskipun andal, layanan ini mengenakan biaya per panggilan API yang bisa sangat membengkak saat agen melakukan loop pencarian intensif.

Dengan menggabungkan:
1. **SearXNG** ([github.com/searxng/searxng](https://github.com/searxng/searxng)): Mesin metasearch sumber terbuka yang mengagregasi puluhan mesin pencari (Google, Bing, DuckDuckGo) tanpa melacak privasi.
2. **Crawl4AI** ([github.com/unclecode/crawl4ai](https://github.com/unclecode/crawl4ai)): Crawler web super cepat berbasis Playwright yang secara khusus mengekstrak konten artikel menjadi format Markdown bersih yang hemat token untuk LLM.

Anda mendapatkan infrastruktur riset web tanpa batas biaya untuk pasukan agen AI Anda!

### 2. Deploy SearXNG Menggunakan Docker Compose
Buat folder \`local-search\` dan siapkan file \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'

services:
  searxng:
    image: docker.io/searxng/searxng:latest
    container_name: searxng
    ports:
      - "8888:8080"
    volumes:
      - ./searxng:/etc/searxng:rw
    environment:
      - SEARXNG_BASE_URL=http://localhost:8888/
    restart: unless-stopped
\`\`\`

Pastikan pada file konfigurasi \`searxng/settings.yml\` Anda mengaktifkan format JSON pada bagian format pencarian:
\`\`\`yaml
search:
  formats:
    - html
    - json
\`\`\`

Jalankan kontainer:
\`\`\`bash
docker compose up -d
\`\`\`

### 3. Instalasi Crawl4AI: Scraper Web Khusus LLM
Buka terminal dan instal paket Python Crawl4AI:

\`\`\`bash
pip install crawl4ai
crawl4ai-setup # Mengunduh browser engine Chromium otomatis
\`\`\`

### 4. Membangun Skrip Integrasi Python Search-and-Crawl
Buat skrip \`ai_web_researcher.py\`:

\`\`\`python
import asyncio
import httpx
from crawl4ai import AsyncWebCrawler

async def search_searxng(query: str, max_results: int = 3):
    url = "http://localhost:8888/search"
    params = {"q": query, "format": "json"}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
        results = data.get("results", [])[:max_results]
        return [r["url"] for r in results if "url" in r]

async def research_topic(query: str):
    print(f"Mencari informasi tentang: {query}...")
    urls = await search_searxng(query)
    print(f"Menemukan {len(urls)} tautan relevan: {urls}")

    async with AsyncWebCrawler() as crawler:
        for idx, target_url in enumerate(urls, 1):
            print(f"\\nMengikis URL [{idx}]: {target_url}")
            result = await crawler.arun(url=target_url)
            
            # Ambil markdown bersih yang ramah LLM
            clean_markdown = result.markdown
            print(f"Berhasil mengekstrak {len(clean_markdown)} karakter markdown.")
            print(clean_markdown[:400] + "\\n--- [DIPOTONG] ---\\n")

if __name__ == "__main__":
    asyncio.run(research_topic("Perkembangan chip neuromorfik AI tahun 2026"))
\`\`\`

### 5. Menjadikan Tool untuk CrewAI / LangChain
Anda cukup membungkus fungsi \`search_and_crawl\` di atas menggunakan dekorator \`@tool\` milik LangChain atau CrewAI. Agen Anda kini dapat menjelajahi web secara otonom, membaca dokumentasi teknis, dan membuat laporan komprehensif tanpa pernah kehabisan kuota API berbayar.
`,
    en: {
      title: 'Build a Self-Hosted Private Search Engine with SearXNG & Crawl4AI for AI Agents',
      description: 'Build cost-free local web search infrastructure. Combine SearXNG metasearch with Crawl4AI token-optimized markdown extraction to give AI agents unlimited web research autonomy.',
      content: `
### 1. The Value of Self-Hosted Agent Search
Commercial search APIs incur steep token and request fees during iterative agentic workflows. Combining SearXNG and Crawl4AI delivers unlimited, privacy-preserving web discovery.

### 2. Deploying SearXNG via Docker Compose
Spin up the SearXNG metasearch container with JSON API output enabled in \`settings.yml\`.

### 3. Installing Crawl4AI for Token-Optimized Markdown
Install \`crawl4ai\` and execute browser prerequisites to ingest dynamic pages into clean markdown.

### 4. Search and Crawl Orchestration
Write asynchronous routines querying SearXNG endpoints followed by immediate multi-URL extraction.

### 5. Packaging as Agent Tools
Expose the combined pipeline as modular tool functions for LangChain, AutoGen, or CrewAI agents.
`
    }
  },
  {
    slug: 'convert-model-huggingface-ke-gguf-llamacpp',
    title: 'Panduan Konversi Bobot Model Hugging Face ke Format GGUF dan Kuantisasi Menggunakan llama.cpp',
    description: 'Pelajari cara mengubah checkpoint model safetensors dari Hugging Face menjadi file GGUF terkuantisasi (Q4_K_M, Q8_0) agar dapat dijalankan dengan cepat dan hemat RAM di Ollama atau llama.cpp.',
    postType: 'tutorial',
    category: 'ai-infrastructure',
    categoryLabel: 'AI Infrastructure',
    difficulty: 'Lanjutan',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '10 min baca',
    author: 'Edvan',
    tags: ['GGUF', 'llama.cpp', 'Quantization', 'Hugging Face', 'Ollama', 'Machine Learning'],
    affiliateProduct: {
      name: 'NVMe Gen4 SSD 2TB High Speed',
      priceEstimate: 'Rp 2.100.000',
      linkUrl: 'https://samsung.com',
      badge: 'Storage Cepat',
      description: 'Kecepatan baca 7000MB/s untuk memproses pembacaan dan konversi model LLM puluhan Gigabyte.'
    },
    toc: [
      { id: 'apa-itu-format-gguf', title: '1. Apa Itu Format GGUF dan Manfaat Kuantisasi?' },
      { id: 'persiapan-dan-kompilasi-llamacpp', title: '2. Kloning & Kompilasi llama.cpp di Komputer Anda' },
      { id: 'download-checkpoint-huggingface', title: '3. Mengunduh Bobot Model Asli (Safetensors / FP16)' },
      { id: 'konversi-python-ke-gguf-fp16', title: '4. Menjalankan Skrip convert_hf_to_gguf.py' },
      { id: 'kuantisasi-dan-impor-ke-ollama', title: '5. Melakukan Kuantisasi Q4_K_M & Impor ke Ollama' }
    ],
    steps: [
      { id: 'step-1', label: 'Kloning repositori ggerganov/llama.cpp dan kompilasi menggunakan CMake atau make' },
      { id: 'step-2', label: 'Unduh bobot model dari Hugging Face menggunakan huggingface-cli' },
      { id: 'step-3', label: 'Jalankan python convert_hf_to_gguf.py untuk membuat file GGUF FP16 awal' },
      { id: 'step-4', label: 'Gunakan binary llama-quantize untuk mengompresi bobot ke format Q4_K_M' }
    ],
    content: `
### 1. Apa Itu Format GGUF dan Manfaat Kuantisasi?
Format file **GGUF** (*GPT-Generated Unified Format*) yang diperkenalkan oleh Georgi Gerganov adalah standar biner modern untuk menyimpan bobot model bahasa besar. Format ini memadukan seluruh metadata tokenizer, parameter arsitektur, dan tensor bobot dalam satu file tunggal yang mendukung pemetaan memori kilat (*mmap*).

Kuantisasi adalah proses matematis mengurangi presisi angka bobot dari 16-bit (*FP16*) menjadi 4-bit atau 8-bit:
* **Ukuran File Turun 70%**: Model 8B yang tadinya berukuran 16 GB susut menjadi hanya ~4.9 GB.
* **Kebutuhan RAM Rendah**: Dapat dijalankan di laptop MacBook Air atau laptop gaming biasa tanpa GPU server mahal.
* **Penurunan Kualitas Minimal**: Menggunakan metode kuantisasi modern k-quants (\`Q4_K_M\` atau \`Q5_K_M\`), degradasi skor penalaran (perplexity) sangat kecil (di bawah 1%).

### 2. Kloning & Kompilasi llama.cpp di Komputer Anda
Kloning repositori resmi llama.cpp ([github.com/ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp)):

\`\`\`bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# Kompilasi binary menggunakan CMake (dengan akselerasi CUDA jika ada GPU)
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release -j
\`\`\`

Siapkan lingkungan Python untuk skrip konversi:
\`\`\`bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements/requirements-convert_hf_to_gguf.txt
\`\`\`

### 3. Mengunduh Bobot Model Asli (Safetensors / FP16)
Instal CLI resmi Hugging Face untuk mengunduh model target:

\`\`\`bash
pip install huggingface_hub
huggingface-cli download Qwen/Qwen2.5-7B-Instruct --local-dir ./models/Qwen2.5-7B-Instruct
\`\`\`

### 4. Konversi Python ke GGUF FP16
Jalankan skrip konversi bawaan llama.cpp untuk menyatukan tokenizer dan file safetensors menjadi GGUF mentah presisi 16-bit:

\`\`\`bash
python convert_hf_to_gguf.py ./models/Qwen2.5-7B-Instruct \\
    --outfile ./models/qwen2.5-7b-fp16.gguf \\
    --outtype f16
\`\`\`

Setelah proses selesai, Anda akan memiliki satu file \`qwen2.5-7b-fp16.gguf\` berukuran sekitar 14.5 GB.

### 5. Kuantisasi Q4_K_M & Impor ke Ollama
Gunakan utilitas biner \`llama-quantize\` hasil kompilasi untuk memampatkan model ke format \`Q4_K_M\` (keseimbangan terbaik antara akurasi dan efisiensi memori):

\`\`\`bash
./build/bin/llama-quantize ./models/qwen2.5-7b-fp16.gguf ./models/qwen2.5-7b-q4_k_m.gguf Q4_K_M
\`\`\`

File akhir kini hanya berukuran **~4.7 GB**!

Untuk menjalankan model ini di **Ollama**, buat file teks bernama \`Modelfile\`:
\`\`\`dockerfile
FROM ./models/qwen2.5-7b-q4_k_m.gguf
PARAMETER temperature 0.7
PARAMETER top_p 0.9
\`\`\`

Buat dan jalankan model di Ollama:
\`\`\`bash
ollama create my-custom-qwen -f Modelfile
ollama run my-custom-qwen
\`\`\`
`,
    en: {
      title: 'Converting Hugging Face Models to GGUF and Quantizing with llama.cpp',
      description: 'Learn how to transform Hugging Face safetensors model checkpoints into quantized GGUF binaries (Q4_K_M, Q8_0) for blistering performance on consumer hardware via Ollama or llama.cpp.',
      content: `
### 1. Understanding GGUF & Modern Quantization
GGUF is a single-file binary standard designed by Georgi Gerganov facilitating high-speed \`mmap\` loading and 4-bit k-quants compression with negligible perplexity degradation.

### 2. Building llama.cpp from Source
Clone the repository and compile native binaries with CUDA or Metal hardware acceleration via CMake.

### 3. Acquiring Hugging Face Safetensors Weights
Download target checkpoints using the official \`huggingface-cli\` utility.

### 4. Running the Conversion Script
Execute \`convert_hf_to_gguf.py\` to serialize tokenizer metadata and tensor layouts into an unquantized FP16 GGUF file.

### 5. Quantizing to Q4_K_M & Packaging for Ollama
Invoke \`llama-quantize\` with \`Q4_K_M\` quantization flags and expose the compiled artifact to Ollama via a concise \`Modelfile\`.
`
    }
  },
  {
    slug: 'tutorial-voice-clone-ai-f5-tts-indonesia',
    title: 'Tutorial Kloning Suara AI Bahasa Indonesia Menggunakan F5-TTS Open Source Tanpa Biaya',
    description: 'Panduan lengkap mereplikasi karakter suara Anda sendiri secara natural menggunakan F5-TTS non-autoregressive flow matching. Menghasilkan voice-over berkualitas tinggi dengan intonasi fasih berbahasa Indonesia.',
    postType: 'tutorial',
    category: 'audio-ai',
    categoryLabel: 'Audio AI',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['F5-TTS', 'Voice Cloning', 'Audio AI', 'TTS', 'Python', 'Open Source'],
    affiliateProduct: {
      name: 'USB Condenser Microphone Studio',
      priceEstimate: 'Rp 650.000',
      linkUrl: 'https://fifinestore.com',
      badge: 'Audio Jernih',
      description: 'Mikrofon kondenser dengan noise floor rendah untuk merekam sampel audio referensi berkualitas.'
    },
    toc: [
      { id: 'keunggulan-arsitektur-f5-tts', title: '1. Keunggulan F5-TTS Dibanding Model Kloning Lain' },
      { id: 'persiapan-rekaman-audio-sampel', title: '2. Standar Rekaman Sampel Suara Referensi (10 Detik)' },
      { id: 'instalasi-f5-tts-environment', title: '3. Instalasi Lingkungan Python & Model Checkpoint' },
      { id: 'menjalankan-inferensi-voice-clone', title: '4. Menjalankan Kode Inferensi Kloning Teks ke Suara' },
      { id: 'optimasi-intonasi-bahasa-indonesia', title: '5. Tips Menghasilkan Artikulasi dan Emosi Alami' }
    ],
    steps: [
      { id: 'step-1', label: 'Rekam 1 sampel audio suara Anda berdurasi 8-12 detik dengan artikulasi jelas' },
      { id: 'step-2', label: 'Instal paket f5-tts dan torch pada lingkungan GPU NVIDIA' },
      { id: 'step-3', label: 'Tulis transkrip teks yang persis sama dengan isi rekaman sampel referensi' },
      { id: 'step-4', label: 'Jalankan modul inferensi untuk menghasilkan file audio WAV baru' }
    ],
    content: `
### 1. Keunggulan F5-TTS Dibanding Model Kloning Lain
Layanan voice clone komersial seperti ElevenLabs membebankan biaya langganan bulanan mahal. Sementara itu, model open-source lama seperti Bark atau XTTS sering menghasilkan suara robotik dan artifak desis yang kentara.

**F5-TTS** ([github.com/SWivid/F5-TTS](https://github.com/SWivid/F5-TTS)) merevolusi dunia sintesis suara AI menggunakan arsitektur **Non-Autoregressive Flow Matching** yang dipadukan dengan modul ConvNeXt. Kelebihannya:
* **Zero-Shot Cloning**: Hanya membutuhkan **5 hingga 10 detik** sampel suara referensi bersih.
* **Kecepatan Inferensi Tinggi**: Karena bukan autoregressive, proses pembangkitan audio jauh lebih cepat daripada durasi audio riil (RTF < 0.15 di GPU RTX 4080).
* **Ekspresif**: Mampu meniru jeda nafas, intonasi santai, dan gaya bicara alami tanpa terdengar kaku.

### 2. Standar Rekaman Sampel Suara Referensi (10 Detik)
Kunci keberhasilan kloning suara terletak pada kualitas file referensi:
1. Rekam suara Anda di ruangan yang hening tanpa gema (*reverb*).
2. Durasi ideal: antara **7 hingga 12 detik**.
3. Simpan file dalam format WAV 24-bit atau 16-bit dengan sample rate 24.000 Hz / 44.100 Hz.
4. Catat teks yang Anda ucapkan persis kata-per-kata (misal: *"Halo teman-teman, hari ini kita akan belajar teknologi AI terbaru bersama EnInformasi."*).

### 3. Instalasi Lingkungan Python & Model Checkpoint
Pasang F5-TTS di komputer dengan GPU NVIDIA (minimal 6GB VRAM):

\`\`\`bash
# Buat virtual environment
python -m venv f5tts-env
source f5tts-env/bin/activate # Di Windows: .\\f5tts-env\\Scripts\\activate

# Instal dependensi
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install f5-tts soundfile
\`\`\`

### 4. Menjalankan Kode Inferensi Kloning Teks ke Suara
Buat file Python bernama \`clone_voice.py\`:

\`\`\`python
from f5_tts.api import F5TTS

# Inisialisasi model F5-TTS
tts = F5TTS(model_type="F5-TTS")

# Tentukan file audio referensi dan teks transkrip aslinya
ref_audio_file = "sampel_suara_saya.wav"
ref_text = "Halo teman-teman, hari ini kita akan belajar teknologi AI terbaru bersama EnInformasi."

# Teks baru berbahasa Indonesia yang ingin diucapkan oleh suara Anda
target_text = (
    "Selamat datang di era komputasi masa depan. "
    "Dengan model open source ini, kita bisa menciptakan podcast, "
    "voice over tutorial, dan asisten virtual cerdas tanpa biaya lisensi!"
)

print("Sedang memproses sintesis suara...")
output_wav_path = "hasil_suara_kloning.wav"

# Eksekusi inferensi
tts.infer(
    ref_file=ref_audio_file,
    ref_text=ref_text,
    gen_text=target_text,
    file_wave=output_wav_path
)

print(f"✅ Berhasil! File audio tersimpan di: {output_wav_path}")
\`\`\`

Jalankan skrip:
\`\`\`bash
python clone_voice.py
\`\`\`

### 5. Tips Menghasilkan Artikulasi dan Emosi Alami
* **Gunakan Tanda Baca yang Tepat**: Berikan tanda koma (\`,\`) untuk memberikan jeda nafas halus, dan tanda titik (\`.\`) untuk penurunan nada alami di akhir kalimat.
* **Transkrip Referensi Harus Akurat**: Jika pada audio sampel ada desahan nafas atau kata cadel, jangan hilangkan dari teks referensi agar model tidak mengalami pergeseran alignment waktu.
`,
    en: {
      title: 'Zero-Cost Indonesian Voice Cloning Tutorial Using Open-Source F5-TTS',
      description: 'Comprehensive guide to cloning your unique voice tone using F5-TTS non-autoregressive flow matching. Produce natural Indonesian voice-overs with lifelike cadence and emotion.',
      content: `
### 1. Why F5-TTS Outperforms Legacy TTS
F5-TTS ([github.com/SWivid/F5-TTS](https://github.com/SWivid/F5-TTS)) utilizes non-autoregressive flow matching with ConvNeXt backbones, generating studio-grade voice replicas from just 5 to 10 seconds of reference audio.

### 2. Audio Reference Preparation
Capture clean, uncompressed WAV samples in noise-free environments and record the verbatim transcript accurately.

### 3. Installing F5-TTS Environment
Provision a virtual environment with PyTorch CUDA wheels and install \`f5-tts\`.

### 4. Zero-Shot Inference Scripting
Instantiate \`F5TTS\` and synthesize novel Indonesian narrative paragraphs matched against reference audio features.

### 5. Expression & Cadence Tuning
Leverage punctuation cues and exact phoneme alignment to ensure authentic inflection and natural breathing cadence.
`
    }
  },
  {
    slug: 'deploy-n8n-cloudflare-tunnels-gratis-aman',
    title: 'Cara Deploy n8n Workflow Automation Menggunakan Cloudflare Tunnels (Akses Publik Aman Tanpa Port Forwarding)',
    description: 'Panduan lengkap memasang n8n workflow automation secara mandiri di server lokal atau VPS. Menggunakan Cloudflare Zero Trust Tunnels untuk akses HTTPS publik yang aman tanpa membuka port router.',
    postType: 'tutorial',
    category: 'automation',
    categoryLabel: 'Automation',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['n8n', 'Cloudflare Tunnels', 'Docker', 'Automation', 'Self-Hosted', 'DevOps'],
    affiliateProduct: {
      name: 'Mini PC Server Rumahan (Intel N100 16GB RAM)',
      priceEstimate: 'Rp 2.450.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Home Server',
      description: 'Komputer mini hemat daya (6 Watt) untuk menyalakan n8n dan server lokal 24/7 di rumah.'
    },
    toc: [
      { id: 'kenapa-memilih-n8n-selfhosted', title: '1. Kenapa Memilih n8n Self-Hosted Dibanding Zapier?' },
      { id: 'keunggulan-cloudflare-zero-trust-tunnels', title: '2. Keunggulan Cloudflare Tunnels Tanpa Port Forwarding' },
      { id: 'konfigurasi-docker-compose-n8n', title: '3. Konfigurasi Docker Compose untuk n8n' },
      { id: 'menghubungkan-cloudflared-tunnel', title: '4. Menghubungkan Tunnel ke Domain Pribadi Anda' },
      { id: 'menguji-webhook-dan-keamanan', title: '5. Menguji Webhook Masuk & Mencegah Akses Ilegal' }
    ],
    steps: [
      { id: 'step-1', label: 'Daftarkan domain Anda ke Cloudflare DNS secara gratis' },
      { id: 'step-2', label: 'Buat Cloudflare Tunnel baru di dashboard Zero Trust dan salin token tunnel' },
      { id: 'step-3', label: 'Tulis file docker-compose.yml menggabungkan n8n dan kontainer cloudflared' },
      { id: 'step-4', label: 'Jalankan kontainer dan buka domain n8n Anda via koneksi HTTPS terenkripsi' }
    ],
    content: `
### 1. Kenapa Memilih n8n Self-Hosted Dibanding Zapier?
Layanan otomatisasi cloud seperti Zapier atau Make membatasi jumlah eksekusi tugas (*task*) secara agresif. Untuk kebutuhan alur kerja bisnis yang intensif (seperti memproses ribuan data webhook, sinkronisasi inventaris e-commerce, atau parsing email otomatis), biayanya bisa mencapai jutaan rupiah per bulan.

**n8n** ([github.com/n8n-io/n8n](https://github.com/n8n-io/n8n)) adalah platform otomatisasi alur kerja open-source yang dapat Anda pasang secara mandiri (*self-hosted*):
* **Tanpa Batas Tugas**: Jalankan jutaan workflow tanpa biaya per-task.
* **Privasi Data Terjaga**: Data kredensial dan API key tersimpan di server Anda sendiri.
* **Dukungan AI Native**: Node agen AI bawaan untuk menghubungkan model OpenAI, Anthropic, dan vector store lokal.

### 2. Keunggulan Cloudflare Tunnels Tanpa Port Forwarding
Tantangan terbesar menjalankan server mandiri di rumah atau kantor adalah IP publik yang bersifat dinamis (*dynamic IP*) dan risiko keamanan saat membuka port router (*port forwarding* port 80/443).

Dengan **Cloudflare Tunnels (Zero Trust)**:
* Server Anda membuat koneksi keluar (*outbound-only*) ke edge network Cloudflare.
* Port firewall router tetap 100% tertutup rapat dari pemindaian bot internet jahat.
* Mendapatkan sertifikat SSL HTTPS otomatis dan proteksi DDoS gratis dari Cloudflare.

### 3. Konfigurasi Docker Compose untuk n8n
Buat folder proyek \`n8n-cloudflare\` dan siapkan file \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    container_name: n8n-automation
    restart: always
    environment:
      - N8N_HOST=n8n.domainanda.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.domainanda.com/
      - GENERIC_TIMEZONE=Asia/Jakarta
    volumes:
      - ./n8n_data:/home/node/.n8n

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-tunnel
    restart: always
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=\${CLOUDFLARE_TUNNEL_TOKEN}
\`\`\`

### 4. Menghubungkan Cloudflared Tunnel
1. Buka dashboard **Cloudflare Zero Trust** ([one.dash.cloudflare.com](https://one.dash.cloudflare.com)).
2. Pilih menu **Networks** -> **Tunnels** -> Klik **Create a Tunnel**.
3. Pilih tipe installer **Docker**, lalu salin string token panjang yang disediakan.
4. Buat file \`.env\` di sebelah \`docker-compose.yml\` dan tempelkan token tersebut:

\`\`\`env
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiY2...token_anda...
\`\`\`

5. Di tab **Public Hostname** pada dashboard Cloudflare:
   * **Subdomain**: \`n8n\`
   * **Domain**: \`domainanda.com\`
   * **Service Type**: \`HTTP\`
   * **URL**: \`n8n:5678\`

Jalankan kedua kontainer:
\`\`\`bash
docker compose up -d
\`\`\`

### 5. Menguji Webhook Masuk & Mencegah Akses Ilegal
Buka browser dan navigasikan ke alamat \`https://n8n.domainanda.com\`. Anda akan disambut halaman pendaftaran admin n8n dengan gembok SSL hijau yang valid!

Uji webhook pertama Anda:
1. Buat workflow baru dan tambahkan node **Webhook**.
2. Salin URL Webhook Produksi.
3. Kirim data uji coba via cURL dari komputer lain. Webhook akan langsung terpicu secara instan tanpa hambatan firewall!
`,
    en: {
      title: 'How to Deploy Self-Hosted n8n via Cloudflare Tunnels (Zero Port Forwarding)',
      description: 'Step-by-step blueprint for self-hosting n8n workflow automation. Use Cloudflare Zero Trust Tunnels to securely expose webhooks and dashboards via HTTPS without port forwarding.',
      content: `
### 1. The Financial Advantage of Self-Hosted n8n
n8n ([github.com/n8n-io/n8n](https://github.com/n8n-io/n8n)) provides unlimited workflow execution without arbitrary per-task pricing tiers found in SaaS solutions.

### 2. Benefits of Cloudflare Zero Trust Tunnels
Cloudflare Tunnels establish outbound-only tunnels to Cloudflare edge networks, bypassing dynamic IP headaches and eliminating router port exposure.

### 3. Docker Compose Orchestration
Configure \`docker-compose.yml\` binding the official \`n8n\` image alongside the \`cloudflared\` daemon.

### 4. Configuring Public Hostname Routes
Route public DNS hostnames to the internal Docker container network service (\`http://n8n:5678\`).

### 5. Validating Webhooks & Access Security
Verify webhook dispatch across public HTTPS endpoints and safeguard instance credentials.
`
    }
  },
  {
    slug: 'tutorial-bot-discord-ai-musik-suno-api',
    title: 'Tutorial Membuat Bot Discord Generator Musik AI Menggunakan Node.js dan Suno API Unofficial',
    description: 'Panduan membangun bot Discord interaktif yang dapat menciptakan lagu orisinal lengkap dengan lirik dan instrumen audio langsung di dalam server Discord Anda menggunakan Suno API.',
    postType: 'tutorial',
    category: 'automation',
    categoryLabel: 'Automation',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['Discord Bot', 'Suno AI', 'Music AI', 'Node.js', 'discord.js', 'Audio'],
    affiliateProduct: {
      name: 'Studio Monitor Headphones',
      priceEstimate: 'Rp 850.000',
      linkUrl: 'https://audio-technica.com',
      badge: 'Audio Akurat',
      description: 'Headphone monitoring beresolusi tinggi untuk mengevaluasi kualitas mastering lagu hasil AI.'
    },
    toc: [
      { id: 'mengenal-revolusi-suno-ai', title: '1. Mengenal Revolusi Pembuatan Lagu dengan Suno AI' },
      { id: 'mendaftarkan-bot-di-discord-developer-portal', title: '2. Mendaftarkan Bot di Discord Developer Portal' },
      { id: 'persiapan-proyek-discordjs', title: '3. Setup Proyek discord.js & Pengambilan Kuki Suno' },
      { id: 'membuat-slash-command-generate-lagu', title: '4. Menulis Perintah Slash /generate-song' },
      { id: 'streaming-dan-pengiriman-audio-mp3', title: '5. Mengirim File Lagu MP3 & Lirik ke Channel Discord' }
    ],
    steps: [
      { id: 'step-1', label: 'Buat aplikasi bot baru di Discord Developer Portal dan aktifkan bot token' },
      { id: 'step-2', label: 'Ambil session cookie dari akun Suno.com melalui Inspect Element browser' },
      { id: 'step-3', label: 'Instal paket discord.js dan axios pada proyek Node.js' },
      { id: 'step-4', label: 'Registrasikan slash command /lagu dan tangani status proses rendering audio' }
    ],
    content: `
### 1. Mengenal Revolusi Pembuatan Lagu dengan Suno AI
Suno AI ([suno.com](https://suno.com)) telah mendemokratisasi produksi musik. Cukup dengan memberikan deskripsi gaya (*genre*) dan tema lirik, AI ini mampu menghasilkan lagu vokal stereo berkualitas radio komersial dalam tempo kurang dari 60 detik.

Dalam tutorial ini, kita akan membawa keajaiban tersebut langsung ke server Discord komunitas Anda melalui sebuah **Discord Bot** berbasis Node.js. Anggota server dapat mengetikkan perintah \`/lagu prompt: rock ballad tentang coder lembur\` dan bot akan membalas dengan file MP3 siap putar!

### 2. Mendaftarkan Bot di Discord Developer Portal
1. Kunjungi [discord.com/developers/applications](https://discord.com/developers/applications) dan klik **New Application**.
2. Masuk ke tab **Bot**, klik **Reset Token**, lalu salin token rahasia bot Anda.
3. Di bagian **Privileged Gateway Intents**, centang opsi **Message Content Intent**.
4. Buka tab **OAuth2** -> **URL Generator**, centang scope \`bot\` dan \`applications.commands\`. Berikan izin \`Send Messages\`, \`Attach Files\`, dan \`Embed Links\`, lalu buka URL tersebut untuk mengundang bot ke server Anda.

### 3. Setup Proyek discord.js & Pengambilan Kuki Suno
Inisialisasi folder proyek Anda:

\`\`\`bash
mkdir suno-discord-bot && cd suno-discord-bot
npm init -y
npm install discord.js axios dotenv
npm install -D tsx typescript @types/node
\`\`\`

Buat file \`.env\`:
\`\`\`env
DISCORD_TOKEN=MTE5xxxxxxxxxxxxxxxxxxxxxxxxxxx
SUNO_COOKIE=session_cookie_suno_anda
CLIENT_ID=id_aplikasi_discord_anda
\`\`\`

### 4. Membuat Slash Command /generate-song
Buat file utama \`index.ts\`:

\`\`\`typescript
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Registrasi slash command
const commands = [
  new SlashCommandBuilder()
    .setName('lagu')
    .setDescription('Ciptakan lagu AI baru dengan Suno')
    .addStringOption(opt => 
      opt.setName('prompt')
         .setDescription('Deskripsi genre, instrumen, dan lirik yang diinginkan')
         .setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

async function registerCommands() {
  try {
    console.log('Mendaftarkan slash command...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands }
    );
    console.log('Slash command berhasil terdaftar!');
  } catch (error) {
    console.error(error);
  }
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'lagu') {
    const prompt = interaction.options.getString('prompt', true);
    await interaction.deferReply(); // Berikan waktu bot memproses karena pembuatan lagu memakan waktu 30-50 detik

    try {
      await interaction.editReply(\`🎵 Sedang meracik melodi dan lirik untuk: **"\${prompt}"**... Mohon tunggu ~40 detik.\`);

      // Panggil API generator Suno
      const response = await axios.post(
        'https://api.suno.ai/v1/generate', // Endpoint wrapper API Suno
        { prompt: prompt, make_instrumental: false },
        { headers: { Cookie: process.env.SUNO_COOKIE } }
      );

      const songData = response.data[0];
      const audioUrl = songData.audio_url;

      const embed = new EmbedBuilder()
        .setTitle(\`🎶 \${songData.title || 'Lagu Baru AI'}\`)
        .setDescription(\`**Genre & Style:** \${songData.metadata?.tags || 'Campuran'}\\n\\n**Lirik:**\\n\${songData.metadata?.prompt?.slice(0, 1500) || 'Lirik instrumental'}\`)
        .setColor(0x5865F2)
        .setThumbnail(songData.image_url)
        .setFooter({ text: 'Dibuat dengan Suno AI via EnInformasi Hub' });

      await interaction.editReply({
        content: \`✅ Lagu berhasil diciptakan untuk <@\${interaction.user.id}>!\`,
        embeds: [embed],
        files: [new AttachmentBuilder(audioUrl, { name: 'lagu_ai.mp3' })]
      });
    } catch (err: any) {
      console.error(err);
      await interaction.editReply('❌ Gagal menghasilkan lagu. Pastikan kuki sesi Suno masih valid.');
    }
  }
});

client.once('ready', () => {
  console.log(\`🤖 Bot aktif sebagai: \${client.user?.tag}\`);
  registerCommands();
});

client.login(process.env.DISCORD_TOKEN);
\`\`\`

### 5. Streaming dan Pengiriman Audio MP3
Saat lagu selesai dirender, bot secara otomatis mengunggah file MP3 langsung ke obrolan Discord bersama gambar sampul (*album art*) dan kartu lirik lagu. Anggota komunitas Anda dapat langsung memutar lagu tersebut di aplikasi Discord tanpa perlu membuka link eksternal!
`,
    en: {
      title: 'How to Build an AI Music Generator Discord Bot with Node.js & Suno API',
      description: 'Step-by-step tutorial for building an interactive Discord bot that generates original full-length songs with vocals and instrumentation using discord.js and Suno music generation.',
      content: `
### 1. The Era of Generative AI Music
Suno AI creates broadcast-quality musical pieces spanning diverse genres from natural language lyric and styling prompts.

### 2. Discord Developer Application Setup
Register an application on the Discord Developer Portal, activate Privileged Intents, and configure OAuth2 permissions.

### 3. Project Configuration with discord.js
Scaffold a Node.js TypeScript project integrating \`discord.js\`, \`axios\`, and session cookie authenticators.

### 4. Crafting the /lagu Slash Command
Implement deferred interactions (\`deferReply\`) to accommodate asynchronous generation latency before returning media files.

### 5. In-Channel MP3 Attachment Delivery
Format rich message embeds including generated cover artwork, song metadata, and direct playable MP3 attachments.
`
    }
  },
  {
    slug: 'cara-setup-dify-ai-agentic-workflow-selfhosted',
    title: 'Cara Setup Dify AI Secara Self-Hosted Menggunakan Docker Compose untuk Platform Agen No-Code',
    description: 'Panduan lengkap memasang Dify AI secara mandiri di server sendiri. Membangun platform alur kerja agen LLM visual no-code, manajemen pengetahuan RAG terintegrasi, dan integrasi API produksi.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '10 min baca',
    author: 'Edvan',
    tags: ['Dify', 'Docker', 'Self-Hosted', 'AI Agents', 'No-Code', 'RAG'],
    affiliateProduct: {
      name: 'VPS Cloud 8GB RAM 4 vCPU',
      priceEstimate: 'Rp 189.000/bln',
      linkUrl: 'https://linode.com',
      badge: 'Server Handal',
      description: 'Kapasitas RAM ideal untuk menjalankan tumpukan multi-kontainer Dify AI dengan mulus.'
    },
    toc: [
      { id: 'kenapa-dify-ai-sangat-populer', title: '1. Kenapa Dify AI Menjadi Platform Agen Paling Populer?' },
      { id: 'prasyarat-server-dan-docker', title: '2. Prasyarat Sistem & Kebutuhan RAM' },
      { id: 'kloning-repositori-dan-env', title: '3. Kloning Repositori Dify & Konfigurasi Variabel Lingkungan' },
      { id: 'menjalankan-stack-docker-compose', title: '4. Menjalankan Kontainer & Inisialisasi Akun Admin' },
      { id: 'membuat-aplikasi-chat-rag-pertama', title: '5. Membuat Chatbot RAG Cerdas Tanpa Coding' }
    ],
    steps: [
      { id: 'step-1', label: 'Pastikan Docker dan Docker Compose plugin sudah aktif di Ubuntu server' },
      { id: 'step-2', label: 'Kloning repositori difyai/dify dan masuk ke direktori docker' },
      { id: 'step-3', label: 'Salin .env.example menjadi .env dan sesuaikan SECRET_KEY' },
      { id: 'step-4', label: 'Jalankan docker compose up -d dan akses portal web di port 80' }
    ],
    content: `
### 1. Kenapa Dify AI Menjadi Platform Agen Paling Populer?
Membangun aplikasi AI dari nol menggunakan kode Python murni sering kali memakan waktu berbulan-bulan hanya untuk mengurus manajemen otentikasi pengguna, antarmuka chat, penyimpanan vektor, dan evaluasi hasil prompt.

**Dify AI** ([github.com/langgenius/dify](https://github.com/langgenius/dify)) adalah platform open-source kelas industri yang menyatukan seluruh kebutuhan tersebut ke dalam satu dashboard visual yang elegan:
* **Visual Workflow Builder**: Rancang alur logika multi-agent, if/else branching, dan iterasi loop secara *drag-and-drop*.
* **Knowledge Base (RAG) Terintegrasi**: Unggah dokumen PDF, Word, atau Notion dengan chunking dan hybrid search otomatis.
* **Model Agnostic**: Hubungkan ratusan model AI sekaligus (OpenAI, Anthropic, Gemini, DeepSeek, Groq, hingga Ollama lokal).
* **Siap Produksi**: Menyediakan API REST dan widget embed JavaScript untuk ditempelkan ke website dalam 1 baris kode.

### 2. Prasyarat Server & Kebutuhan RAM
Karena Dify menjalankan arsitektur microservices (Frontend Next.js, API Python, Worker Celery, Redis, PostgreSQL, Nginx, Weaviate/Qdrant), Anda disarankan menyiapkan server dengan spesifikasi:
* **OS**: Ubuntu 22.04 / 24.04 LTS
* **RAM**: Minimal 4 GB (disarankan 8 GB untuk beban tim produksi)
* **Storage**: 30 GB SSD

### 3. Kloning Repositori Dify & Konfigurasi Variabel Lingkungan
Masuk ke terminal server Anda dan unduh repositori resmi:

\`\`\`bash
git clone https://github.com/langgenius/dify.git
cd dify/docker
cp .env.example .env
\`\`\`

Buka file \`.env\` dan buat string enkripsi acak untuk \`SECRET_KEY\`:
\`\`\`bash
# Buat string acak menggunakan openssl
openssl rand -base64 42
\`\`\`
Tempelkan hasil tersebut ke variabel \`SECRET_KEY=\` di file \`.env\`.

### 4. Menjalankan Stack Docker Compose
Nyalakan seluruh layanan kontainer di latar belakang:

\`\`\`bash
docker compose up -d
\`\`\`

Periksa status kontainer:
\`\`\`bash
docker compose ps
\`\`\`

Jika semua kontainer berstatus \`Up\`, buka browser Anda dan navigasikan ke alamat IP server Anda:
\`\`\`
http://IP_SERVER_ANDA/install
\`\`\`

Anda akan diminta membuat akun **Administrator Utama** (Email dan Password) untuk pertama kali.

### 5. Membuat Chatbot RAG Cerdas Tanpa Coding
1. Masuk ke tab **Settings** -> **Model Providers**, masukkan API key model Anda (misalnya OpenAI atau Groq).
2. Pindah ke tab **Knowledge** -> Klik **Create Knowledge**, unggah file SOP internal atau manual produk perusahaan Anda. Pilih metode *Hybrid Search* (Keyword BM25 + Vector Semantic).
3. Pindah ke tab **Studio** -> Klik **Create from Blank** -> Pilih **Chatbot**.
4. Di bilah *Context*, klik tanda tambah (\`+\`) dan pilih Knowledge Base yang baru saja dibuat.
5. Klik tombol **Preview & Run**. Chatbot Anda sekarang dapat menjawab pertanyaan spesifik tentang dokumen internal Anda dengan akurasi kutipan yang sempurna!
`,
    en: {
      title: 'How to Self-Host Dify AI on Docker Compose: Visual Agentic Workflow Platform',
      description: 'Complete deployment guide for self-hosting Dify AI. Set up an enterprise-grade visual no-code LLM orchestration platform with integrated RAG knowledge bases and production APIs.',
      content: `
### 1. Why Dify AI Dominates Enterprise AI
Dify AI ([github.com/langgenius/dify](https://github.com/langgenius/dify)) combines visual flow builders, multi-tenant knowledge management, and unified model routing into a cohesive platform.

### 2. Hardware Prerequisites
Requires Ubuntu Linux with at least 4GB RAM (8GB recommended) to host PostgreSQL, Redis, Celery workers, and vector engines.

### 3. Cloning & Environment Secret Key Generation
Clone the source repository, configure \`.env\`, and generate cryptographic keys via \`openssl rand -base64 42\`.

### 4. Docker Compose Deployment & Admin Provisioning
Launch services via \`docker compose up -d\` and complete initial administrative account configuration at \`/install\`.

### 5. Assembling Zero-Code RAG Assistants
Connect upstream inference providers, ingest documentation into hybrid vector stores, and publish responsive web widgets.
`
    }
  },
  {
    slug: 'smart-home-ai-home-assistant-local-voice-llm',
    title: 'Integrasi Smart Home: Menghubungkan Home Assistant dengan Model Suara LLM Lokal Tanpa Cloud',
    description: 'Panduan membangun asisten suara rumah pintar yang 100% privat dan offline. Menghubungkan Home Assistant dengan Piper TTS, Whisper STT, dan model LLM Ollama lokal untuk mengontrol lampu dan sensor tanpa internet.',
    postType: 'tutorial',
    category: 'iot-smarthome',
    categoryLabel: 'IoT & Smart Home',
    difficulty: 'Lanjutan',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '10 min baca',
    author: 'Edvan',
    tags: ['Home Assistant', 'Smart Home', 'IoT', 'Ollama', 'Local AI', 'Whisper', 'Piper'],
    affiliateProduct: {
      name: 'Raspberry Pi 5 8GB / Mini PC Intel',
      priceEstimate: 'Rp 1.450.000',
      linkUrl: 'https://raspberrypi.com',
      badge: 'IoT Hub',
      description: 'Pusat kendali perangkat IoT rumah pintar dengan efisiensi konsumsi listrik sangat rendah.'
    },
    toc: [
      { id: 'kenapa-asisten-lokal-lebih-baik-dari-alexa', title: '1. Kelemahan Alexa/Google Home vs Asisten Suara Lokal' },
      { id: 'arsitektur-home-assistant-year-of-the-voice', title: '2. Arsitektur Voice Assistant Home Assistant (Whisper + Piper)' },
      { id: 'instalasi-integrasi-ollama-conversation', title: '3. Menghubungkan Integrasi Ollama Conversation' },
      { id: 'pemetaan-entitas-dan-prompt-rekayasa', title: '4. Memetakan Sensor Rumah ke System Prompt LLM' },
      { id: 'uji-coba-perintah-suara-offline', title: '5. Uji Coba Mengontrol Rumah Tanpa Koneksi Internet' }
    ],
    steps: [
      { id: 'step-1', label: 'Pasang add-on Whisper (STT) dan Piper (TTS) di Home Assistant OS' },
      { id: 'step-2', label: 'Setup model Ollama (misalnya qwen2.5-coder atau llama3.2) di komputer lokal' },
      { id: 'step-3', label: 'Tambahkan integrasi Ollama Conversation di menu Settings -> Devices & Services' },
      { id: 'step-4', label: 'Pilih entitas lampu dan saklar yang diizinkan untuk dikontrol oleh LLM' }
    ],
    content: `
### 1. Kelemahan Alexa/Google Home vs Asisten Suara Lokal
Asisten suara komersial seperti Amazon Alexa atau Google Assistant memiliki tiga kelemahan mendasar:
1. **Privasi Terancam**: Setiap percakapan di ruang keluarga Anda direkam dan dianalisis di server cloud perusahaan raksasa.
2. **Ketergantungan Internet**: Saat koneksi internet rumah mati atau ISP mengalami gangguan, Anda bahkan tidak bisa menyalakan lampu kamar sendiri.
3. **Kaku**: Perintah suara harus mengikuti sintaks kaku (*"Turn on living room light"*). Jika menggunakan bahasa santai atau kalimat majemuk, asisten cloud sering kali bingung.

Dengan menggabungkan **Home Assistant** ([home-assistant.io](https://www.home-assistant.io)) dan **Model Bahasa Lokal (Ollama)**, Anda mendapatkan asisten yang memahami konteks percakapan manusiawi secara 100% offline dan privat!

### 2. Arsitektur Voice Assistant Home Assistant (Whisper + Piper)
Alur pemrosesan suara lokal dibagi menjadi 3 tahap mandiri:
* **Speech-to-Text (STT) - Faster-Whisper**: Mengubah gelombang audio ucapan mikrofon menjadi teks tulisan dalam hitungan milidetik.
* **Brain (LLM) - Ollama Conversation Agent**: Menganalisis maksud (*intent*) kalimat, membaca status sensor suhu/lampu, dan menentukan tindakan yang harus diambil.
* **Text-to-Speech (TTS) - Piper**: Mengubah teks balasan AI kembali menjadi suara vokal alami yang renyah dan cepat.

### 3. Menghubungkan Integrasi Ollama Conversation
Jalankan model bahasa yang ringan di PC rumah Anda:

\`\`\`bash
ollama run llama3.2:3b
\`\`\`

Buka dashboard Home Assistant:
1. Buka **Settings** -> **Devices & Services** -> Klik **Add Integration**.
2. Cari **Ollama**.
3. Masukkan URL server Ollama Anda (contoh: \`http://192.168.1.100:11434\`).
4. Pilih model yang telah diunduh: \`llama3.2:3b\`.

### 4. Memetakan Sensor Rumah ke System Prompt LLM
Di pengaturan integrasi Ollama di Home Assistant, aktifkan centang **Expose entities to Assist**. Pilih perangkat apa saja yang boleh dikendalikan:
* \`light.lampu_ruang_tamu\`
* \`switch.ac_kamar_utama\`
* \`sensor.suhu_ruang_keluarga\`

Sesuaikan **System Prompt** agar LLM berperilaku sebagai pelayan rumah cerdas:
\`\`\`text
Anda adalah asisten rumah pintar yang ramah bernama Jarvis.
Tugas Anda adalah mengendalikan perangkat rumah berdasarkan status entitas berikut:
{{ devices() }}

Saat pengguna meminta tindakan (seperti menyalakan lampu atau mengubah suhu AC), gunakan fungsi perangkat yang sesuai dan berikan respon konfirmasi yang singkat dan santai dalam bahasa Indonesia.
\`\`\`

### 5. Uji Coba Perintah Suara Offline
Gunakan mikrofon pada ponsel atau perangkat satelit ESP32-S3 Box, lalu ucapkan:
*"Jarvis, di luar kayaknya panas banget nih, tolong nyalain AC kamar dan matiin lampu depan."*

AI lokal akan mengeksekusi kedua tindakan tersebut secara paralel:
1. Memanggil service \`climate.set_hvac_mode\` ke status \`cool\`.
2. Memanggil service \`light.turn_off\` pada entitas lampu depan.
3. Menjawab dengan vokal Piper: *"Siap! AC kamar sudah menyala sejuk dan lampu depan sudah dimatikan."* Semua terjadi dalam 1.2 detik tanpa satu bita pun data keluar ke internet!
`,
    en: {
      title: 'Smart Home Automation: Home Assistant with Local Voice LLMs & Zero Cloud',
      description: 'Architect a 100% offline, privacy-first smart home assistant. Connect Home Assistant with Piper TTS, Whisper STT, and local Ollama LLMs to automate devices without internet access.',
      content: `
### 1. The Pitfalls of Commercial Cloud Assistants
Cloud smart assistants sacrifice household privacy, incur latency, and fail whenever external internet connectivity drops.

### 2. Home Assistant Local Voice Architecture
The Voice Pipeline decouples processing into Faster-Whisper (STT), Ollama (LLM reasoning & entity dispatch), and Piper (instantaneous neural TTS).

### 3. Integrating Ollama with Home Assistant
Expose local Ollama daemon instances directly over internal LAN subnets into Home Assistant Assist engines.

### 4. Entity Exposure & Context Prompting
Safely expose select lights, switches, and environmental climate entities into the model context via Jinja templates.

### 5. Offline Testing & Compound Command Execution
Verify compound commands without external WAN traffic, executing multi-device routines with sub-second responsiveness.
`
    }
  },
  {
    slug: 'fine-tuning-vision-model-qwen2-vl-faktur-pajak',
    title: 'Panduan Fine-Tuning Vision Model Qwen2-VL untuk Ekstraksi Otomatis Dokumen Faktur Pajak',
    description: 'Pelajari teknik fine-tuning Vision-Language Model Qwen2-VL menggunakan LoRA & Unsloth. Melatih model mengenali format faktur pajak, NPWP, dan tabel rincian transaksi dengan presisi tinggi.',
    postType: 'tutorial',
    category: 'computer-vision',
    categoryLabel: 'Computer Vision',
    difficulty: 'Lanjutan',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '10 min baca',
    author: 'Edvan',
    tags: ['Fine-Tuning', 'Qwen2-VL', 'Vision AI', 'LoRA', 'OCR', 'Python', 'PyTorch'],
    affiliateProduct: {
      name: 'GPU Cloud Training Credit',
      priceEstimate: 'Rp 500.000',
      linkUrl: 'https://lambdalabs.com',
      badge: 'ML Training',
      description: 'Sewa GPU NVIDIA A100/H100 per jam untuk menyelesaikan fine-tuning vision model dalam waktu singkat.'
    },
    toc: [
      { id: 'kenapa-fine-tuning-vision-model', title: '1. Kenapa Perlu Fine-Tuning Vision Model untuk Dokumen Spesifik?' },
      { id: 'persiapan-dataset-gambar-dan-json', title: '2. Format Dataset: Pasangan Gambar & JSON Ekstraksi' },
      { id: 'konfigurasi-lora-dan-unsloth', title: '3. Setup LoRA (Low-Rank Adaptation) untuk Efisiensi VRAM' },
      { id: 'menjalankan-loop-training', title: '4. Menjalankan Loop Pelatihan & Monitoring Loss' },
      { id: 'evaluasi-dan-export-bobot', title: '5. Evaluasi Hasil & Ekspor Model untuk Inferensi Produksi' }
    ],
    steps: [
      { id: 'step-1', label: 'Kumpulkan 100-500 gambar sampel faktur pajak dan buat label JSON terstruktur' },
      { id: 'step-2', label: 'Instal pustaka trl, peft, unsloth, dan transformers' },
      { id: 'step-3', label: 'Muat model dasar Qwen/Qwen2-VL-7B-Instruct dengan kuantisasi 4-bit' },
      { id: 'step-4', label: 'Latih adapter LoRA selama 3 epoch dan simpan bobot fine-tuned' }
    ],
    content: `
### 1. Kenapa Perlu Fine-Tuning Vision Model untuk Dokumen Spesifik?
Meskipun model multimodal umum seperti GPT-4o atau Qwen2-VL standar mampu membaca teks dari gambar, mereka sering melakukan kesalahan pada dokumen legal berformat ketat seperti **Faktur Pajak Standar Indonesia**:
* Salah membaca digit NPWP 16 angka karena degradasi resolusi stempel.
* Keliru membedakan DPP (*Dasar Pengenaan Pajak*) dengan nilai PPN 11%.
* Mengabaikan tanda tangan barcode QR Code di bagian bawah faktur.

Dengan melakukan **Fine-Tuning LoRA** pada bobot vision dan language projection, model diajarkan untuk memusatkan perhatian (*attention*) pada struktur unik faktur pajak dan langsung mengembalikan output dalam format JSON valid tanpa halusinasi.

### 2. Format Dataset: Pasangan Gambar & JSON Ekstraksi
Siapkan dataset dalam format Hugging Face \`jsonl\`. Setiap baris merepresentasikan 1 gambar dan label ground-truth:

\`\`\`json
{
  "image": "dataset/faktur_001.jpg",
  "conversations": [
    {
      "role": "user",
      "content": "<image>Ekstrak seluruh entitas penting dari faktur pajak ini ke dalam JSON."
    },
    {
      "role": "assistant",
      "content": "{\\"nomor_faktur\\": \\"010.002-26.12345678\\", \\"npwp_penjual\\": \\"01.234.567.8-012.000\\", \\"nama_penjual\\": \\"PT MAKMUR SENTOSA\\", \\"dpp\\": 10000000, \\"ppn\\": 1100000, \\"total\\": 11100000}"
    }
  ]
}
\`\`\`

### 3. Setup LoRA (Low-Rank Adaptation) untuk Efisiensi VRAM
Pasang paket yang diperlukan:

\`\`\`bash
pip install torch transformers peft trl bitsandbytes accelerate
\`\`\`

Muat model dasar **Qwen2-VL-7B-Instruct** dengan konfigurasi LoRA:

\`\`\`python
import torch
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
from peft import LoraConfig, get_peft_model

model_id = "Qwen/Qwen2-VL-7B-Instruct"

# Muat model dalam presisi 4-bit bfloat16
model = Qwen2VLForConditionalGeneration.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16,
    load_in_4bit=True,
    device_map="auto"
)
processor = AutoProcessor.from_pretrained(model_id)

# Konfigurasi LoRA targeting modul perhatian
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
\`\`\`

### 4. Menjalankan Loop Pelatihan & Monitoring Loss
Gunakan \`SFTTrainer\` dari pustaka TRL untuk mengelola siklus training:

\`\`\`python
from trl import SFTTrainer, SFTConfig

training_args = SFTConfig(
    output_dir="./qwen2-vl-faktur-lora",
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    num_train_epochs=3,
    logging_steps=10,
    fp16=False,
    bf16=True,
    save_strategy="epoch"
)

trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    args=training_args,
)

print("Memulai proses fine-tuning...")
trainer.train()
\`\`\`

### 5. Evaluasi Hasil & Ekspor Model untuk Inferensi Produksi
Setelah pelatihan selesai, simpan adapter LoRA:
\`\`\`python
model.save_pretrained("./faktur_pajak_qwen2_adapter")
processor.save_pretrained("./faktur_pajak_qwen2_adapter")
\`\`\`

Model hasil fine-tuning kini memiliki tingkat akurasi ekstraksi angka di atas **99.4%** bahkan pada hasil foto kamera ponsel yang miring dan buram!
`,
    en: {
      title: 'Fine-Tuning Qwen2-VL Vision-Language Models for Invoice Extraction',
      description: 'Master fine-tuning vision-language models with LoRA and PEFT. Train Qwen2-VL to parse complex tax invoices, receipts, and structured legal records with near-perfect reliability.',
      content: `
### 1. The Necessity of Fine-Tuning Multimodal Vision
Zero-shot frontier models frequently confuse dense structural tabular indices or misread digits in standardized regional tax invoices.

### 2. Dataset Structuring
Construct JSONL corpora pairing high-resolution document images with ground-truth structured JSON targets.

### 3. LoRA Configuration on 4-Bit Foundations
Load \`Qwen2-VL-7B-Instruct\` with 4-bit quantization and inject Low-Rank Adapters across attention query/value projection layers.

### 4. Training Loop Execution via TRL
Employ \`SFTTrainer\` with gradient accumulation and bfloat16 mixed precision to converge loss across 3 epochs.

### 5. Evaluation & Deployment Exports
Serialize the fine-tuned adapter weights and deploy to inference backends achieving 99%+ field extraction accuracy.
`
    }
  },
  {
    slug: 'tutorial-bot-trading-crypto-sentimen-ai-python',
    title: 'Tutorial Membuat Bot Analisis Sentimen Crypto Otomatis Menggunakan Python & Analisis Berita AI',
    description: 'Panduan membangun bot penganalisis sentimen pasar cryptocurrency berbasis Python. Mengumpulkan berita crypto terkini, menganalisis indeks sentimen menggunakan LLM, dan mengirim sinyal peringatan ke Telegram.',
    postType: 'tutorial',
    category: 'data-science',
    categoryLabel: 'Data Science',
    difficulty: 'Menengah',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['Python', 'Crypto Bot', 'Sentiment Analysis', 'Telegram Bot', 'Trading', 'Data Science'],
    affiliateProduct: {
      name: 'Hardware Crypto Wallet Cold Storage',
      priceEstimate: 'Rp 1.150.000',
      linkUrl: 'https://ledger.com',
      badge: 'Keamanan Aset',
      description: 'Dompet fisik dengan chip keamanan tersertifikasi untuk menyimpan aset crypto secara aman.'
    },
    toc: [
      { id: 'analisis-sentimen-dalam-pasar-crypto', title: '1. Mengapa Sentimen Berita Menggerakkan Harga Crypto?' },
      { id: 'mengambil-berita-real-time-api', title: '2. Mengambil Feed Berita Pasar Crypto Real-Time' },
      { id: 'evaluasi-skor-sentimen-llm', title: '3. Menghitung Skor Sentimen Menggunakan Prompting LLM' },
      { id: 'mengirimkan-sinyal-ke-telegram', title: '4. Mengirim Peringatan Sinyal Otomatis ke Grup Telegram' },
      { id: 'manajemen-risiko-dan-disclaimer', title: '5. Prinsip Manajemen Risiko & Otomatisasi Terjadwal' }
    ],
    steps: [
      { id: 'step-1', label: 'Daftarkan bot Telegram baru via @BotFather dan dapatkan Bot Token serta Chat ID' },
      { id: 'step-2', label: 'Ambil berita terkini koin crypto melalui API publik (CryptoPanic atau RSS Feed)' },
      { id: 'step-3', label: 'Tulis fungsi analisis yang mengembalikan skor sentimen antara -1.0 hingga +1.0' },
      { id: 'step-4', label: 'Jalankan skrip setiap 15 menit menggunakan cron job atau APScheduler' }
    ],
    content: `
### 1. Mengapa Sentimen Berita Menggerakkan Harga Crypto?
Pasar aset kripto sangat dipengaruhi oleh psikologi massa dan siklus berita (*narrative-driven market*). Pengumuman regulasi ETF baru, peretasan protokol DeFi, atau pernyataan pejabat bank sentral dapat menggerakkan harga Bitcoin hingga 5-10% dalam hitungan menit sebelum indikator teknikal konvensional (seperti RSI atau MACD) sempat bereaksi.

Dengan membangun bot analisis sentimen berbasis AI:
* Anda tidak perlu memantau Twitter/X dan portal berita 24 jam sehari.
* AI secara objektif mengukur bobot berita: memisahkan *FUD (Fear, Uncertainty, Doubt)* palsu dari sentimen institusional riil.
* Sinyal ringkas dikirimkan langsung ke ponsel Anda via Telegram.

### 2. Mengambil Feed Berita Pasar Crypto Real-Time
Gunakan API publik dari agregator berita seperti CryptoPanic atau feed RSS portal berita finansial:

\`\`\`python
import httpx

async def fetch_latest_crypto_news():
    url = "https://cryptopanic.com/api/v1/posts/?auth_token=TOKEN_ANDA&public=true"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
        articles = []
        for post in data.get("results", [])[:5]:
            articles.append({
                "title": post.get("title"),
                "source": post.get("source", {}).get("domain"),
                "url": post.get("url")
            })
        return articles
\`\`\`

### 3. Menghitung Skor Sentimen Menggunakan Prompting LLM
Gunakan model AI seperti GPT-4o-mini atau Groq Llama 3 untuk menilai dampak berita ke pasar:

\`\`\`python
from openai import OpenAI
import json

client = OpenAI()

def analyze_sentiment(news_list):
    prompt = f"""
    Analisis daftar berita crypto berikut dan berikan skor sentimen pasar secara keseluruhan:
    {json.dumps(news_list, indent=2)}

    Format balasan WAJIB berupa JSON murni:
    {{
      "sentiment_score": float (-1.0 sangat bearish hingga +1.0 sangat bullish),
      "kategori": "BULLISH" | "BEARISH" | "NETRAL",
      "alasan_ringkas": "penjelasan maksimal 2 kalimat",
      "koin_terdampak": ["BTC", "ETH", dll]
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    return json.loads(response.choices[0].message.content)
\`\`\`

### 4. Mengirimkan Sinyal ke Telegram
Kirimkan hasil analisis ke bot Telegram Anda:

\`\`\`python
import httpx

async def send_telegram_alert(token: str, chat_id: str, data: dict):
    skor = data["sentiment_score"]
    emoji = "🚀" if skor > 0.3 else ("🔻" if skor < -0.3 else "⚖️")
    
    pesan = (
        f"{emoji} **SINYAL SENTIMEN PASAR CRYPTO** {emoji}\\n\\n"
        f"📊 **Kategori:** {data['kategori']} (Skor: {skor})\\n"
        f"🪙 **Koin Terdampak:** {', '.join(data['koin_terdampak'])}\\n"
        f"💡 **Analisis:** {data['alasan_ringkas']}\\n\\n"
        f"⏱ _Waktu Analisis: 14 Oktober 2026_"
    )

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": pesan, "parse_mode": "Markdown"}

    async with httpx.AsyncClient() as client:
        await client.post(url, json=payload)
\`\`\`

### 5. Prinsip Manajemen Risiko & Otomatisasi Terjadwal
Pasang skrip ini pada penjadwal otomatis (misal: \`cron\` setiap 30 menit).

> [!WARNING]
> Bot ini bertujuan sebagai alat bantu pemantauan sentimen data dan **bukan nasihat finansial**. Selalu gunakan manajemen risiko modal yang ketat (*stop-loss*) dan jangan pernah mendasarkan keputusan perdagangan hanya pada satu indikator tunggal.
`,
    en: {
      title: 'Python Crypto Sentiment Analysis Bot with AI News Parsing & Telegram Alerts',
      description: 'Build an automated cryptocurrency sentiment analysis pipeline in Python. Aggregate breaking market news, compute sentiment matrices via LLMs, and broadcast high-priority signals to Telegram.',
      content: `
### 1. The Impact of Sentiment on Digital Assets
Cryptocurrency price movements frequently precede technical chart breakouts when institutional announcements or macroeconomic updates occur.

### 2. Ingesting Real-Time Market News Feeds
Leverage public aggregator endpoints (e.g. CryptoPanic) to capture breaking headlines asynchronously.

### 3. Structured Sentiment Scoring via LLMs
Prompt frontier language models with strict JSON schema constraints to return normalized sentiment indices between -1.0 and +1.0.

### 4. Telegram Alert Dispatching
Format structured markdown notifications dispatching sentiment indices and affected tickers directly into private Telegram channels.

### 5. Risk Management & Scheduling Protocols
Execute routine cron intervals to maintain continuous market awareness alongside strict risk mitigation protocols.
`
    }
  }
];

const targetFile = path.join(__dirname, '..', 'lib', 'data', 'tutorials-2.ts');
const fileContent = `import { Article } from '@/types/article';

export const tutorialsPart2: Article[] = ${JSON.stringify(tutorials, null, 2)};
`;

fs.writeFileSync(targetFile, fileContent, 'utf8');
console.log(`Successfully written all ${tutorials.length} tutorials to lib/data/tutorials-2.ts!`);
