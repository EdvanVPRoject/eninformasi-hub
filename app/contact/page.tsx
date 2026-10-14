'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-3 pb-6 border-b border-[var(--border-color)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <Mail className="w-3.5 h-3.5" />
          <span>Kontak & Kerjasama</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
          Hubungi Tim NetKode Hub
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Punya masukan tutorial, menemukan bug di skrip kami, atau ingin berdiskusi kerjasama sponsor produk teknologi?
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-[var(--text-main)]">Pesan Anda Berhasil Terkirim!</h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Terima kasih atas tanggapan Anda. Tim kurator NetKode Hub akan membalas via email dalam tempo 1x24 jam kerja.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-5 shadow-sm">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-[var(--text-muted)]">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-[var(--text-muted)]">
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="budi@domain.com"
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-[var(--text-muted)]">
              Pesan / Keterangan
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tuliskan pertanyaan, request tutorial AI, atau proposal kerjasama..."
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-mono font-bold rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Pesan</span>
          </button>
        </form>
      )}
    </div>
  );
}
