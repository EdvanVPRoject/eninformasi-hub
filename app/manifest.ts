import { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Portal Informasi, Gaming & Tutorial Teknologi`,
    short_name: SITE_NAME,
    description:
      'Portal informasi teknologi modern, AI agents, gaming & esports, analisis hardware, dan tutorial praktis terupdate.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090B',
    theme_color: '#10B981',
    lang: 'id',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
