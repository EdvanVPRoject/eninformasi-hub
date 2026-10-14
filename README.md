# EnInformasi Hub (`EnInformasi.hub`)

> **Portal Modern 150 Konten Teknologi, AI, Komputasi & Gaming Kompetitif Terlengkap di Indonesia.**

Dikembangkan & Dikelola Secara Independen oleh **Edvan** ([@EdvanVPRoject](https://github.com/EdvanVPRoject))  
*Pembaruan Katalog Resmi: 14 Oktober 2026*

---

## 🌟 Ikhtisar Portal

**EnInformasi Hub** adalah platform konten teknologi dan panduan komputasi generasi baru yang memisahkan secara tegas antara **Tutorial Praktis (*Hands-on Guide*)** dan **EnInformasi (*Deep-Dive Insight & Trends*)**:

- **65 Tutorial Praktis**: Panduan teknis langkah demi langkah yang dilengkapi perintah terminal siap salin (*one-click copy*), snippet kode teruji, konfigurasi in-game, dan *Interactive Practical Checklist*.
- **85 EnInformasi & Tren Booming**: Analisis mendalam industri semikonduktor, masa depan model LLM otonom (*Agentic AI*), arsitektur inference, serta bocoran game blockbuster generasi mendatang.
- **Bilingual Penuh (100% ID & EN)**: Seluruh 150 konten, tabel bab (*Table of Contents*), checklist langkah, dan antarmuka web dapat dialihkan secara instan antara Bahasa Indonesia (🇮🇩) dan English (🇬🇧).

---

## 🚀 Fitur Unggulan

1. **Dual Segmented Language Switcher `[ 🇮🇩 ID | 🇬🇧 EN ]`**:
   - Penggantian bahasa real-time tanpa refresh halaman.
   - 100% judul, ringkasan, teks artikel, dan bab daftar isi dialihkan ke bahasa Inggris standar tanpa tercampur kata Indonesia.
2. **Interactive Top Reading Progress Bar**:
   - Indikator progres bacaan real-time dengan gradien emerald di bawah navbar.
3. **Smart Scrollspy Table of Contents**:
   - Penanda aktif hijau otomatis mengikuti posisi bacaan di layar (*viewport-based scrollspy*).
4. **Interactive Practice Checklist**:
   - Status centang tersimpan otomatis di browser (*sessionStorage* per slug artikel) dengan tombol reset progres satu klik.
5. **Kategori Terkurasi Tanpa Duplikasi**:
   - **Gaming & Esports** (41 konten termasuk GTA 6, Switch 2, Monster Hunter Wilds, dll.)
   - **Dev Tools & Workflow** (42 konten)
   - **AI Agents & Otomasi** (31 konten)
   - **Teknologi & Hardware** (13 konten)
   - **LLM & Model Cerdas** (12 konten)
   - **Rig Local AI & Komputasi** (10 konten)
   - **Prompt Engineering** (1 konten)

---

## 🛠️ Stack Teknologi

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Static Site Generation / SSG, Standalone Output)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Kontainerisasi & Deployment**: Docker, Docker Compose, Azure VPS & Cloudflare

---

## 💻 Menjalankan Secara Lokal

```bash
# 1. Kloning repositori
git clone https://github.com/EdvanVPRoject/eninformasi-hub.git
cd eninformasi-hub

# 2. Instal dependensi
npm install

# 3. Jalankan server pengembang
npm run dev

# 4. Buka di browser
# http://localhost:3000
```

---

## 📦 Build Produksi

```bash
# Build seluruh 313 rute statis
npm run build

# Menjalankan hasil build
npm run start
```

---

## 📄 Hak Cipta & Lisensi

Seluruh struktur konten, panduan teknis, dan rancangan kode dikembangkan oleh **Edvan**.  
Hak Cipta © 2026 **EnInformasi Hub**. All rights reserved.
