'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useUniverseStore } from '@/lib/store';

interface Firework {
  x: number; y: number; vx: number; vy: number;
  alpha: number; color: string; size: number; decay: number;
}

function useFireworks(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{ particles: Firework[]; interval: ReturnType<typeof setInterval> | null; raf: number }>({
    particles: [], interval: null, raf: 0,
  });

  useEffect(() => {
    if (!active) {
      clearInterval(stateRef.current.interval!);
      cancelAnimationFrame(stateRef.current.raf);
      stateRef.current.particles = [];
      const c = canvasRef.current;
      if (c) c.getContext('2d')?.clearRect(0, 0, c.width, c.height);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    function burst(px?: number, py?: number) {
      const x = px ?? Math.random() * canvas!.width;
      const y = py ?? canvas!.height * (0.08 + Math.random() * 0.55);
      const hue = Math.random() * 65 + 20; // gold/amber range
      const count = 55 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 1.2 + Math.random() * 3.5;
        stateRef.current.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: `hsl(${hue},${75 + Math.random()*15}%,${52 + Math.random()*25}%)`,
          size: 0.6 + Math.random() * 2,
          decay: 0.010 + Math.random() * 0.010,
        });
      }
    }

    burst(canvas.width * 0.3, canvas.height * 0.25);
    burst(canvas.width * 0.7, canvas.height * 0.3);

    stateRef.current.interval = setInterval(() => {
      if (Math.random() < 0.75) burst();
    }, 500);

    function tick() {
      ctx.fillStyle = 'rgba(4,5,15,0.13)';
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);

      stateRef.current.particles = stateRef.current.particles.filter((p) => p.alpha > 0.01);
      stateRef.current.particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.055; p.vx *= 0.988;
        p.alpha -= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      stateRef.current.raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      clearInterval(stateRef.current.interval!);
      cancelAnimationFrame(stateRef.current.raf);
    };
  }, [active]);

  return canvasRef;
}

const SERIF: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', var(--font-serif), Georgia, serif",
  fontWeight: 300,
};
const SANS: React.CSSProperties = {
  fontFamily: "'Jost', var(--font-sans), sans-serif",
  fontWeight: 100,
};

export function FinalScene() {
  const scrollProgress = useUniverseStore((s) => s.scrollProgress);
  const visible = scrollProgress >= 0.87;
  const canvasRef = useFireworks(visible);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 8, opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease' }}
      />

      <AnimatePresence>
        {visible && (
          <motion.div
            key="final-scene"
            className="fixed inset-0 z-[19] flex flex-col items-center justify-center text-center px-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 1 }}
              style={{ ...SANS, fontSize: '10px', letterSpacing: '0.6em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '2.8rem' }}
            >
              Today, across the universe
            </motion.div>

            {/* Main title */}
            <motion.div
              initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ ...SERIF, fontStyle: 'italic', fontSize: 'clamp(56px, 11vw, 138px)', lineHeight: 0.85, marginBottom: '2rem', color: '#f5f0e8' }}
            >
              Happy<br />
              <span style={{
                background: 'linear-gradient(135deg, #c9a84c 0%, #f5f0e8 35%, #e8c880 65%, #c9a84c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Birthday
              </span>
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 1.1 }}
              style={{ ...SANS, fontSize: 'clamp(12px, 1.45vw, 16px)', lineHeight: 2, color: 'rgba(245,240,232,0.58)', maxWidth: '480px', marginBottom: '3.5rem' }}
            >
              In this vast, spinning universe —<br />
              of all the planets, all the stars,<br />
              all the galaxies that exist —<br />
              thank you for taking the scenic route through this one.
            </motion.p>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 1 }}
              style={{ ...SERIF, fontStyle: 'italic', fontSize: 'clamp(18px, 2.5vw, 27px)', color: '#c9a84c' }}
            >
              Made with more light than sleep ✦
            </motion.div>

            {/* Floating star accents */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ delay: 1.2 + i * 0.3, duration: 2, repeat: Infinity, repeatDelay: Math.random() * 3 }}
                className="absolute pointer-events-none"
                style={{
                  left: `${15 + i * 18}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  fontSize: '12px',
                  color: '#c9a84c',
                }}
              >
                ✦
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
