'use client';

import React, { useState, useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
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
