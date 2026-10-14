import { Article } from '../types';

export const tutorialsPart2: Article[] = [
  {
    "slug": "tutorial-bikin-custom-mcp-server-postgresql",
    "title": "Bikin Custom MCP Server PostgreSQL Sendiri (Biar Cursor & Claude Bisa Query Database Langsung)",
    "description": "Panduan langkah demi langkah membuat Model Context Protocol (MCP) server kustom untuk PostgreSQL menggunakan TypeScript SDK. Memungkinkan asisten coding AI membaca skema, menjalankan query terisolasi, dan menjelaskan tabel.",
    "postType": "tutorial",
    "category": "database-dev",
    "categoryLabel": "Database Dev",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "9 min baca",
    "author": "Edvan",
    "tags": [
      "MCP",
      "PostgreSQL",
      "TypeScript",
      "Cursor",
      "Claude Desktop",
      "Database"
    ],
    "affiliateProduct": {
      "name": "Managed Cloud PostgreSQL Instance",
      "priceEstimate": "Rp 220.000/bln",
      "linkUrl": "https://neon.tech",
      "badge": "Database Pilihan",
      "description": "Database serverless PostgreSQL dengan branching instan untuk sandbox testing MCP server."
    },
    "toc": [
      {
        "id": "apa-itu-mcp-server",
        "title": "1. Apa Itu Model Context Protocol (MCP) Server?"
      },
      {
        "id": "persiapan-proyek-typescript",
        "title": "2. Inisialisasi Proyek TypeScript & SDK MCP"
      },
      {
        "id": "menulis-resource-dan-tools",
        "title": "3. Menulis Resource Skema & Tools Query PostgreSQL"
      },
      {
        "id": "konfigurasi-claude-cursor",
        "title": "4. Menghubungkan ke Claude Desktop & Cursor IDE"
      },
      {
        "id": "keamanan-dan-read-only-guard",
        "title": "5. Best Practice Keamanan: Mencegah Query Destruktif"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Buat proyek TypeScript dan instal @modelcontextprotocol/sdk serta pg"
      },
      {
        "id": "step-2",
        "label": "Tulis handler MCP Server untuk membaca schema information_schema"
      },
      {
        "id": "step-3",
        "label": "Terapkan tool execute_sql dengan validasi Read-Only (hanya SELECT)"
      },
      {
        "id": "step-4",
        "label": "Daftarkan server di claude_desktop_config.json dan uji interaksi AI"
      }
    ],
    "content": "\n### 1. Apa Itu Model Context Protocol (MCP) Server?\nModel Context Protocol (MCP) adalah standar terbuka dari Anthropic ([github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)) yang memungkinkan LLM seperti Claude Desktop, Claude Code, dan Cursor terhubung secara aman ke sumber data eksternal maupun perkakas operasional lokal.\n\nSebelum MCP hadir, Anda harus menyalin (*copy-paste*) DDL tabel, skema relasi, atau hasil query SQL secara manual ke jendela chat. Dengan MCP server kustom PostgreSQL:\n* Editor atau LLM dapat membaca katalog tabel (*schema discovery*) otomatis.\n* Model dapat mengeksekusi query `SELECT` untuk menganalisis anomali data riil.\n* Debugging query ORM (Prisma/Drizzle) langsung divalidasi ke engine database secara instan.\n\n### 2. Inisialisasi Proyek TypeScript & SDK MCP\nSiapkan folder proyek dan instal dependensi resmi MCP TypeScript SDK:\n\n```bash\nmkdir pg-mcp-server && cd pg-mcp-server\nnpm init -y\nnpm install @modelcontextprotocol/sdk pg dotenv\nnpm install -D typescript @types/node @types/pg tsx\nnpx tsc --init\n```\n\nPastikan pada file `package.json` Anda menambahkan konfigurasi `\"type\": \"module\"` dan script build:\n\n```json\n{\n  \"type\": \"module\",\n  \"scripts\": {\n    \"build\": \"tsc\",\n    \"start\": \"node dist/index.js\",\n    \"dev\": \"tsx src/index.ts\"\n  }\n}\n```\n\n### 3. Menulis Resource Skema & Tools Query PostgreSQL\nBuat file utama `src/index.ts`. Server akan berkomunikasi lewat *Standard I/O (stdio)*:\n\n```typescript\nimport { Server } from \"@modelcontextprotocol/sdk/server/index.js\";\nimport { StdioServerTransport } from \"@modelcontextprotocol/sdk/server/stdio.js\";\nimport { CallToolRequestSchema, ListToolsRequestSchema } from \"@modelcontextprotocol/sdk/types.js\";\nimport pg from 'pg';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nconst pool = new pg.Pool({\n  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mydb'\n});\n\nconst server = new Server(\n  { name: \"postgres-inspector\", version: \"1.0.0\" },\n  { capabilities: { tools: {} } }\n);\n\nserver.setRequestHandler(ListToolsRequestSchema, async () => {\n  return {\n    tools: [\n      {\n        name: \"get_tables\",\n        description: \"Dapatkan daftar seluruh tabel dan total baris di database publik.\",\n        inputSchema: { type: \"object\", properties: {} }\n      },\n      {\n        name: \"run_readonly_query\",\n        description: \"Jalankan SQL query SELECT secara aman (hanya query baca).\",\n        inputSchema: {\n          type: \"object\",\n          properties: {\n            sql: { type: \"string\", description: \"Query SQL diawali dengan SELECT\" }\n          },\n          required: [\"sql\"]\n        }\n      }\n    ]\n  };\n});\n\nserver.setRequestHandler(CallToolRequestSchema, async (request) => {\n  const { name, arguments: args } = request.params;\n\n  if (name === \"get_tables\") {\n    const res = await pool.query(`\n      SELECT table_name \n      FROM information_schema.tables \n      WHERE table_schema = 'public' \n      ORDER BY table_name;\n    `);\n    return { content: [{ type: \"text\", text: JSON.stringify(res.rows, null, 2) }] };\n  }\n\n  if (name === \"run_readonly_query\") {\n    const query = (args?.sql as string || '').trim();\n    if (!query.toLowerCase().startsWith('select')) {\n      throw new Error(\"Izin ditolak: Hanya perintah SELECT yang diperbolehkan demi keamanan.\");\n    }\n    const res = await pool.query(query);\n    return { content: [{ type: \"text\", text: JSON.stringify(res.rows, null, 2) }] };\n  }\n\n  throw new Error(\"Perkakas tidak dikenali\");\n});\n\nasync function main() {\n  const transport = new StdioServerTransport();\n  await server.connect(transport);\n  console.error(\"MCP PostgreSQL Server berhasil terhubung via stdio.\");\n}\n\nmain().catch(err => {\n  console.error(\"Fatal error:\", err);\n  process.exit(1);\n});\n```\n\n### 4. Menghubungkan ke Claude Desktop & Cursor IDE\nKompilasi TypeScript menjadi JavaScript biasa dengan perintah:\n```bash\nnpm run build\n```\n\nBuka file konfigurasi Claude Desktop di sistem Anda (`claude_desktop_config.json`):\n* **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`\n* **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`\n\nTambahkan entri server berikut:\n\n```json\n{\n  \"mcpServers\": {\n    \"postgres-local\": {\n      \"command\": \"node\",\n      \"args\": [\"C:/Users/edvan/Projects/pg-mcp-server/dist/index.js\"],\n      \"env\": {\n        \"DATABASE_URL\": \"postgresql://postgres:rahasia@localhost:5432/ecommerce_db\"\n      }\n    }\n  }\n}\n```\n\nBuka kembali Claude Desktop. Ikon palu (*tools*) akan otomatis menyala hijau, siap menerima pertanyaan seperti: *\"Tampilkan 5 transaksi paling besar dari tabel orders bulan ini.\"*\n\n### 5. Best Practice Keamanan: Mencegah Query Destruktif\nDalam implementasi produksi:\n1. **User Database Terbatas**: Selalu buat database user khusus dengan izin `GRANT SELECT ON ALL TABLES` saja. Jangan gunakan superuser `postgres`.\n2. **Statement Timeout**: Pasang batasan waktu eksekusi (`statement_timeout = 3000`) agar LLM tidak menjalankan query scan jutaan baris yang membebani CPU database utama.\n3. **Audit Log**: Simpan riwayat query yang dipanggil oleh model ke dalam file log terpisah untuk pemantauan kepatuhan privasi data.\n",
    "en": {
      "title": "Build Your Own Custom PostgreSQL MCP Server (Let Cursor & Claude Query Databases Safely)",
      "description": "Step-by-step guide to building a custom Model Context Protocol (MCP) server for PostgreSQL using TypeScript. Learn how to expose read-only schema inspection and query execution to AI assistants.",
      "content": "\n### 1. What is Model Context Protocol (MCP) Server?\nThe Model Context Protocol (MCP) is an open specification created by Anthropic ([github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)) enabling AI tools such as Claude Desktop and Cursor to interface safely with local databases, external APIs, and developer toolchains.\n\n### 2. TypeScript Project Initialization & MCP SDK\nInitialize your project and install official packages:\n```bash\nmkdir pg-mcp-server && cd pg-mcp-server\nnpm init -y\nnpm install @modelcontextprotocol/sdk pg dotenv\nnpm install -D typescript @types/node @types/pg tsx\n```\n\n### 3. Writing Schema Resources & PostgreSQL Query Tools\nImplement the server with `StdioServerTransport` and expose safe `get_tables` and read-only `run_readonly_query` tools with SQL assertion safeguards.\n\n### 4. Configuring Claude Desktop & Cursor IDE\nRegister the built script in `claude_desktop_config.json` with your Postgres connection URL and restart the client.\n\n### 5. Production Security Best Practices\nAlways bind the MCP server to a dedicated read-only database role, apply tight statement timeouts, and log every query for regulatory compliance.\n"
    }
  },
  {
    "slug": "panduan-autogen-0-4-grup-chat-multi-agent",
    "title": "Panduan Praktis AutoGen 0.4: Bikin Grup Chat Multi-Agent untuk Analisis Pasar Otomatis",
    "description": "Pelajari arsitektur baru Microsoft AutoGen 0.4 event-driven. Membangun ruang obrolan multi-agen berisi Agen Peneliti Web, Agen Analis Keuangan, dan Agen Pembuat Laporan Markdown.",
    "postType": "tutorial",
    "category": "ai-agents",
    "categoryLabel": "AI Agents",
    "difficulty": "Lanjutan",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "10 min baca",
    "author": "Edvan",
    "tags": [
      "AutoGen",
      "Microsoft",
      "Multi-Agent",
      "Python",
      "Financial Analysis"
    ],
    "affiliateProduct": {
      "name": "Dedicated AI Inference VPS",
      "priceEstimate": "Rp 280.000/bln",
      "linkUrl": "https://hetzner.com",
      "badge": "Compute Power",
      "description": "Server dengan multi-core tinggi untuk menjalankan simulasi orkestrasi 5+ agen secara simultan."
    },
    "toc": [
      {
        "id": "perubahan-besar-autogen-0-4",
        "title": "1. Perubahan Arsitektur AutoGen 0.4 (Core & AgentChat)"
      },
      {
        "id": "instalasi-dan-lingkungan-python",
        "title": "2. Instalasi Paket autogen-agentchat & autogen-ext"
      },
      {
        "id": "merancang-tim-analis-finansial",
        "title": "3. Merancang Tim: Peneliti, Analis Finansial, & Editor"
      },
      {
        "id": "orkestrasi-round-robin-group-chat",
        "title": "4. Menjalankan RoundRobinGroupChat & Terminasi Syarat"
      },
      {
        "id": "evaluasi-dan-simulasi-pasar",
        "title": "5. Menjalankan Simulasi Riset Saham & Menyimak Hasil"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Instal paket autogen-agentchat dan autogen-ext terbaru"
      },
      {
        "id": "step-2",
        "label": "Inisialisasi OpenAIChatCompletionClient atau model backend lokal"
      },
      {
        "id": "step-3",
        "label": "Tentukan 3 AssistantAgent dengan system_message spesifik"
      },
      {
        "id": "step-4",
        "label": "Bungkus agen ke dalam RoundRobinGroupChat dan jalankan runtime stream"
      }
    ],
    "content": "\n### 1. Perubahan Arsitektur AutoGen 0.4 (Core & AgentChat)\nPada pembaruan besar Microsoft AutoGen versi 0.4 ([github.com/microsoft/autogen](https://github.com/microsoft/autogen)), arsitektur monolitik lama digantikan dengan desain modular modern berbasis *Event-Driven Actor Model*:\n* **autogen-core**: Pondasi sistem pesan terdistribusi berbasis asynchronous event loop.\n* **autogen-agentchat**: Abstraksi tingkat tinggi untuk menyusun percakapan tim agen tanpa kode boilerplate.\n* **autogen-ext**: Modul integrasi eksternal untuk model OpenAI, Azure, Anthropic, dan eksekusi Docker.\n\n### 2. Instalasi Paket autogen-agentchat & autogen-ext\nGunakan Python 3.10 atau lebih tinggi dan pasang paket resmi versi 0.4:\n\n```bash\npip install -U autogen-agentchat autogen-ext[openai] python-dotenv\n```\n\nSimpan kunci API model Anda pada file `.env`:\n```env\nOPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx\n```\n\n### 3. Merancang Tim: Peneliti, Analis Finansial, & Editor\nBuat file `financial_team.py`. Di sini kita definisikan tiga agen spesialis yang saling mengoreksi draf:\n\n```python\nimport asyncio\nfrom autogen_agentchat.agents import AssistantAgent\nfrom autogen_agentchat.conditions import TextMentionTermination\nfrom autogen_agentchat.teams import RoundRobinGroupChat\nfrom autogen_ext.models.openai import OpenAIChatCompletionClient\n\nasync def main():\n    # 1. Konfigurasi model client\n    model_client = OpenAIChatCompletionClient(model=\"gpt-4o-mini\")\n\n    # 2. Agen 1: Peneliti Tren Makro\n    researcher = AssistantAgent(\n        name=\"Peneliti_Pasar\",\n        model_client=model_client,\n        system_message=\"Anda adalah peneliti data ekonomi. Tugas Anda adalah memaparkan fakta, berita terbaru, dan tren fundamental sektor teknologi.\"\n    )\n\n    # 3. Agen 2: Analis Keuangan & Risiko\n    analyst = AssistantAgent(\n        name=\"Analis_Risiko\",\n        model_client=model_client,\n        system_message=\"Anda adalah analis risiko kuantitatif. Evaluasi data dari Peneliti_Pasar, berikan catatan valuasi P/E, risiko volatilitas, dan potensi sentimen negatif.\"\n    )\n\n    # 4. Agen 3: Editor Eksekutif\n    editor = AssistantAgent(\n        name=\"Editor_Eksekutif\",\n        model_client=model_client,\n        system_message=\"Anda merangkum semua argumen ke dalam 1 lembar eksekutif ringkas. Jika laporan sudah komprehensif dan matang, akhiri pesan dengan kata: SELESAI_LAPORAN.\"\n    )\n```\n\n### 4. Menjalankan RoundRobinGroupChat & Terminasi Syarat\nKelompokkan ketiga agen tersebut ke dalam tim *Round Robin* dan tambahkan kondisi terminasi teks:\n\n```python\n    # Syarat berhenti ketika Editor mengeluarkan kata kunci\n    termination_condition = TextMentionTermination(\"SELESAI_LAPORAN\")\n\n    # Bungkus dalam Tim\n    team = RoundRobinGroupChat(\n        participants=[researcher, analyst, editor],\n        termination_condition=termination_condition,\n        max_turns=12\n    )\n\n    prompt = \"Buatkan analisis prospek investasi sektor semikonduktor AI untuk kuartal ke-4 tahun 2026.\"\n\n    print(\"=== MEMULAI SIMULASI TIM AUTOGEN 0.4 ===\")\n    async for message in team.run_stream(task=prompt):\n        print(f\"\\n[{message.source}]:\\n{message.content}\")\n\nif __name__ == \"__main__\":\n    asyncio.run(main())\n```\n\n### 5. Evaluasi dan Simulasi Pasar\nJalankan skrip di terminal:\n```bash\npython financial_team.py\n```\n\nPerhatikan bagaimana pesan bergerak terstruktur:\n1. Peneliti Pasar memaparkan lonjakan adopsi arsitektur AI on-device.\n2. Analis Risiko menantang proyeksi tersebut dengan risiko kenaikan suku bunga global dan keterbatasan pasokan silicon wafer.\n3. Editor Eksekutif menengahi kedua argumen, membuat poin rekomendasi portofolio seimbang, lalu memicu kata kunci terminasi. Tidak ada loop berputar tanpa batas!\n",
    "en": {
      "title": "Practical AutoGen 0.4 Guide: Building Multi-Agent Market Research Group Chats",
      "description": "Master Microsoft AutoGen 0.4 event-driven architecture. Build a collaborative multi-agent squad featuring Web Researchers, Financial Risk Analysts, and Executive Markdown Editors.",
      "content": "\n### 1. AutoGen 0.4 Architectural Paradigm Shift\nAutoGen 0.4 rewrote the core into an asynchronous, actor-based framework split between `autogen-core`, `autogen-agentchat`, and `autogen-ext`.\n\n### 2. Environment Setup\nInstall the modern components:\n```bash\npip install -U autogen-agentchat autogen-ext[openai] python-dotenv\n```\n\n### 3. Configuring Specialized Agents\nConfigure `AssistantAgent` instances powered by `OpenAIChatCompletionClient` with distinct domain personas.\n\n### 4. RoundRobinGroupChat & Termination Logic\nGroup the squad inside `RoundRobinGroupChat` coupled with a strict `TextMentionTermination` predicate to ensure clean convergence.\n\n### 5. Execution & Analysis Output\nRun the async stream loop to inspect step-by-step reasoning and synthesized markdown deliverables.\n"
    }
  },
  {
    "slug": "cara-bikin-ekstensi-chrome-ai-plasmo-gemini",
    "title": "Cara Bikin Ekstensi Chrome Berbasis AI Menggunakan Plasmo Framework & Gemini Nano / API",
    "description": "Panduan lengkap membungkus kecerdasan buatan ke dalam browser extension. Menggunakan framework Plasmo (React + TypeScript) dan integrasi Gemini API untuk merangkum teks halaman web dengan 1-klik.",
    "postType": "tutorial",
    "category": "web-dev",
    "categoryLabel": "Web Dev",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "9 min baca",
    "author": "Edvan",
    "tags": [
      "Plasmo",
      "Chrome Extension",
      "React",
      "Gemini API",
      "TypeScript"
    ],
    "affiliateProduct": {
      "name": "Google Workspace Developer Account",
      "priceEstimate": "Rp 75.000/bln",
      "linkUrl": "https://workspace.google.com",
      "badge": "Dev Suite",
      "description": "Akses penuh ke ekosistem Google AI Studio dan kuota API tier produksi."
    },
    "toc": [
      {
        "id": "kenapa-memilih-plasmo-framework",
        "title": "1. Kenapa Memilih Plasmo Framework untuk Ekstensi Browser?"
      },
      {
        "id": "membuat-proyek-plasmo-react",
        "title": "2. Inisialisasi Proyek Plasmo + Tailwind CSS"
      },
      {
        "id": "integrasi-gemini-sdk-popup",
        "title": "3. Menghubungkan Google GenAI SDK di Popup Extension"
      },
      {
        "id": "content-script-ekstraksi-halaman",
        "title": "4. Ekstraksi Teks Halaman dengan Content Script"
      },
      {
        "id": "build-dan-load-unpacked-chrome",
        "title": "5. Build Produksi & Menjalankan di Google Chrome"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Inisialisasi proyek Plasmo dengan template React dan TypeScript"
      },
      {
        "id": "step-2",
        "label": "Pasang @google/genai SDK dan siapkan API Key di environment"
      },
      {
        "id": "step-3",
        "label": "Tulis UI Popup modern dengan status loading dan tombol rangkum"
      },
      {
        "id": "step-4",
        "label": "Kirim pesan ke Content Script untuk mengambil teks artikel aktif"
      }
    ],
    "content": "\n### 1. Kenapa Memilih Plasmo Framework untuk Ekstensi Browser?\nMembangun ekstensi browser tradisional menggunakan manifest v3 murni sering kali melelahkan karena minimnya dukungan bawaan untuk bundler modern, HMR (*Hot Module Replacement*), dan TypeScript.\n\n**Plasmo Framework** ([github.com/PlasmoHQ/plasmo](https://github.com/PlasmoHQ/plasmo)) adalah standar emas pengembangan WebExtension modern. Plasmo mengotomatisasi pembuatan `manifest.json`, mendukung React/Vue, Tailwind CSS, serta isolasi penyimpanan lokal tanpa pusing mengelola konfigurasi Webpack.\n\n### 2. Inisialisasi Proyek Plasmo + Tailwind CSS\nBuka terminal dan jalankan generator proyek resmi Plasmo:\n\n```bash\npnpm create plasmo --with-react ai-summarizer-ext\ncd ai-summarizer-ext\npnpm install @google/genai\npnpm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p\n```\n\nKonfigurasi file `tailwind.config.js`:\n```javascript\n/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: [\"./src/**/*.{tsx,html}\", \"./popup.tsx\"],\n  theme: { extend: {} },\n  plugins: []\n}\n```\n\n### 3. Menghubungkan Google GenAI SDK di Popup Extension\nBuat antarmuka popup di file `popup.tsx`. Komponen ini akan tampil saat ikon ekstensi diklik oleh pengguna di toolbar Chrome:\n\n```tsx\nimport { useState } from \"react\"\nimport { GoogleGenAI } from \"@google/genai\"\nimport \"./style.css\"\n\nexport default function IndexPopup() {\n  const [summary, setSummary] = useState(\"\")\n  const [loading, setLoading] = useState(false)\n  const [apiKey, setApiKey] = useState(process.env.PLASMO_PUBLIC_GEMINI_KEY || \"\")\n\n  const summarizeCurrentTab = async () => {\n    setLoading(true)\n    setSummary(\"\")\n\n    try {\n      // 1. Dapatkan tab browser yang sedang aktif\n      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })\n      if (!tab.id) return\n\n      // 2. Eksekusi script untuk mengambil konten teks artikel\n      const injectionResults = await chrome.scripting.executeScript({\n        target: { tabId: tab.id },\n        func: () => {\n          const article = document.querySelector(\"article\") || document.querySelector(\"main\") || document.body\n          return article.innerText.slice(0, 8000) // Ambil 8000 karakter pertama\n        }\n      })\n\n      const pageText = injectionResults[0]?.result\n      if (!pageText) throw new Error(\"Gagal mengambil teks dari halaman.\")\n\n      // 3. Panggil Gemini API\n      const ai = new GoogleGenAI({ apiKey })\n      const response = await ai.models.generateContent({\n        model: \"gemini-2.5-flash\",\n        contents: `Rangkum artikel berikut dalam 3 poin bullet penting berbahasa Indonesia:\\n\\n${pageText}`\n      })\n\n      setSummary(response.text || \"Tidak ada respon.\")\n    } catch (err: any) {\n      setSummary(`Error: ${err.message}`)\n    } finally {\n      setLoading(false)\n    }\n  }\n\n  return (\n    <div className=\"w-96 p-4 bg-slate-900 text-slate-100 font-sans\">\n      <h1 className=\"text-lg font-bold text-sky-400 mb-2\">⚡ AI Page Summarizer</h1>\n      <p className=\"text-xs text-slate-400 mb-4\">Rangkum artikel web panjang menjadi 3 poin ringkas dalam 2 detik.</p>\n      \n      <button\n        onClick={summarizeCurrentTab}\n        disabled={loading}\n        className=\"w-full py-2 px-4 rounded bg-sky-600 hover:bg-sky-500 font-medium text-sm transition disabled:opacity-50\"\n      >\n        {loading ? \"Menganalisis Konten...\" : \"Rangkum Halaman Ini\"}\n      </button>\n\n      {summary && (\n        <div className=\"mt-4 p-3 bg-slate-800 rounded border border-slate-700 text-xs leading-relaxed whitespace-pre-line\">\n          {summary}\n        </div>\n      )}\n    </div>\n  )\n}\n```\n\n### 4. Content Script Ekstraksi Halaman\nTambahkan izin pada file `package.json` di bagian manifest kustom Plasmo agar ekstensi memiliki hak akses membaca tab aktif:\n\n```json\n{\n  \"manifest\": {\n    \"permissions\": [\"activeTab\", \"scripting\"],\n    \"host_permissions\": [\"https://*/*\"]\n  }\n}\n```\n\n### 5. Build Produksi & Menjalankan di Google Chrome\nUji ekstensi Anda dalam mode live-reload development:\n```bash\npnpm dev\n```\n\n1. Buka browser Google Chrome, navigasikan ke alamat `chrome://extensions/`.\n2. Aktifkan sakelar **Developer mode** di pojok kanan atas.\n3. Klik tombol **Load unpacked**, lalu arahkan ke folder `build/chrome-mv3-dev` di dalam proyek Anda.\n4. Buka halaman berita atau blog teknis, lalu klik ikon ekstensi AI Anda untuk merangkum secara instan!\n",
    "en": {
      "title": "How to Build an AI-Powered Chrome Extension with Plasmo & Gemini",
      "description": "Comprehensive tutorial on creating browser extensions using the Plasmo framework (React + TypeScript) and the Google GenAI SDK to summarize web articles in one click.",
      "content": "\n### 1. Why Choose Plasmo Framework?\nPlasmo ([github.com/PlasmoHQ/plasmo](https://github.com/PlasmoHQ/plasmo)) provides zero-config Manifest V3 scaffolding, instant hot reloading, and native React support for browser extension engineering.\n\n### 2. Scaffolding Project with Tailwind CSS\nGenerate the boilerplate and install necessary dependencies:\n```bash\npnpm create plasmo --with-react ai-summarizer-ext\ncd ai-summarizer-ext\npnpm install @google/genai\n```\n\n### 3. Integrating Google GenAI SDK in Extension Popup\nBuild a sleek interactive popup leveraging `chrome.tabs.query` and `chrome.scripting.executeScript` to extract active DOM text and summarize via `gemini-2.5-flash`.\n\n### 4. Manifest V3 Permissions\nDeclare `activeTab` and `scripting` in `package.json` manifest overrides.\n\n### 5. Development Build & Chrome Unpacked Loading\nExecute `pnpm dev`, open `chrome://extensions`, toggle Developer Mode, and select `build/chrome-mv3-dev` to inspect live.\n"
    }
  },
  {
    "slug": "tutorial-langchain-expression-language-lcel",
    "title": "Tutorial LangChain Expression Language (LCEL): Bangun Pipeline RAG Modern Tanpa Ribet",
    "description": "Panduan mendalam menguasai sintaks pipe operator (|) pada LCEL. Menggantikan kelas legacy chain dengan pipeline komposisi fungsional yang mendukung streaming, batching, dan async secara otomatis.",
    "postType": "tutorial",
    "category": "ai-agents",
    "categoryLabel": "AI Agents",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "8 min baca",
    "author": "Edvan",
    "tags": [
      "LangChain",
      "LCEL",
      "RAG",
      "Python",
      "Vector DB",
      "Prompt Engineering"
    ],
    "affiliateProduct": {
      "name": "Serverless Vector Database Tier",
      "priceEstimate": "Rp 175.000/bln",
      "linkUrl": "https://pinecone.io",
      "badge": "Database AI",
      "description": "Indeks vektor instan dengan latensi sub-50ms untuk pipeline RAG produksi."
    },
    "toc": [
      {
        "id": "kenapa-langchain-beralih-ke-lcel",
        "title": "1. Kenapa LangChain Beralih ke LCEL?"
      },
      {
        "id": "konsep-dasar-pipe-operator",
        "title": "2. Anatomi Dasar Operator Pipe (|) & Runnable"
      },
      {
        "id": "membangun-pipeline-rag-lcel",
        "title": "3. Membangun Pipeline RAG Lengkap dengan Vector Store"
      },
      {
        "id": "fitur-bawaan-streaming-dan-async",
        "title": "4. Fitur Bawaan: Streaming Token & Pemanggilan Asynchronous"
      },
      {
        "id": "debugging-lcel-dengan-langsmith",
        "title": "5. Debugging & Visualisasi Eksekusi Chain"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Instal langchain-core, langchain-community, dan penyedia LLM"
      },
      {
        "id": "step-2",
        "label": "Pahami fungsi RunnablePassthrough dan StrOutputParser"
      },
      {
        "id": "step-3",
        "label": "Hubungkan retriever dokumen dengan prompt template via operator |"
      },
      {
        "id": "step-4",
        "label": "Gunakan method .stream() untuk output real-time di terminal"
      }
    ],
    "content": "\n### 1. Kenapa LangChain Beralih ke LCEL?\nPada versi LangChain awal, pengguna dihadapkan pada puluhan kelas rantai (*chains*) yang kaku seperti `LLMChain`, `ConversationalRetrievalChain`, atau `SequentialChain`. Setiap kelas memiliki parameter tersembunyi yang sulit di-debug dan tidak ramah streaming.\n\n**LangChain Expression Language (LCEL)** ([github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain)) mengubah paradigma tersebut menjadi gaya deklaratif fungsional:\n* Setiap komponen adalah **Runnable**.\n* Komposisi dilakukan lewat operator pipe (`|`), mirip pipa Unix di terminal bash.\n* Setiap pipeline secara otomatis mendapatkan dukungan sinkron, asinkron (`ainvoke`), batching (`batch`), dan streaming token (`stream`) tanpa perlu menulis ulang fungsi.\n\n### 2. Konsep Dasar Pipe Operator (|) & Runnable\nPerhatikan contoh pipeline paling sederhana di bawah ini:\n\n```python\nfrom langchain_core.prompts import ChatPromptTemplate\nfrom langchain_core.output_parsers import StrOutputParser\nfrom langchain_openai import ChatOpenAI\n\n# 1. Definisikan komponen runnable\nprompt = ChatPromptTemplate.from_template(\"Berikan 3 analogi sederhana untuk menjelaskan konsep {topik}.\")\nmodel = ChatOpenAI(model=\"gpt-4o-mini\", temperature=0.7)\noutput_parser = StrOutputParser()\n\n# 2. Rangkai dengan operator pipe (|)\nchain = prompt | model | output_parser\n\n# 3. Eksekusi\nresult = chain.invoke({\"topik\": \"Asynchronous Event Loop\"})\nprint(result)\n```\n\nData mengalir mulus: Dictionary input masuk ke Prompt -> Menghasilkan PromptValue -> Diteruskan ke LLM -> Menghasilkan AIMessage -> Dikonversi menjadi String murni oleh Output Parser.\n\n### 3. Membangun Pipeline RAG Lengkap dengan Vector Store\nMari kita buat sistem tanya jawab dokumen (*Retrieval-Augmented Generation*) menggunakan LCEL murni:\n\n```python\nfrom langchain_community.vectorstores import FAISS\nfrom langchain_openai import OpenAIEmbeddings, ChatOpenAI\nfrom langchain_core.prompts import ChatPromptTemplate\nfrom langchain_core.runnables import RunnablePassthrough\nfrom langchain_core.output_parsers import StrOutputParser\n\n# Inisialisasi basis data pengetahuan mini\ncorpus = [\n    \"Peraturan Perusahaan Pasal 14: Jam kerja fleksibel dimulai antara pukul 08.00 hingga 10.00 WIB.\",\n    \"Peraturan Perusahaan Pasal 15: Cuti tahunan berjumlah 14 hari kerja setelah masa kerja 1 tahun.\",\n    \"Peraturan Perusahaan Pasal 16: Tunjangan internet bulanan sebesar Rp 500.000 untuk karyawan WFH.\"\n]\n\nembeddings = OpenAIEmbeddings()\nvectorstore = FAISS.from_texts(corpus, embedding=embeddings)\nretriever = vectorstore.as_retriever(search_kwargs={\"k\": 2})\n\n# Template instruksi LLM\ntemplate = \"\"\"Jawab pertanyaan berikut hanya berdasarkan konteks yang disediakan:\nKonteks:\n{context}\n\nPertanyaan: {question}\nJawaban:\"\"\"\n\nrag_prompt = ChatPromptTemplate.from_template(template)\nllm = ChatOpenAI(model=\"gpt-4o-mini\")\n\n# Fungsi pembantu merapikan dokumen retriever\ndef format_docs(docs):\n    return \"\\n\\n\".join(d.page_content for d in docs)\n\n# RAG Chain LCEL\nrag_chain = (\n    {\"context\": retriever | format_docs, \"question\": RunnablePassthrough()}\n    | rag_prompt\n    | llm\n    | StrOutputParser()\n)\n\nresponse = rag_chain.invoke(\"Berapa tunjangan pulsa atau internet untuk karyawan remote?\")\nprint(\"HASIL RAG:\", response)\n```\n\n### 4. Fitur Bawaan: Streaming Token & Pemanggilan Asynchronous\nKeunggulan utama LCEL adalah Anda tidak perlu memodifikasi kode chain untuk menampilkan efek mengetik secara real-time:\n\n```python\nimport sys\n\nprint(\"Streaming jawaban: \", end=\"\", flush=True)\nfor chunk in rag_chain.stream(\"Berapa lama masa cuti tahunan dan syaratnya?\"):\n    sys.stdout.write(chunk)\n    sys.stdout.flush()\nprint()\n```\n\n### 5. Debugging & Visualisasi Eksekusi Chain\nGunakan variabel lingkungan `LANGCHAIN_TRACING_V2=\"true\"` dan sambungkan ke akun **LangSmith**. Setiap langkah dalam pipa LCEL Anda (durasi latensi, token input, respons mentah JSON) akan langsung terpeta rapi dalam diagram alur web yang mudah dianalisis.\n",
    "en": {
      "title": "LangChain Expression Language (LCEL) Tutorial: Modern RAG Pipelines",
      "description": "Master the declarative pipe operator (|) in LCEL. Replace cumbersome legacy chain classes with modern functional runnables that natively support streaming, batching, and async execution.",
      "content": "\n### 1. Why Migrate to LCEL?\nLCEL ([github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain)) transitions LangChain from opaque classes into composable, transparent Runnables connected via the Unix pipe (`|`) paradigm.\n\n### 2. Anatomy of the Pipe Operator & Runnables\nCompose prompt templates, model clients, and output parsers declaratively: `chain = prompt | model | parser`.\n\n### 3. Full-Fledged RAG Pipeline with Vector Retrieval\nConstruct production RAG architectures using `RunnablePassthrough` and vector store retrievers without boilerplate wrappers.\n\n### 4. Native Streaming & Asynchronous Primitives\nEvery LCEL chain natively exposes `.stream()`, `.ainvoke()`, and `.batch()` without code modifications.\n\n### 5. Tracing with LangSmith\nSet `LANGCHAIN_TRACING_V2=true` to visualize execution trees, latency bottlenecks, and token expenditure.\n"
    }
  },
  {
    "slug": "cara-setup-vllm-ubuntu-server-inferensi-kilat",
    "title": "Cara Setup vLLM di Ubuntu Server: Inferensi Model LLM Berkecepatan Tinggi dengan PagedAttention",
    "description": "Panduan komprehensif menginstal dan mengonfigurasi vLLM di server GPU Ubuntu. Mengoptimalkan throughput token per detik hingga 10x lipat lebih tinggi dari HuggingFace standar menggunakan PagedAttention.",
    "postType": "tutorial",
    "category": "ai-infrastructure",
    "categoryLabel": "AI Infrastructure",
    "difficulty": "Lanjutan",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "10 min baca",
    "author": "Edvan",
    "tags": [
      "vLLM",
      "Linux",
      "Ubuntu",
      "GPU",
      "NVIDIA",
      "LLM Serving",
      "PagedAttention"
    ],
    "affiliateProduct": {
      "name": "GPU Cloud Instance (NVIDIA RTX 4090 / A10G)",
      "priceEstimate": "Rp 650.000/bln",
      "linkUrl": "https://runpod.io",
      "badge": "Compute Pilihan",
      "description": "Server GPU siap pakai dengan driver CUDA 12.4 terkonfigurasi untuk vLLM."
    },
    "toc": [
      {
        "id": "kenapa-memilih-vllm",
        "title": "1. Kenapa vLLM Jauh Lebih Cepat Dibanding Solusi Lain?"
      },
      {
        "id": "persiapan-server-ubuntu-cuda",
        "title": "2. Persiapan Driver NVIDIA & CUDA Toolkit di Ubuntu"
      },
      {
        "id": "instalasi-vllm-python-env",
        "title": "3. Instalasi vLLM dalam Virtual Environment"
      },
      {
        "id": "menjalankan-openai-compatible-server",
        "title": "4. Menjalankan Server API OpenAI-Compatible"
      },
      {
        "id": "benchmarking-dan-tuning-memory",
        "title": "5. Parameter Tuning: gpu-memory-utilization & max-model-len"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Pastikan driver NVIDIA dan CUDA 12.1+ sudah aktif dengan perintah nvidia-smi"
      },
      {
        "id": "step-2",
        "label": "Instal vLLM menggunakan pip pada lingkungan virtual Python 3.10+"
      },
      {
        "id": "step-3",
        "label": "Jalankan vllm serve dengan model DeepSeek atau Llama 3"
      },
      {
        "id": "step-4",
        "label": "Kirim HTTP POST request ke endpoint /v1/chat/completions untuk validasi"
      }
    ],
    "content": "\n### 1. Kenapa vLLM Jauh Lebih Cepat Dibanding Solusi Lain?\nSaat melayani banyak permintaan (*concurrency* tinggi) ke sebuah LLM, pemborosan memori terbesar terletak pada **KV Cache** (Key-Value cache dari layer attention).\n\nFramework konvensional mengalokasikan memori KV cache secara statis berdasarkan panjang konteks maksimum teoritis, menyebabkan fragmentasi memori hingga 60-80%.\n\n**vLLM** ([github.com/vllm-project/vllm](https://github.com/vllm-project/vllm)) memecahkan masalah ini dengan algoritma revolusioner bernama **PagedAttention** (terinspirasi dari virtual memory paging di sistem operasi Linux). Hasilnya:\n* Fragmentasi memori mendekati 0%.\n* Dukungan *continuous batching* otomatis.\n* Throughput inferensi meningkat **5x hingga 10x lipat** dibandingkan Hugging Face Transformers biasa pada GPU yang sama.\n\n### 2. Persiapan Driver NVIDIA & CUDA Toolkit di Ubuntu\nPastikan server Anda memiliki GPU diskret dengan VRAM minimal 16GB (seperti RTX 4090, A4000, A10G, atau A100). Verifikasi status GPU di terminal:\n\n```bash\nnvidia-smi\n```\n\nPastikan versi CUDA yang didukung minimal **12.1** atau **12.4**. Perbarui repositori paket Ubuntu:\n\n```bash\nsudo apt update && sudo apt install -y python3-pip python3-venv git\n```\n\n### 3. Instalasi vLLM dalam Virtual Environment\nBuat lingkungan virtual terpisah agar tidak merusak paket sistem:\n\n```bash\npython3 -m venv vllm-env\nsource vllm-env/bin/activate\npip install --upgrade pip\n\n# Instal paket vLLM pra-kompilasi CUDA\npip install vllm\n```\n\n### 4. Menjalankan Server API OpenAI-Compatible\nvLLM menyediakan server API bawaan yang 100% kompatibel dengan format endpoint OpenAI (`/v1/chat/completions`). Artinya, Anda bisa langsung menghubungkannya ke antarmuka chat seperti Open WebUI, Dify, atau Cline.\n\nJalankan perintah berikut untuk mengunduh dan menyajikan model Llama-3.1-8B-Instruct:\n\n```bash\npython3 -m vllm.entrypoints.openai.api_server \\\n    --model meta-llama/Llama-3.1-8B-Instruct \\\n    --port 8000 \\\n    --gpu-memory-utilization 0.90 \\\n    --max-model-len 8192\n```\n\nJika menggunakan model terkuantisasi (AWQ / GPTQ) untuk menghemat VRAM:\n```bash\npython3 -m vllm.entrypoints.openai.api_server \\\n    --model casperhansen/llama-3.1-8b-instruct-awq \\\n    --quantization awq \\\n    --port 8000\n```\n\n### 5. Parameter Tuning: gpu-memory-utilization & max-model-len\nUntuk menghindari galat *Out Of Memory (OOM)* pada beban kerja produksi:\n1. `--gpu-memory-utilization 0.92`: Memberikan 92% VRAM untuk model dan KV cache, menyisakan 8% untuk overhead komputasi CUDA.\n2. `--tensor-parallel-size 2`: Jika Anda memiliki 2 unit GPU, flag ini akan memecah bobot model secara seimbang menggunakan NVLink/PCIe.\n3. **Uji Endpoint dengan cURL**:\n\n```bash\ncurl http://localhost:8000/v1/chat/completions \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"meta-llama/Llama-3.1-8B-Instruct\",\n    \"messages\": [\n      {\"role\": \"user\", \"content\": \"Jelaskan apa itu PagedAttention dalam 2 kalimat.\"}\n    ],\n    \"temperature\": 0.2\n  }'\n```\n",
    "en": {
      "title": "How to Setup vLLM on Ubuntu Server: High-Throughput Inference with PagedAttention",
      "description": "Comprehensive guide to configuring vLLM on GPU Linux machines. Achieve 10x higher token generation throughput with zero memory fragmentation using PagedAttention.",
      "content": "\n### 1. Why vLLM Dominates LLM Serving\nvLLM ([github.com/vllm-project/vllm](https://github.com/vllm-project/vllm)) introduces PagedAttention, managing attention keys and values like virtual memory pages in operating systems.\n\n### 2. NVIDIA Drivers & CUDA Verification\nEnsure NVIDIA drivers and CUDA 12.1+ are operational via `nvidia-smi`.\n\n### 3. Installing vLLM in Isolated Environments\nSet up a clean virtual environment and install prebuilt CUDA wheels via `pip install vllm`.\n\n### 4. Deploying OpenAI-Compatible Endpoints\nServe models with `vllm.entrypoints.openai.api_server` exposing `/v1/chat/completions` directly compatible with third-party web UIs.\n\n### 5. Memory & Quantization Tuning\nTune `--gpu-memory-utilization` and configure multi-GPU tensor parallelism for rock-solid stability.\n"
    }
  },
  {
    "slug": "tutorial-rag-multimodal-colpali-baca-grafik-pdf",
    "title": "Tutorial RAG Multimodal dengan ColPali: Tanya Jawab Dokumen PDF Kompleks Termasuk Grafik & Tabel",
    "description": "Tinggalkan OCR konvensional yang sering salah baca! Pelajari cara membangun sistem RAG berbasis vision multimodal menggunakan model ColPali untuk memahami dokumen laporan keuangan, diagram, dan tabel kompleks.",
    "postType": "tutorial",
    "category": "ai-rag",
    "categoryLabel": "AI & RAG",
    "difficulty": "Lanjutan",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "10 min baca",
    "author": "Edvan",
    "tags": [
      "ColPali",
      "Multimodal RAG",
      "Vision AI",
      "PDF Extraction",
      "Python",
      "Embeddings"
    ],
    "affiliateProduct": {
      "name": "High RAM Cloud Computing Instance",
      "priceEstimate": "Rp 450.000/bln",
      "linkUrl": "https://vast.ai",
      "badge": "Vision Power",
      "description": "Instance GPU VRAM 24GB untuk melakukan render dan indexing embedding gambar PDF resolusi tinggi."
    },
    "toc": [
      {
        "id": "masalah-ocr-pada-rag-biasa",
        "title": "1. Kenapa OCR Biasa Selalu Gagal pada Dokumen Kompleks?"
      },
      {
        "id": "arsitektur-revolusioner-colpali",
        "title": "2. Arsitektur ColPali: ColBERT Bertemu Vision Transformer"
      },
      {
        "id": "konversi-pdf-ke-embedding-gambar",
        "title": "3. Konversi Lembar PDF Menjadi Vektor Multi-Vektor"
      },
      {
        "id": "querying-dan-late-interaction",
        "title": "4. Eksekusi Query Menggunakan Late Interaction Scoring"
      },
      {
        "id": "sintesis-jawaban-dengan-vlm",
        "title": "5. Mengirim Lembar Halaman Terpilih ke Vision LLM"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Konversi file PDF menjadi rangkaian gambar JPEG/PNG per halaman"
      },
      {
        "id": "step-2",
        "label": "Instal colpali-engine dan muat model vidore/colpali-v1.2"
      },
      {
        "id": "step-3",
        "label": "Ekstrak multi-vector patch embeddings untuk setiap halaman dokumen"
      },
      {
        "id": "step-4",
        "label": "Lakukan pencarian kesamaan patch dan teruskan halaman terbaik ke Vision LLM"
      }
    ],
    "content": "\n### 1. Kenapa OCR Biasa Selalu Gagal pada Dokumen Kompleks?\nSistem RAG teks tradisional selalu mengandalkan konversi OCR (*Optical Character Recognition*) seperti Tesseract atau pdfplumber sebelum memecah dokumen menjadi chunks.\n\nPendekatan lama ini memiliki kelemahan fatal:\n* **Tabel Kompleks Hancur**: Urutan kolom dan baris sering kali tertukar menjadi paragraf teks yang acak-acakan.\n* **Grafik & Infografis Hilang**: Diagram batang, flowchart arsitektur, dan peta proses dilewati begitu saja karena tidak mengandung teks polos.\n* **Konteks Spasial Lenyap**: Hubungan antara *caption* di bawah gambar dengan diagram di atasnya terputus saat teks di-ekstrak secara linear.\n\n### 2. Arsitektur Revolusioner ColPali: ColBERT Bertemu Vision Transformer\n**ColPali** ([github.com/illuin-tech/colpali](https://github.com/illuin-tech/colpali)) memperkenalkan paradigma baru: **Membaca dokumen seperti mata manusia membaca kertas**.\n\nDibangun di atas fondasi Vision-Language Model PaliGemma dan teknik pencocokan *Late Interaction* ColBERT:\n* Dokumen tidak di-OCR menjadi teks. Setiap lembar halaman PDF diubah menjadi gambar utuh.\n* Gambar dipecah menjadi ratusan patch visual kecil (16x16 piksel) yang masing-masing memiliki representasi vektor 128-dimensi.\n* Saat pengguna bertanya, pertanyaan teks dicocokkan langsung ke patch visual (tabel, kurva grafik, atau header teks) dengan kecepatan tinggi.\n\n### 3. Konversi Lembar PDF Menjadi Vektor Multi-Vektor\nPasang pustaka yang diperlukan:\n\n```bash\npip install colpali-engine pdf2image torch transformers pillow\n```\n\nGunakan skrip Python berikut untuk memproses lembar dokumen PDF:\n\n```python\nimport torch\nfrom pdf2image import convert_from_path\nfrom PIL import Image\nfrom colpali_engine.models import ColPali, ColPaliProcessor\n\n# 1. Muat model ColPali ke GPU\ndevice = \"cuda\" if torch.cuda.is_available() else \"cpu\"\nmodel_name = \"vidore/colpali-v1.2\"\n\nmodel = ColPali.from_pretrained(model_name, torch_dtype=torch.bfloat16, device_map=device)\nprocessor = ColPaliProcessor.from_pretrained(model_name)\n\n# 2. Render lembar PDF ke list objek PIL Images\nimages = convert_from_path(\"laporan_keuangan_q3_2026.pdf\")\nprint(f\"Total halaman dokumen yang diproses: {len(images)}\")\n\n# 3. Hitung embedding multi-vektor untuk setiap halaman\ndataloader = processor.process_images(images).to(device)\nwith torch.no_grad():\n    image_embeddings = model(**dataloader)\n\nprint(\"Dimensi embedding per halaman:\", image_embeddings.shape)\n```\n\n### 4. Querying dan Late Interaction Scoring\nSaat pertanyaan diajukan, ColPali melakukan perhitungan kesamaan maksimal (*MaxSim*) antara vektor kata pertanyaan dan vektor patch visual dokumen:\n\n```python\npertanyaan = \"Berapa persen pertumbuhan laba bersih pada diagram kuartal ketiga?\"\n\n# Proses teks pertanyaan\nquery_input = processor.process_queries([pertanyaan]).to(device)\nwith torch.no_grad():\n    query_embeddings = model(**query_input)\n\n# Hitung skor kemiripan Late Interaction\nscores = processor.score_multi_vector(query_embeddings, image_embeddings)\nbest_page_idx = torch.argmax(scores[0]).item()\n\nprint(f\"Halaman paling relevan ditemukan pada: Halaman {best_page_idx + 1}\")\n```\n\n### 5. Sintesis Jawaban dengan VLM\nSetelah ColPali menemukan nomor halaman yang tepat, kirimkan gambar lembar tersebut secara utuh ke model seperti **Gemini 2.5 Flash** atau **Claude 3.7 Sonnet**:\n\n```python\nfrom google import genai\n\nclient = genai.Client()\ntarget_image = images[best_page_idx]\ntarget_image.save(\"selected_page.jpg\")\n\nwith open(\"selected_page.jpg\", \"rb\") as f:\n    response = client.models.generate_content(\n        model=\"gemini-2.5-flash\",\n        contents=[\n            \"Ekstrak angka pertumbuhan laba bersih dari diagram batang di halaman ini dan jelaskan secara rinci.\",\n            genai.types.Part.from_bytes(f.read(), mime_type=\"image/jpeg\")\n        ]\n    )\n\nprint(\"Jawaban Eksekutif:\\n\", response.text)\n```\n",
    "en": {
      "title": "Multimodal RAG with ColPali: Querying Complex PDFs, Graphs, and Tables",
      "description": "Ditch flawed OCR parsers! Learn how to build vision-based multimodal RAG with ColPali to accurately parse financial charts, diagrams, and complex tabular documents.",
      "content": "\n### 1. The Fundamental Limits of Traditional OCR\nStandard RAG frameworks decompose PDFs into textual chunks using OCR engines that frequently destroy tabular schemas and omit graphical insights.\n\n### 2. The ColPali Architecture\nColPali ([github.com/illuin-tech/colpali](https://github.com/illuin-tech/colpali)) embeds document pages as collections of visual token vectors powered by PaliGemma and ColBERT late interaction.\n\n### 3. Converting PDF Pages to Multi-Vector Representations\nUtilize `pdf2image` and `colpali_engine` to ingest full-fidelity page renders directly into patch embedding matrices.\n\n### 4. Querying via Late Interaction Scoring\nMatch query token embeddings against visual patches using MaxSim operators to identify target pages.\n\n### 5. Answer Synthesis with Vision-Language Models\nFeed the retrieved high-resolution page render directly into multimodal models (e.g. Gemini 2.5 Flash) for factual synthesis.\n"
    }
  },
  {
    "slug": "bikin-bot-whatsapp-ai-baileys-groq-api-ngebut",
    "title": "Bikin Bot WhatsApp AI Super Cepat dengan Library Baileys & Groq Llama 3.3 API",
    "description": "Panduan merakit bot asisten WhatsApp pintar berbasis Node.js. Menghubungkan library soket Baileys dengan akselerator LPU Groq untuk menghasilkan balasan pesan cerdas dalam waktu di bawah 1 detik.",
    "postType": "tutorial",
    "category": "automation",
    "categoryLabel": "Automation",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "9 min baca",
    "author": "Edvan",
    "tags": [
      "WhatsApp Bot",
      "Baileys",
      "Node.js",
      "Groq",
      "Llama 3",
      "Automation"
    ],
    "affiliateProduct": {
      "name": "VPS Cloud 2 vCPU 4GB RAM",
      "priceEstimate": "Rp 89.000/bln",
      "linkUrl": "https://contabo.com",
      "badge": "Best Value Host",
      "description": "Server dengan uptime 99.9% untuk menjalankan koneksi socket WhatsApp 24 jam nonstop."
    },
    "toc": [
      {
        "id": "kenapa-baileys-dan-groq",
        "title": "1. Kombinasi Maut: Baileys Tanpa Browser & Groq LPU"
      },
      {
        "id": "persiapan-proyek-nodejs",
        "title": "2. Inisialisasi Proyek Node.js & Instalasi Dependensi"
      },
      {
        "id": "autentikasi-qr-multi-device",
        "title": "3. Konfigurasi Autentikasi QR Code Multi-Device"
      },
      {
        "id": "integrasi-groq-cloud-sdk",
        "title": "4. Menghubungkan Groq SDK untuk Balasan Super Cepat"
      },
      {
        "id": "menjaga-bot-tetap-hidup-pm2",
        "title": "5. Menjalankan Bot Nonstop Menggunakan PM2"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Inisialisasi proyek Node.js dan pasang @whiskeysockets/baileys serta groq-sdk"
      },
      {
        "id": "step-2",
        "label": "Tulis skrip listener event connection.update untuk menampilkan kode QR di terminal"
      },
      {
        "id": "step-3",
        "label": "Filter pesan masuk yang mengandung awalan perintah (misal: !tanya)"
      },
      {
        "id": "step-4",
        "label": "Kirim prompt ke model Llama 3.3 70B di Groq dan balas via sendMessage"
      }
    ],
    "content": "\n### 1. Kombinasi Maut: Baileys Tanpa Browser & Groq LPU\nMembangun bot WhatsApp menggunakan Puppeteer atau browser automation sering memakan RAM hingga lebih dari 1.5 GB dan rawan terputus.\n\nSolusi terbaik adalah menggunakan **Baileys** ([github.com/WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)), pustaka TypeScript murni yang berkomunikasi langsung dengan protokol WebSocket enkripsi WhatsApp Web tanpa membutuhkan browser Chromium sama sekali (hemat RAM di bawah 100 MB).\n\nDikombinasikan dengan **Groq API** ([groq.com](https://groq.com)) yang ditenagai chip LPU (*Language Processing Unit*), respons model Llama 3.3 70B dapat dikembalikan ke ponsel pengguna dengan kecepatan luar biasa: **di bawah 800 milidetik!**\n\n### 2. Inisialisasi Proyek Node.js & Instalasi Dependensi\nBuka terminal Anda dan siapkan direktori kerja:\n\n```bash\nmkdir wa-ai-bot && cd wa-ai-bot\nnpm init -y\nnpm install @whiskeysockets/baileys qrcode-terminal groq-sdk dotenv pino\nnpm install -D tsx typescript @types/node\n```\n\nBuat file `.env` untuk menyimpan kunci API Groq:\n```env\nGROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxx\n```\n\n### 3. Autentikasi QR Code Multi-Device\nBuat file `index.ts`. Skrip ini akan mengelola sesi login dan menyimpan kredensial ke folder `auth_info_baileys`:\n\n```typescript\nimport makeWASocket, {\n  useMultiFileAuthState,\n  DisconnectReason\n} from '@whiskeysockets/baileys';\nimport qrcode from 'qrcode-terminal';\nimport Groq from 'groq-sdk';\nimport pino from 'pino';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nconst groq = new Groq({ apiKey: process.env.GROQ_API_KEY });\n\nasync function startWhatsAppBot() {\n  const { state, saveCreds } = await useMultiFileAuthState('auth_session');\n\n  const sock = makeWASocket({\n    auth: state,\n    printQRInTerminal: true,\n    logger: pino({ level: 'silent' })\n  });\n\n  sock.ev.on('creds.update', saveCreds);\n\n  sock.ev.on('connection.update', (update) => {\n    const { connection, lastDisconnect, qr } = update;\n\n    if (qr) {\n      console.log(\"Silakan scan QR code berikut menggunakan aplikasi WhatsApp Anda:\");\n    }\n\n    if (connection === 'close') {\n      const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;\n      console.log('Koneksi terputus. Menyambung ulang...', shouldReconnect);\n      if (shouldReconnect) {\n        startWhatsAppBot();\n      }\n    } else if (connection === 'open') {\n      console.log('✅ Bot WhatsApp AI Berhasil Terhubung!');\n    }\n  });\n\n  // Listener pesan masuk\n  sock.ev.on('messages.upsert', async ({ messages, type }) => {\n    if (type !== 'notify') return;\n    const msg = messages[0];\n    if (!msg.message || msg.key.fromMe) return;\n\n    const senderJid = msg.key.remoteJid!;\n    const messageText = \n      msg.message.conversation || \n      msg.message.extendedTextMessage?.text || '';\n\n    // Deteksi jika pesan ditujukan ke bot\n    if (messageText.toLowerCase().startsWith('!tanya ')) {\n      const query = messageText.slice(7).trim();\n      await sock.sendPresenceUpdate('composing', senderJid);\n\n      try {\n        const chatCompletion = await groq.chat.completions.create({\n          messages: [\n            {\n              role: 'system',\n              content: 'Anda adalah asisten WhatsApp pribadi yang cerdas, ramah, dan ringkas. Berikan jawaban informatif dalam bahasa Indonesia dengan format rapi tanpa bertele-tele.'\n            },\n            { role: 'user', content: query }\n          ],\n          model: 'llama-3.3-70b-versatile',\n          temperature: 0.6\n        });\n\n        const replyText = chatCompletion.choices[0]?.message?.content || 'Maaf, gagal memproses jawaban.';\n        await sock.sendMessage(senderJid, { text: replyText }, { quoted: msg });\n      } catch (error: any) {\n        console.error(\"Gagal memanggil Groq:\", error);\n        await sock.sendMessage(senderJid, { text: \"Terjadi kesalahan saat memproses jawaban AI.\" });\n      }\n    }\n  });\n}\n\nstartWhatsAppBot();\n```\n\n### 4. Integrasi Groq Cloud SDK\nPada kode di atas, model `llama-3.3-70b-versatile` digunakan karena menawarkan kemampuan penalaran setara GPT-4o namun dengan latensi token per detik yang sangat superior untuk interaksi chat instan di ponsel.\n\n### 5. Menjalankan Bot Nonstop Menggunakan PM2\nAgar bot tidak mati saat terminal Anda ditutup atau server restart:\n\n```bash\n# Instal PM2 secara global\nnpm install -g pm2\n\n# Jalankan bot sebagai background daemon\npm2 start \"npx tsx index.ts\" --name wa-ai-bot\npm2 save\npm2 startup\n```\n\nSekarang Anda memiliki asisten AI pribadi di kantong Anda 24/7 yang siap merespons setiap pertanyaan dalam sekejap mata!\n",
    "en": {
      "title": "Build Ultra-Fast AI WhatsApp Bots with Baileys & Groq LPU",
      "description": "Step-by-step guide to building a lightweight Node.js WhatsApp AI assistant using Baileys socket library and Groq Llama 3.3 API for sub-second smart replies.",
      "content": "\n### 1. Why Baileys and Groq Outperform Browsers\nBaileys ([github.com/WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)) communicates directly through WhatsApp Web WebSockets without heavy Chromium dependencies, while Groq LPU infrastructure yields near-instant responses.\n\n### 2. Node.js Project Setup\nInitialize project and install dependencies:\n```bash\nnpm install @whiskeysockets/baileys qrcode-terminal groq-sdk dotenv pino\n```\n\n### 3. QR Authentication & Multi-Device Sessions\nConfigure `useMultiFileAuthState` to serialize sessions securely on disk and listen to socket events.\n\n### 4. Hooking Groq Llama 3.3 70B\nIntercept inbound messages matching `!tanya`, trigger typing status indicators, and query Groq with concise system instructions.\n\n### 5. Production Daemonization via PM2\nDaemonize using PM2 to maintain persistent socket reconnection and high availability.\n"
    }
  },
  {
    "slug": "cara-bikin-ai-coding-assistant-neovim-avante",
    "title": "Cara Setup AI Coding Assistant di Neovim Menggunakan Avante.nvim (Alternatif Cursor di Terminal)",
    "description": "Ubah editor Neovim Anda menjadi IDE AI canggih layaknya Cursor. Pelajari cara memasang avante.nvim, mengonfigurasi model Anthropic Claude / DeepSeek, dan melakukan inline code refactoring langsung di terminal.",
    "postType": "tutorial",
    "category": "developer-tools",
    "categoryLabel": "Dev Tools",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "8 min baca",
    "author": "Edvan",
    "tags": [
      "Neovim",
      "Avante.nvim",
      "Lua",
      "Terminal",
      "AI Assistant",
      "Productivity"
    ],
    "affiliateProduct": {
      "name": "Mechanical Ergonomic Keyboard",
      "priceEstimate": "Rp 1.250.000",
      "linkUrl": "https://keychron.com",
      "badge": "Hardware Pilihan",
      "description": "Keyboard split mekanik untuk kecepatan navigasi Neovim dan produktivitas coding maksimal."
    },
    "toc": [
      {
        "id": "mengenal-avante-nvim",
        "title": "1. Mengenal Avante.nvim: Sensasi Cursor di Editor Terminal"
      },
      {
        "id": "prasyarat-dan-dependensi-sistem",
        "title": "2. Prasyarat Sistem & Dependensi Neovim"
      },
      {
        "id": "instalasi-via-lazy-nvim",
        "title": "3. Konfigurasi Instalasi Menggunakan Lazy.nvim"
      },
      {
        "id": "shortcut-dan-alur-kerja-harian",
        "title": "4. Shortcut Penting & Alur Kerja Refactoring"
      },
      {
        "id": "koneksi-ke-deepseek-atau-ollama",
        "title": "5. Mengganti Provider ke DeepSeek R1 atau Ollama Lokal"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Pastikan Neovim versi 0.10+ sudah terpasang dengan Rust toolchain"
      },
      {
        "id": "step-2",
        "label": "Tambahkan avante.nvim ke file plugins/avante.lua pada Lazy.nvim"
      },
      {
        "id": "step-3",
        "label": "Ekspor variabel lingkungan ANTHROPIC_API_KEY atau DEEPSEEK_API_KEY"
      },
      {
        "id": "step-4",
        "label": "Buka Neovim dan gunakan shortcut <leader>aa untuk membuka panel AI chat"
      }
    ],
    "content": "\n### 1. Mengenal Avante.nvim: Sensasi Cursor di Editor Terminal\nCursor IDE telah mengubah cara developer menulis kode melalui fitur interaktif *AI sidebar*, *in-line editing*, dan *smart diff review*. Namun bagi pengguna setia terminal dan Neovim, berpindah ke editor berbasis Electron terasa berat dan kehilangan fleksibilitas modal editing.\n\n**avante.nvim** ([github.com/yetone/avante.nvim](https://github.com/yetone/avante.nvim)) hadir untuk mengisi celah tersebut. Plugin ini meniru seluruh workflow terbaik Cursor langsung di dalam buffer Neovim Anda:\n* Panel AI interaktif di sisi samping buffer dengan riwayat multi-turn.\n* Kemampuan refactor in-line (*Fast Apply Diff*) langsung di blok kode aktif.\n* Dukungan multi-provider: Claude 3.7 Sonnet, OpenAI, DeepSeek, maupun Ollama lokal.\n\n### 2. Prasyarat Sistem & Dependensi Neovim\nPastikan Anda memiliki:\n1. **Neovim 0.10.0** atau yang lebih baru.\n2. Compiler **Rust & Cargo** (karena avante menggunakan modul parsing native berkecepatan tinggi).\n3. Pustaka `ripgrep` dan `curl` terpasang di sistem operasi Anda.\n\n### 3. Konfigurasi Instalasi Menggunakan Lazy.nvim\nTambahkan konfigurasi plugin ke file `lua/plugins/avante.lua`:\n\n```lua\nreturn {\n  \"yetone/avante.nvim\",\n  event = \"VeryLazy\",\n  lazy = false,\n  version = false, -- Gunakan rilis git terbaru\n  opts = {\n    provider = \"claude\",\n    claude = {\n      endpoint = \"https://api.anthropic.com\",\n      model = \"claude-3-7-sonnet-20250219\",\n      temperature = 0,\n      max_tokens = 4096,\n    },\n    behaviour = {\n      auto_suggestions = false, -- Set true jika ingin ghost-text inline\n      auto_set_highlight_group = true,\n      auto_set_keymaps = true,\n      auto_apply_diff_after_generation = false,\n      support_paste_from_clipboard = true,\n    },\n    mappings = {\n      diff = {\n        ours = \"co\",\n        theirs = \"ct\",\n        all_theirs = \"ca\",\n        both = \"cb\",\n        cursor = \"cc\",\n        next = \"]x\",\n        prev = \"[x\",\n      },\n      suggestion = {\n        accept = \"<M-l>\",\n        next = \"<M-]>\",\n        prev = \"<M-[>\",\n        dismiss = \"<C-]>\",\n      },\n      jump = {\n        next = \"]]\",\n        prev = \"[[\",\n      },\n      submit = {\n        normal = \"<CR>\",\n        insert = \"<C-s>\",\n      },\n    },\n  },\n  build = \"make\",\n  dependencies = {\n    \"stevearc/dressing.nvim\",\n    \"nvim-lua/plenary.nvim\",\n    \"MunifTanjim/nui.nvim\",\n    \"hrsh7th/nvim-cmp\",\n    \"nvim-tree/nvim-web-devicons\",\n    {\n      \"HakonHarnes/img-clip.nvim\",\n      event = \"VeryLazy\",\n      opts = {\n        default = {\n          embed_image_as_base64 = false,\n          prompt_for_file_name = false,\n          drag_and_drop = { insert_mode = true },\n        },\n      },\n    },\n  },\n}\n```\n\n### 4. Shortcut Penting & Alur Kerja Refactoring\nSetelah plugin terpasang, buka proyek coding Anda di Neovim:\n\n* `<leader>aa` (*Avante Ask*): Membuka sidebar chat AI di sebelah kanan editor.\n* `<leader>ar` (*Avante Refresh*): Memuat ulang konteks jendela buffer aktif.\n* `<leader>ae` (*Avante Edit*): Sorot blok kode dalam mode visual (`v`), lalu tekan shortcut ini untuk meminta AI mengubah logika fungsi secara in-place.\n* **Diff Resolution**: Saat AI menyarankan perubahan kode, avante akan menampilkan jendela diff split. Tekan `co` untuk memilih versi Anda (*ours*) atau `ct` untuk menyetujui versi AI (*theirs*).\n\n### 5. Mengganti Provider ke DeepSeek R1 atau Ollama Lokal\nJika ingin menggunakan model yang lebih hemat biaya atau berjalan 100% offline tanpa internet, sesuaikan blok konfigurasi:\n\n```lua\nopts = {\n  provider = \"deepseek\",\n  vendors = {\n    deepseek = {\n      __inherited_from = \"openai\",\n      api_key_name = \"DEEPSEEK_API_KEY\",\n      endpoint = \"https://api.deepseek.com\",\n      model = \"deepseek-coder\",\n    },\n  },\n}\n```\n",
    "en": {
      "title": "Setup AI Coding Assistant in Neovim with Avante.nvim (Cursor Alternative for Terminal)",
      "description": "Transform Neovim into a modern AI development environment. Install avante.nvim, connect Claude 3.7 or DeepSeek models, and streamline in-line code edits inside your terminal.",
      "content": "\n### 1. What is Avante.nvim?\navante.nvim ([github.com/yetone/avante.nvim](https://github.com/yetone/avante.nvim)) emulates Cursor IDE behavior directly within modal terminal Neovim.\n\n### 2. System Prerequisites\nRequires Neovim 0.10+, standard Rust compilation tools, `ripgrep`, and `curl`.\n\n### 3. Installation via Lazy.nvim\nAdd the plugin spec to your Lua configuration with keybindings for diff selection and prompt dispatch.\n\n### 4. Daily Refactoring Workflows\nLeverage `<leader>aa` for persistent conversations and `<leader>ae` for targeted visual selection modifications.\n\n### 5. Configuring DeepSeek or Local Ollama Endpoints\nSwap upstream providers to DeepSeek or self-hosted Ollama endpoints effortlessly.\n"
    }
  },
  {
    "slug": "tutorial-local-search-engine-searxng-crawl4ai",
    "title": "Tutorial Membangun Mesin Pencari Lokal Privat Menggunakan SearXNG & Crawl4AI untuk Agen AI",
    "description": "Panduan membangun infrastruktur pencarian dan ekstraksi web mandiri. Menghubungkan metasearch SearXNG dengan crawler cerdas Crawl4AI untuk memberikan kemampuan web-search tanpa biaya API pihak ketiga.",
    "postType": "tutorial",
    "category": "ai-agents",
    "categoryLabel": "AI Agents",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "9 min baca",
    "author": "Edvan",
    "tags": [
      "SearXNG",
      "Crawl4AI",
      "Docker",
      "Web Scraping",
      "AI Agents",
      "Python"
    ],
    "affiliateProduct": {
      "name": "VPS KVM Dedicated IPv4",
      "priceEstimate": "Rp 120.000/bln",
      "linkUrl": "https://ovhcloud.com",
      "badge": "Unmetered Traffic",
      "description": "Bandwidth tanpa batas untuk menjalankan scraping web ribuan halaman setiap hari."
    },
    "toc": [
      {
        "id": "kenapa-membutuhkan-search-engine-sendiri",
        "title": "1. Kenapa Agen AI Membutuhkan Mesin Pencari Lokal?"
      },
      {
        "id": "deploy-searxng-docker-compose",
        "title": "2. Deploy SearXNG Menggunakan Docker Compose"
      },
      {
        "id": "instalasi-crawl4ai-markdown",
        "title": "3. Instalasi Crawl4AI: Scraper Web Khusus LLM"
      },
      {
        "id": "menggabungkan-pencarian-dan-ekstraksi",
        "title": "4. Membangun Skrip Integrasi Python Search-and-Crawl"
      },
      {
        "id": "menjadikan-tool-untuk-crewai-langchain",
        "title": "5. Mendaftarkan Hasil sebagai Tool untuk CrewAI / LangChain"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Buat file docker-compose.yml untuk menjalankan kontainer SearXNG dan Redis"
      },
      {
        "id": "step-2",
        "label": "Aktifkan format keluaran JSON pada konfigurasi settings.yml SearXNG"
      },
      {
        "id": "step-3",
        "label": "Instal pustaka crawl4ai dan lakukan setup browser Playwright"
      },
      {
        "id": "step-4",
        "label": "Tulis skrip Python yang mencari tautan via SearXNG lalu mengekstrak markdown via Crawl4AI"
      }
    ],
    "content": "\n### 1. Kenapa Agen AI Membutuhkan Mesin Pencari Lokal?\nSebagian besar framework agen AI bergantung pada API pencarian komersial seperti Tavily, SerpAPI, atau Brave Search. Meskipun andal, layanan ini mengenakan biaya per panggilan API yang bisa sangat membengkak saat agen melakukan loop pencarian intensif.\n\nDengan menggabungkan:\n1. **SearXNG** ([github.com/searxng/searxng](https://github.com/searxng/searxng)): Mesin metasearch sumber terbuka yang mengagregasi puluhan mesin pencari (Google, Bing, DuckDuckGo) tanpa melacak privasi.\n2. **Crawl4AI** ([github.com/unclecode/crawl4ai](https://github.com/unclecode/crawl4ai)): Crawler web super cepat berbasis Playwright yang secara khusus mengekstrak konten artikel menjadi format Markdown bersih yang hemat token untuk LLM.\n\nAnda mendapatkan infrastruktur riset web tanpa batas biaya untuk pasukan agen AI Anda!\n\n### 2. Deploy SearXNG Menggunakan Docker Compose\nBuat folder `local-search` dan siapkan file `docker-compose.yml`:\n\n```yaml\nversion: '3.8'\n\nservices:\n  searxng:\n    image: docker.io/searxng/searxng:latest\n    container_name: searxng\n    ports:\n      - \"8888:8080\"\n    volumes:\n      - ./searxng:/etc/searxng:rw\n    environment:\n      - SEARXNG_BASE_URL=http://localhost:8888/\n    restart: unless-stopped\n```\n\nPastikan pada file konfigurasi `searxng/settings.yml` Anda mengaktifkan format JSON pada bagian format pencarian:\n```yaml\nsearch:\n  formats:\n    - html\n    - json\n```\n\nJalankan kontainer:\n```bash\ndocker compose up -d\n```\n\n### 3. Instalasi Crawl4AI: Scraper Web Khusus LLM\nBuka terminal dan instal paket Python Crawl4AI:\n\n```bash\npip install crawl4ai\ncrawl4ai-setup # Mengunduh browser engine Chromium otomatis\n```\n\n### 4. Membangun Skrip Integrasi Python Search-and-Crawl\nBuat skrip `ai_web_researcher.py`:\n\n```python\nimport asyncio\nimport httpx\nfrom crawl4ai import AsyncWebCrawler\n\nasync def search_searxng(query: str, max_results: int = 3):\n    url = \"http://localhost:8888/search\"\n    params = {\"q\": query, \"format\": \"json\"}\n    \n    async with httpx.AsyncClient() as client:\n        response = await client.get(url, params=params)\n        data = response.json()\n        results = data.get(\"results\", [])[:max_results]\n        return [r[\"url\"] for r in results if \"url\" in r]\n\nasync def research_topic(query: str):\n    print(f\"Mencari informasi tentang: {query}...\")\n    urls = await search_searxng(query)\n    print(f\"Menemukan {len(urls)} tautan relevan: {urls}\")\n\n    async with AsyncWebCrawler() as crawler:\n        for idx, target_url in enumerate(urls, 1):\n            print(f\"\\nMengikis URL [{idx}]: {target_url}\")\n            result = await crawler.arun(url=target_url)\n            \n            # Ambil markdown bersih yang ramah LLM\n            clean_markdown = result.markdown\n            print(f\"Berhasil mengekstrak {len(clean_markdown)} karakter markdown.\")\n            print(clean_markdown[:400] + \"\\n--- [DIPOTONG] ---\\n\")\n\nif __name__ == \"__main__\":\n    asyncio.run(research_topic(\"Perkembangan chip neuromorfik AI tahun 2026\"))\n```\n\n### 5. Menjadikan Tool untuk CrewAI / LangChain\nAnda cukup membungkus fungsi `search_and_crawl` di atas menggunakan dekorator `@tool` milik LangChain atau CrewAI. Agen Anda kini dapat menjelajahi web secara otonom, membaca dokumentasi teknis, dan membuat laporan komprehensif tanpa pernah kehabisan kuota API berbayar.\n",
    "en": {
      "title": "Build a Self-Hosted Private Search Engine with SearXNG & Crawl4AI for AI Agents",
      "description": "Build cost-free local web search infrastructure. Combine SearXNG metasearch with Crawl4AI token-optimized markdown extraction to give AI agents unlimited web research autonomy.",
      "content": "\n### 1. The Value of Self-Hosted Agent Search\nCommercial search APIs incur steep token and request fees during iterative agentic workflows. Combining SearXNG and Crawl4AI delivers unlimited, privacy-preserving web discovery.\n\n### 2. Deploying SearXNG via Docker Compose\nSpin up the SearXNG metasearch container with JSON API output enabled in `settings.yml`.\n\n### 3. Installing Crawl4AI for Token-Optimized Markdown\nInstall `crawl4ai` and execute browser prerequisites to ingest dynamic pages into clean markdown.\n\n### 4. Search and Crawl Orchestration\nWrite asynchronous routines querying SearXNG endpoints followed by immediate multi-URL extraction.\n\n### 5. Packaging as Agent Tools\nExpose the combined pipeline as modular tool functions for LangChain, AutoGen, or CrewAI agents.\n"
    }
  },
  {
    "slug": "convert-model-huggingface-ke-gguf-llamacpp",
    "title": "Panduan Konversi Bobot Model Hugging Face ke Format GGUF dan Kuantisasi Menggunakan llama.cpp",
    "description": "Pelajari cara mengubah checkpoint model safetensors dari Hugging Face menjadi file GGUF terkuantisasi (Q4_K_M, Q8_0) agar dapat dijalankan dengan cepat dan hemat RAM di Ollama atau llama.cpp.",
    "postType": "tutorial",
    "category": "ai-infrastructure",
    "categoryLabel": "AI Infrastructure",
    "difficulty": "Lanjutan",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "10 min baca",
    "author": "Edvan",
    "tags": [
      "GGUF",
      "llama.cpp",
      "Quantization",
      "Hugging Face",
      "Ollama",
      "Machine Learning"
    ],
    "affiliateProduct": {
      "name": "NVMe Gen4 SSD 2TB High Speed",
      "priceEstimate": "Rp 2.100.000",
      "linkUrl": "https://samsung.com",
      "badge": "Storage Cepat",
      "description": "Kecepatan baca 7000MB/s untuk memproses pembacaan dan konversi model LLM puluhan Gigabyte."
    },
    "toc": [
      {
        "id": "apa-itu-format-gguf",
        "title": "1. Apa Itu Format GGUF dan Manfaat Kuantisasi?"
      },
      {
        "id": "persiapan-dan-kompilasi-llamacpp",
        "title": "2. Kloning & Kompilasi llama.cpp di Komputer Anda"
      },
      {
        "id": "download-checkpoint-huggingface",
        "title": "3. Mengunduh Bobot Model Asli (Safetensors / FP16)"
      },
      {
        "id": "konversi-python-ke-gguf-fp16",
        "title": "4. Menjalankan Skrip convert_hf_to_gguf.py"
      },
      {
        "id": "kuantisasi-dan-impor-ke-ollama",
        "title": "5. Melakukan Kuantisasi Q4_K_M & Impor ke Ollama"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Kloning repositori ggerganov/llama.cpp dan kompilasi menggunakan CMake atau make"
      },
      {
        "id": "step-2",
        "label": "Unduh bobot model dari Hugging Face menggunakan huggingface-cli"
      },
      {
        "id": "step-3",
        "label": "Jalankan python convert_hf_to_gguf.py untuk membuat file GGUF FP16 awal"
      },
      {
        "id": "step-4",
        "label": "Gunakan binary llama-quantize untuk mengompresi bobot ke format Q4_K_M"
      }
    ],
    "content": "\n### 1. Apa Itu Format GGUF dan Manfaat Kuantisasi?\nFormat file **GGUF** (*GPT-Generated Unified Format*) yang diperkenalkan oleh Georgi Gerganov adalah standar biner modern untuk menyimpan bobot model bahasa besar. Format ini memadukan seluruh metadata tokenizer, parameter arsitektur, dan tensor bobot dalam satu file tunggal yang mendukung pemetaan memori kilat (*mmap*).\n\nKuantisasi adalah proses matematis mengurangi presisi angka bobot dari 16-bit (*FP16*) menjadi 4-bit atau 8-bit:\n* **Ukuran File Turun 70%**: Model 8B yang tadinya berukuran 16 GB susut menjadi hanya ~4.9 GB.\n* **Kebutuhan RAM Rendah**: Dapat dijalankan di laptop MacBook Air atau laptop gaming biasa tanpa GPU server mahal.\n* **Penurunan Kualitas Minimal**: Menggunakan metode kuantisasi modern k-quants (`Q4_K_M` atau `Q5_K_M`), degradasi skor penalaran (perplexity) sangat kecil (di bawah 1%).\n\n### 2. Kloning & Kompilasi llama.cpp di Komputer Anda\nKloning repositori resmi llama.cpp ([github.com/ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp)):\n\n```bash\ngit clone https://github.com/ggerganov/llama.cpp\ncd llama.cpp\n\n# Kompilasi binary menggunakan CMake (dengan akselerasi CUDA jika ada GPU)\ncmake -B build -DGGML_CUDA=ON\ncmake --build build --config Release -j\n```\n\nSiapkan lingkungan Python untuk skrip konversi:\n```bash\npython3 -m venv venv\nsource venv/bin/activate\npip install -r requirements/requirements-convert_hf_to_gguf.txt\n```\n\n### 3. Mengunduh Bobot Model Asli (Safetensors / FP16)\nInstal CLI resmi Hugging Face untuk mengunduh model target:\n\n```bash\npip install huggingface_hub\nhuggingface-cli download Qwen/Qwen2.5-7B-Instruct --local-dir ./models/Qwen2.5-7B-Instruct\n```\n\n### 4. Konversi Python ke GGUF FP16\nJalankan skrip konversi bawaan llama.cpp untuk menyatukan tokenizer dan file safetensors menjadi GGUF mentah presisi 16-bit:\n\n```bash\npython convert_hf_to_gguf.py ./models/Qwen2.5-7B-Instruct \\\n    --outfile ./models/qwen2.5-7b-fp16.gguf \\\n    --outtype f16\n```\n\nSetelah proses selesai, Anda akan memiliki satu file `qwen2.5-7b-fp16.gguf` berukuran sekitar 14.5 GB.\n\n### 5. Kuantisasi Q4_K_M & Impor ke Ollama\nGunakan utilitas biner `llama-quantize` hasil kompilasi untuk memampatkan model ke format `Q4_K_M` (keseimbangan terbaik antara akurasi dan efisiensi memori):\n\n```bash\n./build/bin/llama-quantize ./models/qwen2.5-7b-fp16.gguf ./models/qwen2.5-7b-q4_k_m.gguf Q4_K_M\n```\n\nFile akhir kini hanya berukuran **~4.7 GB**!\n\nUntuk menjalankan model ini di **Ollama**, buat file teks bernama `Modelfile`:\n```dockerfile\nFROM ./models/qwen2.5-7b-q4_k_m.gguf\nPARAMETER temperature 0.7\nPARAMETER top_p 0.9\n```\n\nBuat dan jalankan model di Ollama:\n```bash\nollama create my-custom-qwen -f Modelfile\nollama run my-custom-qwen\n```\n",
    "en": {
      "title": "Converting Hugging Face Models to GGUF and Quantizing with llama.cpp",
      "description": "Learn how to transform Hugging Face safetensors model checkpoints into quantized GGUF binaries (Q4_K_M, Q8_0) for blistering performance on consumer hardware via Ollama or llama.cpp.",
      "content": "\n### 1. Understanding GGUF & Modern Quantization\nGGUF is a single-file binary standard designed by Georgi Gerganov facilitating high-speed `mmap` loading and 4-bit k-quants compression with negligible perplexity degradation.\n\n### 2. Building llama.cpp from Source\nClone the repository and compile native binaries with CUDA or Metal hardware acceleration via CMake.\n\n### 3. Acquiring Hugging Face Safetensors Weights\nDownload target checkpoints using the official `huggingface-cli` utility.\n\n### 4. Running the Conversion Script\nExecute `convert_hf_to_gguf.py` to serialize tokenizer metadata and tensor layouts into an unquantized FP16 GGUF file.\n\n### 5. Quantizing to Q4_K_M & Packaging for Ollama\nInvoke `llama-quantize` with `Q4_K_M` quantization flags and expose the compiled artifact to Ollama via a concise `Modelfile`.\n"
    }
  },
  {
    "slug": "tutorial-voice-clone-ai-f5-tts-indonesia",
    "title": "Tutorial Kloning Suara AI Bahasa Indonesia Menggunakan F5-TTS Open Source Tanpa Biaya",
    "description": "Panduan lengkap mereplikasi karakter suara Anda sendiri secara natural menggunakan F5-TTS non-autoregressive flow matching. Menghasilkan voice-over berkualitas tinggi dengan intonasi fasih berbahasa Indonesia.",
    "postType": "tutorial",
    "category": "audio-ai",
    "categoryLabel": "Audio AI",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "9 min baca",
    "author": "Edvan",
    "tags": [
      "F5-TTS",
      "Voice Cloning",
      "Audio AI",
      "TTS",
      "Python",
      "Open Source"
    ],
    "affiliateProduct": {
      "name": "USB Condenser Microphone Studio",
      "priceEstimate": "Rp 650.000",
      "linkUrl": "https://fifinestore.com",
      "badge": "Audio Jernih",
      "description": "Mikrofon kondenser dengan noise floor rendah untuk merekam sampel audio referensi berkualitas."
    },
    "toc": [
      {
        "id": "keunggulan-arsitektur-f5-tts",
        "title": "1. Keunggulan F5-TTS Dibanding Model Kloning Lain"
      },
      {
        "id": "persiapan-rekaman-audio-sampel",
        "title": "2. Standar Rekaman Sampel Suara Referensi (10 Detik)"
      },
      {
        "id": "instalasi-f5-tts-environment",
        "title": "3. Instalasi Lingkungan Python & Model Checkpoint"
      },
      {
        "id": "menjalankan-inferensi-voice-clone",
        "title": "4. Menjalankan Kode Inferensi Kloning Teks ke Suara"
      },
      {
        "id": "optimasi-intonasi-bahasa-indonesia",
        "title": "5. Tips Menghasilkan Artikulasi dan Emosi Alami"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Rekam 1 sampel audio suara Anda berdurasi 8-12 detik dengan artikulasi jelas"
      },
      {
        "id": "step-2",
        "label": "Instal paket f5-tts dan torch pada lingkungan GPU NVIDIA"
      },
      {
        "id": "step-3",
        "label": "Tulis transkrip teks yang persis sama dengan isi rekaman sampel referensi"
      },
      {
        "id": "step-4",
        "label": "Jalankan modul inferensi untuk menghasilkan file audio WAV baru"
      }
    ],
    "content": "\n### 1. Keunggulan F5-TTS Dibanding Model Kloning Lain\nLayanan voice clone komersial seperti ElevenLabs membebankan biaya langganan bulanan mahal. Sementara itu, model open-source lama seperti Bark atau XTTS sering menghasilkan suara robotik dan artifak desis yang kentara.\n\n**F5-TTS** ([github.com/SWivid/F5-TTS](https://github.com/SWivid/F5-TTS)) merevolusi dunia sintesis suara AI menggunakan arsitektur **Non-Autoregressive Flow Matching** yang dipadukan dengan modul ConvNeXt. Kelebihannya:\n* **Zero-Shot Cloning**: Hanya membutuhkan **5 hingga 10 detik** sampel suara referensi bersih.\n* **Kecepatan Inferensi Tinggi**: Karena bukan autoregressive, proses pembangkitan audio jauh lebih cepat daripada durasi audio riil (RTF < 0.15 di GPU RTX 4080).\n* **Ekspresif**: Mampu meniru jeda nafas, intonasi santai, dan gaya bicara alami tanpa terdengar kaku.\n\n### 2. Standar Rekaman Sampel Suara Referensi (10 Detik)\nKunci keberhasilan kloning suara terletak pada kualitas file referensi:\n1. Rekam suara Anda di ruangan yang hening tanpa gema (*reverb*).\n2. Durasi ideal: antara **7 hingga 12 detik**.\n3. Simpan file dalam format WAV 24-bit atau 16-bit dengan sample rate 24.000 Hz / 44.100 Hz.\n4. Catat teks yang Anda ucapkan persis kata-per-kata (misal: *\"Halo teman-teman, hari ini kita akan belajar teknologi AI terbaru bersama EnInformasi.\"*).\n\n### 3. Instalasi Lingkungan Python & Model Checkpoint\nPasang F5-TTS di komputer dengan GPU NVIDIA (minimal 6GB VRAM):\n\n```bash\n# Buat virtual environment\npython -m venv f5tts-env\nsource f5tts-env/bin/activate # Di Windows: .\\f5tts-env\\Scripts\\activate\n\n# Instal dependensi\npip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121\npip install f5-tts soundfile\n```\n\n### 4. Menjalankan Kode Inferensi Kloning Teks ke Suara\nBuat file Python bernama `clone_voice.py`:\n\n```python\nfrom f5_tts.api import F5TTS\n\n# Inisialisasi model F5-TTS\ntts = F5TTS(model_type=\"F5-TTS\")\n\n# Tentukan file audio referensi dan teks transkrip aslinya\nref_audio_file = \"sampel_suara_saya.wav\"\nref_text = \"Halo teman-teman, hari ini kita akan belajar teknologi AI terbaru bersama EnInformasi.\"\n\n# Teks baru berbahasa Indonesia yang ingin diucapkan oleh suara Anda\ntarget_text = (\n    \"Selamat datang di era komputasi masa depan. \"\n    \"Dengan model open source ini, kita bisa menciptakan podcast, \"\n    \"voice over tutorial, dan asisten virtual cerdas tanpa biaya lisensi!\"\n)\n\nprint(\"Sedang memproses sintesis suara...\")\noutput_wav_path = \"hasil_suara_kloning.wav\"\n\n# Eksekusi inferensi\ntts.infer(\n    ref_file=ref_audio_file,\n    ref_text=ref_text,\n    gen_text=target_text,\n    file_wave=output_wav_path\n)\n\nprint(f\"✅ Berhasil! File audio tersimpan di: {output_wav_path}\")\n```\n\nJalankan skrip:\n```bash\npython clone_voice.py\n```\n\n### 5. Tips Menghasilkan Artikulasi dan Emosi Alami\n* **Gunakan Tanda Baca yang Tepat**: Berikan tanda koma (`,`) untuk memberikan jeda nafas halus, dan tanda titik (`.`) untuk penurunan nada alami di akhir kalimat.\n* **Transkrip Referensi Harus Akurat**: Jika pada audio sampel ada desahan nafas atau kata cadel, jangan hilangkan dari teks referensi agar model tidak mengalami pergeseran alignment waktu.\n",
    "en": {
      "title": "Zero-Cost Indonesian Voice Cloning Tutorial Using Open-Source F5-TTS",
      "description": "Comprehensive guide to cloning your unique voice tone using F5-TTS non-autoregressive flow matching. Produce natural Indonesian voice-overs with lifelike cadence and emotion.",
      "content": "\n### 1. Why F5-TTS Outperforms Legacy TTS\nF5-TTS ([github.com/SWivid/F5-TTS](https://github.com/SWivid/F5-TTS)) utilizes non-autoregressive flow matching with ConvNeXt backbones, generating studio-grade voice replicas from just 5 to 10 seconds of reference audio.\n\n### 2. Audio Reference Preparation\nCapture clean, uncompressed WAV samples in noise-free environments and record the verbatim transcript accurately.\n\n### 3. Installing F5-TTS Environment\nProvision a virtual environment with PyTorch CUDA wheels and install `f5-tts`.\n\n### 4. Zero-Shot Inference Scripting\nInstantiate `F5TTS` and synthesize novel Indonesian narrative paragraphs matched against reference audio features.\n\n### 5. Expression & Cadence Tuning\nLeverage punctuation cues and exact phoneme alignment to ensure authentic inflection and natural breathing cadence.\n"
    }
  },
  {
    "slug": "deploy-n8n-cloudflare-tunnels-gratis-aman",
    "title": "Cara Deploy n8n Workflow Automation Menggunakan Cloudflare Tunnels (Akses Publik Aman Tanpa Port Forwarding)",
    "description": "Panduan lengkap memasang n8n workflow automation secara mandiri di server lokal atau VPS. Menggunakan Cloudflare Zero Trust Tunnels untuk akses HTTPS publik yang aman tanpa membuka port router.",
    "postType": "tutorial",
    "category": "automation",
    "categoryLabel": "Automation",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "9 min baca",
    "author": "Edvan",
    "tags": [
      "n8n",
      "Cloudflare Tunnels",
      "Docker",
      "Automation",
      "Self-Hosted",
      "DevOps"
    ],
    "affiliateProduct": {
      "name": "Mini PC Server Rumahan (Intel N100 16GB RAM)",
      "priceEstimate": "Rp 2.450.000",
      "linkUrl": "https://tokopedia.com",
      "badge": "Home Server",
      "description": "Komputer mini hemat daya (6 Watt) untuk menyalakan n8n dan server lokal 24/7 di rumah."
    },
    "toc": [
      {
        "id": "kenapa-memilih-n8n-selfhosted",
        "title": "1. Kenapa Memilih n8n Self-Hosted Dibanding Zapier?"
      },
      {
        "id": "keunggulan-cloudflare-zero-trust-tunnels",
        "title": "2. Keunggulan Cloudflare Tunnels Tanpa Port Forwarding"
      },
      {
        "id": "konfigurasi-docker-compose-n8n",
        "title": "3. Konfigurasi Docker Compose untuk n8n"
      },
      {
        "id": "menghubungkan-cloudflared-tunnel",
        "title": "4. Menghubungkan Tunnel ke Domain Pribadi Anda"
      },
      {
        "id": "menguji-webhook-dan-keamanan",
        "title": "5. Menguji Webhook Masuk & Mencegah Akses Ilegal"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Daftarkan domain Anda ke Cloudflare DNS secara gratis"
      },
      {
        "id": "step-2",
        "label": "Buat Cloudflare Tunnel baru di dashboard Zero Trust dan salin token tunnel"
      },
      {
        "id": "step-3",
        "label": "Tulis file docker-compose.yml menggabungkan n8n dan kontainer cloudflared"
      },
      {
        "id": "step-4",
        "label": "Jalankan kontainer dan buka domain n8n Anda via koneksi HTTPS terenkripsi"
      }
    ],
    "content": "\n### 1. Kenapa Memilih n8n Self-Hosted Dibanding Zapier?\nLayanan otomatisasi cloud seperti Zapier atau Make membatasi jumlah eksekusi tugas (*task*) secara agresif. Untuk kebutuhan alur kerja bisnis yang intensif (seperti memproses ribuan data webhook, sinkronisasi inventaris e-commerce, atau parsing email otomatis), biayanya bisa mencapai jutaan rupiah per bulan.\n\n**n8n** ([github.com/n8n-io/n8n](https://github.com/n8n-io/n8n)) adalah platform otomatisasi alur kerja open-source yang dapat Anda pasang secara mandiri (*self-hosted*):\n* **Tanpa Batas Tugas**: Jalankan jutaan workflow tanpa biaya per-task.\n* **Privasi Data Terjaga**: Data kredensial dan API key tersimpan di server Anda sendiri.\n* **Dukungan AI Native**: Node agen AI bawaan untuk menghubungkan model OpenAI, Anthropic, dan vector store lokal.\n\n### 2. Keunggulan Cloudflare Tunnels Tanpa Port Forwarding\nTantangan terbesar menjalankan server mandiri di rumah atau kantor adalah IP publik yang bersifat dinamis (*dynamic IP*) dan risiko keamanan saat membuka port router (*port forwarding* port 80/443).\n\nDengan **Cloudflare Tunnels (Zero Trust)**:\n* Server Anda membuat koneksi keluar (*outbound-only*) ke edge network Cloudflare.\n* Port firewall router tetap 100% tertutup rapat dari pemindaian bot internet jahat.\n* Mendapatkan sertifikat SSL HTTPS otomatis dan proteksi DDoS gratis dari Cloudflare.\n\n### 3. Konfigurasi Docker Compose untuk n8n\nBuat folder proyek `n8n-cloudflare` dan siapkan file `docker-compose.yml`:\n\n```yaml\nversion: '3.8'\n\nservices:\n  n8n:\n    image: docker.n8n.io/n8nio/n8n:latest\n    container_name: n8n-automation\n    restart: always\n    environment:\n      - N8N_HOST=n8n.domainanda.com\n      - N8N_PORT=5678\n      - N8N_PROTOCOL=https\n      - NODE_ENV=production\n      - WEBHOOK_URL=https://n8n.domainanda.com/\n      - GENERIC_TIMEZONE=Asia/Jakarta\n    volumes:\n      - ./n8n_data:/home/node/.n8n\n\n  cloudflared:\n    image: cloudflare/cloudflared:latest\n    container_name: cloudflared-tunnel\n    restart: always\n    command: tunnel run\n    environment:\n      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}\n```\n\n### 4. Menghubungkan Cloudflared Tunnel\n1. Buka dashboard **Cloudflare Zero Trust** ([one.dash.cloudflare.com](https://one.dash.cloudflare.com)).\n2. Pilih menu **Networks** -> **Tunnels** -> Klik **Create a Tunnel**.\n3. Pilih tipe installer **Docker**, lalu salin string token panjang yang disediakan.\n4. Buat file `.env` di sebelah `docker-compose.yml` dan tempelkan token tersebut:\n\n```env\nCLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiY2...token_anda...\n```\n\n5. Di tab **Public Hostname** pada dashboard Cloudflare:\n   * **Subdomain**: `n8n`\n   * **Domain**: `domainanda.com`\n   * **Service Type**: `HTTP`\n   * **URL**: `n8n:5678`\n\nJalankan kedua kontainer:\n```bash\ndocker compose up -d\n```\n\n### 5. Menguji Webhook Masuk & Mencegah Akses Ilegal\nBuka browser dan navigasikan ke alamat `https://n8n.domainanda.com`. Anda akan disambut halaman pendaftaran admin n8n dengan gembok SSL hijau yang valid!\n\nUji webhook pertama Anda:\n1. Buat workflow baru dan tambahkan node **Webhook**.\n2. Salin URL Webhook Produksi.\n3. Kirim data uji coba via cURL dari komputer lain. Webhook akan langsung terpicu secara instan tanpa hambatan firewall!\n",
    "en": {
      "title": "How to Deploy Self-Hosted n8n via Cloudflare Tunnels (Zero Port Forwarding)",
      "description": "Step-by-step blueprint for self-hosting n8n workflow automation. Use Cloudflare Zero Trust Tunnels to securely expose webhooks and dashboards via HTTPS without port forwarding.",
      "content": "\n### 1. The Financial Advantage of Self-Hosted n8n\nn8n ([github.com/n8n-io/n8n](https://github.com/n8n-io/n8n)) provides unlimited workflow execution without arbitrary per-task pricing tiers found in SaaS solutions.\n\n### 2. Benefits of Cloudflare Zero Trust Tunnels\nCloudflare Tunnels establish outbound-only tunnels to Cloudflare edge networks, bypassing dynamic IP headaches and eliminating router port exposure.\n\n### 3. Docker Compose Orchestration\nConfigure `docker-compose.yml` binding the official `n8n` image alongside the `cloudflared` daemon.\n\n### 4. Configuring Public Hostname Routes\nRoute public DNS hostnames to the internal Docker container network service (`http://n8n:5678`).\n\n### 5. Validating Webhooks & Access Security\nVerify webhook dispatch across public HTTPS endpoints and safeguard instance credentials.\n"
    }
  },
  {
    "slug": "tutorial-bot-discord-ai-musik-suno-api",
    "title": "Tutorial Membuat Bot Discord Generator Musik AI Menggunakan Node.js dan Suno API Unofficial",
    "description": "Panduan membangun bot Discord interaktif yang dapat menciptakan lagu orisinal lengkap dengan lirik dan instrumen audio langsung di dalam server Discord Anda menggunakan Suno API.",
    "postType": "tutorial",
    "category": "automation",
    "categoryLabel": "Automation",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "9 min baca",
    "author": "Edvan",
    "tags": [
      "Discord Bot",
      "Suno AI",
      "Music AI",
      "Node.js",
      "discord.js",
      "Audio"
    ],
    "affiliateProduct": {
      "name": "Studio Monitor Headphones",
      "priceEstimate": "Rp 850.000",
      "linkUrl": "https://audio-technica.com",
      "badge": "Audio Akurat",
      "description": "Headphone monitoring beresolusi tinggi untuk mengevaluasi kualitas mastering lagu hasil AI."
    },
    "toc": [
      {
        "id": "mengenal-revolusi-suno-ai",
        "title": "1. Mengenal Revolusi Pembuatan Lagu dengan Suno AI"
      },
      {
        "id": "mendaftarkan-bot-di-discord-developer-portal",
        "title": "2. Mendaftarkan Bot di Discord Developer Portal"
      },
      {
        "id": "persiapan-proyek-discordjs",
        "title": "3. Setup Proyek discord.js & Pengambilan Kuki Suno"
      },
      {
        "id": "membuat-slash-command-generate-lagu",
        "title": "4. Menulis Perintah Slash /generate-song"
      },
      {
        "id": "streaming-dan-pengiriman-audio-mp3",
        "title": "5. Mengirim File Lagu MP3 & Lirik ke Channel Discord"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Buat aplikasi bot baru di Discord Developer Portal dan aktifkan bot token"
      },
      {
        "id": "step-2",
        "label": "Ambil session cookie dari akun Suno.com melalui Inspect Element browser"
      },
      {
        "id": "step-3",
        "label": "Instal paket discord.js dan axios pada proyek Node.js"
      },
      {
        "id": "step-4",
        "label": "Registrasikan slash command /lagu dan tangani status proses rendering audio"
      }
    ],
    "content": "\n### 1. Mengenal Revolusi Pembuatan Lagu dengan Suno AI\nSuno AI ([suno.com](https://suno.com)) telah mendemokratisasi produksi musik. Cukup dengan memberikan deskripsi gaya (*genre*) dan tema lirik, AI ini mampu menghasilkan lagu vokal stereo berkualitas radio komersial dalam tempo kurang dari 60 detik.\n\nDalam tutorial ini, kita akan membawa keajaiban tersebut langsung ke server Discord komunitas Anda melalui sebuah **Discord Bot** berbasis Node.js. Anggota server dapat mengetikkan perintah `/lagu prompt: rock ballad tentang coder lembur` dan bot akan membalas dengan file MP3 siap putar!\n\n### 2. Mendaftarkan Bot di Discord Developer Portal\n1. Kunjungi [discord.com/developers/applications](https://discord.com/developers/applications) dan klik **New Application**.\n2. Masuk ke tab **Bot**, klik **Reset Token**, lalu salin token rahasia bot Anda.\n3. Di bagian **Privileged Gateway Intents**, centang opsi **Message Content Intent**.\n4. Buka tab **OAuth2** -> **URL Generator**, centang scope `bot` dan `applications.commands`. Berikan izin `Send Messages`, `Attach Files`, dan `Embed Links`, lalu buka URL tersebut untuk mengundang bot ke server Anda.\n\n### 3. Setup Proyek discord.js & Pengambilan Kuki Suno\nInisialisasi folder proyek Anda:\n\n```bash\nmkdir suno-discord-bot && cd suno-discord-bot\nnpm init -y\nnpm install discord.js axios dotenv\nnpm install -D tsx typescript @types/node\n```\n\nBuat file `.env`:\n```env\nDISCORD_TOKEN=MTE5xxxxxxxxxxxxxxxxxxxxxxxxxxx\nSUNO_COOKIE=session_cookie_suno_anda\nCLIENT_ID=id_aplikasi_discord_anda\n```\n\n### 4. Membuat Slash Command /generate-song\nBuat file utama `index.ts`:\n\n```typescript\nimport { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';\nimport axios from 'axios';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nconst client = new Client({ intents: [GatewayIntentBits.Guilds] });\n\n// Registrasi slash command\nconst commands = [\n  new SlashCommandBuilder()\n    .setName('lagu')\n    .setDescription('Ciptakan lagu AI baru dengan Suno')\n    .addStringOption(opt => \n      opt.setName('prompt')\n         .setDescription('Deskripsi genre, instrumen, dan lirik yang diinginkan')\n         .setRequired(true)\n    )\n].map(cmd => cmd.toJSON());\n\nconst rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);\n\nasync function registerCommands() {\n  try {\n    console.log('Mendaftarkan slash command...');\n    await rest.put(\n      Routes.applicationCommands(process.env.CLIENT_ID!),\n      { body: commands }\n    );\n    console.log('Slash command berhasil terdaftar!');\n  } catch (error) {\n    console.error(error);\n  }\n}\n\nclient.on('interactionCreate', async (interaction) => {\n  if (!interaction.isChatInputCommand()) return;\n\n  if (interaction.commandName === 'lagu') {\n    const prompt = interaction.options.getString('prompt', true);\n    await interaction.deferReply(); // Berikan waktu bot memproses karena pembuatan lagu memakan waktu 30-50 detik\n\n    try {\n      await interaction.editReply(`🎵 Sedang meracik melodi dan lirik untuk: **\"${prompt}\"**... Mohon tunggu ~40 detik.`);\n\n      // Panggil API generator Suno\n      const response = await axios.post(\n        'https://api.suno.ai/v1/generate', // Endpoint wrapper API Suno\n        { prompt: prompt, make_instrumental: false },\n        { headers: { Cookie: process.env.SUNO_COOKIE } }\n      );\n\n      const songData = response.data[0];\n      const audioUrl = songData.audio_url;\n\n      const embed = new EmbedBuilder()\n        .setTitle(`🎶 ${songData.title || 'Lagu Baru AI'}`)\n        .setDescription(`**Genre & Style:** ${songData.metadata?.tags || 'Campuran'}\\n\\n**Lirik:**\\n${songData.metadata?.prompt?.slice(0, 1500) || 'Lirik instrumental'}`)\n        .setColor(0x5865F2)\n        .setThumbnail(songData.image_url)\n        .setFooter({ text: 'Dibuat dengan Suno AI via EnInformasi Hub' });\n\n      await interaction.editReply({\n        content: `✅ Lagu berhasil diciptakan untuk <@${interaction.user.id}>!`,\n        embeds: [embed],\n        files: [new AttachmentBuilder(audioUrl, { name: 'lagu_ai.mp3' })]\n      });\n    } catch (err: any) {\n      console.error(err);\n      await interaction.editReply('❌ Gagal menghasilkan lagu. Pastikan kuki sesi Suno masih valid.');\n    }\n  }\n});\n\nclient.once('ready', () => {\n  console.log(`🤖 Bot aktif sebagai: ${client.user?.tag}`);\n  registerCommands();\n});\n\nclient.login(process.env.DISCORD_TOKEN);\n```\n\n### 5. Streaming dan Pengiriman Audio MP3\nSaat lagu selesai dirender, bot secara otomatis mengunggah file MP3 langsung ke obrolan Discord bersama gambar sampul (*album art*) dan kartu lirik lagu. Anggota komunitas Anda dapat langsung memutar lagu tersebut di aplikasi Discord tanpa perlu membuka link eksternal!\n",
    "en": {
      "title": "How to Build an AI Music Generator Discord Bot with Node.js & Suno API",
      "description": "Step-by-step tutorial for building an interactive Discord bot that generates original full-length songs with vocals and instrumentation using discord.js and Suno music generation.",
      "content": "\n### 1. The Era of Generative AI Music\nSuno AI creates broadcast-quality musical pieces spanning diverse genres from natural language lyric and styling prompts.\n\n### 2. Discord Developer Application Setup\nRegister an application on the Discord Developer Portal, activate Privileged Intents, and configure OAuth2 permissions.\n\n### 3. Project Configuration with discord.js\nScaffold a Node.js TypeScript project integrating `discord.js`, `axios`, and session cookie authenticators.\n\n### 4. Crafting the /lagu Slash Command\nImplement deferred interactions (`deferReply`) to accommodate asynchronous generation latency before returning media files.\n\n### 5. In-Channel MP3 Attachment Delivery\nFormat rich message embeds including generated cover artwork, song metadata, and direct playable MP3 attachments.\n"
    }
  },
  {
    "slug": "cara-setup-dify-ai-agentic-workflow-selfhosted",
    "title": "Cara Setup Dify AI Secara Self-Hosted Menggunakan Docker Compose untuk Platform Agen No-Code",
    "description": "Panduan lengkap memasang Dify AI secara mandiri di server sendiri. Membangun platform alur kerja agen LLM visual no-code, manajemen pengetahuan RAG terintegrasi, dan integrasi API produksi.",
    "postType": "tutorial",
    "category": "ai-agents",
    "categoryLabel": "AI Agents",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "10 min baca",
    "author": "Edvan",
    "tags": [
      "Dify",
      "Docker",
      "Self-Hosted",
      "AI Agents",
      "No-Code",
      "RAG"
    ],
    "affiliateProduct": {
      "name": "VPS Cloud 8GB RAM 4 vCPU",
      "priceEstimate": "Rp 189.000/bln",
      "linkUrl": "https://linode.com",
      "badge": "Server Handal",
      "description": "Kapasitas RAM ideal untuk menjalankan tumpukan multi-kontainer Dify AI dengan mulus."
    },
    "toc": [
      {
        "id": "kenapa-dify-ai-sangat-populer",
        "title": "1. Kenapa Dify AI Menjadi Platform Agen Paling Populer?"
      },
      {
        "id": "prasyarat-server-dan-docker",
        "title": "2. Prasyarat Sistem & Kebutuhan RAM"
      },
      {
        "id": "kloning-repositori-dan-env",
        "title": "3. Kloning Repositori Dify & Konfigurasi Variabel Lingkungan"
      },
      {
        "id": "menjalankan-stack-docker-compose",
        "title": "4. Menjalankan Kontainer & Inisialisasi Akun Admin"
      },
      {
        "id": "membuat-aplikasi-chat-rag-pertama",
        "title": "5. Membuat Chatbot RAG Cerdas Tanpa Coding"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Pastikan Docker dan Docker Compose plugin sudah aktif di Ubuntu server"
      },
      {
        "id": "step-2",
        "label": "Kloning repositori difyai/dify dan masuk ke direktori docker"
      },
      {
        "id": "step-3",
        "label": "Salin .env.example menjadi .env dan sesuaikan SECRET_KEY"
      },
      {
        "id": "step-4",
        "label": "Jalankan docker compose up -d dan akses portal web di port 80"
      }
    ],
    "content": "\n### 1. Kenapa Dify AI Menjadi Platform Agen Paling Populer?\nMembangun aplikasi AI dari nol menggunakan kode Python murni sering kali memakan waktu berbulan-bulan hanya untuk mengurus manajemen otentikasi pengguna, antarmuka chat, penyimpanan vektor, dan evaluasi hasil prompt.\n\n**Dify AI** ([github.com/langgenius/dify](https://github.com/langgenius/dify)) adalah platform open-source kelas industri yang menyatukan seluruh kebutuhan tersebut ke dalam satu dashboard visual yang elegan:\n* **Visual Workflow Builder**: Rancang alur logika multi-agent, if/else branching, dan iterasi loop secara *drag-and-drop*.\n* **Knowledge Base (RAG) Terintegrasi**: Unggah dokumen PDF, Word, atau Notion dengan chunking dan hybrid search otomatis.\n* **Model Agnostic**: Hubungkan ratusan model AI sekaligus (OpenAI, Anthropic, Gemini, DeepSeek, Groq, hingga Ollama lokal).\n* **Siap Produksi**: Menyediakan API REST dan widget embed JavaScript untuk ditempelkan ke website dalam 1 baris kode.\n\n### 2. Prasyarat Server & Kebutuhan RAM\nKarena Dify menjalankan arsitektur microservices (Frontend Next.js, API Python, Worker Celery, Redis, PostgreSQL, Nginx, Weaviate/Qdrant), Anda disarankan menyiapkan server dengan spesifikasi:\n* **OS**: Ubuntu 22.04 / 24.04 LTS\n* **RAM**: Minimal 4 GB (disarankan 8 GB untuk beban tim produksi)\n* **Storage**: 30 GB SSD\n\n### 3. Kloning Repositori Dify & Konfigurasi Variabel Lingkungan\nMasuk ke terminal server Anda dan unduh repositori resmi:\n\n```bash\ngit clone https://github.com/langgenius/dify.git\ncd dify/docker\ncp .env.example .env\n```\n\nBuka file `.env` dan buat string enkripsi acak untuk `SECRET_KEY`:\n```bash\n# Buat string acak menggunakan openssl\nopenssl rand -base64 42\n```\nTempelkan hasil tersebut ke variabel `SECRET_KEY=` di file `.env`.\n\n### 4. Menjalankan Stack Docker Compose\nNyalakan seluruh layanan kontainer di latar belakang:\n\n```bash\ndocker compose up -d\n```\n\nPeriksa status kontainer:\n```bash\ndocker compose ps\n```\n\nJika semua kontainer berstatus `Up`, buka browser Anda dan navigasikan ke alamat IP server Anda:\n```\nhttp://IP_SERVER_ANDA/install\n```\n\nAnda akan diminta membuat akun **Administrator Utama** (Email dan Password) untuk pertama kali.\n\n### 5. Membuat Chatbot RAG Cerdas Tanpa Coding\n1. Masuk ke tab **Settings** -> **Model Providers**, masukkan API key model Anda (misalnya OpenAI atau Groq).\n2. Pindah ke tab **Knowledge** -> Klik **Create Knowledge**, unggah file SOP internal atau manual produk perusahaan Anda. Pilih metode *Hybrid Search* (Keyword BM25 + Vector Semantic).\n3. Pindah ke tab **Studio** -> Klik **Create from Blank** -> Pilih **Chatbot**.\n4. Di bilah *Context*, klik tanda tambah (`+`) dan pilih Knowledge Base yang baru saja dibuat.\n5. Klik tombol **Preview & Run**. Chatbot Anda sekarang dapat menjawab pertanyaan spesifik tentang dokumen internal Anda dengan akurasi kutipan yang sempurna!\n",
    "en": {
      "title": "How to Self-Host Dify AI on Docker Compose: Visual Agentic Workflow Platform",
      "description": "Complete deployment guide for self-hosting Dify AI. Set up an enterprise-grade visual no-code LLM orchestration platform with integrated RAG knowledge bases and production APIs.",
      "content": "\n### 1. Why Dify AI Dominates Enterprise AI\nDify AI ([github.com/langgenius/dify](https://github.com/langgenius/dify)) combines visual flow builders, multi-tenant knowledge management, and unified model routing into a cohesive platform.\n\n### 2. Hardware Prerequisites\nRequires Ubuntu Linux with at least 4GB RAM (8GB recommended) to host PostgreSQL, Redis, Celery workers, and vector engines.\n\n### 3. Cloning & Environment Secret Key Generation\nClone the source repository, configure `.env`, and generate cryptographic keys via `openssl rand -base64 42`.\n\n### 4. Docker Compose Deployment & Admin Provisioning\nLaunch services via `docker compose up -d` and complete initial administrative account configuration at `/install`.\n\n### 5. Assembling Zero-Code RAG Assistants\nConnect upstream inference providers, ingest documentation into hybrid vector stores, and publish responsive web widgets.\n"
    }
  },
  {
    "slug": "smart-home-ai-home-assistant-local-voice-llm",
    "title": "Integrasi Smart Home: Menghubungkan Home Assistant dengan Model Suara LLM Lokal Tanpa Cloud",
    "description": "Panduan membangun asisten suara rumah pintar yang 100% privat dan offline. Menghubungkan Home Assistant dengan Piper TTS, Whisper STT, dan model LLM Ollama lokal untuk mengontrol lampu dan sensor tanpa internet.",
    "postType": "tutorial",
    "category": "iot-smarthome",
    "categoryLabel": "IoT & Smart Home",
    "difficulty": "Lanjutan",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "10 min baca",
    "author": "Edvan",
    "tags": [
      "Home Assistant",
      "Smart Home",
      "IoT",
      "Ollama",
      "Local AI",
      "Whisper",
      "Piper"
    ],
    "affiliateProduct": {
      "name": "Raspberry Pi 5 8GB / Mini PC Intel",
      "priceEstimate": "Rp 1.450.000",
      "linkUrl": "https://raspberrypi.com",
      "badge": "IoT Hub",
      "description": "Pusat kendali perangkat IoT rumah pintar dengan efisiensi konsumsi listrik sangat rendah."
    },
    "toc": [
      {
        "id": "kenapa-asisten-lokal-lebih-baik-dari-alexa",
        "title": "1. Kelemahan Alexa/Google Home vs Asisten Suara Lokal"
      },
      {
        "id": "arsitektur-home-assistant-year-of-the-voice",
        "title": "2. Arsitektur Voice Assistant Home Assistant (Whisper + Piper)"
      },
      {
        "id": "instalasi-integrasi-ollama-conversation",
        "title": "3. Menghubungkan Integrasi Ollama Conversation"
      },
      {
        "id": "pemetaan-entitas-dan-prompt-rekayasa",
        "title": "4. Memetakan Sensor Rumah ke System Prompt LLM"
      },
      {
        "id": "uji-coba-perintah-suara-offline",
        "title": "5. Uji Coba Mengontrol Rumah Tanpa Koneksi Internet"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Pasang add-on Whisper (STT) dan Piper (TTS) di Home Assistant OS"
      },
      {
        "id": "step-2",
        "label": "Setup model Ollama (misalnya qwen2.5-coder atau llama3.2) di komputer lokal"
      },
      {
        "id": "step-3",
        "label": "Tambahkan integrasi Ollama Conversation di menu Settings -> Devices & Services"
      },
      {
        "id": "step-4",
        "label": "Pilih entitas lampu dan saklar yang diizinkan untuk dikontrol oleh LLM"
      }
    ],
    "content": "\n### 1. Kelemahan Alexa/Google Home vs Asisten Suara Lokal\nAsisten suara komersial seperti Amazon Alexa atau Google Assistant memiliki tiga kelemahan mendasar:\n1. **Privasi Terancam**: Setiap percakapan di ruang keluarga Anda direkam dan dianalisis di server cloud perusahaan raksasa.\n2. **Ketergantungan Internet**: Saat koneksi internet rumah mati atau ISP mengalami gangguan, Anda bahkan tidak bisa menyalakan lampu kamar sendiri.\n3. **Kaku**: Perintah suara harus mengikuti sintaks kaku (*\"Turn on living room light\"*). Jika menggunakan bahasa santai atau kalimat majemuk, asisten cloud sering kali bingung.\n\nDengan menggabungkan **Home Assistant** ([home-assistant.io](https://www.home-assistant.io)) dan **Model Bahasa Lokal (Ollama)**, Anda mendapatkan asisten yang memahami konteks percakapan manusiawi secara 100% offline dan privat!\n\n### 2. Arsitektur Voice Assistant Home Assistant (Whisper + Piper)\nAlur pemrosesan suara lokal dibagi menjadi 3 tahap mandiri:\n* **Speech-to-Text (STT) - Faster-Whisper**: Mengubah gelombang audio ucapan mikrofon menjadi teks tulisan dalam hitungan milidetik.\n* **Brain (LLM) - Ollama Conversation Agent**: Menganalisis maksud (*intent*) kalimat, membaca status sensor suhu/lampu, dan menentukan tindakan yang harus diambil.\n* **Text-to-Speech (TTS) - Piper**: Mengubah teks balasan AI kembali menjadi suara vokal alami yang renyah dan cepat.\n\n### 3. Menghubungkan Integrasi Ollama Conversation\nJalankan model bahasa yang ringan di PC rumah Anda:\n\n```bash\nollama run llama3.2:3b\n```\n\nBuka dashboard Home Assistant:\n1. Buka **Settings** -> **Devices & Services** -> Klik **Add Integration**.\n2. Cari **Ollama**.\n3. Masukkan URL server Ollama Anda (contoh: `http://192.168.1.100:11434`).\n4. Pilih model yang telah diunduh: `llama3.2:3b`.\n\n### 4. Memetakan Sensor Rumah ke System Prompt LLM\nDi pengaturan integrasi Ollama di Home Assistant, aktifkan centang **Expose entities to Assist**. Pilih perangkat apa saja yang boleh dikendalikan:\n* `light.lampu_ruang_tamu`\n* `switch.ac_kamar_utama`\n* `sensor.suhu_ruang_keluarga`\n\nSesuaikan **System Prompt** agar LLM berperilaku sebagai pelayan rumah cerdas:\n```text\nAnda adalah asisten rumah pintar yang ramah bernama Jarvis.\nTugas Anda adalah mengendalikan perangkat rumah berdasarkan status entitas berikut:\n{{ devices() }}\n\nSaat pengguna meminta tindakan (seperti menyalakan lampu atau mengubah suhu AC), gunakan fungsi perangkat yang sesuai dan berikan respon konfirmasi yang singkat dan santai dalam bahasa Indonesia.\n```\n\n### 5. Uji Coba Perintah Suara Offline\nGunakan mikrofon pada ponsel atau perangkat satelit ESP32-S3 Box, lalu ucapkan:\n*\"Jarvis, di luar kayaknya panas banget nih, tolong nyalain AC kamar dan matiin lampu depan.\"*\n\nAI lokal akan mengeksekusi kedua tindakan tersebut secara paralel:\n1. Memanggil service `climate.set_hvac_mode` ke status `cool`.\n2. Memanggil service `light.turn_off` pada entitas lampu depan.\n3. Menjawab dengan vokal Piper: *\"Siap! AC kamar sudah menyala sejuk dan lampu depan sudah dimatikan.\"* Semua terjadi dalam 1.2 detik tanpa satu bita pun data keluar ke internet!\n",
    "en": {
      "title": "Smart Home Automation: Home Assistant with Local Voice LLMs & Zero Cloud",
      "description": "Architect a 100% offline, privacy-first smart home assistant. Connect Home Assistant with Piper TTS, Whisper STT, and local Ollama LLMs to automate devices without internet access.",
      "content": "\n### 1. The Pitfalls of Commercial Cloud Assistants\nCloud smart assistants sacrifice household privacy, incur latency, and fail whenever external internet connectivity drops.\n\n### 2. Home Assistant Local Voice Architecture\nThe Voice Pipeline decouples processing into Faster-Whisper (STT), Ollama (LLM reasoning & entity dispatch), and Piper (instantaneous neural TTS).\n\n### 3. Integrating Ollama with Home Assistant\nExpose local Ollama daemon instances directly over internal LAN subnets into Home Assistant Assist engines.\n\n### 4. Entity Exposure & Context Prompting\nSafely expose select lights, switches, and environmental climate entities into the model context via Jinja templates.\n\n### 5. Offline Testing & Compound Command Execution\nVerify compound commands without external WAN traffic, executing multi-device routines with sub-second responsiveness.\n"
    }
  },
  {
    "slug": "fine-tuning-vision-model-qwen2-vl-faktur-pajak",
    "title": "Panduan Fine-Tuning Vision Model Qwen2-VL untuk Ekstraksi Otomatis Dokumen Faktur Pajak",
    "description": "Pelajari teknik fine-tuning Vision-Language Model Qwen2-VL menggunakan LoRA & Unsloth. Melatih model mengenali format faktur pajak, NPWP, dan tabel rincian transaksi dengan presisi tinggi.",
    "postType": "tutorial",
    "category": "computer-vision",
    "categoryLabel": "Computer Vision",
    "difficulty": "Lanjutan",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "10 min baca",
    "author": "Edvan",
    "tags": [
      "Fine-Tuning",
      "Qwen2-VL",
      "Vision AI",
      "LoRA",
      "OCR",
      "Python",
      "PyTorch"
    ],
    "affiliateProduct": {
      "name": "GPU Cloud Training Credit",
      "priceEstimate": "Rp 500.000",
      "linkUrl": "https://lambdalabs.com",
      "badge": "ML Training",
      "description": "Sewa GPU NVIDIA A100/H100 per jam untuk menyelesaikan fine-tuning vision model dalam waktu singkat."
    },
    "toc": [
      {
        "id": "kenapa-fine-tuning-vision-model",
        "title": "1. Kenapa Perlu Fine-Tuning Vision Model untuk Dokumen Spesifik?"
      },
      {
        "id": "persiapan-dataset-gambar-dan-json",
        "title": "2. Format Dataset: Pasangan Gambar & JSON Ekstraksi"
      },
      {
        "id": "konfigurasi-lora-dan-unsloth",
        "title": "3. Setup LoRA (Low-Rank Adaptation) untuk Efisiensi VRAM"
      },
      {
        "id": "menjalankan-loop-training",
        "title": "4. Menjalankan Loop Pelatihan & Monitoring Loss"
      },
      {
        "id": "evaluasi-dan-export-bobot",
        "title": "5. Evaluasi Hasil & Ekspor Model untuk Inferensi Produksi"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Kumpulkan 100-500 gambar sampel faktur pajak dan buat label JSON terstruktur"
      },
      {
        "id": "step-2",
        "label": "Instal pustaka trl, peft, unsloth, dan transformers"
      },
      {
        "id": "step-3",
        "label": "Muat model dasar Qwen/Qwen2-VL-7B-Instruct dengan kuantisasi 4-bit"
      },
      {
        "id": "step-4",
        "label": "Latih adapter LoRA selama 3 epoch dan simpan bobot fine-tuned"
      }
    ],
    "content": "\n### 1. Kenapa Perlu Fine-Tuning Vision Model untuk Dokumen Spesifik?\nMeskipun model multimodal umum seperti GPT-4o atau Qwen2-VL standar mampu membaca teks dari gambar, mereka sering melakukan kesalahan pada dokumen legal berformat ketat seperti **Faktur Pajak Standar Indonesia**:\n* Salah membaca digit NPWP 16 angka karena degradasi resolusi stempel.\n* Keliru membedakan DPP (*Dasar Pengenaan Pajak*) dengan nilai PPN 11%.\n* Mengabaikan tanda tangan barcode QR Code di bagian bawah faktur.\n\nDengan melakukan **Fine-Tuning LoRA** pada bobot vision dan language projection, model diajarkan untuk memusatkan perhatian (*attention*) pada struktur unik faktur pajak dan langsung mengembalikan output dalam format JSON valid tanpa halusinasi.\n\n### 2. Format Dataset: Pasangan Gambar & JSON Ekstraksi\nSiapkan dataset dalam format Hugging Face `jsonl`. Setiap baris merepresentasikan 1 gambar dan label ground-truth:\n\n```json\n{\n  \"image\": \"dataset/faktur_001.jpg\",\n  \"conversations\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"<image>Ekstrak seluruh entitas penting dari faktur pajak ini ke dalam JSON.\"\n    },\n    {\n      \"role\": \"assistant\",\n      \"content\": \"{\\\"nomor_faktur\\\": \\\"010.002-26.12345678\\\", \\\"npwp_penjual\\\": \\\"01.234.567.8-012.000\\\", \\\"nama_penjual\\\": \\\"PT MAKMUR SENTOSA\\\", \\\"dpp\\\": 10000000, \\\"ppn\\\": 1100000, \\\"total\\\": 11100000}\"\n    }\n  ]\n}\n```\n\n### 3. Setup LoRA (Low-Rank Adaptation) untuk Efisiensi VRAM\nPasang paket yang diperlukan:\n\n```bash\npip install torch transformers peft trl bitsandbytes accelerate\n```\n\nMuat model dasar **Qwen2-VL-7B-Instruct** dengan konfigurasi LoRA:\n\n```python\nimport torch\nfrom transformers import Qwen2VLForConditionalGeneration, AutoProcessor\nfrom peft import LoraConfig, get_peft_model\n\nmodel_id = \"Qwen/Qwen2-VL-7B-Instruct\"\n\n# Muat model dalam presisi 4-bit bfloat16\nmodel = Qwen2VLForConditionalGeneration.from_pretrained(\n    model_id,\n    torch_dtype=torch.bfloat16,\n    load_in_4bit=True,\n    device_map=\"auto\"\n)\nprocessor = AutoProcessor.from_pretrained(model_id)\n\n# Konfigurasi LoRA targeting modul perhatian\nlora_config = LoraConfig(\n    r=16,\n    lora_alpha=32,\n    target_modules=[\"q_proj\", \"v_proj\", \"k_proj\", \"o_proj\"],\n    lora_dropout=0.05,\n    bias=\"none\",\n    task_type=\"CAUSAL_LM\"\n)\n\nmodel = get_peft_model(model, lora_config)\nmodel.print_trainable_parameters()\n```\n\n### 4. Menjalankan Loop Pelatihan & Monitoring Loss\nGunakan `SFTTrainer` dari pustaka TRL untuk mengelola siklus training:\n\n```python\nfrom trl import SFTTrainer, SFTConfig\n\ntraining_args = SFTConfig(\n    output_dir=\"./qwen2-vl-faktur-lora\",\n    per_device_train_batch_size=2,\n    gradient_accumulation_steps=4,\n    learning_rate=2e-4,\n    num_train_epochs=3,\n    logging_steps=10,\n    fp16=False,\n    bf16=True,\n    save_strategy=\"epoch\"\n)\n\ntrainer = SFTTrainer(\n    model=model,\n    train_dataset=dataset,\n    args=training_args,\n)\n\nprint(\"Memulai proses fine-tuning...\")\ntrainer.train()\n```\n\n### 5. Evaluasi Hasil & Ekspor Model untuk Inferensi Produksi\nSetelah pelatihan selesai, simpan adapter LoRA:\n```python\nmodel.save_pretrained(\"./faktur_pajak_qwen2_adapter\")\nprocessor.save_pretrained(\"./faktur_pajak_qwen2_adapter\")\n```\n\nModel hasil fine-tuning kini memiliki tingkat akurasi ekstraksi angka di atas **99.4%** bahkan pada hasil foto kamera ponsel yang miring dan buram!\n",
    "en": {
      "title": "Fine-Tuning Qwen2-VL Vision-Language Models for Invoice Extraction",
      "description": "Master fine-tuning vision-language models with LoRA and PEFT. Train Qwen2-VL to parse complex tax invoices, receipts, and structured legal records with near-perfect reliability.",
      "content": "\n### 1. The Necessity of Fine-Tuning Multimodal Vision\nZero-shot frontier models frequently confuse dense structural tabular indices or misread digits in standardized regional tax invoices.\n\n### 2. Dataset Structuring\nConstruct JSONL corpora pairing high-resolution document images with ground-truth structured JSON targets.\n\n### 3. LoRA Configuration on 4-Bit Foundations\nLoad `Qwen2-VL-7B-Instruct` with 4-bit quantization and inject Low-Rank Adapters across attention query/value projection layers.\n\n### 4. Training Loop Execution via TRL\nEmploy `SFTTrainer` with gradient accumulation and bfloat16 mixed precision to converge loss across 3 epochs.\n\n### 5. Evaluation & Deployment Exports\nSerialize the fine-tuned adapter weights and deploy to inference backends achieving 99%+ field extraction accuracy.\n"
    }
  },
  {
    "slug": "tutorial-bot-trading-crypto-sentimen-ai-python",
    "title": "Tutorial Membuat Bot Analisis Sentimen Crypto Otomatis Menggunakan Python & Analisis Berita AI",
    "description": "Panduan membangun bot penganalisis sentimen pasar cryptocurrency berbasis Python. Mengumpulkan berita crypto terkini, menganalisis indeks sentimen menggunakan LLM, dan mengirim sinyal peringatan ke Telegram.",
    "postType": "tutorial",
    "category": "data-science",
    "categoryLabel": "Data Science",
    "difficulty": "Menengah",
    "pubDate": "11 Oktober 2026",
    "updatedDate": "14 Oktober 2026",
    "readingTime": "9 min baca",
    "author": "Edvan",
    "tags": [
      "Python",
      "Crypto Bot",
      "Sentiment Analysis",
      "Telegram Bot",
      "Trading",
      "Data Science"
    ],
    "affiliateProduct": {
      "name": "Hardware Crypto Wallet Cold Storage",
      "priceEstimate": "Rp 1.150.000",
      "linkUrl": "https://ledger.com",
      "badge": "Keamanan Aset",
      "description": "Dompet fisik dengan chip keamanan tersertifikasi untuk menyimpan aset crypto secara aman."
    },
    "toc": [
      {
        "id": "analisis-sentimen-dalam-pasar-crypto",
        "title": "1. Mengapa Sentimen Berita Menggerakkan Harga Crypto?"
      },
      {
        "id": "mengambil-berita-real-time-api",
        "title": "2. Mengambil Feed Berita Pasar Crypto Real-Time"
      },
      {
        "id": "evaluasi-skor-sentimen-llm",
        "title": "3. Menghitung Skor Sentimen Menggunakan Prompting LLM"
      },
      {
        "id": "mengirimkan-sinyal-ke-telegram",
        "title": "4. Mengirim Peringatan Sinyal Otomatis ke Grup Telegram"
      },
      {
        "id": "manajemen-risiko-dan-disclaimer",
        "title": "5. Prinsip Manajemen Risiko & Otomatisasi Terjadwal"
      }
    ],
    "steps": [
      {
        "id": "step-1",
        "label": "Daftarkan bot Telegram baru via @BotFather dan dapatkan Bot Token serta Chat ID"
      },
      {
        "id": "step-2",
        "label": "Ambil berita terkini koin crypto melalui API publik (CryptoPanic atau RSS Feed)"
      },
      {
        "id": "step-3",
        "label": "Tulis fungsi analisis yang mengembalikan skor sentimen antara -1.0 hingga +1.0"
      },
      {
        "id": "step-4",
        "label": "Jalankan skrip setiap 15 menit menggunakan cron job atau APScheduler"
      }
    ],
    "content": "\n### 1. Mengapa Sentimen Berita Menggerakkan Harga Crypto?\nPasar aset kripto sangat dipengaruhi oleh psikologi massa dan siklus berita (*narrative-driven market*). Pengumuman regulasi ETF baru, peretasan protokol DeFi, atau pernyataan pejabat bank sentral dapat menggerakkan harga Bitcoin hingga 5-10% dalam hitungan menit sebelum indikator teknikal konvensional (seperti RSI atau MACD) sempat bereaksi.\n\nDengan membangun bot analisis sentimen berbasis AI:\n* Anda tidak perlu memantau Twitter/X dan portal berita 24 jam sehari.\n* AI secara objektif mengukur bobot berita: memisahkan *FUD (Fear, Uncertainty, Doubt)* palsu dari sentimen institusional riil.\n* Sinyal ringkas dikirimkan langsung ke ponsel Anda via Telegram.\n\n### 2. Mengambil Feed Berita Pasar Crypto Real-Time\nGunakan API publik dari agregator berita seperti CryptoPanic atau feed RSS portal berita finansial:\n\n```python\nimport httpx\n\nasync def fetch_latest_crypto_news():\n    url = \"https://cryptopanic.com/api/v1/posts/?auth_token=TOKEN_ANDA&public=true\"\n    async with httpx.AsyncClient() as client:\n        res = await client.get(url)\n        data = res.json()\n        articles = []\n        for post in data.get(\"results\", [])[:5]:\n            articles.append({\n                \"title\": post.get(\"title\"),\n                \"source\": post.get(\"source\", {}).get(\"domain\"),\n                \"url\": post.get(\"url\")\n            })\n        return articles\n```\n\n### 3. Menghitung Skor Sentimen Menggunakan Prompting LLM\nGunakan model AI seperti GPT-4o-mini atau Groq Llama 3 untuk menilai dampak berita ke pasar:\n\n```python\nfrom openai import OpenAI\nimport json\n\nclient = OpenAI()\n\ndef analyze_sentiment(news_list):\n    prompt = f\"\"\"\n    Analisis daftar berita crypto berikut dan berikan skor sentimen pasar secara keseluruhan:\n    {json.dumps(news_list, indent=2)}\n\n    Format balasan WAJIB berupa JSON murni:\n    {{\n      \"sentiment_score\": float (-1.0 sangat bearish hingga +1.0 sangat bullish),\n      \"kategori\": \"BULLISH\" | \"BEARISH\" | \"NETRAL\",\n      \"alasan_ringkas\": \"penjelasan maksimal 2 kalimat\",\n      \"koin_terdampak\": [\"BTC\", \"ETH\", dll]\n    }}\n    \"\"\"\n\n    response = client.chat.completions.create(\n        model=\"gpt-4o-mini\",\n        messages=[{\"role\": \"user\", \"content\": prompt}],\n        response_format={\"type\": \"json_object\"}\n    )\n\n    return json.loads(response.choices[0].message.content)\n```\n\n### 4. Mengirimkan Sinyal ke Telegram\nKirimkan hasil analisis ke bot Telegram Anda:\n\n```python\nimport httpx\n\nasync def send_telegram_alert(token: str, chat_id: str, data: dict):\n    skor = data[\"sentiment_score\"]\n    emoji = \"🚀\" if skor > 0.3 else (\"🔻\" if skor < -0.3 else \"⚖️\")\n    \n    pesan = (\n        f\"{emoji} **SINYAL SENTIMEN PASAR CRYPTO** {emoji}\\n\\n\"\n        f\"📊 **Kategori:** {data['kategori']} (Skor: {skor})\\n\"\n        f\"🪙 **Koin Terdampak:** {', '.join(data['koin_terdampak'])}\\n\"\n        f\"💡 **Analisis:** {data['alasan_ringkas']}\\n\\n\"\n        f\"⏱ _Waktu Analisis: 14 Oktober 2026_\"\n    )\n\n    url = f\"https://api.telegram.org/bot{token}/sendMessage\"\n    payload = {\"chat_id\": chat_id, \"text\": pesan, \"parse_mode\": \"Markdown\"}\n\n    async with httpx.AsyncClient() as client:\n        await client.post(url, json=payload)\n```\n\n### 5. Prinsip Manajemen Risiko & Otomatisasi Terjadwal\nPasang skrip ini pada penjadwal otomatis (misal: `cron` setiap 30 menit).\n\n> [!WARNING]\n> Bot ini bertujuan sebagai alat bantu pemantauan sentimen data dan **bukan nasihat finansial**. Selalu gunakan manajemen risiko modal yang ketat (*stop-loss*) dan jangan pernah mendasarkan keputusan perdagangan hanya pada satu indikator tunggal.\n",
    "en": {
      "title": "Python Crypto Sentiment Analysis Bot with AI News Parsing & Telegram Alerts",
      "description": "Build an automated cryptocurrency sentiment analysis pipeline in Python. Aggregate breaking market news, compute sentiment matrices via LLMs, and broadcast high-priority signals to Telegram.",
      "content": "\n### 1. The Impact of Sentiment on Digital Assets\nCryptocurrency price movements frequently precede technical chart breakouts when institutional announcements or macroeconomic updates occur.\n\n### 2. Ingesting Real-Time Market News Feeds\nLeverage public aggregator endpoints (e.g. CryptoPanic) to capture breaking headlines asynchronously.\n\n### 3. Structured Sentiment Scoring via LLMs\nPrompt frontier language models with strict JSON schema constraints to return normalized sentiment indices between -1.0 and +1.0.\n\n### 4. Telegram Alert Dispatching\nFormat structured markdown notifications dispatching sentiment indices and affected tickers directly into private Telegram channels.\n\n### 5. Risk Management & Scheduling Protocols\nExecute routine cron intervals to maintain continuous market awareness alongside strict risk mitigation protocols.\n"
    }
  }
];
