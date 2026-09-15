'use client';

import { useEffect, useRef } from 'react';
import { useUniverseStore } from '@/lib/store';

type LenisInstance = {
  destroy: () => void;
  raf: (time: number) => void;
  on: (event: string, callback: (data: { scroll: number }) => void) => void;
};

export function useLenis() {
  const setScrollProgress = useUniverseStore((s) => s.setScrollProgress);
  const lenisRef = useRef<LenisInstance | null>(null);

  useEffect(() => {
    let rafId: number;

    async function init() {
      // Dynamic import avoids SSR issues
      const mod = await import('lenis');
      const LenisClass = (mod.default || mod) as new (opts: object) => LenisInstance & {
        on: (e: string, cb: (data: { scroll: number }) => void) => void;
      };

      const lenis = new LenisClass({
        duration: 1.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });

      lenisRef.current = lenis;

      lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) setScrollProgress(scroll / total);
      });

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }

    init();

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
    };
  }, [setScrollProgress]);

  return lenisRef;
}
