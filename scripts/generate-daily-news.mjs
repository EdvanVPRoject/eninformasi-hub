import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { generateCoverSvg } from './svg-cover-generator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load from .env.local or .env if present
function loadEnv() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  for (const envFile of ['.env.local', '.env']) {
    const envPath = path.join(ROOT_DIR, envFile);
    if (fs.existsSync(envPath)) {
      const text = fs.readFileSync(envPath, 'utf8');
      const match = text.match(/GEMINI_API_KEY\s*=\s*([^\r\n]+)/);
      if (match) return match[1].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return '';
}

const API_KEY = loadEnv();
if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set. Please set GEMINI_API_KEY in environment or .env.local');
  process.exit(1);
}

const MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.8-flash'
];

// Helper to fetch text with timeout and User-Agent
async function fetchSafe(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    clearTimeout(id);
    return null;
  }
}

// 1. Collect real-time breaking news from high-signal feeds with authentic links
async function fetchViralFeeds() {
  const candidates = [];

  // Feed 1: Google News AI & Gaming Hardware (Last 24h)
  try {
    const gnewsUrl = 'https://news.google.com/rss/search?q=(AI+OR+NVIDIA+OR+GPU+OR+Gaming+hardware+OR+Unreal+Engine+OR+Steam)+when:24h&hl=en-US&gl=US&ceid=US:en';
    const xml = await fetchSafe(gnewsUrl);
    if (xml) {
      const items = [...xml.matchAll(/<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<\/item>/g)];
      for (const m of items.slice(0, 10)) {
        const title = m[1].replace(/ - [^-]+$/, '').trim();
        const link = (m[2] || '').trim();
        if (title && !title.toLowerCase().includes('google news')) {
          candidates.push({ 
            title, 
            link: link || 'https://news.google.com/', 
            source: 'Google News Tech Wire' 
          });
        }
      }
    }
  } catch (e) {
    console.warn('Google News feed error:', e.message);
  }

  // Feed 2: Tom's Hardware
  try {
    const thXml = await fetchSafe('https://www.tomshardware.com/feeds/all');
    if (thXml) {
      const items = [...thXml.matchAll(/<item>[\s\S]*?<title>(<!\[CDATA\[)?(.*?)(]?\]>)?<\/title>[\s\S]*?<link>(.*?)<\/link>/g)];
      for (const m of items.slice(0, 10)) {
        const title = (m[2] || '').trim();
        const link = (m[4] || '').trim();
        if (title) candidates.push({ 
          title, 
          link: link || 'https://www.tomshardware.com/pc-components/gpus', 
          source: "Tom's Hardware" 
        });
      }
    }
  } catch (e) {
    console.warn("Tom's Hardware feed error:", e.message);
  }

  // Feed 3: Wccftech
  try {
    const wccfXml = await fetchSafe('https://wccftech.com/feed/');
    if (wccfXml) {
      const items = [...wccfXml.matchAll(/<item>[\s\S]*?<title>(<!\[CDATA\[)?(.*?)(]?\]>)?<\/title>[\s\S]*?<link>(.*?)<\/link>/g)];
      for (const m of items.slice(0, 10)) {
        const title = (m[2] || '').trim();
        const link = (m[4] || '').trim();
        if (title) candidates.push({ 
          title, 
          link: link || 'https://wccftech.com/', 
          source: 'Wccftech' 
        });
      }
    }
  } catch (e) {
    console.warn('Wccftech feed error:', e.message);
  }

  // Feed 4: Hacker News Algolia API (Top front page tech/AI stories)
  try {
    const hnRaw = await fetchSafe('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=15');
    if (hnRaw) {
      const hnJson = JSON.parse(hnRaw);
      for (const hit of hnJson.hits || []) {
        if (hit.title && (hit.points > 80 || hit.num_comments > 40)) {
          candidates.push({ 
            title: hit.title.trim(), 
            link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`, 
            source: 'Hacker News Community' 
          });
        }
      }
    }
  } catch (e) {
    console.warn('Hacker News feed error:', e.message);
  }

  return candidates;
}

// 2. Load all existing articles to prevent duplicate topics
function loadExistingArticlesMetadata() {
  const existingTitles = [];
  const existingSlugs = new Set();
  const recentDailyTitles = [];
  const dataDir = path.join(ROOT_DIR, 'lib', 'data');

  if (fs.existsSync(dataDir)) {
    const dailyPath = path.join(dataDir, 'daily-news.ts');
    if (fs.existsSync(dailyPath)) {
      const dailyContent = fs.readFileSync(dailyPath, 'utf8');
      const dailyMatches = [...dailyContent.matchAll(/["']?title["']?\s*:\s*["'`](.*?)["'`]/g)];
      for (const m of dailyMatches) {
        recentDailyTitles.push(m[1]);
        existingTitles.push(m[1].toLowerCase());
      }
    }

    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts') && !f.includes('translations') && !f.includes('en-steps') && f !== 'daily-news.ts');
    for (const file of files) {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
      const titleMatches = [...content.matchAll(/["']?title["']?\s*:\s*["'`](.*?)["'`]/g)];
      const slugMatches = [...content.matchAll(/["']?slug["']?\s*:\s*["'`](.*?)["'`]/g)];

      for (const m of titleMatches) existingTitles.push(m[1].toLowerCase());
      for (const m of slugMatches) existingSlugs.add(m[1].toLowerCase());
    }
  }

  return { existingTitles, existingSlugs, recentDailyTitles };
}

// Simple word similarity helper
function calculateSimilarity(str1, str2) {
  const getWords = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  const words1 = new Set(getWords(str1));
  const words2 = new Set(getWords(str2));
  if (words1.size === 0 || words2.size === 0) return 0;

  let common = 0;
  for (const w of words1) {
    if (words2.has(w)) common++;
  }
  return common / Math.min(words1.size, words2.size);
}

// 3. Filter candidates for AI + Gaming & Hardware relevance + Deduplication
function filterAndRankCandidates(candidates, existingTitles, recentDailyTitles) {
  const keywords = [
    'ai', 'gpu', 'nvidia', 'amd', 'intel', 'geforce', 'radeon', 'rtx', 'dlss', 'fsr',
    'steam', 'epic', 'gaming', 'pc', 'console', 'playstation', 'xbox', 'nintendo',
    'handheld', 'rog', 'deck', 'unreal', 'unity', 'benchmark', 'fps', 'tps',
    'agent', 'model', 'llm', 'chip', 'silicon', 'hardware', 'semiconductor',
    'deepseek', 'claude', 'gemini', 'chatgpt', 'openai', 'qualcomm', 'snapdragon'
  ];

  const filtered = [];
  const seenHeadlines = new Set();

  for (const item of candidates) {
    const lower = item.title.toLowerCase();
    if (seenHeadlines.has(lower)) continue;
    seenHeadlines.add(lower);

    // Relevance check
    const matchesKeyword = keywords.some(k => lower.includes(k));
    if (!matchesKeyword) continue;

    // Strict similarity check against all existing site articles (threshold: 0.35)
    let isDuplicate = false;
    for (const exTitle of existingTitles) {
      if (calculateSimilarity(item.title, exTitle) > 0.35) {
        isDuplicate = true;
        break;
      }
    }

    // Extra strict check against recent daily titles
    for (const rdTitle of recentDailyTitles) {
      if (calculateSimilarity(item.title, rdTitle) > 0.30) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      filtered.push(item);
    }
  }

  return filtered;
}

// 4. Generate the article via Gemini API with upgraded rules
async function generateArticleWithGemini(topCandidates, existingTitlesSample, recentDailyTitles) {
  const candidateListStr = topCandidates
    .slice(0, 10)
    .map((c, i) => `${i + 1}. [${c.source}] ${c.title} (URL Rujukan: ${c.link})`)
    .join('\n');

  const recentListStr = (recentDailyTitles.length > 0 ? recentDailyTitles : existingTitlesSample.slice(-15))
    .slice(0, 15)
    .map(t => `- ${t}`)
    .join('\n');

  const prompt = `
Kamu adalah Editor-in-Chief dan Jurnalis Senior Teknologi & Gaming di EnInformasi Hub.
Author / Penulis artikel ini adalah: EdvanVPRoject (GitHub: https://github.com/EdvanVPRoject).

Tugasmu adalah memilih 1 (SATU) topik berita PALING VIRAL, TERHANGAT, dan PALING BERPENGARUH dari daftar berita 24 jam terakhir berikut:

KANDIDAT BERITA VIRAL TERKINI:
${candidateListStr}

ATURAN DEDUKASI & KEASLIAN (SANGAT KETAT):
- DILARANG KERAS membuat ulang atau mengangkat topik/perusahaan/isu yang sama persis dengan artikel yang baru saja kami terbitkan berikut:
${recentListStr}
- Pilih satu topik dari daftar kandidat di atas yang BELUM PERNAH dibahas sama sekali, segar, dan sedang sangat viral di komunitas global.

ATURAN WAJIB STRUKTUR, SINKRONISASI, & KONTEN (100% KONSISTEN):
1. **SINKRONISASI BILINGUAL TINGKAT TINGGI**:
   - Struktur subjudul Bahasa Indonesia dan Bahasa Inggris WAJIB identik 1-ke-1 (6 Bagian Lengkap):
     - Bagian 1: ### 1. Kronologi & Latar Belakang Peristiwa <---> ### 1. Chronology & Background Context
     - Bagian 2: ### 2. Bedah Teknis & Analisis Arsitektur Mendalam <---> ### 2. Technical Deep-Dive & Architecture Breakdown
     - Bagian 3: ### 3. Komparasi Tolak Ukur & Lanskap Kompetitor <---> ### 3. Benchmark Comparisons & Competitive Landscape
     - Bagian 4: ### 4. Respons Komunitas & Sentimen Industri <---> ### 4. Community Reaction & Industry Sentiment
     - Bagian 5: ### 5. Panduan Praktis & Antisipasi bagi Konsumen <---> ### 5. Practical Consumer Advice & Strategic Takeaways
     - Bagian 6: ### 6. Kesimpulan, Prospek & Rujukan Sumber Asli <---> ### 6. Strategic Outlook & Verified References
2. **TABEL KOMPARASI & BENCHMARK DENGAN RUJUKAN DATA VALID**:
   - Pada Bagian 3 (atau Bagian 2), sertakan minimal 1 (SATU) tabel Markdown komparasi performa/spesifikasi konkret, contoh:
     | Parameter / Metrik | Model / Arsitektur Baru | Generasi Sebelumnya / Pesaing | Selisih Performa |
     |---|---|---|---|
     | Compute / TFLOPS | 120 TFLOPS | 85 TFLOPS | +41.1% |
     Sertakan catatan verifikasi rujukan data uji independen di bawah tabel.
3. **DAFTAR PUSTAKA & RUJUKAN VALID**:
   - Pada akhir Bagian 6, cantumkan blok rujukan asli (misal: *Sumber: [Nama Publisher]*).
   - Masukkan informasi rujukan valid ke field "publisher" dan "sourceUrl" (URL rujukan asli dari berita terpilih).
4. **KEDALAMAN & KUALITAS JURNALISTIK**:
   - Panjang konten ("content" dan "en.content") minimal 650 - 900+ kata. DILARANG KERAS membuat paragraf pendek/ringkas.
   - Beri dua baris baru (\n\n) setelah setiap heading '### ...' sebelum memulai teks paragraf.
5. **ATRIBUSI AUTHOR**:
   - Author: "EdvanVPRoject".

FORMAT JSON OUTPUT YANG WAJIB DIHASILKAN (HANYA JSON MURNI TANPA MARKDOWN BACKTICKS):
{
  "title": "Judul Bahasa Indonesia yang memikat, tajam, viral, dan SEO-friendly",
  "description": "Ringkasan komprehensif 2-3 kalimat dalam Bahasa Indonesia",
  "category": "gaming-esports ATAU tech-gadgets ATAU ai-agents ATAU hardware-setup",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
  "readingTime": "7 min read",
  "difficulty": "Menengah",
  "publisher": "Nama publisher/portal resmi asli (contoh: Tom's Hardware, Eurogamer, The Verge, dll)",
  "sourceUrl": "https://... (URL rujukan resmi yang valid dan aktif)",
  "content": "### 1. Kronologi & Latar Belakang Peristiwa\\n\\n...\\n\\n### 2. Bedah Teknis & Analisis Arsitektur Mendalam\\n\\n...\\n\\n### 3. Komparasi Tolak Ukur & Lanskap Kompetitor\\n\\n| Parameter / Metrik | Hardware / Model Baru | Alternatif / Model Lama | Delta |\\n|---|---|---|---|\\n...\\n\\n### 4. Respons Komunitas & Sentimen Industri\\n\\n...\\n\\n### 5. Panduan Praktis & Antisipasi bagi Konsumen\\n\\n...\\n\\n### 6. Kesimpulan, Prospek & Rujukan Sumber Asli\\n\\n...\\n\\n*Sumber: Nama Publisher Resmi*",
  "en": {
    "title": "Catchy, high-impact English title for global audience",
    "description": "Comprehensive 2-3 sentence English summary explaining the core breakthrough and impact",
    "content": "### 1. Chronology & Background Context\\n\\n...\\n\\n### 2. Technical Deep-Dive & Architecture Breakdown\\n\\n...\\n\\n### 3. Benchmark Comparisons & Competitive Landscape\\n\\n| Metric / Parameter | New Hardware / Model | Predecessor / Rival | Variance |\\n|---|---|---|---|\\n...\\n\\n### 4. Community Reaction & Industry Sentiment\\n\\n...\\n\\n### 5. Practical Consumer Advice & Strategic Takeaways\\n\\n...\\n\\n### 6. Strategic Outlook & Verified References\\n\\n...\\n\\n*Source: Official Publisher Report*"
  }
}
`;

  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`Mengontak Gemini model: ${model}...`);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        })
      });

      const data = await res.json();
      if (data.error) {
        console.warn(`Model ${model} gagal:`, data.error.message);
        lastError = data.error;
        continue;
      }

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from model');

      const parsed = safeJsonParse(rawText);
      if (!parsed) throw new Error('Failed to parse JSON response');
      return parsed;
    } catch (err) {
      console.warn(`Percobaan ${model} error:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`Semua model Gemini gagal dihubungi. Detail error terakhir: ${lastError?.message || lastError}`);
}

function safeJsonParse(raw) {
  if (!raw) return null;
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    try {
      const sanitized = cleaned
        .replace(/\\'/g, "'")
        .replace(/\\([^"\\\/bfnrtu0-9])/g, '$1');
      return JSON.parse(sanitized);
    } catch (e2) {
      throw e1;
    }
  }
}

// Helper to generate a clean, collision-free slug
function createSlug(title, dateStr) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 48);
  const dateCode = dateStr.slice(0, 10).replace(/-/g, '');
  return `${base}-${dateCode}`;
}

// Helper to sanitize article content defensively
function sanitizeArticleContent(raw) {
  if (!raw) return '';
  return raw
    .replace(/([a-zA-Z0-9)])(?:ln|\\n)([A-Z])/g, '$1\n\n$2')
    .replace(/(###\s+\d+[\.\)][^\n\r]{10,75}?(?:Context|Breakdown|Landscape|Sentiment|Takeaways|Trajectory|Peristiwa|Mendalam|Pasar|Industri|Konsumen|Depan|Asli|References))([A-Z][a-z]{3,})/g, '$1\n\n$2');
}

// Helper to extract TOC items from content
function extractToc(content) {
  const items = [];
  const clean = sanitizeArticleContent(content);
  const lines = clean.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      let title = trimmed.replace(/^###\s+/, '').trim();
      if (title.length > 85) {
        const dotIdx = title.search(/(?<=[^\d]\.)\s+[A-Z]/);
        if (dotIdx !== -1) {
          title = title.slice(0, dotIdx + 1).trim();
        } else {
          title = title.slice(0, 80).trim() + '...';
        }
      }
      const id = title
        .toLowerCase()
        .replace(/^[0-9]+\.\s*/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      items.push({ id, title });
    }
  }
  return items;
}

// 5. Main execution logic
async function run() {
  console.log('=== [DAILY VIRAL AI + GAMING NEWS PIPELINE - ENINFORMASI HUB] ===');
  console.log('Waktu Eksekusi:', new Date().toISOString());

  // Step 1: Load existing articles for anti-duplication
  const { existingTitles, existingSlugs, recentDailyTitles } = loadExistingArticlesMetadata();
  console.log(`Terdeteksi ${existingTitles.length} artikel eksisting (${recentDailyTitles.length} berita harian terbaru) di sistem.`);

  // Step 2: Fetch fresh feeds
  console.log('Mengambil feed berita viral terkini (Google News, Tom\'s Hardware, Wccftech, Hacker News)...');
  const rawCandidates = await fetchViralFeeds();
  console.log(`Ditemukan ${rawCandidates.length} berita dari berbagai feed terpercaya.`);

  // Step 3: Filter & deduplicate
  const filteredCandidates = filterAndRankCandidates(rawCandidates, existingTitles, recentDailyTitles);
  console.log(`Setelah filter relevansi (AI, Gaming, Hardware) & deduplikasi: ${filteredCandidates.length} topik kandidat unik.`);

  if (filteredCandidates.length === 0) {
    console.log('Semua topik kandidat sudah pernah dibahas atau tidak relevan. Mencari fallback tren...');
    filteredCandidates.push(
      { 
        title: 'Next-Gen Neural GPU Architectures in High-End Gaming Rigs', 
        link: 'https://www.tomshardware.com/pc-components/gpus',
        source: 'Hardware Lab Review' 
      },
      { 
        title: 'AI-Powered DLSS and Frame Generation in 2026 Gaming Handhelds', 
        link: 'https://www.eurogamer.net/digitalfoundry',
        source: 'Digital Foundry Investigation' 
      }
    );
  }

  // Step 4: Generate new article via Gemini
  console.log('Menghasilkan artikel mendalam dengan Gemini...');
  const generated = await generateArticleWithGemini(filteredCandidates, existingTitles, recentDailyTitles);

  const now = new Date();
  const dateISO = now.toISOString();
  const pubDate = dateISO.slice(0, 10);
  let slug = createSlug(generated.title, pubDate);

  // Guarantee slug uniqueness
  if (existingSlugs.has(slug)) {
    slug += `-${Math.floor(Math.random() * 8999 + 1000)}`;
  }

  const cleanContentID = sanitizeArticleContent(generated.content);
  const cleanContentEN = sanitizeArticleContent(generated.en?.content || generated.content);
  const tocID = extractToc(cleanContentID);
  const tocEN = extractToc(cleanContentEN);

  const newArticle = {
    slug,
    title: generated.title,
    description: generated.description,
    postType: 'artikel',
    category: generated.category || 'gaming-esports',
    categoryLabel: generated.category === 'gaming-esports' ? 'Gaming & Esports' : 'Teknologi & Hardware',
    difficulty: generated.difficulty || 'Menengah',
    pubDate: dateISO,
    updatedDate: dateISO,
    readingTime: generated.readingTime || '6 min read',
    author: 'EdvanVPRoject',
    tags: generated.tags || ['AI', 'Gaming', 'Hardware', 'Viral News'],
    toc: tocID,
    content: cleanContentID,
    en: {
      title: generated.en?.title || generated.title,
      description: generated.en?.description || generated.description,
      content: cleanContentEN,
      toc: tocEN.length > 0 ? tocEN : tocID,
    }
  };

  console.log('Artikel baru berhasil dibuat:');
  console.log('Slug:', newArticle.slug);
  console.log('Judul (ID):', newArticle.title);
  console.log('Judul (EN):', newArticle.en.title);
  console.log('Kategori:', newArticle.category);

  // Step 5: Generate 100% Unique Bespoke SVG Cover (Zero Duplicates & Zero 404s)
  console.log('Menghasilkan Cover Vektor SVG Kustom...');
  try {
    const coversDir = path.join(ROOT_DIR, 'public', 'covers');
    if (!fs.existsSync(coversDir)) {
      fs.mkdirSync(coversDir, { recursive: true });
    }
    const svgCode = generateCoverSvg({
      title: newArticle.title,
      category: newArticle.category,
      author: 'EdvanVPRoject',
      tags: newArticle.tags
    });
    const svgPath = path.join(coversDir, `${slug}.svg`);
    fs.writeFileSync(svgPath, svgCode, 'utf8');
    console.log(`Bespoke SVG Cover berhasil dibuat di: ${svgPath}`);
  } catch (err) {
    console.warn('Gagal membuat SVG cover:', err.message);
  }

  // Step 6: Register Verified Source Reference in lib/article-references.ts
  console.log('Mendaftarkan rujukan referensi valid ke lib/article-references.ts...');
  try {
    const refPath = path.join(ROOT_DIR, 'lib', 'article-references.ts');
    if (fs.existsSync(refPath)) {
      let refFileContent = fs.readFileSync(refPath, 'utf8');
      const targetPublisher = generated.publisher || filteredCandidates[0]?.source || "Independent Hardware & Gaming Journal";
      let targetSourceUrl = generated.sourceUrl || filteredCandidates[0]?.link || "https://news.google.com/";
      if (!targetSourceUrl.startsWith('http')) targetSourceUrl = 'https://news.google.com/';

      const targetNote = `Laporan investigasi dan analisis data rujukan resmi: ${generated.title}`;
      const entryCode = `  // Auto-generated Daily News Entry: ${slug}\n  '${slug}': {\n    publisher: ${JSON.stringify(targetPublisher)},\n    sourceUrl: ${JSON.stringify(targetSourceUrl)},\n    note: ${JSON.stringify(targetNote)}\n  },\n`;

      const insertMarker = 'export const ARTICLE_REFERENCES: Record<string, ArticleReference> = {';
      if (refFileContent.includes(insertMarker)) {
        refFileContent = refFileContent.replace(insertMarker, `${insertMarker}\n${entryCode}`);
        fs.writeFileSync(refPath, refFileContent, 'utf8');
        console.log(`Berhasil mendaftarkan rujukan artikel untuk: ${slug}`);
      }
    }
  } catch (err) {
    console.warn('Gagal memperbarui article-references:', err.message);
  }

  // Step 7: Save to lib/data/daily-news.ts
  const dailyNewsPath = path.join(ROOT_DIR, 'lib', 'data', 'daily-news.ts');
  let currentArticles = [];

  if (fs.existsSync(dailyNewsPath)) {
    const rawContent = fs.readFileSync(dailyNewsPath, 'utf8');
    const jsonMatch = rawContent.match(/export const dailyNewsArticles: Article\[\] = (\[[\s\S]*\]);/);
    if (jsonMatch) {
      try {
        const evalStr = jsonMatch[1];
        currentArticles = (new Function(`return ${evalStr}`))();
      } catch (e) {
        console.warn('Gagal membaca dailyNewsArticles eksisting, membuat list baru:', e.message);
        currentArticles = [];
      }
    }
  }

  // Prepend the new article so it appears at the very top of feeds
  currentArticles.unshift(newArticle);

  // Format TypeScript file output
  const tsContent = `import { Article } from '../types';\n\nexport const dailyNewsArticles: Article[] = ${JSON.stringify(currentArticles, null, 2)};\n`;

  fs.writeFileSync(dailyNewsPath, tsContent, 'utf8');
  console.log(`Berhasil menyimpan artikel ke: ${dailyNewsPath}`);
  console.log(`Total artikel di dailyNewsArticles saat ini: ${currentArticles.length}`);

  // Step 8: Automatically run build-summaries.mjs to update total counts and summaries dataset
  console.log('Memperbarui artikel ringkasan & total penghitung konten...');
  try {
    execSync('node scripts/build-summaries.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });
    console.log('Katalog article-summaries berhasil disinkronkan!');
  } catch (err) {
    console.warn('Gagal menjalankan build-summaries:', err.message);
  }

  console.log('=== [DAILY NEWS PIPELINE SELESAI DENGAN SUKSES] ===');
}

run().catch(err => {
  console.error('Fatal error in daily news pipeline:', err);
  process.exit(1);
});
