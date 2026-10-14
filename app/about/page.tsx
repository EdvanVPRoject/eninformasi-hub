import React from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  ShieldCheck, 
  Github, 
  Globe, 
  ExternalLink, 
  Code2, 
  UserCheck, 
  Cpu, 
  Layers, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header Halaman */}
      <div className="space-y-3 pb-6 border-b border-[var(--border-color)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <Terminal className="w-3.5 h-3.5" />
          <span>Profil & Visi Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
          Tentang EnInformasi Hub
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          Portal wawasan teknologi modern, analisis mendalam, tren digital global, dan repositori panduan praktis AI masa depan.
        </p>
      </div>

      {/* Profil Pengembang & Hak Cipta */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-mono font-bold text-xl">
              EV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[var(--text-main)]">Edvan</h2>
                <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                  Lead Developer & Author
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                Software Engineer & Spesialis Otomasi Artificial Intelligence
              </p>
            </div>
          </div>

          {/* Tombol Portofolio & GitHub */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/EdvanVPRoject"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-emerald-500/40 hover:text-emerald-500 transition-all shadow-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
            </a>

            <a
              href="https://github.com/EdvanVPRoject"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-semibold rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all shadow-sm"
            >
              <Globe className="w-4 h-4" />
              <span>Portofolio</span>
              <ExternalLink className="w-3 h-3 text-zinc-900" />
            </a>
          </div>
        </div>

        {/* Pernyataan Hak Cipta Resmi */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-muted)] font-mono gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Hak Cipta © 2026 <strong>Edvan</strong>. Seluruh Hak Cipta Dilindungi Undang-Undang.</span>
          </div>
          <span className="text-[11px] text-zinc-500">Lisensi Terbuka untuk Edukasi & Riset</span>
        </div>
      </div>

      {/* Visi & Pendekatan Teknis */}
      <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
        <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
          Visi & Pendekatan Redaksi
        </h3>
        <p>
          <strong className="text-[var(--text-main)]">EnInformasi Hub</strong> dikembangkan secara mandiri oleh <strong>Edvan</strong> untuk menghadirkan repositori wawasan teknologi dan tutorial bermutu tinggi yang langsung dapat diuji coba dalam skenario nyata. Kami menolak publikasi konten generik tanpa pembuktian teknis dan berkomitmen menyediakan referensi komputasi yang terstruktur, efisien, serta relevan terhadap perkembangan teknologi global.
        </p>

        {/* Empat Pilar Standar Kualitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose pt-2">
          <div className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 inline-block font-mono text-xs font-bold">
              01
            </span>
            <h4 className="font-semibold text-sm text-[var(--text-main)]">Validasi & Verifikasi Kode</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Seluruh sintaks, skrip Python, serta konfigurasi terminal yang disajikan telah diuji langsung pada lingkungan lokal dan cloud sebelum diterbitkan.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 inline-block font-mono text-xs font-bold">
              02
            </span>
            <h4 className="font-semibold text-sm text-[var(--text-main)]">Struktur Bahasa Jelas & Terstruktur</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Materi disajikan secara sistematis, memecah konsep arsitektur rumit menjadi tahapan langkah kerja yang mudah dipahami oleh pembaca.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 inline-block font-mono text-xs font-bold">
              03
            </span>
            <h4 className="font-semibold text-sm text-[var(--text-main)]">Arsitektur Web Ringan & Presisi</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Platform dirancang dengan standar rekayasa perangkat lunak modern: waktu muat instan, minim beban JavaScript, dan tata letak 3-kolom yang optimal untuk kenyamanan membaca.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 inline-block font-mono text-xs font-bold">
              04
            </span>
            <h4 className="font-semibold text-sm text-[var(--text-main)]">Repositori Skrip Terbuka</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Menyediakan template otomatisasi alur kerja, starter kit proyek AI otonom, dan modul siap pakai yang dapat diunduh tanpa biaya lisensi melalui Resource Hub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
