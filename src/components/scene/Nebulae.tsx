'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const nebulaDefs = [
  { pos: [-10, 4, -22],  scale: [22, 11, 16], color: '#1a2a60', opacity: 0.06, speed: 0.04 },
  { pos: [14,  -4, -38], scale: [28, 13, 20], color: '#501830', opacity: 0.055, speed: 0.03 },
  { pos: [-8,  6, -52],  scale: [34, 17, 24], color: '#301060', opacity: 0.05, speed: 0.05 },
  { pos: [4,   -3, -58], scale: [40, 22, 28], color: '#200820', opacity: 0.07, speed: 0.02 },
  { pos: [0,   2, -30],  scale: [18, 9, 14],  color: '#0a1840', opacity: 0.045, speed: 0.06 },
];

interface NebulaCloudProps {
  pos: number[];
  scale: number[];
  color: string;
  opacity: number;
  speed: number;
  index: number;
}

function NebulaCloud({ pos, scale, color, opacity, speed, index }: NebulaCloudProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const col = useMemo(() => new THREE.Color(color), [color]);
  const phaseOffset = index * 1.37;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle rotation + breathing scale
    meshRef.current.rotation.y = t * speed;
    meshRef.current.rotation.z = Math.sin(t * speed * 0.7 + phaseOffset) * 0.05;
    const breathe = 1 + Math.sin(t * speed * 2 + phaseOffset) * 0.04;
    meshRef.current.scale.setScalar(breathe);
  });

  return (
    <mesh
      ref={meshRef}
      position={pos as [number, number, number]}
      scale={scale as [number, number, number]}
    >
      <sphereGeometry args={[1, 7, 7]} />
      <meshBasicMaterial
        color={col}
        transparent
        opacity={opacity}
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Space dust — very fine particle layer
function SpaceDust() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, alphas } = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = -5 - Math.random() * 80;
      alphas[i] = Math.random() * 0.25;
    }
    return { positions, alphas };
  }, []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aAlpha"   args={[alphas, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={`
          attribute float aAlpha;
          varying float vA;
          uniform float uTime;
          void main() {
            vA = aAlpha;
            vec3 p = position;
            p.x += sin(uTime * 0.1 + position.z * 0.05) * 0.3;
            p.y += cos(uTime * 0.08 + position.x * 0.04) * 0.2;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = 1.2 * (150.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying float vA;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            gl_FragColor = vec4(0.85, 0.90, 1.0, smoothstep(0.5, 0.0, d) * vA);
          }
        `}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function Nebulae() {
  return (
    <group>
      {nebulaDefs.map((n, i) => (
        <NebulaCloud key={i} {...n} index={i} />
      ))}
      <SpaceDust />
    </group>
  );
}
