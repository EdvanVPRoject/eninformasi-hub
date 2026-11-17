'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export interface SyncedParams {
  category: string | null;
  type: string | null;
  q: string | null;
}

interface SearchParamsSyncProps {
  onChange: (params: SyncedParams) => void;
}

function SearchParamsSyncInner({ onChange }: SearchParamsSyncProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const q = searchParams.get('q');

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current({ category, type, q });
  }, [category, type, q]);

  return null;
}

export default function SearchParamsSync(props: SearchParamsSyncProps) {
  return (
    <Suspense fallback={null}>
      <SearchParamsSyncInner {...props} />
    </Suspense>
  );
}
