import React from 'react';

interface EnLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function EnLogo({ className = '', size = 32, showText = false }: EnLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* SVG Vector Icon Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="enLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F59B" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="enBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <filter id="enGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Tech Frame with Glow Accent */}
        <rect
          x="6"
          y="6"
          width="108"
          height="108"
          rx="26"
          fill="url(#enBgGrad)"
          stroke="url(#enLogoGrad)"
          strokeWidth="2.5"
          strokeOpacity="0.4"
        />

        {/* Tech Nodes in Corners */}
        <circle cx="22" cy="22" r="2.5" fill="#10B981" fillOpacity="0.5" />
        <circle cx="98" cy="98" r="2.5" fill="#06B6D4" fillOpacity="0.5" />

        {/* 'EN' Cyber Monogram Mark */}
        <g filter="url(#enGlowFilter)">
          {/* Letter 'E' */}
          <path
            d="M34 34 H58 C60.5 34 62 35.5 62 38 C62 40.5 60.5 42 58 42 H44 V55 H54 C56 55 57 56.5 57 59 C57 61.5 56 63 54 63 H44 V78 H60 C62.5 78 64 79.5 64 82 C64 84.5 62.5 86 60 86 H34 C31.5 86 30 84.5 30 82 V38 C30 35.5 31.5 34 34 34 Z"
            fill="url(#enLogoGrad)"
          />

          {/* Dynamic Circuit Bridge */}
          <path d="M59 42 L80 77" stroke="#00F59B" strokeWidth="4.5" strokeLinecap="round" />

          {/* Letter 'N' */}
          <path
            d="M80 34 H86 C88.5 34 90 35.5 90 38 V82 C90 84.5 88.5 86 86 86 H80 C77.5 86 76 84.5 76 82 V48 L62 36 Z"
            fill="url(#enLogoGrad)"
          />

          {/* Nexus Core Point */}
          <circle cx="70" cy="59" r="3.5" fill="#FFFFFF" />
          <circle cx="70" cy="59" r="6" stroke="#00F59B" strokeWidth="1.5" strokeOpacity="0.75" />
        </g>
      </svg>

      {/* Optional Wordmark */}
      {showText && (
        <span className="font-mono font-bold tracking-tight text-lg text-[var(--text-main)]">
          EnInformasi<span className="text-emerald-500">.hub</span>
        </span>
      )}
    </div>
  );
}
