'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUniverseStore } from '@/lib/store';
import { PLANETS } from '@/data/planets';

export function PlanetLabel() {
  const hoveredPlanet = useUniverseStore((s) => s.hoveredPlanet);
  const planet = PLANETS.find((p) => p.id === hoveredPlanet);

  return (
    <div className="fixed bottom-[11vh] left-1/2 -translate-x-1/2 z-[16] text-center pointer-events-none">
      <AnimatePresence>
        {planet && (
          <motion.div
            key={planet.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(18px, 2.5vw, 26px)',
              color: '#f5f0e8',
              marginBottom: '0.4rem',
            }}>
              {planet.name}
            </div>
            <div style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 100,
              fontSize: '9px',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: '#c9a84c',
            }}>
              Click to explore
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
