'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_STARS = 8;

interface StarState {
  active: boolean;
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; maxLife: number;
  tailLen: number;
}

function makeStar(): StarState {
  const side = Math.random() > 0.5 ? 1 : -1;
  return {
    active: true,
    x: side * (40 + Math.random() * 30),
    y: 10 + Math.random() * 20,
    z: -10 - Math.random() * 50,
    vx: -side * (0.8 + Math.random() * 1.2),
    vy: -(0.3 + Math.random() * 0.6),
    vz: 0,
    life: 0,
    maxLife: 60 + Math.random() * 80,
    tailLen: 0.5 + Math.random() * 1.5,
  };
}

export function ShootingStars() {
  const starsRef = useRef<StarState[]>([]);
  const spawnTimer = useRef(0);

  // We'll use a Points object with many positions (head + tail segments)
  const SEGMENTS = 10;
  const TOTAL_POINTS = MAX_STARS * SEGMENTS;

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TOTAL_POINTS * 3), 3));
    g.setAttribute('aAlpha',   new THREE.BufferAttribute(new Float32Array(TOTAL_POINTS), 1));
    g.setAttribute('aSize',    new THREE.BufferAttribute(new Float32Array(TOTAL_POINTS), 1));
    return g;
  }, [TOTAL_POINTS]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          attribute float aAlpha;
          attribute float aSize;
          varying float vAlpha;
          void main() {
            vAlpha = aAlpha;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (200.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            gl_FragColor = vec4(1.0, 0.97, 0.88, smoothstep(0.5, 0.0, d) * vAlpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((_, delta) => {
    const dt = delta * 60; // normalize to 60fps steps
    spawnTimer.current += dt;

    // Spawn new star randomly
    if (spawnTimer.current > 80 + Math.random() * 120) {
      spawnTimer.current = 0;
      if (starsRef.current.length < MAX_STARS) {
        starsRef.current.push(makeStar());
      }
    }

    // Update stars
    starsRef.current = starsRef.current.filter((s) => s.life < s.maxLife);
    starsRef.current.forEach((s) => {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life += dt;
    });

    // Update geometry
    const posArr = geo.attributes.position.array as Float32Array;
    const alphaArr = geo.attributes.aAlpha.array as Float32Array;
    const sizeArr  = geo.attributes.aSize.array as Float32Array;

    posArr.fill(0); alphaArr.fill(0); sizeArr.fill(0);

    starsRef.current.forEach((s, si) => {
      const t = s.life / s.maxLife;
      const headAlpha = Math.sin(t * Math.PI) * 0.9;

      for (let seg = 0; seg < SEGMENTS; seg++) {
        const idx = (si * SEGMENTS + seg) * 3;
        const segT = seg / SEGMENTS;
        const rx = s.x - s.vx * dt * segT * 3;
        const ry = s.y - s.vy * dt * segT * 3;
        posArr[idx]     = rx;
        posArr[idx + 1] = ry;
        posArr[idx + 2] = s.z;
        const pIdx = si * SEGMENTS + seg;
        alphaArr[pIdx] = headAlpha * (1 - segT);
        sizeArr[pIdx]  = (1 - segT) * 1.5;
      }
    });

    geo.attributes.position.needsUpdate = true;
    geo.attributes.aAlpha.needsUpdate = true;
    geo.attributes.aSize.needsUpdate = true;
  });

  return <points geometry={geo} material={mat} />;
}
