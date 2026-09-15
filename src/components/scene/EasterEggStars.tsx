'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EASTER_EGGS } from '@/data/planets';
import { useUniverseStore } from '@/lib/store';

export function EasterEggStars() {
  const findEasterEgg = useUniverseStore((s) => s.findEasterEgg);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    meshRefs.current.forEach((m, i) => {
      if (!m) return;
      const pulse = 1 + Math.sin(timeRef.current * 2 + i * 2.1) * 0.15;
      m.scale.setScalar(pulse);
      (m.material as THREE.MeshBasicMaterial).opacity =
        0.55 + Math.sin(timeRef.current * 1.8 + i) * 0.25;
    });
  });

  return (
    <group>
      {EASTER_EGGS.map((egg, i) => (
        <mesh
          key={egg.id}
          ref={(el) => { meshRefs.current[i] = el; }}
          position={egg.position}
          onClick={() => findEasterEgg(egg.id, egg.message)}
          onPointerOver={(e) => { e.stopPropagation(); (e.object as THREE.Mesh).scale.setScalar(2); }}
          onPointerOut={(e) => { e.stopPropagation(); }}
        >
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial
            color="#ffd080"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
