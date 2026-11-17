import type { Metadata } from 'next';
import ContactFormClient from '@/components/ContactFormClient';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

const pageTitle = `Hubungi Tim ${SITE_NAME} — Kontak & Kerjasama`;
const pageDescription =
  'Hubungi tim kurator dan pengembang EnInformasi Hub untuk masukan tutorial, laporan teknis, atau peluang kolaborasi konten teknologi.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactFormClient />;
}
