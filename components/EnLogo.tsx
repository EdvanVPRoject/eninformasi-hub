import React from 'react';
import Image from 'next/image';

interface EnLogoProps {
  className?: string;
  size?: number;
  variant?: 'emblem' | 'transparent' | 'full';
  showText?: boolean;
}

export default function EnLogo({
  className = '',
  size = 32,
  variant = 'emblem',
  showText = false,
}: EnLogoProps) {
  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src="/logo-full.png"
          alt="EnInformasi Hub"
          width={size * 2}
          height={size}
          className="h-auto max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  const src = variant === 'transparent' ? '/logo-transparent.png' : '/logo-emblem.png';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="relative shrink-0 rounded-xl overflow-hidden border border-emerald-500/25 bg-[#090d14] shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all duration-300 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_16px_rgba(16,185,129,0.35)] flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <img
          src={src}
          alt="EnInformasi Hub Logo"
          width={size}
          height={size}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      {showText && (
        <span className="font-mono font-bold tracking-tight text-[var(--text-main)]">
          EnInformasi<span className="text-emerald-500">.hub</span>
        </span>
      )}
    </div>
  );
}
