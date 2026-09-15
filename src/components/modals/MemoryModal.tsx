'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useUniverseStore } from '@/lib/store';

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'Jost', var(--font-sans), sans-serif",
  fontWeight: 100,
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
  fontWeight: 100,
};

export function MemoryModal() {
  const { activePlanet, closePlanet } = useUniverseStore();
  const [msgIndex, setMsgIndex] = useState(0);

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
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            background: 'rgba(4,5,15,0.62)',
          }}
          onClick={handleBackdropClick}
        >
          <motion.div
            key="modal-card"
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
            }}
          >
            {/* Close */}
            <button
              onClick={handleBackdropClick}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                border: '1px solid rgba(245,240,232,0.15)',
                color: 'rgba(245,240,232,0.35)',
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
            <motion.h2
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
                key={msgIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                style={{
                  ...SANS_STYLE,
                  fontSize: 'clamp(12px, 1.3vw, 14px)',
                  lineHeight: 1.95,
                  color: 'rgba(245,240,232,0.65)',
                  marginBottom: '1.8rem',
                }}
              >
                {allMessages[msgIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Message nav dots if multiple */}
            {allMessages.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-2 mb-5"
              >
                {allMessages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMsgIndex(i)}
                    style={{
                      width: i === msgIndex ? 18 : 5,
                      height: 5,
                      borderRadius: 3,
                      background: i === msgIndex ? '#c9a84c' : 'rgba(245,240,232,0.2)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: 0,
                    }}
                  />
                ))}
              </motion.div>
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
