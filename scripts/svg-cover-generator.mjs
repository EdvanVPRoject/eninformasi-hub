// scripts/svg-cover-generator.mjs
// Generates pure visual, text-free architectural vector illustrations (Zero repeated titles or badges)

export function generateCoverSvg({ title = '', category = '', tags = [] }) {
  let accentColor = '#10b981'; // emerald
  let accentSecondary = '#06b6d4'; // cyan
  let themeType = 'ai';

  const catLower = `${category} ${title} ${(tags || []).join(' ')}`.toLowerCase();
  if (catLower.includes('game') || catLower.includes('gaming') || catLower.includes('playstation') || catLower.includes('xbox') || catLower.includes('gta')) {
    accentColor = '#8b5cf6'; // purple
    accentSecondary = '#ec4899'; // pink
    themeType = 'gaming';
  } else if (catLower.includes('hardware') || catLower.includes('gpu') || catLower.includes('rtx') || catLower.includes('cpu') || catLower.includes('chip')) {
    accentColor = '#f59e0b'; // amber
    accentSecondary = '#10b981'; // emerald
    themeType = 'hardware';
  } else if (catLower.includes('ai') || catLower.includes('llm') || catLower.includes('agent') || catLower.includes('gemini') || catLower.includes('claude')) {
    accentColor = '#10b981'; // emerald
    accentSecondary = '#3b82f6'; // blue
    themeType = 'ai';
  } else {
    accentColor = '#06b6d4'; // cyan
    accentSecondary = '#6366f1'; // indigo
    themeType = 'tech';
  }

  const centerIllustration =
    themeType === 'hardware'
      ? `
    <!-- Silicon Die & GPU Architecture Illustration -->
    <g transform="translate(600, 315)">
      <!-- PCB Traces -->
      <g stroke="url(#accGrad)" stroke-width="2" opacity="0.35" fill="none">
        <path d="M-420,-140 L-220,-140 L-160,-80 M-420,-60 L-250,-60 L-180,-20 M-420,60 L-250,60 L-180,20 M-420,140 L-220,140 L-160,80" />
        <path d="M420,-140 L220,-140 L160,-80 M420,-60 L250,-60 L180,-20 M420,60 L250,60 L180,20 M420,140 L220,140 L160,80" />
        <path d="M-120,-240 L-120,-170 M0,-250 L0,-170 M120,-240 L120,-170" />
        <path d="M-120,240 L-120,170 M0,250 L0,170 M120,240 L120,170" />
      </g>
      <!-- Outer Processor Substrate -->
      <rect x="-170" y="-170" width="340" height="340" rx="28" fill="#0f172a" stroke="url(#accGrad)" stroke-width="2.5" />
      <rect x="-145" y="-145" width="290" height="290" rx="18" fill="#090d16" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
      <!-- Compute Cores Grid -->
      <g fill="url(#accGrad)" opacity="0.75">
        <rect x="-120" y="-120" width="70" height="50" rx="6" />
        <rect x="-35" y="-120" width="70" height="50" rx="6" />
        <rect x="50" y="-120" width="70" height="50" rx="6" />
        <rect x="-120" y="-55" width="70" height="50" rx="6" opacity="0.5" />
        <rect x="-35" y="-55" width="70" height="110" rx="8" opacity="0.95" />
        <rect x="50" y="-55" width="70" height="50" rx="6" opacity="0.5" />
        <rect x="-120" y="10" width="70" height="50" rx="6" opacity="0.65" />
        <rect x="50" y="10" width="70" height="50" rx="6" opacity="0.65" />
        <rect x="-120" y="75" width="110" height="45" rx="6" opacity="0.4" />
        <rect x="10" y="75" width="110" height="45" rx="6" opacity="0.4" />
      </g>
    </g>`
      : themeType === 'gaming'
      ? `
    <!-- Next-Gen Gaming Engine & HUD Geometry -->
    <g transform="translate(600, 315)">
      <circle cx="0" cy="0" r="210" fill="none" stroke="url(#accGrad)" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.35" />
      <circle cx="0" cy="0" r="160" fill="none" stroke="url(#accGrad)" stroke-width="2" opacity="0.5" />
      <polygon points="0,-130 112,65 -112,65" fill="url(#accGrad)" opacity="0.15" stroke="url(#accGrad)" stroke-width="2.5" />
      <polygon points="0,130 112,-65 -112,-65" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      <circle cx="0" cy="0" r="42" fill="#090d16" stroke="url(#accGrad)" stroke-width="3" />
      <circle cx="0" cy="0" r="14" fill="url(#accGrad)" />
    </g>`
      : `
    <!-- Neural Network & Autonomous AI Topology -->
    <g transform="translate(600, 315)">
      <g stroke="url(#accGrad)" stroke-width="2" opacity="0.4">
        <line x1="-240" y1="-100" x2="-60" y2="-130" />
        <line x1="-240" y1="-100" x2="-80" y2="20" />
        <line x1="-240" y1="90" x2="-80" y2="20" />
        <line x1="-240" y1="90" x2="-40" y2="140" />
        <line x1="-60" y1="-130" x2="90" y2="-70" />
        <line x1="-80" y1="20" x2="90" y2="-70" />
        <line x1="-80" y1="20" x2="100" y2="90" />
        <line x1="-40" y1="140" x2="100" y2="90" />
        <line x1="90" y1="-70" x2="250" y2="0" />
        <line x1="100" y1="90" x2="250" y2="0" />
      </g>
      <circle cx="-240" cy="-100" r="22" fill="#0f172a" stroke="url(#accGrad)" stroke-width="3" />
      <circle cx="-240" cy="90" r="22" fill="#0f172a" stroke="url(#accGrad)" stroke-width="3" />
      <circle cx="-60" cy="-130" r="26" fill="#0f172a" stroke="url(#accGrad)" stroke-width="3" />
      <circle cx="-80" cy="20" r="34" fill="url(#accGrad)" opacity="0.85" />
      <circle cx="-40" cy="140" r="24" fill="#0f172a" stroke="url(#accGrad)" stroke-width="3" />
      <circle cx="90" cy="-70" r="30" fill="#0f172a" stroke="url(#accGrad)" stroke-width="3" />
      <circle cx="100" cy="90" r="28" fill="#0f172a" stroke="url(#accGrad)" stroke-width="3" />
      <circle cx="250" cy="0" r="36" fill="url(#accGrad)" />
    </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#09090b" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#040608" />
    </linearGradient>
    <linearGradient id="accGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" />
      <stop offset="100%" stop-color="${accentSecondary}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#glow)" />
  <rect width="1200" height="630" fill="url(#grid)" />
  ${centerIllustration}
</svg>`;
}
