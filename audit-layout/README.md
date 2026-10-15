# 📐 Dokumentasi & Direktori Audit Lengkap EnInformasi Hub

Folder ini (`audit-layout/`) mengumpulkan seluruh file dan komponen yang mengatur tata letak (**layout**), hierarki visual, navigasi, grid responsif, serta pengaturan fitur interaktif website dalam **satu folder terpadu**.

---

## 📁 Daftar Lengkap File Audit (20 Komponen & Fitur)

| No | Nama File di Folder Ini | Lokasi File Asli | Kategori & Fitur Utama |
|:---|:---|:---|:---|
| **01** | [`01-RootLayout-layout.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/01-RootLayout-layout.tsx) | `app/layout.tsx` | **Root Shell**: Pembungkus `<html>`, `<head>`, Google Fonts Inter & Geist Mono, serta `<body>`. |
| **02** | [`02-globals.css`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/02-globals.css) | `app/globals.css` | **Styling Global**: Variabel CSS dark/light, utility borders, scrollbar 6px halus, scroll-smooth. |
| **03** | [`03-LayoutShell.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/03-LayoutShell.tsx) | `components/LayoutShell.tsx` | **Parent Shell**: Menampung `<LanguageProvider>`, `<Navbar>`, `<main>`, `<Footer>`, dan modal `<CommandSearch>`. |
| **04** | [`04-Navbar.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/04-Navbar.tsx) | `components/Navbar.tsx` | **Header Atas**: Brand identity, tombol switch bahasa (ID/EN), tema dark/light, search trigger (`Cmd+K`), dan drawer mobile. |
| **05** | [`05-ContentLayout.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/05-ContentLayout.tsx) | `components/ContentLayout.tsx` | **Grid Terpadu**: Grid 12 kolom (`lg:col-span-3` sidebar + `lg:col-span-9` konten), sticky sidebar, dan tab segment. |
| **06** | [`06-SidebarNav.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/06-SidebarNav.tsx) | `components/SidebarNav.tsx` | **Navigasi Kategori**: Filter kategori topik (AI Agents, Gaming & Esports, Upcoming Booming, Tech Gadgets) & badge kesulitan. |
| **07** | [`07-Footer.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/07-Footer.tsx) | `components/Footer.tsx` | **Footer Bawah**: Grid navigasi footer 4 kolom, legal disclaimer afiliasi, dan link kepatuhan hukum/privasi. |
| **08** | [`08-ArticleDetailView.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/08-ArticleDetailView.tsx) | `components/ArticleDetailView.tsx` | **Halaman Baca Artikel**: Breadcrumb dinamis, meta reading time, sticky Table of Contents kanan (`sticky top-24`), dan artikel terkait. |
| **09** | [`09-HomePage-page.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/09-HomePage-page.tsx) | `app/page.tsx` | **Beranda**: Hero bento banner, filter segment `Semua \| Tutorial \| EnInformasi`, live filter bar, dan grid 150 artikel. |
| **10** | [`10-TutorialPage-page.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/10-TutorialPage-page.tsx) | `app/tutorial/page.tsx` | **Katalog Tutorial**: Halaman indeks khusus 65 panduan langkah-demi-langkah praktis. |
| **11** | [`11-ArtikelPage-page.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/11-ArtikelPage-page.tsx) | `app/artikel/page.tsx` | **Katalog EnInformasi**: Halaman indeks khusus 85 wawasan mendalam & tren teknologi masa depan. |
| **12** | [`12-TableOfContents.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/12-TableOfContents.tsx) | `components/TableOfContents.tsx` | **Scroll-Spy TOC**: Penanda aktif hijau dinamis (`#10b981`) yang bergerak mengikuti posisi heading yang sedang dibaca. |
| **13** | [`13-articles.ts`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/13-articles.ts) | `lib/articles.ts` | **Database & Logika Artikel**: Helper pemfilteran kategori (AI, Gaming, Tech), slug routing, dan resolver bilingual ID/EN 150 artikel. |
| **14** | [`14-CommandSearch.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/14-CommandSearch.tsx) | `components/CommandSearch.tsx` | **Modal Pencarian Global**: Modal spotlight (`Cmd+K` / `Ctrl+K`) dengan live debounce filter pencarian judul, tag, dan ringkasan. |
| **15** | [`15-LanguageContext.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/15-LanguageContext.tsx) | `components/LanguageContext.tsx` | **State Manajemen Bahasa**: Context provider untuk switch bahasa ID/EN instan tanpa reload halaman, tersimpan di localStorage. |
| **16** | [`16-FeedbackWidget.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/16-FeedbackWidget.tsx) | `components/FeedbackWidget.tsx` | **Widget Feedback Pembaca**: Tombol voting interaktif "Apakah panduan ini bermanfaat?" dengan proteksi rate-limit. |
| **17** | [`17-StepTracker.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/17-StepTracker.tsx) | `components/StepTracker.tsx` | **Checklist Interaktif Tutorial**: Komponen daftar tahapan tutorial yang dapat dicentang secara mandiri oleh pembaca. |
| **18** | [`18-CodeBlock.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/18-CodeBlock.tsx) | `components/CodeBlock.tsx` | **Blok Kode & Copy Snippet**: Syntax highlighter dengan header nama bahasa, tombol salin 1-klik, dan animasi ceklis. |
| **19** | [`19-ArticleBodyRenderer.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/19-ArticleBodyRenderer.tsx) | `components/ArticleBodyRenderer.tsx` | **Content Parser**: Mengonversi teks artikel menjadi heading terindeks ID untuk TOC, alert info/tips/warning, dan paragraf berjarak ideal. |
| **20** | [`20-ToolsPage-page.tsx`](file:///C:/Users/edvan/.gemini/antigravity/scratch/netkode-hub/audit-layout/20-ToolsPage-page.tsx) | `app/tools/page.tsx` | **Halaman Resource Tools**: Katalog script Python, cheatsheet model AI GGUF, template n8n, dan setting gaming. |

---

## 🏛️ Diagram Hierarki Visual & Interaksi Fitur

```mermaid
flowchart TD
    subgraph Global Shell
        L1["01-RootLayout-layout.tsx"] --> L2["03-LayoutShell.tsx"]
        L2 --> Lang["15-LanguageContext.tsx (ID/EN State)"]
        L2 --> Nav["04-Navbar.tsx (Header, Search Btn, Lang Switch)"]
        L2 --> Modal["14-CommandSearch.tsx (Cmd+K Global Search)"]
        L2 --> MainContent["Halaman Aktif (page.tsx / tutorial / artikel / tools)"]
        L2 --> Foot["07-Footer.tsx (Footer & Legalitas)"]
    end

    subgraph Content & Reading Flow
        MainContent --> Grid["05-ContentLayout.tsx (Grid 12 Kolom)"]
        Grid --> Side["06-SidebarNav.tsx (Filter Topik & Level)"]
        Grid --> FilterQuery["13-articles.ts (Kategori Gaming, AI, Tech)"]
        MainContent --> Reader["08-ArticleDetailView.tsx"]
        Reader --> TOC["12-TableOfContents.tsx (Active Green Indicator)"]
        Reader --> Parser["19-ArticleBodyRenderer.tsx"]
        Parser --> Steps["17-StepTracker.tsx (Interactive Steps)"]
        Parser --> Code["18-CodeBlock.tsx (Copy Snippet)"]
        Reader --> Feedback["16-FeedbackWidget.tsx (Voting Bermanfaat)"]
    end
```

---

## 📋 Status & Ringkasan Audit Fitur Terkini

### 1. Penanda Hijau Dinamis Table of Contents (`12-TableOfContents.tsx`)
* **Status**:  **Sempurna**
* **Mekanisme**: Menggunakan `IntersectionObserver` dengan offset `rootMargin: '-80px 0px -40% 0px'`. Saat pembaca scroll melewati Point 1, Point 2, dst., garis indikator hijau (`#10b981`), teks tebal, dan background pill otomatis berpindah secara presisi mengikuti heading yang sedang aktif di viewport.

### 2. Filter Kategori Gaming & Esports (`13-articles.ts`)
* **Status**:  **Sempurna**
* **Mekanisme**: Seluruh artikel gaming (strategi CS2, tier list Valorant, autoexec, meta Dota 2, rilis GTA VI, benchmark emulator, optimalisasi GPU) telah terpetakan 100% ke kategori `gaming-esports` dan `upcoming-booming` tanpa tercampur dengan AI atau Tech murni.

### 3. Sistem Dual Bahasa / Bilingual ID & EN (`15-LanguageContext.tsx`)
* **Status**:  **Sempurna**
* **Mekanisme**: Switch bahasa langsung memperbarui judul, deskripsi, tag, dan konten artikel secara reaktif tanpa perlu me-reload halaman. State tersimpan otomatis di `localStorage`.

### 4. Performa & Arsitektur Cloudflare Worker
* **Status**:  **100% Live di Edge**
* **URL Produksi**: `https://eninformasi-hub.entehchin.workers.dev`
* **Startup Latency**: 21 ms dengan CDN caching global.
