 'use client';
import { useEffect, useState } from 'react';
import { PLANETS } from '@/data/planets';
import { useUniverseStore } from '@/lib/store';

export function JourneyTools() {
  const [expanded, setExpanded] = useState(false);
  const lite = useUniverseStore((s) => s.liteMode);
  const reading = useUniverseStore((s) => s.readingMode);
  const visited = useUniverseStore((s) => s.visitedPlanets);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      useUniverseStore.getState().setReadingMode(true);
    }
  }, []);
  return <nav aria-label="Journey controls" style={{ position: 'fixed', top: 16, right: 16, zIndex: 60, maxWidth: 'calc(100vw - 32px)' }}>
    <button className="journey-button" aria-expanded={expanded} aria-controls="journey-menu" onClick={() => setExpanded(!expanded)}>Your universe / {visited.length}/{PLANETS.length} memories</button>
    {expanded && <div id="journey-menu" style={{ marginTop: 8, padding: 16, background: '#080a18', border: '1px solid var(--gold-dim)', borderRadius: 16, display: 'grid', gap: 8, maxHeight: '75dvh', overflowY: 'auto' }}>
      <p style={{ fontSize: 13, color: '#c9a84c' }}>Choose a memory</p>
      {PLANETS.map((planet) => <button className="journey-button" key={planet.id} onClick={() => useUniverseStore.getState().openPlanet(planet)}>{visited.includes(planet.id) ? 'Read: ' : ''}{planet.name} / {planet.subtitle}</button>)}
      <button className="journey-button" aria-pressed={lite} onClick={() => useUniverseStore.getState().setLiteMode(!lite)}>Light mode: {lite ? 'on' : 'off'}</button>
      <button className="journey-button" aria-pressed={reading} onClick={() => useUniverseStore.getState().setReadingMode(!reading)}>Reading mode: {reading ? 'on' : 'off'}</button>
      <button className="journey-button" onClick={() => { setExpanded(false); window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }); }}>Go to birthday wish</button>
    </div>}
  </nav>;
}
