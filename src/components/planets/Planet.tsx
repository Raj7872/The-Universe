'use client';

import { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlanetData } from '@/types';
import { useUniverseStore } from '@/lib/store';

// ─── Atmosphere shader ────────────────────────────────────────────────────────
const atmoVert = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;
const atmoFrag = `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float rim = 1.0 - abs(dot(vNormal, vViewDir));
    rim = pow(rim, 2.8);
    gl_FragColor = vec4(uColor, rim * uIntensity);
  }
`;

// ─── Orbit particles ──────────────────────────────────────────────────────────
function OrbitParticles({ radius, color }: { radius: number; color: THREE.Color }) {
  const count = 80;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const alpha = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.4;
      pos[i * 3]     = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(a) * r;
      alpha[i] = Math.random() * 0.4 + 0.1;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
    return g;
  }, [radius]);

  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <shaderMaterial
        vertexShader={`
          attribute float aAlpha; varying float vA;
          void main() {
            vA = aAlpha;
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            gl_PointSize = 1.8*(180.0/-mv.z);
            gl_Position = projectionMatrix*mv;
          }
        `}
        fragmentShader={`
          varying float vA;
          void main(){
            float d=length(gl_PointCoord-0.5);
            if(d>0.5)discard;
            gl_FragColor=vec4(1.0,1.0,1.0,smoothstep(0.5,0.0,d)*vA);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Floating particles around planet ────────────────────────────────────────
function PlanetParticles({ size, color }: { size: number; color: THREE.Color }) {
  const count = 40;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const radii = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = size * (1.5 + Math.random() * 1.5);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      speeds[i] = 0.3 + Math.random() * 0.7;
      radii[i]  = r;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return g;
  }, [size]);

  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.12;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.1;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={color}
        size={0.06}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Main Planet Component ────────────────────────────────────────────────────
interface PlanetProps {
  data: PlanetData;
}

export function Planet({ data }: PlanetProps) {
  const groupRef   = useRef<THREE.Group>(null);
  const sphereRef  = useRef<THREE.Mesh>(null);
  const atmoRef    = useRef<THREE.Mesh>(null);
  const glowRef    = useRef<THREE.PointLight>(null);
  const timeRef    = useRef(Math.random() * Math.PI * 2);

  const { openPlanet, setHoveredPlanet, hoveredPlanet } = useUniverseStore();
  const { gl } = useThree();

  const isHovered = hoveredPlanet === data.id;

  const colors = useMemo(() => ({
    primary:    new THREE.Color(data.theme.primary),
    emissive:   new THREE.Color(data.theme.emissive),
    atmosphere: new THREE.Color(data.theme.atmosphere),
    particle:   new THREE.Color(data.theme.particle),
    ring:       new THREE.Color(data.theme.ringColor ?? data.theme.primary),
    light:      new THREE.Color(data.theme.lightColor ?? data.theme.atmosphere),
  }), [data.theme]);

  useFrame((_, delta) => {
    timeRef.current += delta * 0.4;
    const t = timeRef.current;

    if (groupRef.current) {
      groupRef.current.position.y = data.position[1] + Math.sin(t * 0.55) * 0.18;
      groupRef.current.rotation.y += delta * 0.055;
    }
    if (sphereRef.current) {
      const mat = sphereRef.current.material as THREE.MeshStandardMaterial;
      const targetEmissive = isHovered ? 0.65 : 0.32;
      mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.07;
      const targetScale = isHovered ? 1 + Math.sin(t * 6) * 0.025 : 1;
      sphereRef.current.scale.setScalar(sphereRef.current.scale.x + (targetScale - sphereRef.current.scale.x) * 0.1);
    }
    if (atmoRef.current) {
      const mat = atmoRef.current.material as THREE.ShaderMaterial;
      const targetIntensity = isHovered ? 0.85 : 0.55;
      mat.uniforms.uIntensity.value += (targetIntensity - mat.uniforms.uIntensity.value) * 0.06;
    }
    if (glowRef.current) {
      const targetIntensity = isHovered
        ? (data.theme.lightIntensity ?? 1.2) * 1.8
        : (data.theme.lightIntensity ?? 1.2);
      glowRef.current.intensity += (targetIntensity - glowRef.current.intensity) * 0.05;
    }
  });

  const handlePointerOver = useCallback(() => {
    setHoveredPlanet(data.id);
    gl.domElement.style.cursor = 'none';
  }, [data.id, setHoveredPlanet, gl.domElement]);

  const handlePointerOut = useCallback(() => {
    setHoveredPlanet(null);
    gl.domElement.style.cursor = 'none';
  }, [setHoveredPlanet, gl.domElement]);

  const handleClick = useCallback(() => {
    openPlanet(data);
  }, [data, openPlanet]);

  return (
    <group ref={groupRef} position={data.position}>
      {/* Point light from planet surface */}
      <pointLight
        ref={glowRef}
        color={colors.light}
        intensity={data.theme.lightIntensity ?? 1.2}
        distance={18}
        decay={2}
      />

      {/* Core sphere */}
      <mesh
        ref={sphereRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        castShadow
      >
        <sphereGeometry args={[data.size, 64, 64]} />
        <meshStandardMaterial
          color={colors.primary}
          emissive={colors.emissive}
          emissiveIntensity={0.32}
          roughness={0.68}
          metalness={0.06}
        />
      </mesh>

      {/* Atmosphere glow rim */}
      <mesh ref={atmoRef}>
        <sphereGeometry args={[data.size * 1.20, 32, 32]} />
        <shaderMaterial
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          uniforms={{
            uColor: { value: colors.atmosphere },
            uIntensity: { value: 0.55 },
          }}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Rings */}
      {data.rings && (
        <group rotation={[Math.PI / 2.8, 0, 0.15]}>
          <mesh>
            <ringGeometry args={[data.size * 1.65, data.size * 2.55, 128]} />
            <meshBasicMaterial
              color={colors.ring}
              side={THREE.DoubleSide}
              transparent
              opacity={0.30}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Inner ring with slight different color */}
          <mesh>
            <ringGeometry args={[data.size * 1.72, data.size * 1.95, 64]} />
            <meshBasicMaterial
              color={colors.primary}
              side={THREE.DoubleSide}
              transparent
              opacity={0.12}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}

      {/* Floating particles */}
      <PlanetParticles size={data.size} color={colors.particle} />

      {/* Orbit dust trail */}
      <OrbitParticles radius={data.size * 3.8} color={colors.primary} />
    </group>
  );
}
