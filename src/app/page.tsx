'use client';

import dynamic from 'next/dynamic';
import { useLenis }         from '@/hooks/useLenis';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { Loader }           from '@/components/ui/Loader';
import { CustomCursor }     from '@/components/ui/CustomCursor';
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
  useLenis();
  useMouseParallax();

  return (
    <main>
      {/* Loader — full screen until ready */}
      <Loader />

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      {/* ── 3D Universe ── */}
      <UniverseScene />

      {/* ── Canvas overlays ── */}
      <ConstellationOverlay />

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
