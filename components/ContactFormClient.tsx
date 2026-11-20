'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  Github,
  ExternalLink,
} from 'lucide-react';

const CONTACT_EMAIL = 'septiaedvan@gmail.com';
const CONTACT_WHATSAPP = '6289630887748';
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '';

export default function ContactFormClient() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent_api' | 'ready_channels'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Masukan / Pertanyaan Konten',
    message: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const subjectParam = params.get('subject');
    const refParam = params.get('ref');
    if (subjectParam || refParam) {
      setFormData((prev) => ({
        ...prev,
        subject: subjectParam || prev.subject,
        message: refParam
          ? `Terkait artikel/halaman: ${refParam}\n\nDetail masukan/kendala:\n`
          : prev.message,
      }));
    }
  }, []);

  const buildFormattedBody = () =>
    [
      `Halo Tim EnInformasi Hub,`,
      ``,
      `Nama: ${formData.name}`,
      `Email: ${formData.email}`,
      `Topik: ${formData.subject}`,
      ``,
      `Pesan:`,
      formData.message,
    ].join('\n');

  const getMailtoUrl = () => {
    const subject = `[EnInformasi Hub] ${formData.subject} — ${formData.name}`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      buildFormattedBody()
    )}`;
  };

  const getWhatsAppUrl = () => {
    return `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(buildFormattedBody())}`;
  };

  const handleCopyMessage = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(buildFormattedBody());
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (CONTACT_ENDPOINT) {
      setStatus('sending');
      try {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal mengirim ke endpoint.');
        setStatus('sent_api');
        return;
      } catch {
        setErrorMsg('Pengiriman otomatis gagal. Silakan kirim langsung lewat Email atau WhatsApp di bawah.');
        setStatus('ready_channels');
        return;
      }
    }

    // Open pre-filled email client directly & display fallback WhatsApp / Copy controls
    setStatus('ready_channels');
    if (typeof window !== 'undefined') {
      window.location.href = getMailtoUrl();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-3 pb-6 border-b border-[var(--border-color)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <Mail className="w-3.5 h-3.5" />
          <span>Kontak & Kerjasama</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
          Hubungi Tim EnInformasi Hub
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Punya masukan tutorial, menemukan kendala pada skrip/kode, atau ingin berdiskusi kolaborasi konten teknologi?
        </p>
      </div>

      {status === 'sent_api' ? (
        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h2 className="text-lg font-bold text-[var(--text-main)]">Pesan Anda Berhasil Terkirim!</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Terima kasih atas tanggapan Anda. Pesan telah diterima dan akan ditinjau oleh pengembang EnInformasi Hub.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setFormData({
                name: '',
                email: '',
                subject: 'Masukan / Pertanyaan Konten',
                message: '',
              });
            }}
            className="px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-emerald-500/50 transition-all"
          >
            Kirim Pesan Lainnya
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-5 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-mono font-medium text-[var(--text-muted)]"
                >
                  Nama Lengkap
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-mono font-medium text-[var(--text-muted)]"
                >
                  Alamat Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="budi@domain.com"
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contact-subject"
                className="block text-xs font-mono font-medium text-[var(--text-muted)]"
              >
                Topik / Subjek
              </label>
              <input
                id="contact-subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Contoh: Laporan Kendala Tutorial / Request Topik"
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contact-message"
                className="block text-xs font-mono font-medium text-[var(--text-muted)]"
              >
                Pesan / Keterangan
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tuliskan pertanyaan, laporan bug/typo artikel, request tutorial AI, atau proposal kerjasama..."
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                {errorMsg}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-mono font-bold rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-sm disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {status === 'sending'
                    ? 'Mengirim...'
                    : CONTACT_ENDPOINT
                    ? 'Kirim Pesan'
                    : 'Buka Aplikasi Email & Kirim'}
                </span>
              </button>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Kirim via WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-mono font-medium rounded-lg bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)] hover:text-emerald-400 hover:border-emerald-500/40 active:scale-95 transition-all"
              >
                {copiedMsg ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Format Pesan Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>

            {status === 'ready_channels' && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-[var(--text-main)] space-y-1.5">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Draft email siap dikirim ke {CONTACT_EMAIL}</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Jika aplikasi email default tidak terbuka otomatis di browser Anda, klik{' '}
                  <strong>Kirim via WhatsApp</strong> atau klik <strong>Salin Pesan</strong> lalu kirim manual ke{' '}
                  <a
                    href={getMailtoUrl()}
                    className="text-emerald-400 underline underline-offset-2 font-mono"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            )}
          </form>

          {/* Direct Contact Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/40 transition-all flex items-center gap-3 text-xs font-mono group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[var(--text-main)] group-hover:text-emerald-400">
                  Email Langsung
                </div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">{CONTACT_EMAIL}</div>
              </div>
            </a>

            <a
              href={`https://wa.me/${CONTACT_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/40 transition-all flex items-center gap-3 text-xs font-mono group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[var(--text-main)] group-hover:text-emerald-400">
                  WhatsApp
                </div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">+62 896-3088-7748</div>
              </div>
            </a>

            <a
              href="https://github.com/EdvanVPRoject/eninformasi-hub/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/40 transition-all flex items-center gap-3 text-xs font-mono group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                <Github className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[var(--text-main)] group-hover:text-emerald-400">
                  GitHub Issues
                </div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">
                  EdvanVPRoject/eninformasi-hub
                </div>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
