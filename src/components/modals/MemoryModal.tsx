'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useUniverseStore } from '@/lib/store';

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'Jost', var(--font-sans), sans-serif",
  fontWeight: 300,
  fontSize: '10px',
  letterSpacing: '0.5em',
  textTransform: 'uppercase',
  color: '#c9a84c',
};

const SERIF_STYLE: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', var(--font-serif), Georgia, serif",
  fontWeight: 300,
};

const SANS_STYLE: React.CSSProperties = {
  fontFamily: "'Jost', var(--font-sans), sans-serif",
  fontWeight: 300,
};

export function MemoryModal() {
  const activePlanet = useUniverseStore((s) => s.activePlanet);
  const closePlanet = useUniverseStore((s) => s.closePlanet);
  const [msgIndex, setMsgIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activePlanet) return;
    setMsgIndex(0);
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePlanet();
      if (event.key !== 'Tab' || !dialog) return;
      const buttons = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a, audio[controls], [tabindex="0"]'));
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [activePlanet, closePlanet]);


  const allMessages = activePlanet
    ? [activePlanet.memory.message, ...(activePlanet.memory.secondaryMessages ?? [])]
    : [];

  const handleBackdropClick = () => {
    setMsgIndex(0);
    closePlanet();
  };

  return (
    <AnimatePresence>
      {activePlanet && (
        <motion.div
          key="modal-bd"
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            background: 'rgba(4,5,15,0.62)',
          }}
          onClick={handleBackdropClick}
        >
          <motion.div
            key="modal-card"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="memory-title"
            className="relative w-full max-w-lg"
            initial={{ y: 36, scale: 0.93, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              border: '1px solid rgba(201,168,76,0.18)',
              background: 'linear-gradient(135deg, rgba(8,10,24,0.92) 0%, rgba(12,14,32,0.95) 100%)',
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              maxHeight: '85dvh', overflowY: 'auto', overscrollBehavior: 'contain',
            }}
          >
            {/* Close */}
            <button
              onClick={handleBackdropClick}
              aria-label="Close memory"
              className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                border: '1px solid rgba(245,240,232,0.15)',
                color: 'rgba(245,240,232,0.8)',
                background: 'transparent',
                cursor: 'pointer',
                ...SANS_STYLE,
                fontSize: '14px',
              }}
            >
              ✕
            </button>

            {/* Planet label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              style={{ ...LABEL_STYLE, marginBottom: '1.4rem' }}
            >
              {activePlanet.memory.planetLabel}
            </motion.div>

            {/* Title */}
            <motion.h2 id="memory-title"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, ease: [0.22,1,0.36,1] }}
              style={{
                ...SERIF_STYLE,
                fontStyle: 'italic',
                fontSize: 'clamp(20px, 3vw, 30px)',
                lineHeight: 1.22,
                marginBottom: '1.6rem',
                color: '#f5f0e8',
              }}
            >
              {activePlanet.memory.title}
            </motion.h2>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.32, duration: 0.55, ease: 'easeOut' }}
              style={{
                width: 38, height: 1,
                background: 'rgba(201,168,76,0.38)',
                marginBottom: '1.6rem',
                transformOrigin: 'left',
              }}
            />

            {/* Message with cycling */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`${activePlanet.id}-${msgIndex}`}
                aria-live="polite"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                style={{
                  ...SANS_STYLE,
                  fontSize: 'clamp(15px, 1.3vw, 17px)',
                  lineHeight: 1.95,
                  color: 'rgba(245,240,232,0.85)',
                  marginBottom: '1.8rem',
                }}
              >
                {allMessages[msgIndex]}
              </motion.p>
            </AnimatePresence>

            {activePlanet.memory.photoUrl && (
              <figure style={{ marginBottom: 24 }}>
                {/* Personal media stays lazy-loaded until this memory is opened. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activePlanet.memory.photoUrl} alt={`A memory from ${activePlanet.name}`} loading="lazy" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 12 }} />
              </figure>
            )}
            {activePlanet.memory.voiceNote && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 13, marginBottom: 8 }}>A little message for you</p>
                <audio key={activePlanet.id} aria-label={`Voice note from ${activePlanet.name}`} controls preload="none" src={activePlanet.memory.voiceNote} style={{ width: '100%' }} />
              </div>
            )}
            {allMessages.length > 1 && (
              <nav aria-label="Memory notes" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 24 }}>
                <button className="journey-button" disabled={msgIndex === 0} onClick={() => setMsgIndex((i) => Math.max(0, i - 1))}>Previous</button>
                <span style={{ fontSize: 12, color: '#c9a84c' }}>{msgIndex + 1} / {allMessages.length}</span>
                <button className="journey-button" disabled={msgIndex === allMessages.length - 1} onClick={() => setMsgIndex((i) => Math.min(allMessages.length - 1, i + 1))}>Next</button>
              </nav>
            )}

            {/* Date */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.48 }}
              style={{ ...LABEL_STYLE, letterSpacing: '0.28em', color: 'rgba(201,168,76,0.42)' }}
            >
              {activePlanet.memory.date}
            </motion.div>

            {/* Planet name accent */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="absolute bottom-0 right-0 pointer-events-none"
              style={{ padding: '1.5rem 2rem' }}
            >
              <span style={{
                ...SERIF_STYLE,
                fontStyle: 'italic',
                fontSize: 'clamp(40px, 6vw, 72px)',
                color: 'rgba(201,168,76,0.06)',
                lineHeight: 1,
                userSelect: 'none',
              }}>
                {activePlanet.name}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
