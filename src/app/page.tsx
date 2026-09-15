'use client';

import dynamic from 'next/dynamic';
import { useUniverseStore } from '@/lib/store';
import { SceneBoundary } from '@/components/scene/SceneBoundary';
import { useLenis }         from '@/hooks/useLenis';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { Loader }           from '@/components/ui/Loader';
import { JourneyTools } from '@/components/ui/JourneyTools';
import { UIChrome }         from '@/components/ui/UIChrome';
import { OpeningOverlay }   from '@/components/overlays/OpeningOverlay';
import { ChapterLabels }    from '@/components/overlays/ChapterLabels';
import { PlanetLabel }      from '@/components/overlays/PlanetLabel';
import { FinalScene }       from '@/components/overlays/FinalScene';
import { MemoryModal }      from '@/components/modals/MemoryModal';
import { ConstellationOverlay } from '@/components/constellation/ConstellationOverlay';

// Three.js must not SSR
const UniverseScene = dynamic(
  () => import('@/components/scene/UniverseScene').then((m) => m.UniverseScene),
  { ssr: false }
);

export default function Home() {
  const reading = useUniverseStore((s) => s.readingMode);
  useLenis();
  useMouseParallax();

  return (
    <main>
      {/* Loader — full screen until ready */}
      <Loader />

      {/* Custom cursor (desktop only) */}
      <JourneyTools />

      {/* ── 3D Universe ── */}
      {reading ? <div aria-hidden="true" className="fixed inset-0" style={{ background: 'radial-gradient(ellipse at 25% 30%, #20203e 0%, #04050f 65%)' }} /> : <SceneBoundary><UniverseScene /></SceneBoundary>}

      {/* ── Canvas overlays ── */}
      {!reading && <ConstellationOverlay />}

      {/* ── UI layers (pointer-events: none except interactive) ── */}
      <OpeningOverlay />
      <ChapterLabels />
      <PlanetLabel />
      <FinalScene />
      <UIChrome />

      {/* ── Modal ── */}
      <MemoryModal />

      {/* Scroll container — height drives camera travel */}
      <div
        aria-hidden="true"
        style={{ height: '700vh', position: 'relative', pointerEvents: 'none' }}
      />
    </main>
  );
}
