import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-3 pb-6 border-b border-[var(--border-color)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <FileText className="w-3.5 h-3.5" />
          <span>Aturan Layanan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
          Syarat & Ketentuan Penggunaan (Terms of Service)
        </h1>
        <p className="text-xs font-mono text-[var(--text-muted)]">
          Terakhir diperbarui: 14 Oktober 2026
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-sm text-[var(--text-muted)] space-y-6 leading-relaxed">
        <p>
          Dengan mengakses situs <strong className="text-[var(--text-main)]">EnInformasi Hub</strong>, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini, semua hukum dan peraturan yang berlaku, serta bertanggung jawab atas kepatuhan terhadap hukum lokal yang berlaku.
        </p>

        <h3 className="text-lg font-bold text-[var(--text-main)] pt-2">1. Lisensi Penggunaan Kode & Tutorial</h3>
        <p>
          Semua cuplikan kode sumber, script Python, dan template konfigurasi yang dibagikan dalam tutorial bersifat open-access untuk tujuan edukasi dan pengembangan proyek pribadi maupun komersial, kecuali ditentukan lain oleh lisensi repositori masing-masing.
        </p>

        <h3 className="text-lg font-bold text-[var(--text-main)] pt-2">2. Batasan Tanggung Jawab (Disclaimer Kode)</h3>
        <p>
          Materi tutorial dan kode disediakan &quot;apa adanya&quot;. EnInformasi Hub tidak memberikan jaminan bahwa script akan selalu bebas dari kegagalan lingkungan lokal, dan kami tidak bertanggung jawab atas kehilangan data, kerusakan sistem operasi, atau pembengkakan kuota komputasi cloud akibat eksekusi skrip tanpa pengawasan.
        </p>

        <h3 className="text-lg font-bold text-[var(--text-main)] pt-2">3. Modifikasi Konten</h3>
        <p>
          Kami berhak memperbarui, memperbaiki, atau merevisi tutorial dan panduan teknis sewaktu-waktu seiring dengan evolusi versi model AI dan software terkait.
        </p>
      </div>
    </div>
  );
}
