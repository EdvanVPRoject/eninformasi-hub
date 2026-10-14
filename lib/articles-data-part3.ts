import { Article } from './types';

export const articlesPart3: Article[] = [
  {
    slug: 'claude-computer-use-tutorial-agen-kendali-layar',
    title: 'Claude Computer Use: Tutorial Bikin AI yang Bisa Klik Mouse & Ngetik Sendiri di Layar Komputer Lu',
    description: 'Panduan eksperimental fitur Computer Use dari Anthropic. Biar agen AI lu bisa buka aplikasi kalkulator, klik menu di Excel, dan navigasi OS otomatis.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Mahir',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '7 min baca',
    author: 'Edvan',
    tags: ['Claude', 'Computer Use', 'OS Automation', 'Anthropic', 'GUI Agent'],
    affiliateProduct: {
      name: 'Mouse Ergonomis Nirkabel Silent Click',
      priceEstimate: 'Rp 450.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Alat Produktif',
      description: 'Mouse presisi nyaman dipakai kerja saat memantau agen AI mengendalikan desktop Anda.'
    },
    toc: [
      { id: 'revolusi-gui', title: '1. Lompatan Dari API Menuju GUI' },
      { id: 'arsitektur-docker', title: '2. Setup Environment Aman via Docker' },
      { id: 'cara-kerja-screenshot', title: '3. Loop: Screenshot, Rencana, Gerakkan Kursor' },
      { id: 'safety-warning', title: '4. Batasan Keamanan & Bahaya Prompt Injection' },
    ],
    steps: [
      { id: 'step-1', label: 'Jalankan container Docker resmi anthropic/quickstart-computer-use' },
      { id: 'step-2', label: 'Buka desktop virtual di browser via noVNC' },
      { id: 'step-3', label: 'Ketik perintah instruksi navigasi antarmuka' }
    ],
    content: `
### Dari "Tolong Tulis Kodingan" Jadi "Tolong Kerjain di Laptop Gue!"
Claude 3.5/3.7 Computer Use membawa kemampuan AI ke level baru: si agen dikasih akses langsung ke layar, mouse, dan keyboard komputer di lingkungan container Docker yang aman.

\`\`\`bash
docker run \\
  -e ANTHROPIC_API_KEY="sk-ant-api-xxxx" \\
  -p 8080:8080 \\
  -it ghcr.io/anthropics/anthropic-quickstart-computer-use:latest
\`\`\`
`
  },
  {
    slug: 'quantization-llm-santai-bedanya-gguf-exl2-awq',
    title: 'Quantization LLM Dijelasin Santai: Bedanya GGUF, EXL2, dan AWQ Biar Gak Boros VRAM',
    description: 'Panduan praktis kompresi model AI. Cara bikin model raksasa 70B yang aslinya butuh VRAM 140GB bisa muat dan ngacir di hardware rumahan.',
    postType: 'artikel',
    category: 'hardware-setup',
    categoryLabel: 'Hardware & Gear',
    difficulty: 'Menengah',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['Quantization', 'GGUF', 'EXL2', 'AWQ', 'VRAM', 'Ollama'],
    affiliateProduct: {
      name: 'RAM DDR5 64GB (2x32GB) 6000MHz CL30',
      priceEstimate: 'Rp 3.450.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Memori Kencang',
      description: 'Bandwidth tinggi krusial buat ngebut proses inferensi model kuantisasi GGUF di CPU + GPU.'
    },
    toc: [
      { id: 'apa-itu-kuantisasi', title: '1. Analogi Gampang: Resolusi Foto JPEG' },
      { id: 'format-gguf', title: '2. Format GGUF: Raja Fleksibilitas CPU + GPU' },
      { id: 'format-exl2-awq', title: '3. Format EXL2 & AWQ: Khusus Sultan GPU NVIDIA' },
      { id: 'pilihan-bit-terbaik', title: '4. Cheat Sheet: Pilih Q4_K_M, Q5, atau Q8?' },
    ],
    steps: [
      { id: 'step-1', label: 'Kenali arsitektur perangkat keras' }
    ],
    content: `
### Kuantisasi: Memperkecil Bobot Model AI Tanpa Merusak Otak
Format GGUF memungkinkan *CPU Offloading* yang fleksibel, sedangkan format EXL2 memberikan kecepatan inferensi tertinggi khusus untuk pengguna GPU NVIDIA murni.
`
  },
  {
    slug: 'bikin-bot-telegram-ai-python-gemini-flash-gratis',
    title: 'Bikin Bot Telegram AI Pribadi Pake Python & Gemini Flash API Gratisan',
    description: 'Proyek akhir pekan seru: bikin bot Telegram pintar yang bisa disuruh rangkum artikel web, transkrip voice note, dan jawab pertanyaan layaknya asisten pribadi.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'Tutorial Teknis',
    difficulty: 'Pemula',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['Telegram Bot', 'Google Gemini', 'Python', 'Tutorial', 'Chatbot'],
    affiliateProduct: {
      name: 'Buku Bikin Bot & Otomasi Python dari Nol',
      priceEstimate: 'Rp 75.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Buku Pemula Mantap',
      description: 'Latihan praktis bikin 10 proyek bot Telegram dan WhatsApp pake Python modern.'
    },
    toc: [
      { id: 'persiapan-botfather', title: '1. Bikin Akun Bot di Telegram @BotFather' },
      { id: 'ambil-gemini-key', title: '2. Ambil Google Gemini API Key Gratisan' },
      { id: 'koding-skrip-bot', title: '3. Tulis Skrip Python 40 Baris' },
      { id: 'deploy-nonstop', title: '4. Cara Pasang di Server Biar Nyala 24 Jam' },
    ],
    steps: [
      { id: 'step-1', label: 'Buka Telegram, chat @BotFather, buat bot baru dan copy token API' },
      { id: 'step-2', label: 'Buka Google AI Studio dan salin API Key Gemini' },
      { id: 'step-3', label: 'Jalankan skrip bot Telegram dengan python-telegram-bot' }
    ],
    content: `
### Asisten AI Pribadi di Saku Celana Anda
Manfaatkan kuota gratis ribuan request harian Google Gemini Flash untuk mentenagai bot Telegram pribadi Anda dengan modul \`python-telegram-bot\`.
`
  },
  {
    slug: 'notebooklm-google-ubah-catatan-jadi-podcast-audio',
    title: 'NotebookLM Dari Google: Ubah Catatan Kuliah & Skripsi Jadi Podcast Audio Obrolan Dua Host',
    description: 'Rahasia fitur Audio Overview di NotebookLM. Cara sulap ratusan lembar PDF tugas kampus jadi obrolan podcast dua orang pembawa acara yang asyik didengerin.',
    postType: 'artikel',
    category: 'tools-automation',
    categoryLabel: 'AI Tools & Productivity',
    difficulty: 'Pemula',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['NotebookLM', 'Google AI', 'Podcast AI', 'Study Hack', 'Audio Overview'],
    affiliateProduct: {
      name: 'Earbuds TWS Bluetooth dengan ANC (Active Noise Cancelling)',
      priceEstimate: 'Rp 399.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Alat Belajar Santai',
      description: 'Dengerin materi pelajaran dan ringkasan podcast AI di perjalanan tanpa keganggu suara bising jalanan.'
    },
    toc: [
      { id: 'fitur-audio-overview', title: '1. Fitur Paling Mengguncang: Audio Overview' },
      { id: 'upload-sumber-akurat', title: '2. Cara Upload Catatan Tanpa Takut Halusinasi' },
      { id: 'trik-custom-podcast', title: '3. Trik Kustomisasi Arah Obrolan Host' },
      { id: 'studi-kasus-ujian', title: '4. Cara Saya Lulus Ujian Sertifikasi Modal Dengerin Podcast' },
    ],
    steps: [
      { id: 'step-1', label: 'Buka notebooklm.google.com dan unggah PDF sumber' }
    ],
    content: `
### Belajar Melalui Audio Percakapan Alami
NotebookLM mengunci basis pengetahuannya hanya pada sumber dokumen yang Anda unggah, menghasilkan podcast audio dengan intonasi alami tanpa risiko halusinasi data.
`
  },
  {
    slug: 'fine-tuning-lora-model-lokal-pake-unsloth-hemat',
    title: 'Fine-Tuning LoRA Model Lokal Pake Unsloth: Bikin AI yang Paham Gaya Bicara Lu Sendiri',
    description: 'Panduan teknik LoRA/QLoRA tercepat di dunia pake Unsloth. Melatih model Llama atau Mistral dengan GPU gratisan Google Colab tanpa bikin dompet nangis.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'Mahir / AI Training',
    difficulty: 'Mahir',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '7 min baca',
    author: 'Edvan',
    tags: ['Fine-Tuning', 'LoRA', 'Unsloth', 'Machine Learning', 'Python'],
    affiliateProduct: {
      name: 'Langganan Google Colab Pro 100 Compute Units',
      priceEstimate: 'Rp 160.000',
      linkUrl: 'https://colab.research.google.com',
      badge: 'Compute Cloud Termurah',
      description: 'Akses GPU NVIDIA A100 40GB buat training model LoRA kilat cuma dalam 15 menit.'
    },
    toc: [
      { id: 'konsep-lora', title: '1. Kenapa LoRA (Low-Rank Adaptation) Sangat Jenius?' },
      { id: 'kenapa-unsloth', title: '2. Unsloth: 2x Lebih Cepat & Hemat VRAM 80%' },
      { id: 'format-dataset-jsonl', title: '3. Menyiapkan Dataset Format Percakapan' },
      { id: 'eksekusi-training', title: '4. Eksekusi Training & Ekspor ke Format GGUF' },
    ],
    steps: [
      { id: 'step-1', label: 'Buka notebook Google Colab dengan GPU T4 atau A100' },
      { id: 'step-2', label: 'Install package: pip install "unsloth[colab-new]"' },
      { id: 'step-3', label: 'Load dataset format ShareGPT atau Alpaca' },
      { id: 'step-4', label: 'Lakukan training LoRA dan export adapter ke format GGUF Ollama' }
    ],
    content: `
### Melatih Ulang Bobot AI dengan Biaya Minimal
Unsloth menulis ulang kernel CUDA Triton untuk mempercepat proses pelatihan LoRA/QLoRA hingga 5x lebih efisien dengan penghematan VRAM hingga 80%.

\`\`\`python
from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Meta-Llama-3.1-8B-bnb-4bit",
    max_seq_length=2048,
    load_in_4bit=True,
)
\`\`\`
`
  },
  {
    slug: 'tutorial-cline-dan-roo-code-agen-di-vs-code',
    title: 'Tutorial Cline & Roo Code di VS Code: Agen Software Engineer Mandiri yang Langsung di Editor Lu',
    description: 'Bikin VS Code lu punya asisten engineer mandiri yang bisa nulis file, jalanin build test di terminal, dan benerin compile error sendiri sampe tuntas.',
    postType: 'tutorial',
    category: 'tools-automation',
    categoryLabel: 'Dev Tools & Automation',
    difficulty: 'Menengah',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['Cline', 'Roo Code', 'VS Code', 'Autonomous Coding', 'Dev Tools'],
    affiliateProduct: {
      name: 'Lisensi OpenRouter API Credits $20',
      priceEstimate: 'Rp 320.000',
      linkUrl: 'https://openrouter.ai',
      badge: 'API Hub Hemat',
      description: 'Satu saldo API buat akses bebas ratusan model: Claude 3.7, DeepSeek R1, dan GPT-4o di Cline.'
    },
    toc: [
      { id: 'apa-itu-cline', title: '1. Dari Copilot Pasif Menjadi Agen Aktif' },
      { id: 'fitur-roo-code', title: '2. Kenapa Roo Code Jadi Pilihan Komunitas?' },
      { id: 'mode-konfigurasi', title: '3. Mode Architect, Code, dan Ask' },
      { id: 'tips-hemat-saldo', title: '4. Cara Menjaga Saldo API Biar Gak Jebol' },
    ],
    steps: [
      { id: 'step-1', label: 'Buka VS Code Extensions Marketplace, cari dan install Cline atau Roo Code' },
      { id: 'step-2', label: 'Konfigurasikan API Provider' },
      { id: 'step-3', label: 'Jalankan task otonom di workspace lokal' }
    ],
    content: `
### Dari Autocomplete Pasif Menjadi Autonomous Engineer
Cline membaca struktur proyek, mengedit banyak file sekaligus, menjalankan compiler di terminal, dan memperbaiki galat secara mandiri hingga lulus build.
`
  },
  {
    slug: 'membuat-voice-ai-agent-interaktif-gemini-live-api',
    title: 'Membuat Voice AI Agent Interaktif Real-Time Pake Gemini Live API & WebSockets',
    description: 'Cara bangun agen suara dua arah berlatensi rendah (ultra-low latency). Ngobrol santai lewat mic laptop dengan respon suara natural tanpa delay canggung.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'Voice & Multimodal AI',
    difficulty: 'Mahir',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '7 min baca',
    author: 'Edvan',
    tags: ['Gemini Live', 'Voice AI', 'WebSockets', 'Real-Time Audio', 'Python'],
    affiliateProduct: {
      name: 'Microphone USB Condenser Podcast Fifine K688',
      priceEstimate: 'Rp 875.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Audio Input Jernih',
      description: 'Mic kapsul dinamis buat suara input yang bersih tanpa dengung saat berbicara dengan AI.'
    },
    toc: [
      { id: 'era-voice-interaktif', title: '1. Kematian Sistem Text-to-Speech Kuno' },
      { id: 'protokol-bidirectional', title: '2. Arsitektur WebSocket Dua Arah' },
      { id: 'koding-skrip-suara', title: '3. Skrip Python Streaming Audio PCM' },
      { id: 'fitur-interupsi', title: '4. Menangani Interupsi (Voice Activity Detection)' },
    ],
    steps: [
      { id: 'step-1', label: 'Siapkan API Key Gemini multimodal live' },
      { id: 'step-2', label: 'Buka koneksi WebSocket bidi streaming' },
      { id: 'step-3', label: 'Streaming audio PCM dua arah' }
    ],
    content: `
### Komunikasi Suara Dua Arah Tanpa Latensi
Gemini Live API mentransmisikan audio suara Anda langsung secara real-time via WebSockets dengan latensi di bawah 300ms serta mendukung pemotongan bicara alami (*barge-in interruption*).
`
  },
  {
    slug: 'optimasi-mac-mini-m4-jalankan-model-70b-lokal',
    title: 'Cara Optimasi Mac Mini M4 / M4 Pro Buat Jalankan Model AI 70B Parameter Tanpa Ngelag',
    description: 'Panduan rahasia memanfaatkan Unified Memory arsitektur Apple Silicon. Cara setting sysctl, Metal shader, dan LLM 70B di Mac mini seharga belasan juta.',
    postType: 'tutorial',
    category: 'hardware-setup',
    categoryLabel: 'Hardware & Gear',
    difficulty: 'Menengah',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['Mac Mini', 'Apple Silicon', 'M4', 'Local LLM', 'Metal Performance'],
    affiliateProduct: {
      name: 'Mac Mini M4 Pro 64GB Unified Memory',
      priceEstimate: 'Rp 27.999.000',
      linkUrl: 'https://ibox.co.id',
      badge: 'Workstation AI Terbaik',
      description: 'Mesin komputasi AI paling ringkas, senyap tanpa bising kipas, dan efisien daya.'
    },
    toc: [
      { id: 'rahasia-unified-memory', title: '1. Kenapa Apple Silicon Ditakuti Server AI?' },
      { id: 'tweak-sysctl', title: '2. Trik Tweak Batas Alokasi Memori VRAM Mac' },
      { id: 'pilihan-model-70b', title: '3. Memilih Model 70B Kuantisasi Q4_K_M' },
      { id: 'pengujian-kecepatan', title: '4. Hasil Benchmark Token per Detik' },
    ],
    steps: [
      { id: 'step-1', label: 'Buka terminal macOS dan periksa batas GPU allocated memory' },
      { id: 'step-2', label: 'Jalankan perintah penyesuaian sudo sysctl iogpu.wired_mem_limit' },
      { id: 'step-3', label: 'Load model 70B di Ollama' }
    ],
    content: `
### Membuka Batas Alokasi Memori GPU Apple Silicon
Tingkatkan alokasi memori kabel (*wired memory*) macOS agar GPU dapat mengakses hingga 90% kapasitas RAM terpadu untuk menjalankan model 70B secara senyap.

\`\`\`bash
sudo sysctl iogpu.wired_mem_limit=57000
ollama run llama3.3:70b-instruct-q4_K_M
\`\`\`
`
  },
  {
    slug: 'evaluasi-keamanan-ai-agent-cegah-prompt-injection',
    title: 'Evaluasi Keamanan AI Agent: Cara Mencegah Prompt Injection & Akses Liar ke File Rahasia',
    description: 'Panduan cyber-security untuk developer AI. Cara mengamankan bot dari serangan jailbreak, indirect prompt injection, dan eksekusi skrip berbahaya.',
    postType: 'artikel',
    category: 'ai-agents',
    categoryLabel: 'AI Security & Dev',
    difficulty: 'Mahir',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['AI Security', 'Prompt Injection', 'Cybersecurity', 'Jailbreak', 'Guardrails'],
    affiliateProduct: {
      name: 'YubiKey 5 NFC Hardware Security Key',
      priceEstimate: 'Rp 890.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Keamanan Tingkat Tinggi',
      description: 'Kunci otentikasi fisik untuk melindungi akses server dan kredensial API sensitif kantor Anda.'
    },
    toc: [
      { id: 'ancaman-nyata', title: '1. Bahaya Agen Dikasih Akses Terminal & File' },
      { id: 'indirect-injection', title: '2. Mengenal Serangan Indirect Prompt Injection' },
      { id: 'arsitektur-sandboxing', title: '3. Tiga Lapis Perlindungan: Sandbox, Approval, Schema' },
      { id: 'guardrails-tools', title: '4. Pasang Llama-Guard & NeMo Guardrails' },
    ],
    steps: [
      { id: 'step-1', label: 'Terapkan prinsip Least Privilege pada izin tools yang diberikan ke AI' }
    ],
    content: `
### Mengamankan Agen Otonom dari Serangan Tak Langsung
Terapkan prinsip *Least Privilege*, isolasi runtime dalam sandbox (gVisor/Docker), dan validasi skema tipe ketat (Zod/Pydantic) sebelum mengeksekusi instruksi dari dokumen luar.
`
  },
  {
    slug: 'monetisasi-ai-agent-workflow-jual-ke-umkm',
    title: 'Monetisasi AI Agent & Workflow Otomasi: Cara Jual Solusi AI ke UMKM & Kantor Agensi Lokal',
    description: 'Strategi bisnis nyata cari cuan di era AI. Cara membungkus workflow n8n dan chatbot cerdas jadi layanan bernilai puluhan juta rupiah bagi pemilik bisnis.',
    postType: 'artikel',
    category: 'tools-automation',
    categoryLabel: 'Business & Monetization',
    difficulty: 'Pemula',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['Monetization', 'AI Agency', 'Freelance', 'Business Guide', 'No-Code'],
    affiliateProduct: {
      name: 'Template Proposal Bisnis & Kontrak Agensi AI',
      priceEstimate: 'Rp 149.000',
      linkUrl: 'https://lynk.id',
      badge: 'Paket Bisnis Siap Pakai',
      description: 'Draft kontrak legal, kalkulator pricing retain bulanan, dan slide pitch deck ke klien.'
    },
    toc: [
      { id: 'peluang-emas', title: '1. Kenapa UMKM Butuh Lu, Bukan Butuh ChatGPT?' },
      { id: 'tiga-layanan-paling-laku', title: '2. Tiga Produk Otomasi yang Paling Dicari Pasar' },
      { id: 'strategi-pricing', title: '3. Cara Menentukan Harga: Setup Fee + Biaya Retainer' },
      { id: 'trik-pitching', title: '4. Jangan Jual "AI", Jual Penghematan Waktu & Cuan!' },
    ],
    steps: [
      { id: 'step-1', label: 'Petakan masalah operasional berulang di bisnis teman atau kenalan' }
    ],
    content: `
### Menjual Efisiensi Waktu dan Solusi Nyata
Klien tidak membeli model AI, mereka membeli solusi yang meningkatkan laba: customer support 24 jam WhatsApp, pemrosesan struk mutasi bank otomatis, dan content repurposing mingguan.
`
  }
];
