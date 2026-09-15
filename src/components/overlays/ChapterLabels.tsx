'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUniverseStore } from '@/lib/store';
import { CHAPTERS } from '@/data/planets';

const SERIF: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', var(--font-serif), Georgia, serif",
};
const SANS: React.CSSProperties = {
  fontFamily: "'Jost', var(--font-sans), sans-serif",
  fontWeight: 100,
};

export function ChapterLabels() {
  const scrollProgress = useUniverseStore((s) => s.scrollProgress);

  const active = CHAPTERS.find(
    (ch) => scrollProgress >= ch.showAt && scrollProgress <= ch.hideAt
  );

  return (
    <div className="fixed inset-0 z-[15] pointer-events-none flex items-center justify-center">
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16,   filter: 'blur(6px)' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="text-center px-8"
          >
            <div style={{ ...SANS, fontSize: '10px', letterSpacing: '0.52em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1.1rem' }}>
              {active.num}
            </div>
            <div style={{
              ...SERIF,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(30px, 5vw, 62px)',
              lineHeight: 1.08,
              color: '#f5f0e8',
              textShadow: '0 0 80px rgba(201,168,76,0.12)',
            }}>
              {active.title}
            </div>
            <div style={{ ...SANS, fontSize: 'clamp(11px, 1.2vw, 13px)', letterSpacing: '0.22em', color: 'rgba(245,240,232,0.42)', marginTop: '0.9rem' }}>
              {active.body}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
