'use client';

import { motion } from 'framer-motion';
import { useUniverseStore } from '@/lib/store';

const SERIF: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', var(--font-serif), Georgia, serif",
  fontWeight: 300,
};
const SANS: React.CSSProperties = {
  fontFamily: "'Jost', var(--font-sans), sans-serif",
  fontWeight: 100,
};

export function OpeningOverlay() {
  const scrollProgress = useUniverseStore((s) => s.scrollProgress);

  // Fade out as scroll starts
  const opacity = Math.max(0, 1 - scrollProgress / 0.13);
  const translateY = -scrollProgress * 80;

  if (scrollProgress > 0.20) return null;

  return (
    <div
      className="fixed inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
      style={{ opacity, transform: `translateY(${translateY}px)`, willChange: 'opacity, transform' }}
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
        style={{ ...SANS, fontSize: 'clamp(9px, 1.1vw, 11px)', letterSpacing: '0.55em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '2.2rem' }}
      >
        A birthday story across space and time
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ ...SERIF, fontSize: 'clamp(58px, 10vw, 128px)', lineHeight: 0.88, letterSpacing: '-0.02em', marginBottom: '1.8rem', color: '#f5f0e8' }}
      >
        Our<br />
        <em style={{
          background: 'linear-gradient(135deg, #f5f0e8 0%, #c9a84c 45%, #f5f0e8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Universe</em>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1.1 }}
        style={{ ...SANS, fontSize: 'clamp(11px, 1.35vw, 15px)', letterSpacing: '0.2em', color: 'rgba(245,240,232,0.5)', marginBottom: '0' }}
      >
        Every memory, a star. Every moment, a world.
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.2 }}
        className="absolute flex flex-col items-center gap-3"
        style={{ bottom: '6vh' }}
      >
        <span style={{ ...SANS, fontSize: '9px', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)' }}>
          Scroll to begin
        </span>
        <div style={{ width: 1, height: 56, background: 'linear-gradient(to bottom, #c9a84c, transparent)', animation: 'pulse 2s ease-in-out infinite' }} />
      </motion.div>
    </div>
  );
}
