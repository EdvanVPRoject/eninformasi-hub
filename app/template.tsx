'use client';

import React, { useState, useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    // 350ms ensures the 320ms smooth entrance animation completes gracefully
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`w-full ${
        isTransitioning ? 'animate-smooth-page' : ''
      }`}
    >
      {children}
    </div>
  );
}
