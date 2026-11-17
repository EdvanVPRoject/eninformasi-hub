import type { Metadata } from 'next';
import ToolsIndexClient from '@/components/ToolsIndexClient';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

const pageTitle = `Resource Tools & Repositori Open-Source AI — ${SITE_NAME}`;
const pageDescription =
  'Koleksi repositori open-source resmi untuk AI agent frameworks, runtime LLM lokal (Ollama, vLLM), LangGraph, CrewAI, dan utilitas developer.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/tools`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function ToolsPage() {
  return <ToolsIndexClient />;
}
