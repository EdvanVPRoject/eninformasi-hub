import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-3 pb-6 border-b border-[var(--border-color)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Keterbukaan Afiliasi & AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
          Pernyataan Penyangkalan (Disclaimer)
        </h1>
        <p className="text-xs font-mono text-[var(--text-muted)]">
          Kepatuhan FTC & Pedoman Transparansi Iklan
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-sm text-[var(--text-muted)] space-y-6 leading-relaxed">
        <h3 className="text-lg font-bold text-[var(--text-main)] pt-2">1. Layanan Konten & Non-Komersial</h3>
        <p>
          Seluruh konten tutorial, analisis teknologi, dan panduan gaming di EnInformasi Hub disajikan secara independen dan gratis untuk tujuan edukasi serta riset. Fitur transaksi komersial dan pembelian langsung saat ini dinonaktifkan.
        </p>

        <h3 className="text-lg font-bold text-[var(--text-main)] pt-2">2. Akurasi Informasi Teknologi AI</h3>
        <p>
          Dunia kecerdasan buatan (*Artificial Intelligence*) berkembang dengan sangat cepat. Parameter harga API, performa benchmark, dan fitur model dapat berubah sewaktu-waktu oleh penyedia resmi (OpenAI, Anthropic, Google, dsb). Meskipun kami berusaha menyajikan data teraktual, selalu rujuk dokumentasi resmi sebelum mengambil keputusan komputasi berskala besar.
        </p>
      </div>
    </div>
  );
}
