# EnInformasi Hub (`EnInformasi.hub`)

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.28-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare_OpenNext-F38020?style=for-the-badge&logo=cloudflare)](https://opennext.js.org/cloudflare)
[![Total Content](https://img.shields.io/badge/Database-180_Articles-10b981?style=for-the-badge)](https://github.com/EdvanVPRoject/eninformasi-hub)
[![Bilingual](https://img.shields.io/badge/Language-100%25_Bilingual_ID_|_EN-8b5cf6?style=for-the-badge)](#)

> **Portal Modern 180 Konten Teknologi, AI Agents, Hardware Komputasi & Gaming Terlengkap di Indonesia.**

Dikembangkan & Dikelola Secara Mandiri oleh **Edvan** ([@EdvanVPRoject](https://github.com/EdvanVPRoject))  
*Pembaruan Katalog & Arsitektur Resmi: 25 Oktober 2026*

---

## 🌟 Ikhtisar & Arsitektur Portal

**EnInformasi Hub** adalah platform konten teknologi dan panduan komputasi generasi baru yang memisahkan secara tegas antara **Tutorial Praktis (*Hands-on Guides*)** dan **Informasi & Tren (*Deep-Dive Insights & Trends*)**:

- **65 Tutorial Praktis**: Panduan teknis langkah demi langkah yang dilengkapi perintah terminal siap salin (*one-click copy*), snippet kode teruji, konfigurasi in-game/hardware, serta *Interactive Practice Checklists*.
- **115 Informasi & Tren Analisis**: Analisis mendalam industri semikonduktor, ekosistem model LLM otonom (*Agentic AI*), arsitektur inference, serta bocoran tren industri game blockbuster generasi mendatang.
- **375 Halaman Statis (SSG)**: Seluruh rute artikel, tutorial, halaman indeks topik, dan dokumentasi di-generate secara statis untuk kecepatan buka halaman instan (*sub-second load time*).
- **100% Bilingual Penuh (🇮🇩 ID & 🇬🇧 EN)**: Seluruh 180 konten, daftar isi (*Table of Contents*), checklist langkah, tabel komparasi, dan antarmuka web dapat dialihkan secara instan antara Bahasa Indonesia dan English tanpa reload.

---

## 🤖 Otomasi Daily Viral News (AI Engine Pipeline)

Proyek ini dilengkapi pipeline otomasi konten harian cerdas yang berjalan otomatis di cloud:

1. **GitHub Actions Terjadwal 3x Sehari (`.github/workflows/daily-news.yml`)**:
   - Pagi: `07:00 WIB` (00:00 UTC)
   - Siang: `13:00 WIB` (06:00 UTC)
   - Malam: `19:00 WIB` (12:00 UTC)
2. **Generasi Berbasis Google Gemini AI**:
   - Memindai tren global teknologi & gaming paling viral.
   - Menghasilkan artikel bilingual dengan struktur 6 subheading simetris.
   - Wajib menyertakan tabel komparasi / benchmark teknis Markdown.
3. **Bespoke Generative SVG Covers (`public/covers/*.svg`)**:
   - Setiap artikel baru otomatis dibuatkan cover vektor SVG beresolusi tajam (*geometricPrecision*) dengan palet warna sesuai kategori topik (bebas gambar blur / pixelated).
4. **Validasi Rujukan Faktual Terpercaya (`lib/article-references.ts`)**:
   - Secara otomatis mendaftarkan tautan referensi publikasi kredibel (misal *The Verge, Tom's Hardware, IEEE, IGN, arXiv*) dengan validasi 0 deadlink / zero 404.
5. **Auto-Rebuild Katalog Ringkas (`scripts/build-summaries.mjs`)**:
   - Menghasilkan dataset metadata ringkas `lib/data/article-summaries.ts` sehingga bundle JavaScript client tetap sangat ringan (< 180 kB First Load JS).

---

## 🚀 Fitur Unggulan UI/UX

1. **HD Typography & Subpixel Clarity**:
   - Menggunakan Google Variable Font **Inter** dengan konfigurasi `optimizeLegibility` dan kontras tajam.
   - Seluruh angka metrik (180 konten, 65 tutorial, 115 artikel) diformat **full white (`text-[var(--text-main)]`)** agar tampil tegas dan mudah dibaca.
2. **Bento Hub Dashboard**:
   - Menampilkan metrik real-time katalog, topik hangat (*Trending Topics*), dan tombol pintas filter cepat.
3. **Transisi Halaman Mulus (*Smooth Transitions*)**:
   - Perpindahan antar halaman dilengkapi animasi masuk yang halus (*glide & fade*), dengan unmount otomatis untuk menjaga ketajaman rendering teks statis.
4. **Navigasi Navbar Terpusat (*Centered Navigation*)**:
   - Menu utama (*Resource Tools, Tentang Saya, Halaman Utama*) terposisi presisi di titik tengah horizontal navbar.
5. **Interactive Reading Utilities**:
   - **Scrollspy Table of Contents**: Indikator bab aktif otomatis mengikuti posisi gulir layar.
   - **Reading Progress Bar**: Garis progres gradien emerald di bawah navbar.
   - **Interactive Practice Checklist**: Status centang panduan tersimpan otomatis di *sessionStorage* browser dengan tombol reset satu klik.
6. **Pencarian Cepat / Command Palette (Ctrl + K)**:
   - Pencarian instan mencakup judul, deskripsi, tag topik, dan kategori baik dalam bahasa Indonesia maupun Inggris.

---

## 📁 Struktur Kategori Terkurasi

| Kategori | Post Type Dominan | Fokus Pembahasan |
|---|---|---|
| **Gaming & Esports** | Tutorial & Artikel | Rilis game blockbuster, strategi in-game, optimasi refresh rate, hardware rig. |
| **Teknologi & Hardware** | Informasi & Analisis | Inovasi arsitektur GPU, semikonduktor, gadget revolusioner, benchmark daya. |
| **AI Agents & Otomasi** | Tutorial Praktis | Workflow otomasi otonom, integrasi tool calling, multi-agent frameworks. |
| **LLM & Model Cerdas** | Informasi & Tutorial | Open-source LLM, quantisasi GGUF/AWQ, self-hosted inference server. |
| **Dev Tools & Workflow** | Tutorial Praktis | Shell scripts, dev environment, debugging tools, produktivitas coding. |
| **Prompt Engineering** | Tutorial Praktis | Struktur system prompt lanjutan, context distillation, zero/few-shot prompts. |
| **Rig Local AI & Komputasi**| Tutorial Praktis | Setup CUDA, vLLM, Ollama, optimasi VRAM, pendingin rig komputasi lokal. |

---

## 🛠️ Stack Teknologi & Alat

- **Framework**: [Next.js 15.5.28](https://nextjs.org/) (App Router, Static Site Generation / SSG, Server Actions)
- **Deployment Platform**: [OpenNext Cloudflare](https://opennext.js.org/cloudflare) & Cloudflare Workers
- **Bahasa**: [TypeScript 5.6](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **AI Engine**: Google Gemini API via official SDK
- **Bundler & Tooling**: Node.js 20, esbuild, Wrangler CLI

---

## 💻 Menjalankan Secara Lokal

```bash
# 1. Kloning repositori
git clone https://github.com/EdvanVPRoject/eninformasi-hub.git
cd eninformasi-hub

# 2. Instal dependensi
npm install

# 3. Jalankan server pengembang (otomatis generate artikel summaries)
npm run dev

# 4. Buka di peramban
# http://localhost:3000
```

---

## 📦 Build Produksi & Deploy

```bash
# 1. Jalankan build lengkap (rebuild summaries + OpenNext Cloudflare bundle)
npm run build

# 2. Menjalankan generasi berita viral AI harian secara lokal
npm run generate:daily
```

---

## 📄 Hak Cipta & Lisensi

Seluruh arsitektur kode, sistem otomasi, kurasi konten, dan rancangan visual dikembangkan dan dikelola oleh **Edvan**.  
Hak Cipta © 2026 **EnInformasi Hub**. All rights reserved.
