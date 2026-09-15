'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUniverseStore } from '@/lib/store';
import { useAmbientAudio } from '@/hooks/useAmbientAudio';
import { CAMERA_PATH } from '@/data/planets';

const SANS: React.CSSProperties = {
  fontFamily: "'Jost', var(--font-sans), sans-serif",
  fontWeight: 100,
};

const NAV_STOPS = [0, 0.13, 0.37, 0.61, 0.87];

function ProgressNav() {
  const scrollProgress = useUniverseStore((s) => s.scrollProgress);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let sec = 0;
    NAV_STOPS.forEach((s, i) => { if (scrollProgress >= s) sec = i; });
    setActive(sec);
  }, [scrollProgress]);

  const goTo = (i: number) => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: NAV_STOPS[i] * total, behavior: 'smooth' });
  };

  return (
    <div className="fixed left-7 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-0">
      {NAV_STOPS.map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <button
            onClick={() => goTo(i)}
            style={{
              width: i === active ? 6 : 4,
              height: i === active ? 6 : 4,
              borderRadius: '50%',
              background: i === active ? '#c9a84c' : 'rgba(245,240,232,0.18)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.4s ease',
              transform: i === active ? 'scale(1.4)' : 'scale(1)',
            }}
            aria-label={`Section ${i + 1}`}
          />
          {i < NAV_STOPS.length - 1 && (
            <div style={{ width: 1, height: 28, background: 'rgba(245,240,232,0.07)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

function AudioButton() {
  const audioEnabled = useUniverseStore((s) => s.audioEnabled);
  const toggleAudio = useUniverseStore((s) => s.toggleAudio);
  useAmbientAudio();

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full transition-all duration-350"
      style={{
        width: 44, height: 44,
        border: `1px solid ${audioEnabled ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.18)'}`,
        background: audioEnabled ? 'rgba(201,168,76,0.09)' : 'rgba(4,5,15,0.55)',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
      }}
      aria-label="Toggle ambient audio"
      aria-pressed={audioEnabled}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={audioEnabled ? '#c9a84c' : 'rgba(245,240,232,0.45)'}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        {audioEnabled ? (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        ) : (
          <line x1="23" y1="9" x2="17" y2="15" />
        )}
      </svg>
    </button>
  );
}

function EasterEggToast() {
  const foundEasterEggMessage = useUniverseStore((s) => s.foundEasterEggMessage);
  const clearEasterEggMessage = useUniverseStore((s) => s.clearEasterEggMessage);

  useEffect(() => {
    if (foundEasterEggMessage) {
      const t = setTimeout(clearEasterEggMessage, 4500);
      return () => clearTimeout(t);
    }
  }, [foundEasterEggMessage, clearEasterEggMessage]);

  return (
    <AnimatePresence>
      {foundEasterEggMessage && (
        <motion.div
          key="toast"
          role="status"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          style={{
            ...SANS,
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#c9a84c',
            textTransform: 'uppercase',
          }}
        >
          {foundEasterEggMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HoverHint() {
  const scrollProgress = useUniverseStore((s) => s.scrollProgress);
  const visible = scrollProgress > 0.12 && scrollProgress < 0.84;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          style={{ ...SANS, fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.28)' }}
        >
          Tap planets to explore · Scroll to journey
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function UIChrome() {
  return (
    <>
      <ProgressNav />
      <AudioButton />
      <EasterEggToast />
      <HoverHint />
    </>
  );
}
