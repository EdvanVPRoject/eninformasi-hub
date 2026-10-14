import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-3 pb-6 border-b border-[var(--border-color)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Kepatuhan & Legalitas</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
          Kebijakan Privasi (Privacy Policy)
        </h1>
        <p className="text-xs font-mono text-[var(--text-muted)]">
          Terakhir diperbarui: 14 Oktober 2026
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-sm text-[var(--text-muted)] space-y-6 leading-relaxed">
        <p>
          Selamat datang di <strong className="text-[var(--text-main)]">EnInformasi Hub</strong> (eninformasi.hub). Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi yang Anda berikan saat mengakses situs dan layanan kami.
        </p>

        <h3 className="text-lg font-bold text-[var(--text-main)] pt-2">1. Informasi yang Kami Kumpulkan</h3>
        <p>
          Kami dapat mengumpulkan informasi non-pribadi seperti jenis peramban (browser), sistem operasi, alamat IP yang disamarkan (anonymized IP), halaman perujuk, dan durasi kunjungan melalui layanan analitik standar industri untuk tujuan peningkatan performa dan pengalaman pengguna.
        </p>

        <h3 className="text-lg font-bold text-[var(--text-main)] pt-2">2. Penggunaan Cookie & Iklan Pihak Ketiga (Google AdSense)</h3>
        <p>
          Situs ini menggunakan cookie untuk menyimpan preferensi tampilan (seperti Dark Mode / Light Mode). Pihak ketiga, termasuk Google, menggunakan cookie untuk menayangkan iklan berdasarkan kunjungan pengguna sebelumnya ke situs web kami atau situs web lainnya di internet.
        </p>
        <p>
          Penggunaan cookie periklanan oleh Google memungkinkan Google dan mitranya menayangkan iklan kepada pengguna kami berdasarkan kunjungan mereka ke situs kami dan/atau situs lain di Internet. Pengguna dapat memilih untuk menonaktifkan iklan yang dipersonalisasi dengan mengunjungi Setelan Iklan Google.
        </p>

        <h3 className="text-lg font-bold text-[var(--text-main)] pt-2">3. Layanan Non-Komersial & Tautan Eksternal</h3>
        <p>
          Seluruh tutorial dan script disajikan secara gratis. EnInformasi Hub saat ini tidak memfasilitasi transaksi atau pembayaran langsung di dalam website.
        </p>

        <h3 className="text-lg font-bold text-[var(--text-main)] pt-2">4. Hubungi Kami</h3>
        <p>
          Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui halaman <Link href="/contact" className="text-emerald-500 underline">Kontak</Link> atau email ke <code className="text-emerald-400">privacy@eninformasi.hub</code>.
        </p>
      </div>
    </div>
  );
}
