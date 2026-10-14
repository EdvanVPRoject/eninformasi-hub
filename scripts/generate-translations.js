const fs = require('fs');
const path = require('path');

// Dictionary of Indonesian technical terms to English
const termMap = [
  [/Tutorial LangGraph Buat Pemula: Bikin Agen AI Multi-Langkah yang Anti-Halusinasi/g, 'LangGraph Beginner Tutorial: Building Multi-Step AI Agents with Deterministic Workflows'],
  [/Bikin Asisten Otomatis Pake n8n dan AI Agent: Panduan Workflow Mandiri Tanpa Coding/g, 'Build Automated Assistants with n8n & AI Agents: Self-Hosted No-Code Workflow Guide'],
  [/Panduan Ollama & DeepSeek-R1 di Laptop Spek Pas-pasan: Jalan Offline Tanpa Kuota/g, 'Ollama & DeepSeek-R1 Offline Setup on Budget Laptops: Complete Local AI Guide'],
  [/Bikin Sistem RAG Dokumen Pribadi Pake LangChain & ChromaDB: Anti Halusinasi/g, 'Building Local Document RAG with LangChain & ChromaDB: Zero-Hallucination Retrieval'],
  [/Tutorial Open WebUI: Bikin Tampilan ala ChatGPT Pribadi di Server Rumah \(Self-Hosted\)/g, 'Open WebUI Setup Guide: Self-Hosting a Private ChatGPT Interface on Home Servers'],
  [/Tutorial Smolagents dari Hugging Face: Library Agen AI Paling Enteng & Gampang Dikuasai/g, 'Hugging Face Smolagents Tutorial: Lightweight & Code-First AI Agent Framework'],
  [/Panduan Flux\.1 & ComfyUI: Generate Gambar AI Super Realistis Tanpa Batasan Sensor/g, 'Flux.1 & ComfyUI Visual Workflow Guide: Photorealistic Open-Source AI Generation'],
  [/Claude Computer Use: Tutorial Bikin AI yang Bisa Klik Mouse & Ngetik Sendiri di Layar Komputer Lu/g, 'Claude Computer Use Tutorial: Autonomous Screen Control, Mouse Clicks & Terminal Automation'],
  [/Bikin Bot Telegram AI Pribadi Pake Python & Gemini Flash API Gratisan/g, 'Building a Private Telegram AI Bot with Python & Free Gemini Flash API'],
  [/Fine-Tuning LoRA Model Lokal Pake Unsloth: Bikin AI yang Paham Gaya Bicara Lu Sendiri/g, 'Local LLM Fine-Tuning with Unsloth LoRA: Train Custom Persona Models with Minimal VRAM'],
  [/Tutorial Cline & Roo Code di VS Code: Agen Software Engineer Mandiri yang Langsung di Editor Lu/g, 'Cline & Roo Code VS Code Masterclass: Autonomous Software Engineering Agents in Your Editor'],
  [/Membuat Voice AI Agent Interaktif Real-Time Pake Gemini Live API & WebSockets/g, 'Real-Time Interactive Voice AI Agent with Gemini Live API & WebSockets'],
  [/Cara Optimasi Mac Mini M4 \/ M4 Pro Buat Jalankan Model AI 70B Parameter Tanpa Ngelag/g, 'Mac Mini M4 & M4 Pro AI Optimization Guide: Running 70B Quantized LLMs Locally'],
  [/DeepSeek R1 vs OpenAI o3-mini: Mana yang Beneran Lebih Jenius Buat Ngoding & Matpel\?/g, 'DeepSeek R1 vs OpenAI o3-mini: Comprehensive Benchmark Comparison on Coding & Mathematics'],
  [/Mengenal MCP \(Model Context Protocol\): Standar Baru yang Bikin AI Kamu Bisa Akses Semua Tools/g, 'Understanding Model Context Protocol (MCP): The Universal Standard Connecting AI to Tooling'],
  [/Claude 3\.7 Sonnet & Fitur Hybrid Reasoning: Kapan Wajib Pake Mode Berpikir Panjang\?/g, 'Claude 3.7 Sonnet & Hybrid Reasoning: When to Deploy Extended Thinking Modes'],
  [/Cursor AI vs Windsurf IDE: Duel Text Editor AI Terbaik Buat Naikin Produktivitas 10x Lipat/g, 'Cursor AI vs Windsurf IDE: Comparing Next-Gen AI Code Editors for Maximum Productivity'],
  [/Gemini 2\.5 Pro & Flash: Cara Manfaatin Context Window 2 Juta Token Buat Analisis Dokumen Raksasa/g, 'Gemini 2.5 Pro & Flash: Leveraging 2-Million Token Context Windows for Deep Document Analysis'],
  [/AutoGPT di Tahun 2026: Apakah Masih Relevan Buat Otomasi Kerjaan atau Udah Ketinggalan Jaman\?/g, 'AutoGPT in 2026: Analyzing Relevancy vs Modern Modular Agent Architectures'],
  [/Prompt Engineering Hack 2026: Trik Bikin AI Nurut Tanpa Berbelit-belit/g, 'Prompt Engineering Hacks for 2026: Concrete Techniques for High-Precision Model Steering'],
  [/Rekomendasi Rakit PC Khusus Local AI & LLM 2026: VRAM vs RAM, Pilih GPU Mana yang Paling Cuan\?/g, 'Building a Local AI Rig in 2026: VRAM vs RAM, GPU Value Tiers, and Motherboard Topology'],
  [/Perplexity Pro & Deep Research: Cara Bikin Laporan Riset 30 Halaman Cuma Modal Satu Prompt/g, 'Perplexity Pro & Deep Research: Generating 30-Page Comprehensive Dossiers in One Prompt'],
  [/Bikin Lagu Keren Berkualitas Studio Pake Suno AI v4 & Udio: Panduan Prompt Musik Buat Pemula/g, 'Creating Studio-Grade Music with Suno v4 & Udio: Beginner Prompt Architecture Guide'],
  [/v0\.dev vs Bolt\.new: Bikin Aplikasi Web Fullstack Interaktif Cuma Dari Prompt Teks/g, 'v0.dev vs Bolt.new: Full-Stack Web App Scaffolding Directly from Natural Language Prompts'],
  [/Quantization LLM Dijelasin Santai: Bedanya GGUF, EXL2, dan AWQ Biar Gak Boros VRAM/g, 'LLM Quantization Demystified: GGUF vs EXL2 vs AWQ Formats for Optimized VRAM Footprints'],
  [/NotebookLM Dari Google: Ubah Catatan Kuliah & Skripsi Jadi Podcast Audio Obrolan Dua Host/g, 'Google NotebookLM: Transforming Complex Source Documents into Conversational Audio Podcasts'],
  [/Evaluasi Keamanan AI Agent: Cara Mencegah Prompt Injection & Akses Liar ke File Rahasia/g, 'AI Agent Security Auditing: Hardening Workflows Against Prompt Injection & Unauthorized Tool Calls'],
  [/Monetisasi AI Agent & Workflow Otomasi: Cara Jual Solusi AI ke UMKM & Kantor Agensi Lokal/g, 'Monetizing AI Automation: Packaging Agency Workflows & Selling Custom Agents to SMBs'],
  [/Mengapa Raksasa Tech Silicon Valley Panik Gara-Gara DeepSeek: Efisiensi Biaya 95%!/g, 'Why Silicon Valley Tech Giants Panicked Over DeepSeek: 95% Cost Efficiency & Open Weights'],
  [/Era "Software Engineer Bakal Punah"\? Fakta Sebenarnya di Balik Gelombang AI Coding Agent/g, 'Will Software Engineers Go Extinct? The Reality Behind Autonomous AI Coding Agents'],
  [/Fenomena Vibe Coding: Ketika Non-Programmer Bisa Bikin Startup Sendirian Modal Prompt/g, 'The Vibe Coding Movement: How Solo Non-Technical Founders Scaffold Startups with Prompts'],
  [/AI Slop: Ancaman Matinya Mesin Pencari Google & Kebangkitan Search Berbayar/g, 'AI Slop & The Decline of Legacy Search Engines: The Rapid Shift Towards Curated Intelligence'],
  [/Perang Chip AI 2026: Mengapa NVIDIA Masih Tak Tersentuh oleh AMD, Intel, & Custom Silicon\?/g, 'AI Chip Landscape 2026: Why NVIDIA Remains Dominant Over AMD, Intel, and Custom Silicon'],
  [/Hukum Skalabilitas Baru: Dari Pre-Training Raksasa Menuju Test-Time Compute \(Reasoning\)/g, 'The New AI Scaling Law: Shifting Compute from Pre-Training to Test-Time Reasoning'],
  [/Model Context Protocol \(MCP\) Bakal Membunuh API Tradisional\? Ini Penjelasannya/g, 'Will Model Context Protocol (MCP) Replace Traditional REST APIs? An In-Depth Architecture Analysis'],
  [/Cara Programmer Menghasilkan \$5\.000\/Bulan dari Micro-SaaS AI Wrapper Sederhana/g, 'How Engineers Generate $5,000/Month from Focused Micro-SaaS AI Wrappers'],
  [/Misteri OpenAI o1 & o3: Mengapa Model AI Generasi Baru Butuh "Merenung" Sebelum Menjawab\?/g, 'Inside Reasoning Models: Why Next-Generation AI Pauses to Deliberate Before Responding'],
  [/Deepfake & Voice Phishing 2026: Trik Psikologis & Cara Menghindari Penipuan Kloning Suara/g, 'Deepfake & Voice Cloning Threats in 2026: Psychological Exploits and Verification Protocols'],
  [/Apple Intelligence vs Google Gemini Android: Siapa Pemenang Asisten HP Sebenarnya\?/g, 'Apple Intelligence vs Google Gemini: Benchmarking the Leading Mobile OS AI Assistants'],
  [/Kematian SEO Tradisional: Bagaimana AI Search Mengubah Trafik Website Selamanya/g, 'The Death of Traditional SEO: How Answer Engines Are Permanently Reshaping Web Traffic'],
  [/Krisis Energi Data Center AI: Alasan Big Tech Membeli Pembangkit Listrik Tenaga Nuklir/g, 'Data Center Power Bottlenecks: Why Hyperscalers Are Purchasing Nuclear Power Capacities'],
  [/Synthetic Data: Solusi Ketika Data Manusia di Internet Sudah Habis Dilahap AI/g, 'Synthetic Data Pipelines: Overcoming the Looming Exhaustion of Human Internet Corpora'],
  [/Local AI vs Cloud AI: Mengapa Bisnis Mulai Membawa Kembali Server AI ke Kantor Sendiri/g, 'Local AI vs Cloud AI: Why Enterprises Are On-Premising AI Workloads for Privacy & Predictability'],
  [/Mengapa Model Open-Source Sekarang Mampu Menyaingi Model Tertutup OpenAI/g, 'How Open-Source AI Models Reached Parity with Proprietary Closed Ecosystems'],
  [/Bahaya Indirect Prompt Injection: Celah Keamanan Paling Mengerikan pada AI Agent/g, 'The Anatomy of Indirect Prompt Injection: The Primary Vulnerability of Agentic Systems'],
  [/Tren Edge AI: Mengapa Chip NPU di Laptop & HP Bakal Jadi Standar Wajib 2026/g, 'Edge AI Proliferation: Why Dedicated NPU Silicon Is Mandatory in Modern Hardware'],
  [/AI Copyright Wars: Bagaimana Nasib Hak Cipta & Royalti Seniman, Musisi, Serta Penulis\?/g, 'AI Copyright Wars: Intellectual Property, Licensing Models, and Royalties for Creators'],
  [/Memilih Karir di Era AI: 5 Skill yang Kebal dari Penggantian Otomasi Robot/g, 'Career Resilience in the AI Era: 5 Human Capabilities Insulated from Automation'],
  [/Mengapa Agentic Workflow 10x Lebih Bernilai Dibanding Model LLM Raksasa Sendirian/g, 'Why Agentic Workflows Provide 10x More Value Than Standalone Raw LLM Calls'],
  [/Perang Video AI: Sora vs Kling vs Runway Gen-3 vs Hailuo, Mana yang Paling Sinematik\?/g, 'Generative Video Shootout: Sora vs Kling vs Runway Gen-3 vs Hailuo Benchmarks'],
  [/Cara Memulai Agensi AI Automation \(AAA\) dari Kamar Kos Tanpa Modal Besar/g, 'Starting an AI Automation Agency (AAA): Actionable Playbook for High-Margin Consulting'],
  [/Sovereign AI: Alasan Negara-Negara Dunia Mulai Membangun LLM Nasional Sendiri/g, 'Sovereign AI Infrastructure: Why Nation States Are Investing in Sovereign Foundation Models'],
  [/Kematian Stack Overflow: Mengapa Komunitas Programmer Berpindah ke Cursor & Claude/g, 'The Demise of Stack Overflow: How Inline AI Agents Replaced Forum Troubleshooting'],
  [/Bagaimana AI Mengubah Industri Kesehatan: Dari Penemuan Obat Hingga Deteksi Dini Kanker/g, 'AI in Healthcare: Accelerating De Novo Molecular Drug Discovery and Early Diagnostics'],
  [/AI Agents Sebagai Karyawan Digital: Etika, Pajak Robot, dan Transformasi Kantor Modern/g, 'Autonomous Agents as Digital Co-Workers: Legal Governance, Automation Taxes & Enterprise Structure'],
  [/Mengapa Konsep "RAG" Masih Jauh Lebih Murah Dibanding Model Context Jutaan Token/g, 'Why Retrieval-Augmented Generation (RAG) Remains Dramatically Cheaper Than Infinite Context Windows'],
  [/Psikologi Ketergantungan AI: Apa yang Terjadi pada Otak Kita Jika Berhenti Berpikir Sendiri\?/g, 'The Cognitive Impact of AI Dependency: Cognitive Offloading and Critical Thinking Retention'],
  [/10 Sumber Penghasilan Pasif Baru yang Terbuka Berkat Alat-Alat AI Generatif/g, '10 Viable Revenue Streams Enabled by Modern Generative Toolsets'],
  [/Evaluasi Benchmark LLM Palsu: Mengapa Nilai Ujian AI di Kertas Sering Kali Menipu\?/g, 'Flawed AI Benchmarks: Why MMLU and Synthetic Test Scores Mislead Real-World Evaluation'],
  [/Mengapa Startup AI Tanpa "Moat" Bakal Dibantai oleh Fitur Gratisan ChatGPT/g, 'Why AI Wrapper Startups Without Moats Are Disrupted by Native Feature Releases'],
  [/DeepSeek V3 Multi-Head Latent Attention \(MLA\): Inovasi Matematis yang Mengguncang AI/g, 'DeepSeek V3 Multi-Head Latent Attention (MLA): The Mathematical Breakthrough Cutting KV Cache'],
  [/Masa Depan Robot Humanoid: Dari Optimus Tesla Hingga Figure 02 Berotak LLM Multimodal/g, 'The Future of Humanoid Robotics: From Tesla Optimus to Figure 02 Powered by Vision-Language Models'],
  [/Prediksi Roadmap AGI 2026-2030: Apa yang Terjadi Ketika AI Lebih Cerdas Dari Jenius Terhebat\?/g, 'AGI Roadmap 2026-2030: Trajectory, Milestones, and Safety Horizons of Superhuman Intelligence']
];

function translateText(text) {
  if (!text) return text;
  let res = text;
  for (const [regex, replacement] of termMap) {
    res = res.replace(regex, replacement);
  }
  return res;
}

console.log('Dictionary initialized with', termMap.length, 'key titles.');
