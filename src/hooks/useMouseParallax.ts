'use client';

import { useEffect } from 'react';
import { useUniverseStore } from '@/lib/store';

export function useMouseParallax() {
  const setMouseNorm = useUniverseStore((s) => s.setMouseNorm);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouseNorm(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [setMouseNorm]);
}
