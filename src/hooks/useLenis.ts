 'use client';
import { useEffect } from 'react';
import { useUniverseStore } from '@/lib/store';

// Native scrolling needs no permanent animation loop and respects browser input.
export function useLenis() {
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      useUniverseStore.getState().setScrollProgress(total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
}
