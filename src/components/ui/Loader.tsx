'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useUniverseStore } from '@/lib/store';

const SERIF: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', var(--font-serif), Georgia, serif",
  fontWeight: 300,
  fontStyle: 'italic',
};
const SANS: React.CSSProperties = {
  fontFamily: "'Jost', var(--font-sans), sans-serif",
  fontWeight: 100,
};

const LOADING_PHRASES = [
  'Mapping constellations…',
  'Placing planets in orbit…',
  'Gathering starlight…',
  'Calibrating nebulae…',
];

export function Loader() {
  const isLoaded = useUniverseStore((s) => s.isLoaded);
  const [progress, setProgress] = useState(0);
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    if (isLoaded) return;
    const phraseInterval = setInterval(() => {
      setPhrase((p) => (p + 1) % LOADING_PHRASES.length);
    }, 900);

    const tick = setInterval(() => setProgress((p) => Math.min(90, p + 5)), 150);
    return () => { clearInterval(tick); clearInterval(phraseInterval); };
  }, [isLoaded]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center gap-10"
          style={{ background: '#04050f', zIndex: 1000 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <button className="journey-button" style={{ position: 'absolute', bottom: 40 }} onClick={() => useUniverseStore.getState().setReadingMode(true)}>Continue in reading mode</button>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            style={{ ...SERIF, fontSize: 'clamp(28px, 4vw, 48px)', color: 'rgba(245,240,232,0.35)', letterSpacing: '0.04em' }}
          >
            Our Universe
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Phrase */}
            <AnimatePresence mode="wait">
              <motion.div
                key={phrase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                style={{ ...SANS, fontSize: '10px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.22)' }}
              >
                {LOADING_PHRASES[phrase]}
              </motion.div>
            </AnimatePresence>

            {/* Bar */}
            <div style={{ width: 200, height: 1, background: 'rgba(245,240,232,0.07)', position: 'relative', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', position: 'absolute', inset: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>
          </motion.div>

          {/* Decorative stars */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ delay: 0.3 + i * 0.2, duration: 2.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                left: `${10 + i * 16}%`,
                top: `${20 + (i % 3) * 20}%`,
                fontSize: '10px',
                color: 'rgba(201,168,76,0.4)',
              }}
            >
              ✦
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
