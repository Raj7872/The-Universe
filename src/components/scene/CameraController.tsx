'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '@/lib/store';
import { interpolateCameraPath } from '@/lib/camera';
import { CAMERA_PATH } from '@/data/planets';

export function CameraController() {
  const { camera } = useThree();


  // Smoothed values
  const smooth = useRef({ x: 0, y: 0, z: 12, rx: 0, ry: 0, rz: 0, fov: 60 });
  const timeRef = useRef(0);
  const mouseSmooth = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const { scrollProgress, mouseNorm } = useUniverseStore.getState();
    delta = Math.min(delta, 0.05);
    timeRef.current += delta;
    const t = timeRef.current;

    // Smooth mouse
    mouseSmooth.current.x += (mouseNorm.x - mouseSmooth.current.x) * 0.06;
    mouseSmooth.current.y += (mouseNorm.y - mouseSmooth.current.y) * 0.06;

    const { pos, rot, fov } = interpolateCameraPath(CAMERA_PATH, scrollProgress);

    // Inertia — different speeds for position vs rotation
    const posSpeed = 1 - Math.exp(-2 * delta);
    const rotSpeed = 1 - Math.exp(-1.5 * delta);
    const fovSpeed = 1 - Math.exp(-2.4 * delta);

    smooth.current.x   += (pos[0] - smooth.current.x) * posSpeed;
    smooth.current.y   += (pos[1] - smooth.current.y) * posSpeed;
    smooth.current.z   += (pos[2] - smooth.current.z) * posSpeed;
    smooth.current.rx  += (rot[0] - smooth.current.rx) * rotSpeed;
    smooth.current.ry  += (rot[1] - smooth.current.ry) * rotSpeed;
    smooth.current.rz  += (rot[2] - smooth.current.rz) * rotSpeed;
    smooth.current.fov += (fov    - smooth.current.fov) * fovSpeed;

    // Organic drift — multi-frequency Lissajous-like motion
    const driftX = Math.sin(t * 0.22) * 0.10 + Math.sin(t * 0.11) * 0.04;
    const driftY = Math.cos(t * 0.18) * 0.07 + Math.cos(t * 0.09) * 0.03;
    const driftRY = Math.sin(t * 0.14) * 0.006;
    const driftRX = Math.sin(t * 0.17) * 0.004;

    // Mouse parallax tilt
    const mouseRY = mouseSmooth.current.x * 0.012;
    const mouseRX = -mouseSmooth.current.y * 0.008;

    camera.position.x = smooth.current.x + driftX;
    camera.position.y = smooth.current.y + driftY;
    camera.position.z = smooth.current.z;

    camera.rotation.order = 'YXZ';
    camera.rotation.x = smooth.current.rx + driftRX + mouseRX;
    camera.rotation.y = smooth.current.ry + driftRY + mouseRY;
    camera.rotation.z = smooth.current.rz;

    (camera as THREE.PerspectiveCamera).fov = smooth.current.fov;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  });

  return null;
}
