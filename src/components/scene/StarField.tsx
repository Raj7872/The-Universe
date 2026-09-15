'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useUniverseStore } from '@/lib/store';
import * as THREE from 'three';

const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aSpeed;
  varying float vAlpha;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vAlpha = aAlpha;
    vec3 pos = position;

    // Subtle cursor parallax on close stars
    float depthFactor = clamp(-pos.z / 80.0, 0.0, 1.0);
    pos.x += uMouse.x * depthFactor * 0.3;
    pos.y += uMouse.y * depthFactor * 0.2;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    float flicker = 0.82 + 0.18 * sin(uTime * aSpeed + position.x * 13.7 + position.z * 5.3);
    gl_PointSize = aSize * flicker * (260.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    // Warm white with slight gold tint for inner glow
    vec3 col = mix(vec3(1.0, 0.97, 0.88), vec3(1.0, 1.0, 1.0), soft * 0.5);
    gl_FragColor = vec4(col, soft * vAlpha);
  }
`;

interface StarFieldProps {
  count?: number;
  spread?: number;
  sizeRange?: [number, number];
  depth?: number;
}

export function StarField({
  count = 2800,
  spread = 220,
  sizeRange = [0.4, 2.2],
  depth = 18,
}: StarFieldProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef = useRef(0);
  const [minSize, maxSize] = sizeRange;
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() } }), []);

  const { positions, sizes, alphas, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const speeds = new Float32Array(count);
    const [sMin, sMax] = [minSize, maxSize];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.38;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread - depth;
      sizes[i]  = Math.random() * (sMax - sMin) + sMin;
      alphas[i] = Math.random() * 0.65 + 0.35;
      speeds[i] = Math.random() * 2.5 + 0.5;
    }
    return { positions, sizes, alphas, speeds };
  }, [count, spread, minSize, maxSize, depth]);

  useFrame((_, delta) => {
    timeRef.current += delta * 0.5;
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = timeRef.current;
      matRef.current.uniforms.uMouse.value.set(useUniverseStore.getState().mouseNorm.x, useUniverseStore.getState().mouseNorm.y);
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aAlpha"   args={[alphas, 1]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
