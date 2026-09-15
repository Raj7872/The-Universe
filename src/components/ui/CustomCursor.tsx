'use client';

import { useEffect, useRef, useState } from 'react';
import { useUniverseStore } from '@/lib/store';

export function CustomCursor() {
  const hoveredPlanet = useUniverseStore((s) => s.hoveredPlanet);
  const activePlanet  = useUniverseStore((s) => s.activePlanet);
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos  = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef  = useRef<number>(0);
  const [mounted, setMounted] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (!mounted || isCoarse) return;

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    function animate() {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, isCoarse]);

  if (!mounted || isCoarse) return null;

  const isHovering = !!hoveredPlanet && !activePlanet;
  const ringSize = isHovering ? 56 : 32;
  const ringColor = isHovering ? 'rgba(201,168,76,0.7)' : 'rgba(245,240,232,0.35)';

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999, mixBlendMode: 'difference' }}
    >
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: 5, height: 5,
          borderRadius: '50%',
          background: '#f5f0e8',
          marginLeft: -2.5,
          marginTop: -2.5,
          willChange: 'transform',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: ringSize, height: ringSize,
          borderRadius: '50%',
          border: `1px solid ${ringColor}`,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, margin 0.3s ease',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
