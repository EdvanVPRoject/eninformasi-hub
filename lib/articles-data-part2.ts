import { Article } from './types';

export const articlesPart2: Article[] = [
  {
    slug: 'autogpt-2026-masih-relevan-atau-ketinggalan',
    title: 'AutoGPT di Tahun 2026: Apakah Masih Relevan Buat Otomasi Kerjaan atau Udah Ketinggalan Jaman?',
    description: 'Bongkar status proyek open source paling viral zaman awal AI. Gimana pergeseran AutoGPT dari bot eksperimen liar jadi arsitektur terstruktur.',
    postType: 'artikel',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Menengah',
    pubDate: '13 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['AutoGPT', 'AI History', 'Autonomous Agents', 'Benchmark'],
    affiliateProduct: {
      name: 'Buku Desain Sistem Multi-Agent Modern',
      priceEstimate: 'Rp 115.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Buku Wajib Arsitek AI',
      description: 'Panduan arsitektur software masa depan untuk orchestrating puluhan AI agent.'
    },
    toc: [
      { id: 'nostalgia-autogpt', title: '1. Nostalgia Awal Kehebohan AutoGPT' },
      { id: 'kelemahan-fatal', title: '2. Kenapa Dulu Sering Boncos & Gagal?' },
      { id: 'wajah-baru-autogpt', title: '3. Evolusi AutoGPT Menjadi Builder Platform' },
      { id: 'perbandingan-alternatif', title: '4. Alternatif Modern di Tahun 2026' },
    ],
    steps: [
      { id: 'step-1', label: 'Pahami batas kemampuan agen otonom murni vs graf' },
      { id: 'step-2', label: 'Eksplorasi antarmuka AutoGPT Forge dan UI Builder' }
    ],
    content: `
### Ingat Momen Pertama Kali AutoGPT Bikin Geger Twitter?
Pertengahan 2023, dunia internet gempar. Ada satu program di GitHub yang katanya bisa bikin startup sendiri, nulis kodingan, cari investor, dan ngejalanin marketing tanpa campur tangan orang sama sekali. 

Tapi realitanya? Dulu AutoGPT sering banget kejebak dalam lingkaran setan (*infinite loop*), ngabisin saldo API $50 dalam waktu 10 menit cuma buat nulis satu file teks yang isinya ngaco!

Kini AutoGPT 2026 berevolusi menjadi platform builder dengan guardrails ketat dan arsitektur State Graph yang jauh lebih matang.
`
  },
  {
    slug: 'cara-bikin-chatbot-rag-qdrant-llamaindex',
    title: 'Cara Bikin Chatbot RAG (Retrieval-Augmented Generation) Sendiri Pake Qdrant & LlamaIndex',
    description: 'Tutorial langkah demi langkah bikin chatbot pintar yang hafal seluruh SOP perusahaan, file PDF, dan catatan Notion pribadi tanpa halusinasi.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Menengah',
    pubDate: '13 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '7 min baca',
    author: 'Edvan',
    tags: ['RAG', 'Vector Database', 'Qdrant', 'LlamaIndex', 'Python'],
    affiliateProduct: {
      name: 'Server Mini PC Intel N100 16GB RAM',
      priceEstimate: 'Rp 2.450.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Home Server Hemat',
      description: 'PC mini hemat daya cuma 15 Watt, pas banget buat nyalain database vektor Qdrant lokal.'
    },
    toc: [
      { id: 'kenapa-rag', title: '1. Kenapa Fine-Tuning Itu Mahal & RAG Jawabannya?' },
      { id: 'vektor-database-qdrant', title: '2. Mengenal Database Vektor Qdrant' },
      { id: 'skrip-koding-rag', title: '3. Skrip Python RAG Pake LlamaIndex' },
      { id: 'trik-chunking', title: '4. Trik Chunking Biar Jawaban Tepat Sasaran' },
    ],
    steps: [
      { id: 'step-1', label: 'Jalankan Qdrant di Docker lokal port 6333' },
      { id: 'step-2', label: 'Install llama-index dan llama-index-vector-stores-qdrant' },
      { id: 'step-3', label: 'Load folder dokumen PDF dan ubah jadi vector embeddings' },
      { id: 'step-4', label: 'Buat query engine dan lakukan tanya jawab interaktif' }
    ],
    content: `
### Jangan Latih Ulang Model AI Cuma Buat Nambahin Data Internal!
Banyak orang ngira kalo mau bikin AI paham data kantor, mereka harus nge-*fine-tune* modelnya dari awal. Padahal cara itu mahal banget. Solusi paling masuk akal: **RAG (Retrieval-Augmented Generation)**.

\`\`\`bash
# Nyalain Qdrant di Docker
docker run -p 6333:6333 -v qdrant_storage:/qdrant/storage qdrant/qdrant
\`\`\`
`
  },
  {
    slug: 'tutorial-open-webui-chatgpt-pribadi-server-rumah',
    title: 'Tutorial Open WebUI: Bikin Tampilan ala ChatGPT Pribadi di Server Rumah (Self-Hosted)',
    description: 'Sulap komputer atau VPS lu jadi server ChatGPT pribadi yang cakep, ada fitur login multi-user, web search, dan upload file pake Open WebUI.',
    postType: 'tutorial',
    category: 'tools-automation',
    categoryLabel: 'Dev Tools & Automation',
    difficulty: 'Pemula',
    pubDate: '13 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['Open WebUI', 'Self-Hosted', 'Ollama', 'Docker', 'Privacy'],
    affiliateProduct: {
      name: 'Router WiFi 6 Gigabit Dual Band',
      priceEstimate: 'Rp 650.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Jaringan Robusta',
      description: 'Koneksi lokal super ngebut biar streaming respon AI di rumah gak ada buffering.'
    },
    toc: [
      { id: 'pesona-open-webui', title: '1. Kenapa Harus Open WebUI?' },
      { id: 'install-gabung-ollama', title: '2. Cara Install Bundled bareng Ollama' },
      { id: 'fitur-tersembunyi', title: '3. Fitur Unggulan: Web Search & RAG Otomatis' },
      { id: 'akses-dari-hp', title: '4. Cara Akses Aman dari HP Lu di Luar Rumah' },
    ],
    steps: [
      { id: 'step-1', label: 'Siapkan Docker Desktop atau Docker Engine' },
      { id: 'step-2', label: 'Jalankan image ghcr.io/open-webui/open-webui:main' },
      { id: 'step-3', label: 'Buka localhost:3000 dan daftarkan user admin' }
    ],
    content: `
### Bosan Tampilan Terminal Hitam Putih?
Jalanin model lokal pake Ollama di terminal emang keren buat pamer, tapi buat kerja harian, mata tetep lebih nyaman pake tampilan web modern kayak ChatGPT. Solusi juara: **Open WebUI**!

\`\`\`bash
docker run -d -p 3000:8080 \\
  --add-host=host.docker.internal:host-gateway \\
  -v open-webui:/app/backend/data \\
  --name open-webui \\
  --restart always \\
  ghcr.io/open-webui/open-webui:main
\`\`\`
`
  },
  {
    slug: 'prompt-engineering-hack-2026-trik-bikin-ai-nurut',
    title: 'Prompt Engineering Hack 2026: Trik Bikin AI Nurut Tanpa Berbelit-belit',
    description: 'Trik menyusun prompt tingkat lanjut tanpa kalimat klise kuno. Belajar pola role-task-context-constraints, few-shot conditioning, dan negative prompting.',
    postType: 'artikel',
    category: 'prompting',
    categoryLabel: 'Prompting',
    difficulty: 'Pemula',
    pubDate: '13 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['Prompt Engineering', 'ChatGPT', 'Claude', 'Productivity'],
    affiliateProduct: {
      name: 'Cheatsheet Card Prompt Engineering Pro',
      priceEstimate: 'Rp 45.000',
      linkUrl: 'https://lynk.id',
      badge: 'Kartu Saku Praktis',
      description: 'Panduan saku 20 pola prompt teruji buat developer dan digital marketer.'
    },
    toc: [
      { id: 'mitos-prompt-kuno', title: '1. Jangan Pake Trik 2023 Lagi!' },
      { id: 'formula-rtcc', title: '2. Formula Sakti RTCC (Role, Task, Context, Constraint)' },
      { id: 'few-shot-magic', title: '3. Keajaiban Contoh Kongkret (Few-Shot)' },
      { id: 'negative-prompting', title: '4. Kekuatan Batasan Negatif (Negative Constraints)' },
    ],
    steps: [
      { id: 'step-1', label: 'Tinggalkan kalimat pembuka basi yang memakan kuota token' },
      { id: 'step-2', label: 'Gunakan formula RTCC' }
    ],
    content: `
### Stop Buka Prompt Pake: "Bertindaklah Sebagai Ahli..."
Di era model penalaran modern kayak Claude 3.7, GPT-4o, dan DeepSeek R1, instruksi basi itu udah gak efektif lagi. Kunci utamanya adalah **Struktur Batasan (Constraints)** dan **Format Output yang Spesifik**.
`
  },
  {
    slug: 'rekomendasi-rakit-pc-khusus-local-ai-llm-2026',
    title: 'Rekomendasi Rakit PC Khusus Local AI & LLM 2026: VRAM vs RAM, Pilih GPU Mana yang Paling Cuan?',
    description: 'Panduan hardware anti boncos buat rakit rig AI lokal. Mana yang lebih penting: kapasitas VRAM GPU, bandwidth DDR5, atau kecepatan prosesor?',
    postType: 'artikel',
    category: 'hardware-setup',
    categoryLabel: 'Hardware & Gear',
    difficulty: 'Menengah',
    pubDate: '13 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['PC Gaming', 'Local AI', 'NVIDIA', 'RTX', 'Hardware Guide'],
    affiliateProduct: {
      name: 'Power Supply 850W Gold PCIe 5.0 ATX 3.0',
      priceEstimate: 'Rp 1.850.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Komponen Vital',
      description: 'PSU berkualitas tinggi biar rig PC lu gak meledak pas GPU narik daya penuh saat komputasi model AI.'
    },
    toc: [
      { id: 'hukum-vram-nomor-satu', title: '1. Hukum Emas: VRAM Adalah Raja' },
      { id: 'rekomendasi-budget', title: '2. Racikan PC Budget Hemat (10-15 Jutaan)' },
      { id: 'racikan-mid-tier', title: '3. Racikan PC Menengah Pro (25-35 Jutaan)' },
      { id: 'opsi-mac-apple-silicon', title: '4. Apakah Mac Mini / Studio Lebih Masuk Akal?' },
    ],
    steps: [
      { id: 'step-1', label: 'Hitung kebutuhan model: Parameter x Bit quantization / 8' }
    ],
    content: `
### Hukum Emas: Kapasitas VRAM GPU Adalah Raja
Di dunia komputasi Local LLM, prosesor mahal tidak banyak menolong jika kartu grafis Anda kehabisan VRAM (*CUDA Out of Memory*). Prioritaskan GPU NVIDIA dengan minimal 12GB sampai 16GB VRAM.
`
  },
  {
    slug: 'perplexity-pro-deep-research-laporan-riset-otomatis',
    title: 'Perplexity Pro & Deep Research: Cara Bikin Laporan Riset 30 Halaman Cuma Modal Satu Prompt',
    description: 'Eksplorasi fitur Deep Research di Perplexity dan Gemini. Gimana AI menjelajah ratusan jurnal ilmiah dan situs terpercaya buat nyusun kajian komprehensif.',
    postType: 'artikel',
    category: 'tools-automation',
    categoryLabel: 'Dev Tools & Automation',
    difficulty: 'Pemula',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['Perplexity', 'Deep Research', 'Market Research', 'Academic AI'],
    affiliateProduct: {
      name: 'Tablet E-Ink Pen Stylus Buat Baca PDF',
      priceEstimate: 'Rp 4.900.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Alat Riset Nyaman',
      description: 'Layar mirip kertas asli, mata gak sakit waktu nge-review puluhan halaman hasil riset AI.'
    },
    toc: [
      { id: 'bukan-search-biasa', title: '1. Apa Itu Mesin Deep Research?' },
      { id: 'anatomi-prompt-riset', title: '2. Cara Bikin Prompt Riset yang Tajam' },
      { id: 'verifikasi-sitasi', title: '3. Cara Cepat Cek Keaslian Sumber Sitasi' },
      { id: 'ekspor-ke-laporan', title: '4. Trik Ekspor Otomatis ke Dokumen & Slide' },
    ],
    steps: [
      { id: 'step-1', label: 'Aktifkan mode Pro / Deep Research' }
    ],
    content: `
### Google Search Konvensional Sudah Terlalu Berisik!
Fitur **Deep Research** memecah pertanyaan kompleks Anda menjadi belasan sub-pertanyaan, merayapi jurnal ilmiah, lalu menyusun dokumen terstruktur lengkap dengan sitasi akurat.
`
  },
  {
    slug: 'tutorial-smolagents-huggingface-paling-enteng',
    title: 'Tutorial Smolagents dari Hugging Face: Library Agen AI Paling Enteng & Gampang Dikuasai',
    description: 'Panduan belajar Smolagents, framework agen AI minimalis dari tim Hugging Face yang pake filosofi CodeAgent alih-alih JSON actions yang rapuh.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Menengah',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['Smolagents', 'Hugging Face', 'Python', 'CodeAgent', 'Open Source'],
    affiliateProduct: {
      name: 'Buku Pemrograman Python Lanjut & OOP',
      priceEstimate: 'Rp 95.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Buku Belajar Wajib',
      description: 'Pondasi logika Python bersih buat yang mau merajai dunia AI engineering.'
    },
    toc: [
      { id: 'filosofi-smolagents', title: '1. Kenapa Namanya "Smol"?' },
      { id: 'codeagent-vs-json', title: '2. CodeAgent: Agen yang Bicara Pake Kode Python Asli' },
      { id: 'tutorial-coding', title: '3. Bikin Bot Smolagent Pertama Lu' },
      { id: 'integrasi-hf-hub', title: '4. Menyambungkan Tools Gratisan dari Hugging Face Hub' },
    ],
    steps: [
      { id: 'step-1', label: 'Install library: pip install smolagents' },
      { id: 'step-2', label: 'Inisialisasi CodeAgent' }
    ],
    content: `
### Smolagents: Minimalis & Tangguh
Hugging Face merancang **Smolagents** dengan inti kode ~1.000 baris. Agen mengekspresikan aksinya melalui kode Python langsung (*CodeAgent*) yang terbukti jauh lebih minim galat dibanding format JSON.

\`\`\`python
from smolagents import CodeAgent, DuckDuckGoSearchTool, HfApiModel

agent = CodeAgent(tools=[DuckDuckGoSearchTool()], model=HfApiModel())
agent.run("Berapa kurs 1 Dollar ke Rupiah hari ini?")
\`\`\`
`
  },
  {
    slug: 'bikin-lagu-studio-pake-suno-v4-dan-udio',
    title: 'Bikin Lagu Keren Berkualitas Studio Pake Suno AI v4 & Udio: Panduan Prompt Musik Buat Pemula',
    description: 'Sulap ide lirik receh lu jadi lagu pop, rock, dangdut, atau jazz berkualitas radio rekaman studio cuma dalam 30 detik pake generator musik AI.',
    postType: 'artikel',
    category: 'tools-automation',
    categoryLabel: 'Creative & Music AI',
    difficulty: 'Pemula',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['Suno AI', 'Udio', 'Music Generation', 'Prompt Music', 'Audio AI'],
    affiliateProduct: {
      name: 'Headphone Studio Monitoring Audio-Technica M50x',
      priceEstimate: 'Rp 2.150.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Audio Monitoring Juara',
      description: 'Headphone favorit produser musik buat dengerin detail mixing lagu hasil AI.'
    },
    toc: [
      { id: 'revolusi-audio-ai', title: '1. Gak Bisa Main Gitar? Tetep Bisa Bikin Album!' },
      { id: 'anatomi-prompt-lagu', title: '2. Cara Nulis Prompt Style & Metatag Vokal' },
      { id: 'suno-vs-udio', title: '3. Kapan Pake Suno v4, Kapan Pake Udio 1.5?' },
      { id: 'tips-mastering', title: '4. Trik Biar Vokal Gak Terdengar Robotik' },
    ],
    steps: [
      { id: 'step-1', label: 'Tentukan genre, tempo BPM, dan emosi lagu' }
    ],
    content: `
### Dari Ide Singkat Menjadi Lagu Berkualitas Radio
Suno AI v4 dan Udio memungkinkan siapa saja menghasilkan lagu lengkap dengan vokal manusiawi dan aransemen instrumen profesional dalam waktu kurang dari 1 menit.
`
  },
  {
    slug: 'panduan-flux-1-comfyui-gambar-ai-super-realistis',
    title: 'Panduan Flux.1 & ComfyUI: Generate Gambar AI Super Realistis Tanpa Batasan Sensor',
    description: 'Cara setting model image generator terbaik Flux.1 di ComfyUI. Bikin render foto hyper-realistic, anatomi jari sempurna, dan teks yang bisa terbaca jelas.',
    postType: 'tutorial',
    category: 'tools-automation',
    categoryLabel: 'Creative & Image AI',
    difficulty: 'Mahir',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['Flux.1', 'ComfyUI', 'Stable Diffusion', 'Image Generation', 'Design'],
    affiliateProduct: {
      name: 'Pen Tablet Drawing Display Huion Kamvas Pro',
      priceEstimate: 'Rp 4.300.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Alat Desainer Digital',
      description: 'Layar gambar interaktif buat touch up dan inpainting detail gambar hasil Flux.1.'
    },
    toc: [
      { id: 'kenapa-flux', title: '1. Selamat Tinggal Jari Enam & Teks Alien' },
      { id: 'persyaratan-hardware', title: '2. Syarat VRAM & Bobot Model Flux (Schnell vs Dev)' },
      { id: 'setup-comfyui', title: '3. Alur Node ComfyUI Paling Efisien' },
      { id: 'taktik-prompt-realistis', title: '4. Rahasia Prompt Fotografi Natural (Anti-Plastic)' },
    ],
    steps: [
      { id: 'step-1', label: 'Download ComfyUI standalone release' },
      { id: 'step-2', label: 'Unduh checkpoint model flux1-schnell' }
    ],
    content: `
### Generasi Gambar AI Generasi Baru
Flux.1 memecahkan kelemahan klasik Stable Diffusion: render jari kini akurat, dan tulisan teks dalam poster ter-render dengan sempurna tanpa kesalahan tipografi.
`
  },
  {
    slug: 'v0-dev-vs-bolt-new-bikin-web-fullstack-dari-prompt',
    title: 'v0.dev vs Bolt.new: Bikin Aplikasi Web Fullstack Interaktif Cuma Dari Prompt Teks',
    description: 'Uji tanding dua AI Web Builder paling viral. Mana yang kodenya paling bersih, gampang diekspor, dan siap dipake buat prototipe klien komersial?',
    postType: 'artikel',
    category: 'tools-automation',
    categoryLabel: 'Dev Tools & Automation',
    difficulty: 'Pemula',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['v0.dev', 'Bolt.new', 'Web Development', 'React', 'Frontend'],
    affiliateProduct: {
      name: 'Langganan Domain .COM & VPS Cloud',
      priceEstimate: 'Rp 160.000/thn',
      linkUrl: 'https://niagahoster.co.id',
      badge: 'Domain Resmi',
      description: 'Domain murah buat langsung online-kan prototipe web buatan v0 dan Bolt ke publik.'
    },
    toc: [
      { id: 'era-vibe-coding', title: '1. Fenomena Baru: "Vibe Coding"' },
      { id: 'spesialisasi-v0', title: '2. v0.dev dari Vercel: Rajanya Komponen UI & Tailwind' },
      { id: 'spesialisasi-bolt', title: '3. Bolt.new: WebContainer Fullstack di Dalam Browser' },
      { id: 'kesimpulan-pilihan', title: '4. Kapan Pilih v0, Kapan Pilih Bolt?' },
    ],
    steps: [
      { id: 'step-1', label: 'Tulis deskripsi antarmuka yang diinginkan' }
    ],
    content: `
### Era "Vibe Coding" Telah Tiba
v0.dev unggul dalam menciptakan komponen UI frontend Tailwind yang sangat bersih, sedangkan Bolt.new menjalankan lingkungan WebContainer fullstack langsung di dalam tab peramban Anda.
`
  }
];
