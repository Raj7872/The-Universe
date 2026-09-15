'use client';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { StarField }        from './StarField';
import { Nebulae }          from './Nebulae';
import { ShootingStars }    from './ShootingStars';
import { CameraController } from './CameraController';
import { EasterEggStars }   from './EasterEggStars';
import { Planet }           from '@/components/planets/Planet';
import { PLANETS }          from '@/data/planets';
import { useUniverseStore } from '@/lib/store';

function SceneContent() {
  const mouseNorm = useUniverseStore((s) => s.mouseNorm);

  return (
    <>
      <fog attach="fog" args={['#04050f', 55, 130]} />

      {/* Scene lighting */}
      <ambientLight intensity={0.28} color="#0d1128" />
      <pointLight position={[0, 20, 0]}   intensity={0.6}  color="#a0c0ff" distance={80} />
      <pointLight position={[0, -20, -30]} intensity={0.4} color="#ff8060" distance={60} />
      <directionalLight position={[-10, 5, 5]} intensity={0.18} color="#6080c0" />

      <CameraController />

      {/* Three star-field layers at different depths for parallax */}
      <StarField count={2500} spread={230} sizeRange={[0.4, 1.8]} depth={15} mouse={mouseNorm} />
      <StarField count={1000} spread={180} sizeRange={[1.0, 3.0]} depth={10} mouse={mouseNorm} />
      <StarField count={400}  spread={120} sizeRange={[0.3, 1.0]} depth={5}  mouse={mouseNorm} />

      <Nebulae />
      <ShootingStars />
      <EasterEggStars />

      {PLANETS.map((planet) => (
        <Planet key={planet.id} data={planet} />
      ))}
    </>
  );
}

export function UniverseScene() {
  // Safe dpr: avoid window access at module level (SSR guard done by dynamic import)
  const dpr: [number, number] = [1, 2];

  return (
    <Canvas
      camera={{ fov: 60, near: 0.05, far: 500, position: [0, 0, 12] }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      dpr={dpr}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
      frameloop="always"
    >
      <SceneContent />
    </Canvas>
  );
}
